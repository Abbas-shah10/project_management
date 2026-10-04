import { User } from '../models/user.models.js'
import { Project } from '../models/project.model.js';
import { Task } from '../models/task.models.js';
import { SubTask } from '../models/subtask.models.js';
import { ApiResponse } from '../utils/api-response.js'
import { ApiError } from '../utils/api-error.js'
import { asyncHandler } from '../utils/async-handler.js'
import mongoose from 'mongoose';
import { AvailableUserRole, UserRolesEnum } from '../utils/constants.js';

const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  const tasks = await Task.find({ project: new mongoose.Types.ObjectId(projectId) }).populate('assignedTo', 'avatar username fullName');

  return res.status(200).json(
    new ApiResponse(200, 'Tasks fetched successfully', tasks)
  )
});
const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, status } = req.body;
  const { projectId } = req.params;

  const project = await Project.findById(projectId)

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  const files = req.files || [];

  const attachments = files.map((file) => {
    return {
      url: `${process.env.SERVER_URL}/images/${file.originalname}`,
      mimetype: file.mimetype,
      size: file.size
    }
  })

  const task = await Task.create({
    title,
    description,
    project: new mongoose.Types.ObjectId(projectId),
    assignedTo: assignedTo ? new mongoose.Types.ObjectId(assignedTo) : undefined,
    status,
    attachments,
    createdBy: new mongoose.Types.ObjectId(req.user._id),
  })

  return res.status(201).json(
    new ApiResponse(201, 'Task created successfully', task)
  )

});
const updateTask = asyncHandler(async (req, res) => {
  const { taskId, projectId } = req.params;
  const {
    title,
    description,
    assignedTo,
    status,
    removeAttachments,
  } = req.body;

  const task = await Task.findOne(
    projectId ? { _id: taskId, project: projectId } : { _id: taskId }
  );

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (status !== undefined) task.status = status;

  if (assignedTo !== undefined) {
    if (assignedTo === null || assignedTo === '') {
      task.assignedTo = undefined;
    } else {
      if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
        throw new ApiError(400, 'Invalid assigned user id');
      }

      task.assignedTo = new mongoose.Types.ObjectId(assignedTo);
    }
  }

  if (req.files && req.files.length > 0) {
    const newAttachments = req.files.map((file) => ({
      url: `${process.env.SERVER_URL}/images/${file.originalname}`,
      mimetype: file.mimetype,
      size: file.size,
    }));

    task.attachments = [...(task.attachments || []), ...newAttachments];
  }

  if (removeAttachments !== undefined) {
    const attachmentsToRemove = Array.isArray(removeAttachments)
      ? removeAttachments
      : [removeAttachments];

    task.attachments = (task.attachments || []).filter(
      (attachment) => !attachmentsToRemove.includes(String(attachment._id))
    );
  }

  await task.save();

  const updatedTask = await Task.findById(task._id).populate(
    'assignedTo',
    'avatar username fullName'
  );

  return res.status(200).json(
    new ApiResponse(200, 'Task updated successfully', updatedTask)
  );
});
const deleteTask = asyncHandler(async (req, res) => {
  const { taskId, projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new ApiError(400, 'Invalid task id');
  }

  const taskFilter = projectId
    ? { _id: taskId, project: projectId }
    : { _id: taskId };

  const task = await Task.findOne(taskFilter);

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  await SubTask.deleteMany({ task: task._id });
  await task.deleteOne();

  return res.status(200).json(
    new ApiResponse(200, 'Task deleted successfully', null)
  );

});
const getTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const task = await Task.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(taskId),
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "assignedTo",
        pipeline: [
          {
            _id: 1,
            username: 1,
            fullName: 1,
            avatar: 1,
          }
        ]
      }
    },
    {
      $lookup: {
        from: "subtasks",
        localField: "_id",
        foreignField: "task",
        as: "subTasks",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "createdBy",
              foreignField: "_id",
              as: "createdBy",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    username: 1,
                    fullName: 1,
                    avatar: 1,
                  },
                },
                {
                  $addFields: {
                    createdBy: {
                      $arrayElemAt: ["$createdBy", 0]
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    },
    {
      $addFields: {
        assignedTo: {
          $arrayElemAt: ["$assignedTo", 0]
        }
      }
    }
  ]);

  if (!task || task.length === 0) {
    throw new ApiError(404, "Task not found")
  }

  return res.status(200).json(
    new ApiResponse(200, task, 'All tasks fetched successfully')
  )

});
const createSubTask = asyncHandler(async (req, res) => {
  const { title, createdBy, isCompleted } = req.body;
  const { taskId } = req.params;

  if (title || createdBy) {
    return ApiError(400, "All the given fields are required")
  }

  const task = await Task.findById(taskId);

  if (!task) {
    return ApiError(404, "Task not found")
  }

  const subTask = await SubTask.create({
    title,
    createdBy: createdBy ? new mongoose.Types.ObjectId(createdBy) : undefined,
    task: new mongoose.Types.ObjectId(taskId),
    isCompleted
  })


  return res.status(201).json(
    new ApiResponse(201, 'SubTask created successfully', subTask)
  )


});
const updateSubTask = asyncHandler(async (req, res) => {
  const { subTaskId } = req.params;

  const subTask = await SubTask.findById(subTaskId)

  if (!subTask) {
    return ApiError(404, "Sub-Task not found")
  }

  if (!subTask.isCompleted) {
    subTask.isCompleted = true;
    await subTask.save();
  }

  return res.status(200).json(
    new ApiResponse(200, "Task status updated successfully", subTask)
  )
});
const deleteSubTask = asyncHandler(async (req, res) => { });

export {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
  createSubTask,
  updateSubTask,
  deleteSubTask
}
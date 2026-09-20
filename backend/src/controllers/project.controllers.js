import { User } from '../models/user.models.js'
import { Project } from '../models/project.model.js';
import { ProjectMember } from '../models/projectmembers.models.js';
import { ApiResponse } from '../utils/api-response.js'
import { ApiError } from '../utils/api-error.js'
import { asyncHandler } from '../utils/async-handler.js'
import mongoose from 'mongoose';
import { AvailableUserRole, UserRolesEnum } from '../utils/constants.js';

const getProjects = asyncHandler(async (req, res) => {
  const projects = await ProjectMember.aggregate([
    {
      // 1. Find only the projects where the logged-in user is a member
      $match: {
        user: new mongoose.Types.ObjectId(req.user._id),
      }
    },
    {
      // 2. Pull the project details
      $lookup: {
        from: 'projects',
        localField: "project",
        foreignField: "_id",
        as: 'projectDetails',
        pipeline: [
          {
            // 2a. INSIDE the project, look up all its members
            $lookup: {
              from: 'projectmembers',
              localField: "_id",
              foreignField: "project", // Fixed from 'projects' to 'project'
              as: "allMembers",
              pipeline: [
                {
                  // 2b. Grab the user details (name, email) for each member
                  $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userDetails'
                  }
                },
                {
                  // Clean up user details array to an object
                  $addFields: {
                    user: { $arrayElemAt: ["$userDetails", 0] }
                  }
                },
                {
                  // Remove the unneeded temporary array field
                  $project: { userDetails: 0 }
                }
              ]
            }
          },
          {
            // 2c. Add the member count total safely
            $addFields: {
              memberCount: { $size: "$allMembers" }
            }
          }
        ]
      }
    },
    {
      // 3. Flatten the project details array
      $unwind: "$projectDetails"
    },
    {
      // 4. Shape the final output cleanly
      $project: {
        _id: "$projectDetails._id",
        name: "$projectDetails.name",
        description: "$projectDetails.description",
        createdBy: "$projectDetails.createdBy",
        createdAt: "$projectDetails.createdAt",
        memberCount: "$projectDetails.memberCount",
        members: "$projectDetails.allMembers", // Contains full array of members with user details
        currentUserRole: "$role" // Remembers the logged-in user's role in this project
      }
    },
    {
      $project: {
        name: 1,
        description: 1,
        role: 1,
      }
    }
  ]);


  return res.status(200).json(
    new ApiResponse(200, { projects }, "Projects fetched successfully")
  )
});
const getProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId)

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res.status(200).json(
    new ApiResponse(200, project, 'Project fetched successfully')
  )
});
const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const project = await Project.create({
    name,
    description,
    createdBy: new mongoose.Types.ObjectId(req.user._id),
  })

  await ProjectMember.create({
    user: new mongoose.Types.ObjectId(req.user._id),
    project: new mongoose.Types.ObjectId(project._id),
    role: UserRolesEnum.ADMIN
  })

  return res.status(201).json(
    new ApiResponse(201, { project }, "Project created successfully")
  )

});
const updateProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const { projectId } = req.params;


  const project = await Project.findByIdAndUpdate(
    projectId,
    {
      name,
      description,
    },
    {
      new: true,
    }
  );

  if (!project) {
    throw new ApiError(404, "Project not found")
  }

  return res.status(200).json(
    new ApiResponse(200, { project }, "Project updated successfully")
  )
});
const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findByIdAndDelete(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found")
  }

  return res.status(200, {}, "Project deleted successfully")

});
const addMembersToProject = asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  const { projectId } = req.params;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found")
  }

  await ProjectMember.findOneAndUpdate(
    {
      user: new mongoose.Types.ObjectId(user._id),
      project: new mongoose.Types.ObjectId(projectId)
    },
    {
      user: new mongoose.Types.ObjectId(user._id),
      project: new mongoose.Types.ObjectId(projectId),
      role: role,
    },
    {
      new: true,
      upsert: true,
    }
  )

  return res.status(200).json(
    new ApiResponse(200, {}, "Project member added successfully")
  )
});
const getProjectMembers = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found")
  }

  const projectMembers = await ProjectMember.aggregate([
    {
      $match: {
        project: new mongoose.Types.ObjectId(project._id)
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: 'user',
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullName: 1,
              avatar: 1,
            }
          }
        ]
      }
    },
    {
      $addFields: {
        user: {
          $arrayElemAt: ['$user', 0],
        }
      }
    },
    {
      $project: {
        project: 1,
        user: 1,
        role: 1,
        createdAt: 1,
        updatedAt: 1,
        _id: 0,
      }
    }
  ])

  return res.status(200).json(
    new ApiResponse(200, projectMembers, "Project Members fetched successfully")
  )
});
const updateMemberRoles = asyncHandler(async (req, res) => {
  const { projectId, userId } = req.params;
  const { newRole } = req.body;

  if (!AvailableUserRole.includes(newRole)) {
    throw new ApiError(400, "Invalid Role")
  }

  let projectMember = await ProjectMember.findOne({
    project: new mongoose.Types.ObjectId(projectId),
    user: new mongoose.Types.ObjectId(userId)
  })

  if (!projectMember) {
    throw new ApiError(404, "Project Member not found")
  }

  projectMember = await ProjectMember.findByIdAndUpdate(
    projectMember._id,
    { role: newRole },
    { new: true }
  )

  if (!projectMember) {
    throw new ApiError(404, "Project Member not found")
  }

  return res.status(200).json(
    new ApiResponse(200, projectMember, "Project Member role updated successfully")
  )

});
const deleteMember = asyncHandler(async (req, res) => {
  const { projectId, userId } = req.params;

  let projectMember = await ProjectMember.findOne({
    project: new mongoose.Types.ObjectId(projectId),
    user: new mongoose.Types.ObjectId(userId)
  })

  if (!projectMember) {
    throw new ApiError(404, "Project Member not found")
  }

  projectMember = await ProjectMember.findByIdAndDelete(
    projectMember._id,
  )

  if (!projectMember) {
    throw new ApiError(404, "Project Member not found")
  }

  return res.status(200).json(
    new ApiResponse(200, projectMember, "Project Member deleted successfully")
  )

});



export {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteMember,
  deleteProject,
  addMembersToProject,
  getProjectMembers,
  updateMemberRoles
}
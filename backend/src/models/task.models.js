import mongoose, { Schema } from 'mongoose';
import { AvailableTaskStatus, TaskStatusEnum } from '../utils/constants.js'

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: AvailableTaskStatus,
    default: TaskStatusEnum.TODO,
  },
  attachments: [
    {
      url: String,
      mimeType: String,
      size: Number,
    }
  ],
  default: [],
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium",
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });


export const Task = mongoose.model("Task", taskSchema);
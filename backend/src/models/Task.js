const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  teamCode: { type: String, required: true },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  assignedTo: { type: String, required: true },
  priority: {
    type: String,
    enum: ["low", "med", "high"],
    default: "med",
    required: true,
  },
  status: {
    type: String,
    enum: ["to do", "in progress", "completed"],
    default: "to do",
    required: true,
  },
  dueDate: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);

const mongoose = require('mongoose');

const ideasSchema = new mongoose.Schema({
  teamCode: { type: String, required: true },
  theme: String,
  teamSize: String,
  duration: String,
  deadline: String,
  skills: [String],
  complexity: String,
  techStack: String,
  deployment: String,
  outputs: [String],
  references: [String],
  otherReference: String,
  generatedIdea: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ideas', ideasSchema);
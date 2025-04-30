const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    teamCode: { type: String, required: true },
    resources: [
        {
            sender: { type: String, required: true },
            message: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
        },
    ],
});

const Resource = mongoose.model('Resource', resourceSchema);
module.exports = Resource;
const mongoose = require('mongoose');
const teamSchema = new mongoose.Schema({
    teamCode: {
        type: String,
        unique: true,
        required: true,
    },
    members: {
        type: [String],
    },
    gitRepoUrl: {
        type: String,
        unique: true
    }
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
const mongoose = require('mongoose');
const DocSchema = new mongoose.Schema({
    teamCode: {
        type: String,
        unique: true,
        required: true,
    },
    projectDesc: {
        type: String,
    }
    
});

const Documentation = mongoose.model('Documentation', DocSchema);

module.exports = Documentation;
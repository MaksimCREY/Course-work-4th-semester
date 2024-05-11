const mongoose = require('mongoose');
const connect=mongoose.connect("mongodb://127.0.0.1:27017/Login-tut");

const studentSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    course: {
        type: Number,
        required: true
    },
    group: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Сдал', 'Не сдал'],
        required: true
    },
    address: String
});

module.exports = mongoose.model('Student', studentSchema);
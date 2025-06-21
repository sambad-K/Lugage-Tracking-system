const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    ltpNumber: {
        type: String,
        required: true
    },
    complaint: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'not read'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

complaintSchema.pre('save', function(next) {
    if (!this.createdAt) {
        this.createdAt = Date.now();
    }
    console.log('createdAt:', this.createdAt); 
    next();
});

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;

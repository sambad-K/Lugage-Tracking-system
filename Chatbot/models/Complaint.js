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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

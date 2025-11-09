import mongoose from 'mongoose';


const applicationSchema = new mongoose.Schema({
jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
resumeUrl: String,
coverLetter: String,
status: {
type: String,
enum: ['applied', 'viewed', 'shortlisted', 'rejected'],
default: 'applied',
},
appliedAt: { type: Date, default: Date.now },
});


export default mongoose.model('Application', applicationSchema);
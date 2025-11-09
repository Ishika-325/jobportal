import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
title: { type: String, required: true },
companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
location: String,
type: { type: String, enum: ['internship', 'full-time', 'part-time'], default: 'full-time' },
description: String,
requirements: [String],
salary: String,
postedAt: { type: Date, default: Date.now },
deadline: Date,
applicantsCount: { type: Number, default: 0 },
});


export default mongoose.model('Job', jobSchema);
import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
title: { type: String, required: true },
companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User',},
location: String,
type: { type: String, enum: ["Full-time", "Part-time", "Internship", "Contract"], default: 'Full-time' },
description: String,
requirements: [String],
salary: String,
postedAt: { type: Date, default: Date.now },
deadline: Date,
applicantsCount: { type: Number, default: 0 },
});


export default mongoose.model('Job', jobSchema);
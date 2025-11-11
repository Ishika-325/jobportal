"use client";

const JobCard = ({ job, onApply, isEmployer, onEdit, onDelete, appliedJobs = [] }) => {
  const alreadyApplied = appliedJobs.includes(job._id); // ✅ Check if applied

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-1">{job.title}</h3>
          <p className="text-gray-600">{job.company}</p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <p className="text-gray-600 line-clamp-2">{job.description}</p>

        <div className="flex flex-wrap gap-2">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            {job.location}
          </span>
          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            ${job.salary}
          </span>
          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            {job.type}
          </span>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 flex gap-2">
        {!isEmployer ? (
          <button
            onClick={() => !alreadyApplied && onApply(job._id)}
            disabled={alreadyApplied}
            className={`btn flex-1 ${
              alreadyApplied ? "btn-disabled bg-gray-300 text-gray-600 cursor-not-allowed" : "btn-primary"
            }`}
          >
            {alreadyApplied ? "Already Applied" : "Apply Now"}
          </button>
        ) : (
          <>
            <button onClick={() => onEdit(job._id)} className="btn btn-secondary flex-1">
              Edit
            </button>
            <button onClick={() => onDelete(job._id)} className="btn btn-danger flex-1">
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default JobCard;

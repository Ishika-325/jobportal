import React, { useState } from "react";
import {
  UserCircleIcon,
  AcademicCapIcon,
  BuildingLibraryIcon,
  DocumentArrowUpIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";

const Profile = () => {
  const defaultImg = "/default.png";

  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [profile, setProfile] = useState({
    fullname: "Anvika Sharma",
    email: "anvika.sharma@example.com",
    profileImg: "",
    university: "UIT-RGPV, Bhopal",
    course: "B.Tech in Computer Science",
    cgpa: "8.5",
    bio: "Enthusiastic computer science student passionate about frontend development, UI/UX design, and AI applications.",
    skills: ["React", "Python", "Data Visualization"],
    resume: "",
  });

  const handleChange = (e) => {
    const { fullname, value } = e.target;
    setProfile((prev) => ({ ...prev, [fullname]: value }));
  };

  const handleProfileImgUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgURL = URL.createObjectURL(file);
      setProfile((prev) => ({ ...prev, profileImg: imgURL }));
    }
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) setProfile((prev) => ({ ...prev, resume: file.name }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill)) {
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleSave = () => {
    console.log("Saving profile:", profile);
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-10 text-center text-blue-700">
        Internship Profile
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Left Section - Profile Card */}
        <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-md flex flex-col items-center">
          <div className="relative mb-4">
            <img
              src={profile.profileImg || defaultImg}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
            />
            {isEditing && (
              <div className="mt-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImgUpload}
                  className="text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 
                             file:rounded-full file:border-0 file:text-sm 
                             file:font-medium file:bg-blue-600 
                             file:text-white hover:file:bg-blue-700"
                />
              </div>
            )}
          </div>
          <h2 className="text-xl font-semibold">{profile.fullname}</h2>
          <p className="text-gray-500 text-sm">{profile.email}</p>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-md transition"
          >
            {isEditing ? "Cancel Edit" : "Edit Profile"}
          </button>
        </div>

        {/* Right Section - Editable Info */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-md">
          {/* Personal Info */}
          <h2 className="text-2xl font-semibold mb-6 border-b pb-3 flex items-center gap-2">
            <UserCircleIcon className="h-6 w-6 text-blue-600" /> Personal Info
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="fullname"
                  value={profile.fullname}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              ) : (
                <p>{profile.fullname}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none "
                />
              ) : (
                <p>{profile.email}</p>
              )}
            </div>
          </div>

          {/* Education */}
          <h2 className="text-2xl font-semibold mb-6 border-b pb-3 flex items-center gap-2">
            <AcademicCapIcon className="h-6 w-6 text-blue-600" /> Education
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                University
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="university"
                  value={profile.university}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              ) : (
                <p>{profile.university}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Course
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="course"
                  value={profile.course}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              ) : (
                <p>{profile.course}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                CGPA
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="cgpa"
                  value={profile.cgpa}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              ) : (
                <p>{profile.cgpa}</p>
              )}
            </div>
          </div>

          {/* Bio */}
          <h2 className="text-2xl font-semibold mb-6 border-b pb-3 flex items-center gap-2">
            <BriefcaseIcon className="h-6 w-6 text-blue-600" /> Bio
          </h2>
          <div className="mb-8">
            {isEditing ? (
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows="3"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            ) : (
              <p className="text-gray-700">{profile.bio}</p>
            )}
          </div>

          {/* Skills */}
          <h2 className="text-2xl font-semibold mb-6 border-b pb-3 flex items-center gap-2">
            <BuildingLibraryIcon className="h-6 w-6 text-blue-600" /> Skills
          </h2>

          <div className="mb-8">
            {isEditing ? (
              <>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Type a skill and press Add"
                    className="flex-grow border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-wrap gap-3">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Resume Upload */}
          <h2 className="text-2xl font-semibold mb-6 border-b pb-3 flex items-center gap-2">
            <DocumentArrowUpIcon className="h-6 w-6 text-blue-600" /> Resume
          </h2>
          <div className="flex items-center gap-3 mb-10">
            {isEditing ? (
              <input
                type="file"
                accept=".pdf"
                onChange={handleResumeUpload}
                className="text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 
                           file:rounded-full file:border-0 file:text-sm 
                           file:font-medium file:bg-blue-600 
                           file:text-white hover:file:bg-blue-700"
              />
            ) : (
              <span className="text-gray-600">
                {profile.resume ? `📄 ${profile.resume}` : "No resume uploaded"}
              </span>
            )}
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};



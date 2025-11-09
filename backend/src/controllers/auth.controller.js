import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// ===========================
// 🧩 Helper: Generate Tokens
// ===========================
const generateTokens = async (user) => {
  const accessToken = jwt.sign(
    { _id: user._id, email: user.email, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d" }
  );

  const refreshToken = jwt.sign(
    { _id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
  );

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

// ===========================
// 🧠 Register Controller
// ===========================
export const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, password, role } = req.body;

  if (!fullname || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User already exists with this email");
  }

  

  const newUser = await User.create({
    fullname,
    email,
    password: password,
    role: role || "student",
  });

  const { accessToken, refreshToken } = await generateTokens(newUser);

  // ✅ Set access token in HTTP-only cookie
  res.cookie("token", accessToken, {
    httpOnly: true,
    secure: false, // true in production (HTTPS)
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: createdUser,
  });
});

// ===========================
// 🔐 Login Controller
// ===========================
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");

  const { accessToken } = await generateTokens(user);

  // ✅ Set access token in cookie
  res.cookie("token", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    user: loggedInUser,
  });
});

// ===========================
// 🚪 Logout Controller
// ===========================
export const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (userId) {
    await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
  }

  // ✅ Clear cookie
  res.clearCookie("token", { httpOnly: true, sameSite: "lax" });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// ===========================
// 👤 Get Current User
// ===========================
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -refreshToken");
  if (!user) throw new ApiError(404, "User not found");

  res.status(200).json({
    success: true,
    user,
  });
});

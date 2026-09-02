import { User } from '../models/user.models.js'
import { ApiResponse } from '../utils/api-response.js'
import { ApiError } from '../utils/api-error.js'
import { asyncHandler } from '../utils/async-handler.js'
import { emailVerificationMailGenContent, forgotPasswordMailGenContent, sendEmail } from '../utils/mail.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken'

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong ")
  }
}

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;

  const existingUser = await User.findOne({
    $or: [{ username }, { email }]
  });

  if (existingUser) {
    throw new ApiError(409, "User with email or username already exists", []);
  }

  const user = await User.create({
    username,
    email,
    password,
    isEmailVerified: false,
  })

  const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false })
  await sendEmail({
    email: user?.email,
    subject: "Please verify your email",
    mailgenContent: emailVerificationMailGenContent(user.username, `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`)
  })

  const createdUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry")

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user")
  }

  res.status(201).json(
    new ApiResponse(201, { user: createdUser }, "User registered Successfully and the verification email is send successfully!")
  )
})

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "All the fields are required")
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exists")
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid Credentials")
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry")

  const options = {
    httpOnly: true,
    secure: true
  }

  return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
    new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in Successfully")
  )
})

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: ""
      }
    },
    {
      new: true,
    }
  )

  const options = {
    httpOnly: true,
    secure: true,
  }

  return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(
    new ApiResponse(200, {}, "User logged out")
  )
})

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, req.user, "Current user fetched successfully")
  )
})

const verifyEmail = asyncHandler(async (req, res) => {
  const { verificationToken } = req.params;

  if (!verificationToken) {
    throw new ApiError(400, "EMail verification token is missing")
  }

  let hashedToken = crypto.createHash("sha256").update(verificationToken).digest('hex')

  const user = await User.findOne({ emailVerificationToken: hashedToken, emailVerificationExpiry: { $gt: Date.now() } })

  if (!user) {
    throw new ApiError(400, "Token is invalid or expired")
  }

  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;

  user.isEmailVerified = true;
  await user.save({ validateBeforeSave: false })

  return res.status(200).json(
    new ApiResponse(200, { isEmailVerified: true }, "email is verified")
  )

})

const resendEmailVerification = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, 'User does not exist')
  }

  if (user.isEmailVerified) {
    throw new ApiError(400, "User is already verified!")
  }

  const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false })
  await sendEmail({
    email: user?.email,
    subject: "Please verify your email",
    mailgenContent: emailVerificationMailGenContent(user.username, `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`)
  })

  return res.status(200).json(
    new ApiResponse(200, {}, "Mail is been sent to your email")
  )


})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized")
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(404, "user does not found")
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired")
    }

    const options = {
      httpOnly: true,
      secure: true,
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id)

    user.refreshToken = newRefreshToken;

    await user.save({ validateBeforeSave: false });

    res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", accessToken, options).json(
      new ApiResponse(200, { accessToken, refreshToken: new newRefreshToken }, "Access token refreshed")
    )
  } catch (error) {
    throw new ApiError(401, "Invalid refresh Token")
  }
})

const forgotPasswordRequest = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found in database")
  }

  const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken();

  user.forgotPasswordToken = hashedToken;
  user.forgotPasswordExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });


  await sendEmail({
    email: user?.email,
    subject: "Password reset request",
    mailgenContent: forgotPasswordMailGenContent(user.username, `${process.env.FORGOT_PASSWORD_REDIRECT_URL}`)
  })

  return res.status(200).json(
    new ApiResponse(200, {}, "Password reset mail has been sent to your mail ")
  )
})

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  verifyEmail,
  resendEmailVerification,
  refreshAccessToken,
  forgotPasswordRequest
};
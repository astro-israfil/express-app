import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {User} from "../models/user.model.js";
import uploadFile from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {

    const {username, fullName, email, password} = req.body;
    
    // check if any field is empty
    if (
        [username, fullName, email, password].some(field => field?.trim() === "")
    ) {
        return res.status(400).json(
            new ApiError(400, "All Fields are required")
        );
    }

    // Check for is user already exist or not
    const existedUser = await User.findOne({
        $or: [{email}, {username}]
    });

    if (existedUser) {
        return res.status(409).json(
            new ApiError(409, "User with the email or username is already exist")
        );
    }

    let avatarLocalPath;
    let coverImageLocalPath;
    
    if (Array.isArray(req.files?.avatar) && req.files?.avatar.length > 0) {
        avatarLocalPath = req.files?.avatar[0]?.path
    }
    if (Array.isArray(req.files?.coverImage) && req.files?.coverImage.length > 0) {
        coverImageLocalPath = req.files?.coverImage[0]?.path
    }

    let avatar = null;
    let coverImage = null;

    if (!avatarLocalPath) {
        return res.status(400).json(
            new ApiError(400, "Avatar file is required")
        );
    } else {
        avatar = await uploadFile(avatarLocalPath);
    }
    
    if (coverImageLocalPath) {
        coverImage = await uploadFile(coverImageLocalPath);
    }

    if (!avatar) {
        return res.status(400).json(
            new ApiError(500, "An Error occurred when uploading Avatar")
        )
    }

    const user = await User.create(
        {
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            password,
            fullName,
            avatar: avatar.url,
            coverImage: coverImage?.url || ""
        }
    );

    const createdUser = await User.findById(user?._id).select("-password -refreshToken");

    if (createdUser) {
        return res.status(201).json(
            new ApiResponse(201, createdUser)
        )
    }

})


export {registerUser}
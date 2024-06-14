import {v2 as cloudinary} from 'cloudinary';
import fs from "fs";
import ApiError from './ApiError.js';

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
});


const uploadFile = async (localFilePath) => {
    console.log(localFilePath);
    try {
        if (!localFilePath) {
            throw new ApiError(500, "Cloudinary don't recieved any file to upload");
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        fs.unlinkSync(localFilePath);
        return response;
        
    } catch (error) {
        fs.unlinkSync(localFilePath)
        throw new ApiError(500, error.message);
    }
}

export default uploadFile;
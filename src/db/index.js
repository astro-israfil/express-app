import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.8f940jf.mongodb.net/`
        );
        console.log("Successfully connected to the database",connectionInstance.connection.host);

    } catch (error) {
        console.log(error)
        process.exit(1);
    }
}

export default connectDB;
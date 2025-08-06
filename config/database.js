import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("DB ka Connection is Successful");
    } catch (error) {
        console.log("Issue in DB Connection");
        console.error(error.message);
        process.exit(1); // This line means: "Exit the app immediately if DB connection fails"
    }
};

export default dbConnect;

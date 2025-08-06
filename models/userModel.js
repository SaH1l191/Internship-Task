import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        minLength: 6,
        required: true,
    },
    bio: {
        type: String,
        default: '',
    },
    blogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);
export default User;

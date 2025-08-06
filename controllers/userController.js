import User from '../models/userModel.js';
import generateTokenAndSetCookie from '../utils/helpers/generateTokenAndSetCookie.js';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export const signUpUser = async (req, res) => {
    try {
        const { name, email, username, password } = req.body;

        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({ error: "Email or username already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            username,
            password: hashedPassword
        });

        await newUser.save();

        generateTokenAndSetCookie(newUser._id, res);

        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            username: newUser.username,
            bio: newUser.bio,
            profilePic: newUser.profilePic
        });

    } catch (error) {
        console.error("Error in signUpUser:", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            bio: user.bio,
            profilePic: user.profilePic
        });

    } catch (error) {
        console.error("Error in loginUser:", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const logoutUser = async (req, res) => {
    try {
        res.cookie("accesstoken", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1
        });

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error in logoutUser:", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const { query } = req.params;

        let user;
        if (mongoose.Types.ObjectId.isValid(query)) {
            user = await User.findById(query).select("-password -updatedAt");
        } else {
            user = await User.findOne({ username: query }).select("-password -updatedAt");
        }

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error("Error in getUserProfile:", err.message);
        res.status(500).json({ error: err.message });
    }
};

export const updateUser = async (req, res) => {
    const { name, email, username, password, bio } = req.body;
    const userId = req.user._id;

    try {
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (req.params.id && req.params.id !== userId.toString()) {
            return res.status(403).json({ error: "You cannot update other user's profile" });
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.bio = bio || user.bio;

        await user.save();

        const updatedUser = await User.findById(userId).select('-password');
        res.status(200).json(updatedUser);
    } catch (err) {
        console.error("Error in updateUser:", err.message);
        res.status(500).json({ error: err.message });
    }
};

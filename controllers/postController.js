 import Post from "../models/postModel.js";
import Like from "../models/likeModel.js";
export const createPost = async (req, res) => {
    try {
        const { title, body } = req.body;
        const authorId = req.user._id;

        if (!title || !body) {
            return res.status(400).json({ error: "Title and body are required" });
        }

        const newPost = await Post.create({ title, body, author: authorId });
        await newPost.populate("author", "name username profilePic");

        res.status(201).json(newPost);
    } catch (err) {
        console.error("Error creating post:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate("author", "name username profilePic")
            .populate("likes")
            .populate("comments")
            .exec();

        res.status(200).json(posts);
    } catch (err) {
        console.error("Error fetching posts:", err.message);
        res.status(500).json({ error: "Failed to fetch posts" });
    }
};

export const getPostById = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.findById(id)
            .populate("author", "name username profilePic")
            .populate("likes")
            .populate("comments")
            .exec();

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        res.status(200).json(post);
    } catch (err) {
        console.error("Error fetching post:", err.message);
        res.status(500).json({ error: "Failed to fetch post" });
    }
};

export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, body } = req.body;
        const userId = req.user._id;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (!post.author.equals(userId)) {
            return res.status(403).json({ error: "You can only edit your own posts" });
        }

        post.title = title || post.title;
        post.body = body || post.body;

        const updatedPost = await post.save();
        res.status(200).json(updatedPost);
    } catch (err) {
        console.error("Error updating post:", err.message);
        res.status(500).json({ error: "Failed to update post" });
    }
};
 
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (!post.author.equals(userId)) {
            return res.status(403).json({ error: "You can only delete your own posts" });
        }

        await Post.findByIdAndDelete(id);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        console.error("Error deleting post:", err.message);
        res.status(500).json({ error: "Failed to delete post" });
    }
};

export const topLikedBlogs = async (req, res) => {
    try {
        const blogs = await Post.find()
            .populate("author", "name username profilePic")
            .populate("likes")
            .sort({ likes: -1 })
            .limit(10)
            .exec();

        res.status(200).json({
            success: true,
            data: blogs
        });
    } catch (error) {
        console.error("Error fetching top liked blogs:", error.message);
        res.status(500).json({
            success: false,
            message: "Error fetching top liked blogs",
            error: error.message
        });
    }
};

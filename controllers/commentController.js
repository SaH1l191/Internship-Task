 
import Post from "../models/postModel.js";
import Comment from "../models/commentModel.js"; 
import User from "../models/userModel.js";

export const createComment = async (req, res) => {
    try {
        const { postId, body } = req.body;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: "Post not found" });
        if (!body) return res.status(400).json({ error: "Comment body is required" });

        const comment = await Comment.create({ post: postId, user: userId, body });

        await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });

        await comment.populate("user", "name username profilePic");

        res.status(201).json({ comment });
    } catch (err) {
        console.error("Error creating comment:", err.message);
        res.status(500).json({ error: "Failed to create comment" });
    }
};
export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { body } = req.body;
        const userId = req.user._id;

        const comment = await Comment.findById(id);
        if (!comment) return res.status(404).json({ error: "Comment not found" });
        if (!comment.user.equals(userId)) return res.status(403).json({ error: "Unauthorized" });

        comment.body = body || comment.body;
        const updated = await comment.save();

        res.status(200).json({ comment: updated });
    } catch (err) {
        console.error("Error updating comment:", err.message);
        res.status(500).json({ error: "Failed to update comment" });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const comment = await Comment.findById(id);
        if (!comment) return res.status(404).json({ error: "Comment not found" });
        if (!comment.user.equals(userId)) return res.status(403).json({ error: "Unauthorized" });

        await Comment.findByIdAndDelete(id);
        await Post.findByIdAndUpdate(comment.post, { $pull: { comments: id } });

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (err) {
        console.error("Error deleting comment:", err.message);
        res.status(500).json({ error: "Failed to delete comment" });
    }
};

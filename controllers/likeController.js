import Post from "../models/postModel.js";
import Like from '../models/likeModel.js'
export const likePost = async (req, res) => {
    try {
        const { postId } = req.body;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
 
 
        const existingLike = await Like.findOne({ post: postId, user: userId });
        if (existingLike) {
            return res.status(400).json({ error: "You have already liked this post" });
        }

        const like = await Like.create({ post: postId, user: userId });
 
        await Post.findByIdAndUpdate(postId, {
            $push: { likes: like._id }
        });
 
        await like.populate("user", "name username profilePic");

        res.status(200).json({ like });
    } catch (err) {
        console.error("Error liking post:", err.message);
        res.status(500).json({ error: "Failed to like post" });
    }
}; 
 
export const unlikePost = async (req, res) => {
    try {
        const { postId } = req.body;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const like = await Like.findOneAndDelete({ post: postId, user: userId });
        if (!like) {
            return res.status(400).json({ error: "You haven't liked this post" });
        }
 
        await Post.findByIdAndUpdate(postId, {
            $pull: { likes: like._id }
        });

        res.status(200).json({ message: "Post unliked successfully" });
    } catch (err) {
        console.error("Error unliking post:", err.message);
        res.status(500).json({ error: "Failed to unlike post" });
    }
};

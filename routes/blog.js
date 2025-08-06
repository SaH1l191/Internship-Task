import express from 'express';
import {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    topLikedBlogs
} from '../controllers/postController.js';

import {
    likePost,
    unlikePost
} from '../controllers/likeController.js';

import {
    createComment, 
    updateComment,
    deleteComment
} from '../controllers/commentController.js';

const router = express.Router();

router.post("/posts/create", createPost);
router.get("/posts", getAllPosts);

router.post("/likes/like", likePost);
router.post("/likes/unlike", unlikePost);

router.get("/top-liked", topLikedBlogs);

router.post("/comments/create", createComment); 
router.put("/comments/:id", updateComment);
router.delete("/comment/:id", deleteComment);

export default router;

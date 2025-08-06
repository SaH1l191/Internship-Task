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

import protectRoute from '../middleware/protecRoute.js'
const router = express.Router();

router.post("/posts/create",protectRoute, createPost);
router.get("/posts", getAllPosts);

router.post("/likes/like", protectRoute, likePost);
router.post("/likes/unlike", protectRoute, unlikePost);

router.get("/top-liked", topLikedBlogs);

router.post("/comments/create", protectRoute,createComment); 
router.put("/comments/:id",protectRoute , updateComment);
router.delete("/comment/:id",protectRoute, deleteComment);

export default router;

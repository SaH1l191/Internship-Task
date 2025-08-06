import express from "express"
import  {
    getUserProfile,
    loginUser,
    logoutUser,
    signUpUser
}  from '../controllers/userController.js';

const router = express.Router();

router.post("/signup", signUpUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile/:query", getUserProfile);

export default router;

 
import express from 'express' ;
import { protectRoute } from '../middleware/auth.middleware.js';
import { acceptFriendRequest, getFriendRequests, getMyFriends, getOutgoingFriendReqs, getRecommendedUsers, sendFriendRequest } from '../controllers/user.controller.js';

const router = express.Router();


router.use(protectRoute);

router.get('/' , getRecommendedUsers);
router.get('/friends', getMyFriends);

router.get("/friendRequests", getFriendRequests);
router.get("/outgoingFriendRequests", getOutgoingFriendReqs);

router.post("/friendRequest/:id", sendFriendRequest);
router.put("/friendRequest/:id/accept", acceptFriendRequest);



export default router
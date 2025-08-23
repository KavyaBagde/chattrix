import express from 'express' ;
import {loging , signup , logout, onboard } from '../controllers/auth.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup' , signup)
router.post('/login' , loging)
router.post('/logout' , logout)

router.post('/onboarding' ,protectRoute, onboard)

router.get('/me' ,protectRoute, (req , res)=>{
    res.status(200).json({success:true , user : req.user})
})

export default router ;
import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Signup

export async function signup(req, res) {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // TODO: understand this
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists , please use different email" });
    }

    const idx = Math.floor(Math.random() * 100) + 1;

    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}`;

    const newUser = await User.create({
      email,
      password,
      fullName,
      profilePic: randomAvatar,
    });

    //create user on steam also

    try {

      await upsertStreamUser({
      id : newUser._id.toString(),
      name : newUser.fullName,
      image : newUser.profilePic || "" ,
      })
    } catch (error) {
      console.log("Error in creating user on stream " , error)
    }

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({
      success: true,
      user: newUser,
    });
  } catch (error) {
    console.log("error in signup", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

// Login

export async function loging(req, res) {
  try {
    const { email , password } = req.body;

    if(!email || !password){
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const user = await User.findOne({email});

    if(!user){
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await user.matchPassword(password);

    if(!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      success : true,
      user
    })

  } catch (error) {
    console.log("error in login", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

// Logout

export async function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({
    success : true , 
    message : "Logout Successful"
  })
}

//onboard

export async function onboard(req , res) {
  try {
    const userId = req.user._id;
    const {fullName , bio , nativeLanguage , learningLanguage , location} = req.body;

    if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location){
      return res.status(500).json({
        message : "All fields are required",
        missingFields : [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location"
        ].filter(Boolean)
      })
    }

   const updatedUser = await User.findByIdAndUpdate(userId , {
    ...req.body,
    isOnboarded : true
   } , {new : true})

   if(!updatedUser){
    return res.status(404).json({message : "User not found"})
   }

   res.status(200).json({
    success:true,
    user : updatedUser
   })

   // update userinfo in stream

   try {

    await upsertStreamUser({
      id : updatedUser._id.toString(),
      name : updatedUser.fullName,
      image : updatedUser.profilePic || ""
    })
    
   } catch (streamError) {
    console.log("Error updating Stream user during onbiarding" , streamError)
   }


  } catch (error) {
    console.log("Onboarding Error " , error);
    res.status(500).json({
      message :"Internal Server Error"
    })
  }
}
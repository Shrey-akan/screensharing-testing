import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RefreshToken } from "../models/RefreshToken.js";
import { Screen } from "../models/ScreenShare.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user)
      return res.status(409).json({
        message: "User Already Exists!",
      });

    const hashPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      name,
      email,
      password: hashPassword,
    });

    const refreshToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: 15 * 24 * 60 * 60 }
    );

    const accessToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: 15 * 60 }
    );


    await RefreshToken.create({
      token: refreshToken,
      userId: user._id,
    });

    res.status(201).json({
      message: "User Resgistered",
      user,
      accessToken
    });
  } catch (error) {
    res.status(500).json({
      message:
        process.env.Mode === "development"
          ? error.message
          : "someting went wrong! Please try after a while",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user)
      return res.status(409).json({
        message: "Invalid Credentials",
      });

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword)
      return res.status(409).json({
        message: "Invalid Credentials",
      });

    const refreshExists = await RefreshToken.findOne({ userId: user._id });

    if (refreshExists) {
      const accessToken = jwt.sign(
        { _id: refreshExists.userId },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: 15 * 60 }
      );

      return res
        .status(200)
        .json({
          message: `Welcome Back ${user.name}`,
          user,
          accessToken
        });
    } else {
      const refreshToken = jwt.sign(
        { _id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: 15 * 24 * 60 * 60 }
      );

      const accessToken = jwt.sign(
        { _id: user._id },
        process.env.JWT_ACCESS_SECRET,
        // { expiresIn: 15 * 60 }    will uncomment it soon
        { expiresIn: 15 * 24 * 60 * 60 }
      );

      await RefreshToken.create({
        token: refreshToken,
        userId: user._id,
      });

      return res
        .status(200)
        .json({
          message: `Welcome Back ${user.name}`,
          user,
          accessToken
        });
    }
  } catch (error) {
    res.status(500).json({
      message:
        process.env.Mode === "development"
          ? error.message
          : "someting went wrong! Please try after a while",
    });
  }
};

export const myProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      user,
    });
  } catch (error) {
    res.status(500).json({
      message:
        process.env.Mode === "development"
          ? error.message
          : "someting went wrong! Please try after a while",
    });
  }
};


export const logout = async(req,res) => {
  try {
    const {userId} = req.body
    await RefreshToken.findOneAndDelete({userId})

    res.status(200).json({
      message:"Logged Out"
    })
  } catch (error) {
    res.status(500).json({
      message:
        process.env.Mode === "development"
          ? error.message
          : "someting went wrong! Please try after a while",
    });
  }
}


export const saveBrodCast = async(req,res) => {
  try {
    const {brodCastId}  = req.body

    await Screen.create({
      brodCastId
    })
  } catch (error) {
    res.status(500).json({
      message:
        process.env.Mode === "development"
          ? error.message
          : "someting went wrong! Please try after a while",
    });
  }
}

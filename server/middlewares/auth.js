import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { RefreshToken } from "../models/RefreshToken.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const { accesstoken } = req.headers;
    if (!accesstoken) {
      const { userId } = req.headers;
      if (userId) {
        const refreshToken = await RefreshToken.findOne({ userId });

        if (!refreshToken)
          return res.status(401).json({ message: "Login First" });

        const decoded = jwt.verify(
          refreshToken.token,
          process.env.JWT_REFRESH_SECRET
        );

        req.user = await User.findById(decoded._id);

        const newAcessToken = jwt.sign(
          { _id: userId },
          process.env.JWT_ACCESS_SECRET,
          { expiresIn: 15 * 60 }
        );

        const accessOptions = {
          expires: new Date(Date.now() + 15 * 60 * 1000),
          httpOnly: true,
        };

        res.cookie("accesstoken", newAcessToken, accessOptions);

        next();
      } else {
        return res.status(401).json({ message: "Login First" });
      }
    } else {
      const decoded = jwt.verify(accesstoken, process.env.JWT_ACCESS_SECRET);

      req.user = await User.findById(decoded._id);

      next();
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

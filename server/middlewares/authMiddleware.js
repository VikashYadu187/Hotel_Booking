// import User from "../models/User.js";

// // Middleware to check if user is authenticated
// export const protect = async (req, res, next) => {
//   const { userId } = req.auth;
//   if (!userId) {
//     res.json({ success: false, message: "not authenticated" });
//   } else {
//     const user = await User.findById(userId);
//     req.user = user;
//     next();
//   }
// };

export const protect = async (req, res, next) => {
  try {
    const auth = req.auth();
    const userId = auth?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      user = await User.create({
        clerkId: userId,
        role: "user",
        recentSearchedCities: [],
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

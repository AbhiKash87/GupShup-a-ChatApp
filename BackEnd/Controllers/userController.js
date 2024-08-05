
const User = require("../Models/userModel");

const getAllUser = async (req, res) => {
    try {
      const keyword = req.query.search;
      const currentUserId = req.user._id; // Uncomment if needed
  
      if (!keyword) {
        return res.status(400).json({ success: false, message: "Search query is required" });
      }
  
      const searchQuery = {
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { email: { $regex: keyword, $options: 'i' } }
        ],
        _id: { $ne: currentUserId } // Uncomment to exclude the current user
      };
  
      // Perform the database query with .lean() and .exec() to get plain objects
      const users = await User.find(searchQuery).select('name email profilePic').lean().exec();
  
      return res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        users // This will be properly stringified
      });
  
    } catch (err) {
      console.error("Error fetching users:", err); // Log the error for debugging
      return res.status(500).json({ success: false, message: "Failed to fetch users" });
    }
}
const getUser = async (req, res) => {

    try {
      const currentUserId = req.user._id; 
      const user = await User.findById(req.user._id).select('name email profilePic');
      return res.status(200).json({
        success: true,
        message: "User fetched successfully",
        user // This will be properly stringified
      });
  
    } catch (err) {
      console.error("Error fetching user:", err); // Log the error for debugging
      return res.status(500).json({ success: false, message: "Failed to fetch user" });
    }
}
  
  module.exports = {getAllUser,getUser };
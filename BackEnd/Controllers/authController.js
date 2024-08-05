const asyncHandler = require("express-async-handler");
const User = require("../Models/userModel");
const jwt = require("jsonwebtoken");




const registerUser = asyncHandler(async (req,res) => {

    // console.log(req.body)
    const { name, email, password, profilePic } = req.body;

    if( !name || !email || !password){
        res.status(400);
        throw new Error("please enter all the fields");
    }

    const userExist = await User.findOne({ email: email });

    if (userExist) {
        // console.log(userExist);
      res.status(400);
      throw new Error("User Already exist");
    }

    let user = {
        name:name,
        email: email,
        password: password,   
    }
    if (profilePic) {
      user.profilePic = profilePic;
    }
   

    const newUser = await new User(user);
    const savedUser = await newUser.save();

    if(savedUser){

        const secretKey = process.env.SECRET_KEY;
        const payload = {
          email: savedUser.email,
          _id: savedUser._id,
        };

       
        const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
        res
        .status(201)
        .json({
            _id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            pic: savedUser.pic,
            token:token
        });
    }else{
         res.status(400);
         throw new Error("Failed to register");
    }   

    


});


const logInUser = asyncHandler(async (req,res) => {

    const {email,password} = req.body;

    if( !email || !password){
        res.status(400);
        throw new Error("please enter all the fields");
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(400);
      throw new Error("User Not Found");
    }

    const isValid = await user.validatePassword(password);
    if (isValid) {
      const secretKey = process.env.SECRET_KEY;
      const payload = {
        email: user.email,
        _id: user._id,
      };

      const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: token,
      });
    } else {
      res.status(400);
      throw new Error("Password Incorrect");
    }   

});


module.exports = { registerUser, logInUser };

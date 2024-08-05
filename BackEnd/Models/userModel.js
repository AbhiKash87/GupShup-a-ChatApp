const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    name: {type:String,required:true},
    email: {type:String,required:true,unique:true},
    password: {type:String,required:true},
    profilePic: {type:String,default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {

  if(!this.isModified){
    next();
  }
  try {
    const salt = await bcrypt.genSalt(10); // Customize salt rounds as needed
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.validatePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    throw err;
  }
};

module.exports = mongoose.model("User", userSchema);

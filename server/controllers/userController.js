const User = require("../models/userModel")
const bcrypt = require("bcrypt")

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body

    //* Check for Username and Email Uniqueness
    const usernameCheck = await User.findOne({ username })
    if (usernameCheck)
      return res.json({ status: false, message: "Username already taken" })
    const emailCheck = await User.findOne({ email })
    if (emailCheck)
      return res.json({ status: false, message: "Email already taken" })

    //* Hash Password
    const hashedPassword = await bcrypt.hash(password, 10)
    //* Create User
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    })
    const user = newUser.toObject()
    //* Delete Password from User Object
    delete user.password

    //* Send User to Client
    return res.json({
      status: true,
      message: "You have successfully registered!",
      user,
    })
  } catch (err) {
    next(err)
  }
}

module.exports.login = async (req, res, next) => {
  try {
    const { usernameOrEmail, password } = req.body

    //* Find User
    const found1 = await User.findOne({ username: usernameOrEmail })
    const found2 = await User.findOne({ email: usernameOrEmail })
    const found = found1 || found2

    //* Check if User Exists
    if (!found)
      return res.json({
        status: false,
        message: "Invalid Username or Email",
      })

    const user = found.toObject()

    //* Confirm Accurate Password Passwords
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect)
      return res.json({
        status: false,
        message: "Invalid Password",
      })
    //* Delete Password from User Object
    delete user.password

    //* Send User to Client
    return res.json({
      status: true,
      message: "You have successfully registered!",
      user,
    })
  } catch (err) {
    next(err)
  }
}

module.exports.setAvatar = async (req, res, next) => {
  try {
    //* Get Request Data
    const userID = req.params.id
    const avatarImage = req.body.avatarImage

    //* Update User's Avatar
    const userData = await User.findByIdAndUpdate(
      userID,
      { avatarImage, isAvatarImageSet: true },
      { new: true }
    )

    //* Send User to Client
    const user = userData.toObject()
    return res.json({
      status: true,
      message: "Avatar set successfully",
      user,
    })
  } catch (err) {
    next(err)
  }
}

module.exports.allUsers = async (req, res, next) => {
  try {
    //* Get Request Data
    const userID = req.params.id

    //* Find All Users except the User who made the Request
    const allUsers = await User.find({ _id: { $ne: userID } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ])

    //* Send Users to Client
    return res.json({
      status: true,
      message: "All users retrieved successfully",
      users: allUsers,
    })
  } catch (err) {
    next(err)
  }
}

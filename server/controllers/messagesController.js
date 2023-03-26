const messageModel = require("../models/messageModel")

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, message } = req.body
    const newMessage = await messageModel.create({
      message: {
        text: message,
        image: req.body.image || undefined,
      },
      general: req.body.to === "c:GENERAL",
      users: req.body.to !== "c:GENERAL" ? [from._id, req.body.to._id] : [],
      sender: from,
    })
    if (newMessage) return res.json({ status: true })
    return res.json({ status: false, message: "Unable to send message" })
  } catch (err) {
    next(err)
  }
}

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body
    let messages
    if (to === "c:GENERAL") {
      messages = await messageModel
        .find({
          general: true,
        })
        .sort({ updatedAt: 1 })
    } else {
      messages = await messageModel
        .find({
          users: { $all: [from._id, to._id] },
        })
        .sort({ updatedAt: 1 })
    }
    const projectMessages = messages.map(({ message, sender }) => ({
      message: message.text,
      image: message.image,
      fromSelf: sender.toString() === from._id.toString(),
    }))
    res.json(projectMessages)
  } catch (err) {
    next(err)
  }
}

module.exports.getGeneralMessages = async (req, res, next) => {
  try {
    const messages = await messageModel
      .find({
        general: true,
      })
      .sort({ updatedAt: 1 })
    const projectMessages = messages.map(({ message, sender }) => ({
      message: message.text,
      image: message.image,
      fromSelf: sender.toString() === req.body.from._id.toString(),
    }))
    res.json(projectMessages)
  } catch (err) {
    next(err)
  }
}

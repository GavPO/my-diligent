const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema(
  {
    message: {
      text: {
        type: String,
      },
      image: {
        type: String,
      },
    },
    users: Array,
    general: Boolean,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Message", messageSchema)

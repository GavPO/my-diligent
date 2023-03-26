const {
  addMessage,
  getMessages,
  getGeneralMessages,
} = require("../controllers/messagesController")

const router = require("express").Router()

router.post("/add", addMessage)
router.post("/get", getMessages)
router.post("/getGeneral", getGeneralMessages)

module.exports = router

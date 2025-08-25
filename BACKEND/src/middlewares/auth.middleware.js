
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')

async function authmiddleware (req, res, next) { // ✅ added 'next' here
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ message: "Unauthorized , No token provided" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await userModel.findOne({ _id: decoded.id })
    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ message: "invalid token ,please login Again" })
  }
}

module.exports = authmiddleware


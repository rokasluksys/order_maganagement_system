const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const errorHandler = (error, request, response, next) => {
  if (error._message) {
    error.messsage = error._message
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({error: error.message})
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique'})
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  } else if (error.name === 'TypeError' && error.message.includes("Cannot read properties of null")) {
    logger.error(error)
    return response.status(404).json({ error: 'Resource not found' })
  } else {
    logger.error(error.message)
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = null
  }

  next()
}

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  } else {
    const user = await User.findById(decodedToken.id)
    request.user = user
  }

  next()
}

module.exports = {
  errorHandler,
  tokenExtractor,
  userExtractor
}
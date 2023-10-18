const logger = require('./logger')
const jwt = require('jsonwebtoken')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  // console.log('authorization:', authorization)
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
    // console.log('request.token:', request.token)
  } else {
    request.token = null
  }
  next()
}

const userExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  // console.log('authorization:', authorization)
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const decodedToken = jwt.verify(
      authorization.substring(7),
      process.env.SECRET
    )
    request.user = decodedToken.username
    console.log('request.user:', request.user)
  } else {
    request.user = null
  }

  next()
}

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error('ERROR: ', error.name, error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id (CastError)' })
  } else if (error.name === 'ValidationError') {
    return response
      .status(400)
      .json({ error: `${error.message} (ValidationError)` })
  } else if (error.name === 'JsonWebTokenError') {
    return response
      .status(401)
      .json({ error: `${error.message} (JsonWebTokenError)` })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired',
    })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
}

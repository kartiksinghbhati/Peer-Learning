const { getyourReviews } = require('../../controllers/Student/getyourReviews')

const getyourReviewsRouter = require('express').Router()

getyourReviewsRouter.get('/', getyourReviews)

module.exports = getyourReviewsRouter

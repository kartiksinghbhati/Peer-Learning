const { updateAssignmentScore } = require('../../controllers/Teacher/update_assignment_score')

const updateAssignmentScoreRouter = require('express').Router()

updateAssignmentScoreRouter.get('/', updateAssignmentScore)

module.exports = updateAssignmentScoreRouter

// Assignment wise peer score
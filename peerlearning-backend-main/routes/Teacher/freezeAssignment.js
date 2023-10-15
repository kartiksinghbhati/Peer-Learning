const { freezeAssignment } = require('../../controllers/Teacher/freezeAssignment')

const freezeAssignmentRouter = require('express').Router()

freezeAssignmentRouter.post('/', freezeAssignment)

module.exports = freezeAssignmentRouter
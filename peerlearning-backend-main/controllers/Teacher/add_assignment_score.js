const axios = require('axios')
const AssignmentScore = require('../../models/assignment_score')

exports.addAssignmentScore = async (req, res) => {
    let assignment_score = new AssignmentScore()
    assignment_score.User_id = req.body.User_id;
    assignment_score.Assignment_id = req.body.Assignment_id;
    assignment_score.final_grade = req.body.final_grade;
    await assignment_score.save().then(
        console.log("Assignment Score Saved.")
    )
    console.log("reached")

}

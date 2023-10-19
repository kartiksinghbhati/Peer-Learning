//const axios = require('axios')
const AssignmentScore = require('../../models/assignment_score')

exports.updateAssignmentScore = async (req, res) => {
  const filter = { Assignment_id: req.query.Assignment_id, User_id: req.query.User_id };
  const update = { final_grade: req.query.final_grade }; // Set newFinalGrade to the value you want to update to
  try {
    const result = await AssignmentScore.findOneAndUpdate(filter, update, { new: true });
    if (!result) {
      res.status(404).send('AssignmentScore not found');
    } else {
      res.status(200).send(result);
    }
  } catch (err) {
    res.status(500).json(err);
  }

}
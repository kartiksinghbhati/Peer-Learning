const { response } = require('express')
const AssignmentScore = require('../../models/assignment_score')

exports.getAssignmentScore = async (req, res) => {
  //console.log(req.query)
  var assignment_id = req.query.Assignment_id
  var User_id = req.query.User_id
  //console.log(req.query.Assignment_id)


  await AssignmentScore.find(
    { Assignment_id: assignment_id, User_id: User_id },
    async (err, result) => {
      if (err) {
        res.json(err)
      } else {
        //console.log(result);
        res.status(200).send(result)
      }
    }
  )
}


 
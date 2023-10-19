const axios = require('axios');
const AssignmentScore = require('../../models/assignment_score');

exports.addAssignmentScore = async (req, res) => {
  const { User_id, Assignment_id, final_grade } = req.body;

  const existingScore = await AssignmentScore.findOne({ User_id, Assignment_id });

//   console.log("existingScore");
//   console.log(existingScore);

  if (existingScore) {
    // Update the existing AssignmentScore
    existingScore.final_grade = final_grade;

    try {
      const updatedScore = await existingScore.save();
    //   console.log("updatedScore");
    //   console.log(updatedScore);
      return res.status(200).json(updatedScore);
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {

    //console.log("Score");

    const newScore = new AssignmentScore({
      User_id,
      Assignment_id,
      final_grade,
    });

    try {
      const savedScore = await newScore.save();
      return res.status(201).json(savedScore);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
};


// const axios = require('axios')
// const AssignmentScore = require('../../models/assignment_score')

// exports.addAssignmentScore = async (req, res) => {
//     let assignment_score = new AssignmentScore()
//     assignment_score.User_id = req.body.User_id;
//     assignment_score.Assignment_id = req.body.Assignment_id;
//     assignment_score.final_grade = req.body.final_grade;

//     await assignment_score.save().then(
//         (as) => {
//             console.log("Score Saved")
//             return res.json(as)
//         },
//         (err) => {
//             return res.json(err)
//         }
//     )

//     // await assignment_score.save().then(
//     //     console.log("Assignment Score Saved.")
//     // )
//     console.log("reached")

// }

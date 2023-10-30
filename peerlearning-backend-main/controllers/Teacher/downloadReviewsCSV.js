const peerActivity = require('../../models/peerActivity');
const axios = require('axios');
const Assignment = require('../../models/assignment');
const config = require('../../config');
const fetch = require('node-fetch');
const PeerActivity = require('../../models/peerActivity')
const AssignmentScore = require('../../models/assignment_score')

exports.download = async (req, res) => {
  try {
    const peerAssignmentId = req.query.peer_assignment_id;
    const assignment = await Assignment.findById(peerAssignmentId).exec();

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    const courseId = assignment.course_id;
    //console.log(courseId);

    const total_questions = assignment.total_questions;
    var studentID = [];
    var name = [];
    var len;
    var l;
    var maxl;
    let csvString = "Student Name"; // Initialize CSV header
    const studentMap = new Map();
    const reviewerMap = new Map();
    function max(a, b) {
      if (a > b) return a;
      else { return b; }
    }
    const studentsR = async () => {
      try {
        const response = await fetch(`${config.app.GC_API}/courses/${courseId}/students?pageSize=300`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${req.query.access_token}`,
          },
        });
        if (response.ok) {

          //console.log("HHHHHHHHHH");
          const data = await response.json();
          const students = data.students;
          //console.log(students[0].profile);
          len = students.length;
          for (let i = 0; i < students.length; i++) {
            const student = students[i];
            name[i] = student.profile.name.fullName;
            studentID[i] = student.userId;
            //csvString += `${name}\n`;
          }
          students.forEach(student => {
            studentMap.set(student.userId, student.profile.name.fullName);
          });
          //console.log("CSV String:\n" + csvString);
        } else {
          console.log("Failed to fetch data:", response.status, response.statusText);
        }
      }
      catch (error) {
        console.log("An error occurred:", error);
      }
    }
    let x = 1;
    await studentsR();
    const score = [];
    const rev = [];
    //const activities = await peerActivity.find({ peerAssignment_id: peerAssignmentId }).exec();
    for (let i = 0; i < len; i++) {
      await PeerActivity.find({ peerAssignment_id: peerAssignmentId, author_id: studentID[i] },
        (err, result) => {
          if (err) {
            console.log("err");
          } else {
            //console.log(result[0].review_score)
            l = result.length;
            maxl = max(maxl, l);
            //console.log(maxl);
            if (x) {
              for (let i = 0; i < len; i++) {
                score[i] = []; // Initialize a new row
                for (let j = 0; j < l; j++) {
                  score[i][j] = 0; // Set each element to zero
                }
              }
              for (let i = 0; i < len; i++) {
                rev[i] = []; // Initialize a new row
                for (let j = 0; j < l; j++) {
                  rev[i][j] = 0; // Set each element to zero
                }
              }
              x = 0;
              for (let i = 0; i < maxl; i++) {
                csvString += `, Reviewer${i + 1}`
              }
              csvString += ",Final Score \n"

            }
            // console.log(result[i])
            // for (let k = 0; k < len; k++) {
            //   result[i].forEach(reviewer => {
            //     reviewerMap.set(reviewer.author_id, reviewer.reviewer_id);
            //   });
            // }
            for (let k = 0; k < l; k++) {
              for (let j = 0; j < result[k].review_score.length; j++) {
                //console.log(score[i][k])
                score[i][k] += result[k].review_score[j];
                //console.log(result[k].review_score[j])
              }
              rev[i][k] = result[k].reviewer_id;
              //console.log(score[i][k])
            }
          }
        })
    }
    const final_grade = [];
    for (let i = 0; i < len; i++) {
      final_grade[i] = 0;
    }
    for (let i = 0; i < len; i++) {
      await AssignmentScore.find(
        { Assignment_id: peerAssignmentId, User_id: studentID[i] },
        async (err, result) => {
          if (err) {
            console.log("erroor")
          } else {
            if (result[0]) {
              console.log(result[0].final_grade)
              final_grade[i] = result[0].final_grade;
            }
          }
        }
      )
    }

    console.log(final_grade)
    for (let i = 0; i < len; i++) {
      csvString += `${name[i]}`;
      for (let j = 0; j < maxl; j++) {
        let studentName = studentMap.get(rev[i][j]);
        if (!rev[i][j]) studentName = "No Submission"
        csvString += `, ${studentName}--${score[i][j]}`;
      }
      csvString += `,${final_grade[i]} \n`
    }
    res.setHeader('Content-disposition', 'attachment; filename=Scores_sheet.csv');
    res.set('Content-Type', 'text/csv');
    res.status(200).send(csvString);
  } catch (error) {
    //console.error(error);
    res.status(500).json({
      message: 'Internal server error occurred while generating the CSV file.',
    });
  }
}


// const peerActivity = require('../../models/peerActivity')
// const axios = require('axios')
// const Assignment = require('../../models/assignment')
// const config = require('../../config')

// exports.download = async (req, res) => {
//   var peerAssignmentId = req.query.peer_assignment_id
//   var courseId
//   var total_questions
//   let sdMap = {}

//   await Assignment.findById(peerAssignmentId, (err, result) => {
//     if (err) {
//       return res.json(err)
//     } else {
//       courseId = result.course_id
//       total_questions = result.total_questions
//     }
//   })

//   await axios
//     .get(`${config.app.GC_API}/courses/${courseId}/students`, {
//       headers: {
//         Authorization: `Bearer ${req.query.access_token}`,
//       },
//     })
//     .then((data) => {
//       data.data.students.forEach((s) => {
//         sdMap[s.profile.id] = s
//       })
//     })
//     .catch((err) => {
//       console.log(err)
//       return res.status(400).json({
//         message:
//           'Some internal error occurred while loading reviews, please try again!',
//       })
//     })
//   let csvString = ''
//   await peerActivity.find(
//     { peerAssignment_id: peerAssignmentId },
//     (err, result) => {
//       if (err) {
//         res.json(err)
//       } else {
//         let activities = [...result]
//         activities.forEach((ac) => {
//           ac.author_id = sdMap[ac.author_id].profile.emailAddress
//           ac.reviewer_id = sdMap[ac.reviewer_id].profile.emailAddress
//           csvString += ac.author_id
//           csvString += ',' + ac.reviewer_id
//           if (ac.review_score.length == 0) {
//             for (let temp = 0; temp < total_questions; temp++) {
//               csvString += ',,'
//             }
//           } else {
//             for (let temp = 0; temp < total_questions; temp++) {
//               csvString += ',' + ac.review_score[temp]
//             }
//             for (let temp = 0; temp < total_questions; temp++) {
//               csvString += ',' + ac.reviewer_comment[temp]
//             }
//           }
//           csvString += '\n'
//         })
//         res.setHeader(
//           'Content-disposition',
//           'attachment; filename=Scores_sheet.csv'
//         )
//         res.set('Content-Type', 'text/csv')
//         res.status(200).send(csvString)
//       }
//     }
//   )
// }
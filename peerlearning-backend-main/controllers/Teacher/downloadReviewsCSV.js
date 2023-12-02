
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
    const options = Array.isArray(req.query.options) ? req.query.options : [req.query.options];
    
    const onlyFinalGrade = 0;
    const showTime = 1;
    const showIndivisualQuestions = 1;
    //const showAllStudents = 1;

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    const courseId = assignment.course_id;
    //console.log(courseId);

    const total_questions = assignment.total_questions;
    const deadline = assignment.reviewer_deadline;
    var studentID = [];
    var name = [];
    var len;
    var l;
    var maxl;
    let csvString = "Student Name"; // Initialize CSV header
    var numofQues = 0;
    const studentMap = new Map();
    const reviewerMap = new Map();
    function max(a, b) {
      if (a > b) return a;
      else { return b; }
    }
    function compareDeadline(timestamp1, timestamp2) {
      if (!timestamp2) return 0;
      const date1 = new Date(timestamp1);
      const date2 = new Date(timestamp2);

      // Compare the two Date objects after converting to a common time zone (e.g., UTC)
      const date1UTC = new Date(date1.toISOString());
      const date2UTC = new Date(date2.toISOString());

      // Now you can compare the two Date objects
      if (date1UTC >= date2UTC) {
        return 1;
      }
      else {
        return -1;
      }
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
    const time = [];
    const late = [];
    const final_grade = [];
    for (let i = 0; i < len; i++) {
      final_grade[i] = 0;
    }
    for (let i = 0; i < len; i++) {  //runs for all students len = no. of students
      await AssignmentScore.find(
        { Assignment_id: peerAssignmentId, User_id: studentID[i] },
        async (err, result1) => {
          if (err) {
            console.log("erroor")
          } else {
            if (result1[0]) {
              //console.log(result1[0].final_grade)
              final_grade[i] = result1[0].final_grade;
            }
          }
        }
      )
    }
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
            for (let k = 0; k < l; k++) {
              numofQues = max(numofQues, result[k].review_score.length);
            }
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
              for (let i = 0; i < len; i++) {
                time[i] = []; // Initialize a new row
                for (let j = 0; j < l; j++) {
                  time[i][j] = 0; // Set each element to zero
                }
              }
              for (let i = 0; i < len; i++) {
                late[i] = []; // Initialize a new row
                for (let j = 0; j < l; j++) {
                  late[i][j] = 0; // Set each element to zero
                }
              }
              x = 0;
              if (!onlyFinalGrade) {
                for (let i = 0; i < maxl; i++) {
                  csvString += `, Reviewer${i + 1}`
                  for (let j = 0; j < numofQues; j++) {
                    if (showIndivisualQuestions) {
                      csvString += `, Q${j + 1}`
                    }
                    if (showTime) {
                      if (j == numofQues - 1) csvString += `, Time of Submission`
                      if (j == numofQues - 1) csvString += `, Late Submission`
                    }
                    if (j == numofQues - 1) csvString += `, Total Marks`
                  }
                }
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
              numofQues = max(numofQues, result[k].review_score.length);
              for (let j = 0; j < result[k].review_score.length; j++) {
                //console.log("QUES:" + numofQues)
                score[i][k] += result[k].review_score[j];
                //console.log(result[k].review_score[j])
              }
              rev[i][k] = result[k].reviewer_id;

              time[i][k] = result[k].time_stamp;
              late[i][k] = compareDeadline(deadline, result[k].time_stamp);
              //console.log(score[i][k])
            }
            //for (let i = 0; i < len; i++) {

            csvString += `${name[i]}`;

            // else {
            //   const a = []
            //   for(let j=0;j<maxl;j++){
            //     if(rev[i][j]) a[i] = 1;
            //   }
            //   csvString +=
            // }

            if (!onlyFinalGrade) {

              for (let j = 0; j < maxl; j++) {
                let studentName = studentMap.get(rev[i][j]);
                if (!rev[i][j]) {
                  studentName = "No Submission"
                  //csvString += `, ${studentName} `;
                }
                //else {
                csvString += `, ${studentName} `;
                for (let k = 0; k < numofQues; k++) {
                  if (showIndivisualQuestions) {
                    if (result[j]) {
                      csvString += `, ${result[j].review_score[k]}`
                    }
                    else {
                      csvString += `, -`
                    }
                  }
                  if (showTime) {
                    if (k == numofQues - 1) csvString += `, ${time[i][j]}`
                    if (k == numofQues - 1) {
                      if (late[i][j] == 1) csvString += `, NO`
                      else if (late[i][j] == 0) csvString += `, -`
                      else if (late[i][j] == -1) csvString += `, YES`
                    }
                  }

                  if (k == numofQues - 1) csvString += `, ${score[i][j]}`
                }
                //}
              }
            }
            csvString += `,${final_grade[i]} \n`
            //}
          }
        })
    }


    //console.log(final_grade)

    res.setHeader('Content-disposition', 'attachment; filename=Scores_sheet.csv');
    res.set('Content-Type', 'text/csv');
    res.status(200).send(csvString);
  } catch (error) {
    //console.error(error);
    res.status(500).json({
      message: 'Internal server error occurred while generating the CSV file.',
    });
  }
};



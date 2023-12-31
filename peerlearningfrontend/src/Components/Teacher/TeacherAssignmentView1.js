import React, { useContext, useEffect, useState } from "react";
import { G_API, API } from "../../config";
import AuthContext from "../../AuthContext";
import { ReactComponent as AssignmentIcon } from "./Assests/Assignment.svg";
import { ReactComponent as Line } from "./Assests/Line.svg";
import thumbnail from "../Student/Assests/thumbnail.png";
import redflag from "../Images/redflag.png";
import yellowflag from "../Images/yellowflag.png"
import bottom from "../Images/Bottom.png";
import styles from "./TeacherAssignmentView1.module.css";
import { ScoreCard } from "./ScoreCard";
import Spinner from "../Spinner/Spinner";
import StopPeerLearningPopup from "../Popups/StopPeerLearningPopup";
import FreezeAssignmentPopup from "../Popups/FreezeAssignmentPopup";


var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function bufferMarksCal(marks, tolerance) {
  let total = 0;
  for (let i = 0; i < marks.length; i++) {
    total = total + marks[i];
  }
  let buffer = (total * tolerance) / 100;

  return buffer;
}

function compareMarks1(row, bufferMark) {

  let flag = false;

  const totalMarks = [];

  for (let i = 2; i < row.length; i++) {
    let total = 0;

    for (let j = 0; j < row[i].review_score.length; j++) {
      total += row[i].review_score[j];
    }
    totalMarks.push(total);
  }
  // console.log(totalMarks)
  for (let i = 0; i < totalMarks.length; i++) {
    for (let j = i + 1; j < totalMarks.length; j++) {
      if(totalMarks[i]==0||totalMarks[j]==0)
      {
        continue;
      }
      const diff = Math.abs(totalMarks[i] - totalMarks[j]);
      if (diff > bufferMark) {
        flag = true;
      }
    }
  }

  return flag;
}

// Standard Deviation Function
function calculateStandardDeviation(eachStudentFullMarks) {
  // Step 1: Calculate the mean
  const mean =
    eachStudentFullMarks.reduce((sum, num) => sum + num, 0) /
    eachStudentFullMarks.length;

  // Step 2: Calculate the squared differences from the mean
  const squaredDifferences = eachStudentFullMarks.map((num) =>
    Math.pow(num - mean, 2)
  );

  // Step 3: Calculate the mean of the squared differences
  const meanOfSquaredDifferences =
    squaredDifferences.reduce((sum, squaredDiff) => sum + squaredDiff, 0) /
    eachStudentFullMarks.length;

  // Step 4: Take the square root to get the standard deviation
  const standardDeviation = Math.sqrt(meanOfSquaredDifferences);

  return standardDeviation;
}
//   Standard deviaiton function ends

function compareMarks2(row) {
  const eachStudentFullMarks = [];
  let selfScore = null;
  let flag = false;
  const rs = row[1]?.review_score;
  let standardDeviationOfAllReviewer = null;
  let meanOfAllReviewerTotalMarks = 0;
  if (row.length <= 3) {
    standardDeviationOfAllReviewer = 0;
  }

  if (rs && rs.length > 0) {
    // Self Total score calulations
    for (let j = 0; j < row[1].review_score.length; j++) {
      selfScore = selfScore + rs[j];
    }
    // row = array of no of students
    for (let i = 2; i < row.length; i++) {
      // review Score == is the array of score of each questions of one student
      let oneReviewerScore = 0;
      for (let j = 0; j < row[i].review_score.length; j++) {
        oneReviewerScore = oneReviewerScore + row[i].review_score[j];
      }
      meanOfAllReviewerTotalMarks += oneReviewerScore;
      if (!row[i].review_score.length == 0) {
        if(oneReviewerScore==0)
        {

        }
        else
        {
          eachStudentFullMarks.push(oneReviewerScore);
        }
        
      }
    }
    // console.log(eachStudentFullMarks.length);
    meanOfAllReviewerTotalMarks = meanOfAllReviewerTotalMarks / eachStudentFullMarks.length;
    standardDeviationOfAllReviewer =
      calculateStandardDeviation(eachStudentFullMarks);
    if (isNaN(standardDeviationOfAllReviewer)) {
      standardDeviationOfAllReviewer = 0;
    }
    console.log(meanOfAllReviewerTotalMarks)
    if (
      meanOfAllReviewerTotalMarks - standardDeviationOfAllReviewer <=
      selfScore &&
      selfScore <=
      meanOfAllReviewerTotalMarks + standardDeviationOfAllReviewer
    ) {
    } else {
      if(isNaN(meanOfAllReviewerTotalMarks))
      {

      }
      else
      {
        flag = true;
      }
      
    }
  }

  return flag;
}

export default function TeacherAssignmentView1({ assg, activities, marks, reviewerCount, stopPeerLearning, freezeAssignment }) {
  //console.log(assg);
  //console.log(activities);

  const { userData, assignment } = useContext(AuthContext);
  const _id = assignment._id;

  const bufferMark = bufferMarksCal(marks, assg.tolerance);

  var i = 200;
  var j = 1000;
  const data = [
    { name: 'Completed', students: i, fill: "rgba(75, 192, 192, 0.2)" },
    { name: 'In-Progress', students: 200, fill: "rgba(255, 206, 86, 0.3)" },
    { name: 'Not-Started', students: j, fill: "rgba(255, 99, 132, 0.4)" },
  ];

  const [TeacherName, setTeacherName] = useState([]);
  const [finalGrades, setFinalGrades] = useState([]);
  const [spin, setspin] = useState(true);
  const [showFreezeConfirmation, setShowFreezeConfirmation] = useState(false);
  const [showStopConfirmation, setShowStopConfirmation] = useState(false);
  const [sortFlaggedStudents, setSortFlaggedStudents] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const allOptions = ['onlyFinalGrade', 'showTime', 'showIndivisualQuestions'];
  const [options, setOptions] = useState(allOptions);

  const truncate = (str) => {
    if (str) {
      return str.length > 60 ? str.substring(0, 59) + "..." : str;
    }
  }


  let formattedDeadline = "";
  if (assg.reviewer_deadline !== undefined) {
    const deadlineDate = new Date(assg.reviewer_deadline);
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    formattedDeadline = deadlineDate.toLocaleDateString('en-US', options);
  }


  const getMarks = async (activity) => {

    if (userData.token) {

      if (activity.length > 1) {

        await fetch(`${API}/api/assignmentscore?User_id=${activity[0].userId}&Assignment_id=${assg._id}`)
          .then((res) => res.json())
          .then((res) => {
            //console.log(res);

            if (res.length > 0) {
              const userId = activity[0].userId;
              const marks = res[0].final_grade;

              setFinalGrades((prevGrades) => ({
                ...prevGrades,
                [userId]: marks,
              }));
            }
          });

      }
      else {

        setFinalGrades((prevGrades) => ({
          ...prevGrades,
          [activity[0].userId]: 0,
        }));

      }

    }
  }

  const loadData = async () => {

    if (userData.token) {
      await fetch(`${G_API}/courses/${assg.courseId}/teachers`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          var len = res.teachers.length;
          for (var i = 0; i < len; i++) {
            if (res.teachers[i].userId == assg.creatorUserId) {
              var g = i;
            }
          }
          setTeacherName(res.teachers[g].profile.name.fullName);

        });

      await Promise.all(activities.map(activity => getMarks(activity)));



      setspin(false);

    }
  }

  useEffect(() => { loadData() }, [userData.token, assg, activities]);

  //useEffect(() => { getMarks() }, [userData.token]);

  const sortedActivities = activities.slice().sort((a, b) => {
    const flagA = compareMarks1(a, bufferMark) || compareMarks2(a);
    const flagB = compareMarks1(b, bufferMark) || compareMarks2(a);
    return sortFlaggedStudents ? flagB - flagA : 0;
  });



  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleOptionToggle = (option) => {
    if (option === 'All') {
      setOptions(options.length === allOptions.length ? [] : allOptions);
    } else {
      setOptions((prevOptions) => {
        if (prevOptions.includes(option)) {
          return prevOptions.filter((opt) => opt !== option);
        } else {
          return [...prevOptions, option];
        }
      });
    }
  };

  const downloadCsvFile = async () => {
    try {

      const queryParams = options.map(option => `options[]=${encodeURIComponent(option)}`).join('&');

      const response = await fetch(`${API}/api/download?peer_assignment_id=${assg._id}&access_token=${userData.token}&${queryParams}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });

      if (response.status === 200) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Scores_sheet.csv'; // Set the desired file name
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Failed to download CSV file");
      }
    } catch (error) {
      console.error("API call error: ", error);
    }
  };

  return (
    <>
      {spin ? <Spinner /> :
        <div>
          <div className={styles.mainDiv}>
            <div className={styles.contentDiv}>
              <div>
                <AssignmentIcon className={styles.AssgIcon} />
              </div>
              <div className={styles.midDiv}>
                <h4 className={styles.AssgnName}>{truncate(assg.assignment_title)}</h4>
                <p className={styles.teacher}>{TeacherName} <span className={styles.dot}>.</span> {month[(assg.creationTime.substring(5, 7)) - 1]} {assg.creationTime.substring(8, 10)}</p>
                <div className={styles.pointsanddue}>
                  {assg.maxPoints ? <p className={styles.points}>{assg.maxPoints} Points</p> : <p className={styles.points}>Ungraded</p>}
                  <div className={styles.duediv}>
                    {assg.reviewer_deadline ? <p className={styles.due}>Due {formattedDeadline} </p> : <p className={styles.due}>No Due Date</p>}
                  </div>
                </div>
                <Line className={styles.line} />
                <p className={styles.AssignmentSubtitle}>{assg.description}</p>
                {assg.materials ?
                  <a href={assg.materials[0].driveFile.driveFile.alternateLink}>
                    <div className={styles.uploadDoc}>
                      <img id={styles.thumbnail1} src={assg.materials[0].driveFile.driveFile.thumbnailUrl} />
                      <div id={styles.written}>
                        <p id={styles.ques}>{assg.materials[0].driveFile.driveFile.title}</p>
                        <p id={styles.type}>PDF</p>
                      </div>
                    </div>
                  </a> :
                  <div className={styles.uploadDoc}>
                    <img id={styles.thumbnail1} src={thumbnail} />
                    <div id={styles.written}>
                      <p id={styles.ques}>No Question Paper Uploaded</p>
                    </div>
                  </div>
                }
              </div>
            </div>
            <div className={styles.pdfDiv}>
              <button className={styles.btn1}>Check for Abnormalities </button>
              <div className={styles.buttonGroup}>
                <button className={styles.btn2} onClick={downloadCsvFile}>Download student Reviews</button>
                <button className={styles.btn3} onClick={toggleDropdown}>&#9660;</button>
              </div>
              <div className={styles.dropDown}>

                {isDropdownOpen && (
                  <div className={styles.checkboxDropdown}>
                    <label>
                      <input
                        type="checkbox"
                        checked={options.length === allOptions.length}
                        onChange={() => handleOptionToggle('All')}
                      />
                      All
                    </label>
                    {allOptions.map((option) => (
                      <label key={option}>
                        <input
                          type="checkbox"
                          checked={options.includes(option)}
                          onChange={() => handleOptionToggle(option)}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <button className={styles.btn4} onClick={() => setSortFlaggedStudents(!sortFlaggedStudents)}>Sort Flagged Students</button>
              <button className={styles.btn5} onClick={() => setShowFreezeConfirmation(true)}>Freeze Marks</button>
              <button className={styles.btn6} onClick={() => setShowStopConfirmation(true)}>Stop Peer Learning </button>
              <button className={styles.btn7}>View detailed Analytics </button>
            </div>
          </div>
          {/* <p className={styles.completeprogress}>Completion Progress</p> */}

          {activities.length > 0 && assg.status !== "Added" && (
            <>
              <p className={styles.studentSubmissions}> Student Submissions </p>

              <table className={styles.studentList}>

                <thead>
                  <tr>
                    <th>Student Name</th>

                    {assg.isFreeze && (<th>Final Grades</th>)}

                    {Array(reviewerCount)
                      .fill(0)
                      .map((_, i) => (
                        <th key={`reviewer-${i}`}>{i === 0 ? "Self" : `Reviewer ${i }`}</th>
                      ))}
                  </tr>
                </thead>

                <tbody>
                  {sortedActivities.map((row, index) => {

                    const flag = compareMarks1(row, bufferMark);
                    const flag2 = compareMarks2(row);

                    // const flag = false;

                    const studentName = (flag || flag2) ? styles.flagstudentFullName : styles.studentFullName;

                    return (
                      <tr key={row.name}>
                        <td>
                          <div className={studentName}>{row[0].profile.name.fullName}</div>
                          {flag && <img src={redflag} alt="RedFlag" className={styles.redflagimg} />}
                          {flag2 && <img src={yellowflag} alt="YellowFlag" className={styles.yellowflagimg} />}
                        </td>

                        {assg.isFreeze && (
                          <td>
                            <div className={studentName}>{finalGrades[row[0].userId]}</div>
                          </td>
                        )}

                        {row.slice(1).map((r) => {
                          const isDataEmpty = r.review_score.length === 0;


                          const tdClassName = isDataEmpty ? styles.emptyScore : styles.nonEmptyScore;

                          return (
                            <td key={r.name.fullName}>
                              <ScoreCard
                                data={r}
                                questions={assg.total_questions}
                                activities={activities}
                                freezeAssignment={freezeAssignment}
                              >
                                <div className={tdClassName}>
                                  {r.name.fullName}
                                </div>
                                <div className={styles.Score}>
                                  {" (" + r.review_score + ")"}
                                </div>
                              </ScoreCard>
                            </td>
                          );
                        })}

                        {row.length === 1 && (
                          <>
                            {Array(reviewerCount).fill(0).map((_, i) => (
                              <td key={`no-submission-${i}`} className={styles.noSubmission}>
                                No Submission
                              </td>
                            ))}
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}

        </div>}
      {<img src={bottom} alt="Image" className={styles.bottom} />}

      <StopPeerLearningPopup
        assg={assg}
        stopPeerLearning={stopPeerLearning}
        showStopConfirmation={showStopConfirmation}
        setShowStopConfirmation={setShowStopConfirmation}
        finalGrades={finalGrades}
      />

      <FreezeAssignmentPopup
        assg={assg}
        activities={activities}
        freezeAssignment={freezeAssignment}
        showFreezeConfirmation={showFreezeConfirmation}
        setShowFreezeConfirmation={setShowFreezeConfirmation}
        finalGrades={finalGrades}
        setFinalGrades={setFinalGrades}
      />

    </>
  );
}

// import React, { useContext, useEffect, useState } from "react";
// import { G_API, API } from "../../config";
// import AuthContext from "../../AuthContext";
// import { ReactComponent as AssignmentIcon } from "./Assests/Assignment.svg";
// import { ReactComponent as Line } from "./Assests/Line.svg";
// import thumbnail from "../Student/Assests/thumbnail.png";
// import redflag from "../Images/redflag.png";
// import bottom from "../Images/Bottom.png";
// import styles from "./TeacherAssignmentView1.module.css";
// import { ScoreCard } from "./ScoreCard";
// import Spinner from "../Spinner/Spinner";
// import StopPeerLearningPopup from "../Popups/StopPeerLearningPopup";
// import FreezeAssignmentPopup from "../Popups/FreezeAssignmentPopup";

// // function conversion(hours, minutes) {
// //   var t;
// //   var h = hours + 5;
// //   var m = minutes + 30;
// //   if (m >= 60) {
// //     h = h + 1;
// //     m = 60 - m;
// //   }
// //   if (m < 10) {
// //     m = "0" + m;
// //   }
// //   if (h >= 24)
// //     h = h - 24;
// //   if (h >= 12) {
// //     t = 'PM';
// //     if (h > 12)
// //       h = h - 12;
// //   }
// //   else {
// //     t = 'AM';
// //     if (h < 10) {
// //       h = "0" + h;
// //     }
// //   }
// //   return h + ":" + m + " " + t;
// // }
// // function none(hours) {
// //   var t;
// //   var h = hours + 5;
// //   var m = 30;
// //   if (h >= 24)
// //     h = h - 24;
// //   if (h >= 12) {
// //     t = 'PM';
// //     if (h > 12)
// //       h = h - 12;
// //   }
// //   else {
// //     t = 'AM';
// //     if (h < 10) {
// //       h = "0" + h;
// //     }
// //   }
// //   return h + ":" + m + " " + t;
// // }

// var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// function bufferMarksCal(marks, tolerance) {
//   let total = 0;
//   for (let i = 0; i < marks.length; i++) {
//     total = total + marks[i];
//   }
//   let buffer = (total * tolerance) / 100;

//   return buffer;
// }

// function compareMarks1(row, bufferMark) {

//   let flag = false;

//   const totalMarks = [];

//   for (let i = 1; i < row.length; i++) {
//     let total = 0;

//     for (let j = 0; j < row[i].review_score.length; j++) {
//       total += row[i].review_score[j];
//     }
//     totalMarks.push(total);
//   }

//   for (let i = 0; i < totalMarks.length; i++) {
//     for (let j = i + 1; j < totalMarks.length; j++) {
//       const diff = Math.abs(totalMarks[i] - totalMarks[j]);
//       if (diff > bufferMark) {
//         flag = true;
//       }
//     }
//   }

//   return flag;
// }

// // Standard Deviation Function
// function calculateStandardDeviation(eachStudentFullMarks) {
//   // Step 1: Calculate the mean
//   const mean =
//     eachStudentFullMarks.reduce((sum, num) => sum + num, 0) /
//     eachStudentFullMarks.length;

//   // Step 2: Calculate the squared differences from the mean
//   const squaredDifferences = eachStudentFullMarks.map((num) =>
//     Math.pow(num - mean, 2)
//   );

//   // Step 3: Calculate the mean of the squared differences
//   const meanOfSquaredDifferences =
//     squaredDifferences.reduce((sum, squaredDiff) => sum + squaredDiff, 0) /
//     eachStudentFullMarks.length;

//   // Step 4: Take the square root to get the standard deviation
//   const standardDeviation = Math.sqrt(meanOfSquaredDifferences);

//   return standardDeviation;
// }
// //   Standard deviaiton function ends

// function compareMarks2(row) {
//   const eachStudentFullMarks = [];
//   let selfScore = null;
//   let flag = false;
//   const rs = row[1]?.review_score;
//   let standardDeviationOfAllReviewer = null;
//   let meanOfAllReviewerTotalMarks = 0;
//   if (row.length <= 3) {
//     standardDeviationOfAllReviewer = 0;
//   }

//   if (rs && rs.length > 0) {
//     // Self Total score calulations
//     for (let j = 0; j < row[1].review_score.length; j++) {
//       selfScore = selfScore + rs[j];
//     }
//     // row = array of no of students
//     for (let i = 2; i < row.length; i++) {
//       // review Score == is the array of score of each questions of one student
//       let oneReviewerScore = 0;
//       for (let j = 0; j < row[i].review_score.length; j++) {
//         oneReviewerScore = oneReviewerScore + row[i].review_score[j];
//       }
//       meanOfAllReviewerTotalMarks += oneReviewerScore;
//       if (!row[i].review_score.length == 0) {
//         eachStudentFullMarks.push(oneReviewerScore);
//       }
//     }
//     meanOfAllReviewerTotalMarks = meanOfAllReviewerTotalMarks / eachStudentFullMarks.length;
//     standardDeviationOfAllReviewer =
//       calculateStandardDeviation(eachStudentFullMarks);
//     if (isNaN(standardDeviationOfAllReviewer)) {
//       standardDeviationOfAllReviewer = 0;
//     }

//     if (
//       meanOfAllReviewerTotalMarks - standardDeviationOfAllReviewer <=
//       selfScore &&
//       selfScore <=
//       meanOfAllReviewerTotalMarks + standardDeviationOfAllReviewer
//     ) {
//     } else {
//       flag = true;
//     }
//   }

//   return flag;
// }

// export default function TeacherAssignmentView1({ assg, activities, marks, reviewerCount, stopPeerLearning, freezeAssignment }) {
//   //console.log(assg);
//   //console.log(activities);

//   const { userData, assignment } = useContext(AuthContext);
//   const _id = assignment._id;

//   const bufferMark = bufferMarksCal(marks, assg.tolerance);

//   var i = 200;
//   var j = 1000;
//   const data = [
//     { name: 'Completed', students: i, fill: "rgba(75, 192, 192, 0.2)" },
//     { name: 'In-Progress', students: 200, fill: "rgba(255, 206, 86, 0.3)" },
//     { name: 'Not-Started', students: j, fill: "rgba(255, 99, 132, 0.4)" },
//   ];

//   const [TeacherName, setTeacherName] = useState([]);
//   const [finalGrades, setFinalGrades] = useState([]);
//   const [spin, setspin] = useState(true);
//   const [showFreezeConfirmation, setShowFreezeConfirmation] = useState(false);
//   const [showStopConfirmation, setShowStopConfirmation] = useState(false);
//   const [sortFlaggedStudents, setSortFlaggedStudents] = useState(false);
//   const [isDropdownOpen, setDropdownOpen] = useState(false);

//   const allOptions = ['onlyFinalGrade', 'showTime', 'showIndivisualQuestions'];
//   const [options, setOptions] = useState(allOptions);

//   const truncate = (str) => {
//     if (str) {
//       return str.length > 60 ? str.substring(0, 59) + "..." : str;
//     }
//   }


//   let formattedDeadline = "";
//   if (assg.reviewer_deadline !== undefined) {
//     const deadlineDate = new Date(assg.reviewer_deadline);
//     const options = {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//       hour: 'numeric',
//       minute: 'numeric',
//       hour12: true,
//     };
//     formattedDeadline = deadlineDate.toLocaleDateString('en-US', options);
//   }


//   const getMarks = async (activity) => {

//     if (userData.token) {

//       if (activity.length > 1) {

//         await fetch(`${API}/api/assignmentscore?User_id=${activity[0].userId}&Assignment_id=${assg._id}`)
//           .then((res) => res.json())
//           .then((res) => {
//             //console.log(res);

//             if (res.length > 0) {
//               const userId = activity[0].userId;
//               const marks = res[0].final_grade;

//               setFinalGrades((prevGrades) => ({
//                 ...prevGrades,
//                 [userId]: marks,
//               }));
//             }
//           });

//       }
//       else {

//         setFinalGrades((prevGrades) => ({
//           ...prevGrades,
//           [activity[0].userId]: 0,
//         }));

//       }

//     }
//   }

//   const loadData = async () => {

//     if (userData.token) {
//       await fetch(`${G_API}/courses/${assg.courseId}/teachers`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${userData.token}`,
//         },
//       })
//         .then((res) => res.json())
//         .then((res) => {
//           var len = res.teachers.length;
//           for (var i = 0; i < len; i++) {
//             if (res.teachers[i].userId == assg.creatorUserId) {
//               var g = i;
//             }
//           }
//           setTeacherName(res.teachers[g].profile.name.fullName);

//         });

//       await Promise.all(activities.map(activity => getMarks(activity)));



//       setspin(false);

//     }
//   }

//   useEffect(() => { loadData() }, [userData.token, assg, activities]);

//   //useEffect(() => { getMarks() }, [userData.token]);

//   const sortedActivities = activities.slice().sort((a, b) => {
//     const flagA = compareMarks1(a, bufferMark) || compareMarks2(a);
//     const flagB = compareMarks1(b, bufferMark) || compareMarks2(a);
//     return sortFlaggedStudents ? flagB - flagA : 0;
//   });



//   const toggleDropdown = () => {
//     setDropdownOpen(!isDropdownOpen);
//   };

//   const handleOptionToggle = (option) => {
//     if (option === 'All') {
//       setOptions(options.length === allOptions.length ? [] : allOptions);
//     } else {
//       setOptions((prevOptions) => {
//         if (prevOptions.includes(option)) {
//           return prevOptions.filter((opt) => opt !== option);
//         } else {
//           return [...prevOptions, option];
//         }
//       });
//     }
//   };

//   const downloadCsvFile = async () => {
//     try {

//       const queryParams = options.map(option => `options[]=${encodeURIComponent(option)}`).join('&');

//       const response = await fetch(`${API}/api/download?peer_assignment_id=${assg._id}&access_token=${userData.token}&${queryParams}`, {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${userData.token}`,
//         },
//       });

//       if (response.status === 200) {
//         const blob = await response.blob();
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = 'Scores_sheet.csv'; // Set the desired file name
//         a.click();
//         window.URL.revokeObjectURL(url);
//       } else {
//         console.error("Failed to download CSV file");
//       }
//     } catch (error) {
//       console.error("API call error: ", error);
//     }
//   };

//   return (
//     <>
//       {spin ? <Spinner /> :
//         <div>
//           <div className={styles.mainDiv}>
//             <div className={styles.contentDiv}>
//               <div>
//                 <AssignmentIcon className={styles.AssgIcon} />
//               </div>
//               <div className={styles.midDiv}>
//                 <h4 className={styles.AssgnName}>{truncate(assg.assignment_title)}</h4>
//                 <p className={styles.teacher}>{TeacherName} <span className={styles.dot}>.</span> {month[(assg.creationTime.substring(5, 7)) - 1]} {assg.creationTime.substring(8, 10)}</p>
//                 <div className={styles.pointsanddue}>
//                   {assg.maxPoints ? <p className={styles.points}>{assg.maxPoints} Points</p> : <p className={styles.points}>Ungraded</p>}
//                   <div className={styles.duediv}>
//                     {assg.reviewer_deadline ? <p className={styles.due}>Due {formattedDeadline} </p> : <p className={styles.due}>No Due Date</p>}
//                   </div>
//                 </div>
//                 <Line className={styles.line} />
//                 <p className={styles.AssignmentSubtitle}>{assg.description}</p>
//                 {assg.materials ?
//                   <a href={assg.materials[0].driveFile.driveFile.alternateLink}>
//                     <div className={styles.uploadDoc}>
//                       <img id={styles.thumbnail1} src={assg.materials[0].driveFile.driveFile.thumbnailUrl} />
//                       <div id={styles.written}>
//                         <p id={styles.ques}>{assg.materials[0].driveFile.driveFile.title}</p>
//                         <p id={styles.type}>PDF</p>
//                       </div>
//                     </div>
//                   </a> :
//                   <div className={styles.uploadDoc}>
//                     <img id={styles.thumbnail1} src={thumbnail} />
//                     <div id={styles.written}>
//                       <p id={styles.ques}>No Question Paper Uploaded</p>
//                     </div>
//                   </div>
//                 }
//               </div>
//             </div>
//             <div className={styles.pdfDiv}>
//               <button className={styles.btn1}>Check for Abnormalities </button>
//               <div className={styles.buttonGroup}>
//                 <button className={styles.btn2} onClick={downloadCsvFile}>Download student Reviews</button>
//                 <button className={styles.btn3} onClick={toggleDropdown}>&#9660;</button>
//               </div>
//               <div className={styles.dropDown}>

//                 {isDropdownOpen && (
//                   <div className={styles.checkboxDropdown}>
//                     <label>
//                       <input
//                         type="checkbox"
//                         checked={options.length === allOptions.length}
//                         onChange={() => handleOptionToggle('All')}
//                       />
//                       All
//                     </label>
//                     {allOptions.map((option) => (
//                       <label key={option}>
//                         <input
//                           type="checkbox"
//                           checked={options.includes(option)}
//                           onChange={() => handleOptionToggle(option)}
//                         />
//                         {option}
//                       </label>
//                     ))}
//                   </div>
//                 )}
//               </div>
//               <button className={styles.btn4} onClick={() => setSortFlaggedStudents(!sortFlaggedStudents)}>Sort Flagged Students</button>
//               <button className={styles.btn5} onClick={() => setShowFreezeConfirmation(true)}>Freeze Marks</button>
//               <button className={styles.btn6} onClick={() => setShowStopConfirmation(true)}>Stop Peer Learning </button>
//               <button className={styles.btn7}>View detailed Analytics </button>
//             </div>
//           </div>
//           {/* <p className={styles.completeprogress}>Completion Progress</p> */}

//           {activities.length > 0 && assg.status !== "Added" && (
//             <>
//               <p className={styles.studentSubmissions}> Student Submissions </p>

//               <table className={styles.studentList}>

//                 <thead>
//                   <tr>
//                     <th>Student Name</th>

//                     {assg.isFreeze && (<th>Final Grades</th>)}

//                     {Array(reviewerCount)
//                       .fill(0)
//                       .map((_, i) => (
//                         <th key={`reviewer-${i}`}>{i === 0 ? "Self" : `Reviewer ${i }`}</th>
//                       ))}
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {sortedActivities.map((row, index) => {

//                     const flag = compareMarks1(row, bufferMark) || compareMarks2(row);

//                     //const flag = false;

//                     const studentName = flag ? styles.flagstudentFullName : styles.studentFullName;

//                     return (
//                       <tr key={row.name}>
//                         <td>
//                           <div className={studentName}>{row[0].profile.name.fullName}</div>
//                           {flag && <img src={redflag} alt="RedFlag" className={styles.redflagimg} />}
//                         </td>

//                         {assg.isFreeze && (
//                           <td>
//                             <div className={studentName}>{finalGrades[row[0].userId]}</div>
//                           </td>
//                         )}

//                         {row.slice(1).map((r) => {
//                           const isDataEmpty = r.review_score.length === 0;


//                           const tdClassName = isDataEmpty ? styles.emptyScore : styles.nonEmptyScore;

//                           return (
//                             <td key={r.name.fullName}>
//                               <ScoreCard
//                                 data={r}
//                                 questions={assg.total_questions}
//                                 activities={activities}
//                                 freezeAssignment={freezeAssignment}
//                               >
//                                 <div className={tdClassName}>
//                                   {r.name.fullName}
//                                 </div>
//                                 <div className={styles.Score}>
//                                   {" (" + r.review_score + ")"}
//                                 </div>
//                               </ScoreCard>
//                             </td>
//                           );
//                         })}

//                         {row.length === 1 && (
//                           <>
//                             {Array(reviewerCount).fill(0).map((_, i) => (
//                               <td key={`no-submission-${i}`} className={styles.noSubmission}>
//                                 No Submission
//                               </td>
//                             ))}
//                           </>
//                         )}
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </>
//           )}

//         </div>}
//       {<img src={bottom} alt="Image" className={styles.bottom} />}

//       <StopPeerLearningPopup
//         assg={assg}
//         stopPeerLearning={stopPeerLearning}
//         showStopConfirmation={showStopConfirmation}
//         setShowStopConfirmation={setShowStopConfirmation}
//         finalGrades={finalGrades}
//       />

//       <FreezeAssignmentPopup
//         assg={assg}
//         activities={activities}
//         freezeAssignment={freezeAssignment}
//         showFreezeConfirmation={showFreezeConfirmation}
//         setShowFreezeConfirmation={setShowFreezeConfirmation}
//         finalGrades={finalGrades}
//         setFinalGrades={setFinalGrades}
//       />

//     </>
//   );
// }


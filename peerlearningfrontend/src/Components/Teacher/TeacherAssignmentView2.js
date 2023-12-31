import React, { useContext, useEffect, useState } from "react";
import { G_API, API } from "../../config";
import AuthContext from "../../AuthContext";
import { ReactComponent as AssignmentIcon } from "./Assests/Assignment.svg";
import { ReactComponent as MoreIcon } from "./Assests/more.svg";
import { ReactComponent as Line } from "./Assests/Line.svg";
import thumbnail from "../Student/Assests/thumbnail.png";
import bottom from "../Images/Bottom.png";
import styles from "./TeacherAssignmentView2.module.css";
import Spinner from "../Spinner/Spinner";
import ReleaseScorePopup from "../Popups/ReleaseScorePopup";
import { ScoreCard } from "./ScoreCard";

// function conversion(hours, minutes) {
//     var t;
//     var h = hours + 5;
//     var m = minutes + 30;
//     if (m >= 60) {
//         h = h + 1;
//         m = 60 - m;
//     }
//     if (m < 10) {
//         m = "0" + m;
//     }
//     if (h >= 24)
//         h = h - 24;
//     if (h >= 12) {
//         t = 'PM';
//         if (h > 12)
//             h = h - 12;
//     }
//     else {
//         t = 'AM';
//         if (h < 10) {
//             h = "0" + h;
//         }
//     }
//     return h + ":" + m + " " + t;
// }
// function none(hours) {
//     var t;
//     var h = hours + 5;
//     var m = 30;
//     if (h >= 24)
//         h = h - 24;
//     if (h >= 12) {
//         t = 'PM';
//         if (h > 12)
//             h = h - 12;
//     }
//     else {
//         t = 'AM';
//         if (h < 10) {
//             h = "0" + h;
//         }
//     }
//     return h + ":" + m + " " + t;
// }

var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function TeacherAssignmentView2({ assg, activities, reviewerCount, freezeAssignment }) {

    const { userData } = useContext(AuthContext);
    const [TeacherName, setTeacherName] = useState([]);
    const [finalGrades, setFinalGrades] = useState([]);
    const [spin, setspin] = useState(true);
    const [showReleaseConfirmation, setShowReleaseConfirmation] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const allOptions = ['onlyFinalGrade', 'showTime', 'showIndivisualQuestions'];
    const [options, setOptions] = useState(allOptions);

    const course_id = assg.course_id;
    const myActivities = activities;

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

    useEffect(() => { loadData() }, [userData.token, assg]);


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

    const releaseScore = async () => {

        alert("releaseScore function called");

        //const updateMask = 'assignedGrade,  draftGrade'; 
        // try {
        //     if (userData.token) {

        //       await fetch(`${G_API}/courses/${course_id}/courseWork/${assg.assignment_id}/studentSubmissions`, {
        //         method: "GET",
        //         headers: {
        //             Authorization: `Bearer ${userData.token}`,
        //         },
        //         })
        //           .then((res) => res.json())
        //           .then((res) => {

        //             const studentSubmissionsArray = Object.values(res.studentSubmissions);

        //             studentSubmissionsArray.forEach(async ( sub ) => {

        //               await fetch(`${G_API}/courses/${course_id}/courseWork/${assg.assignment_id}/studentSubmissions/${sub.id}?updateMask=${updateMask}`, {
        //                 method: "PATCH",
        //                 headers: {
        //                     Authorization: `Bearer ${userData.token}`,
        //                     Accept: "application/json",
        //                     "Content-Type": "application/json",
        //                 },
        //                   body: JSON.stringify({

        //                     assignedGrade : 15,
        //                     draftGrade : 10,
        //                   }),
        //                 })
        //                   .then((res) => res.json())
        //                   .then((res) => {
        //                     console.log(res);
        //                   });
        //             });

        //           });
        //     }
        //   } catch (error) {
        //     console.error('Error:', error);
        //   }
    }

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
                                    <a href={assg.materials[0].driveFile.driveFile.alternateLink} target="_blank">
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

                            <button className={styles.btn4} onClick={() => setShowReleaseConfirmation(true)} >Release Scores </button>
                            <button className={styles.btn5}>View detailed Analytics </button>
                            <button className={styles.btn6}>Peer Learning activity completed </button>
                        </div>
                    </div>

                    {activities.length > 0 && assg.status !== "Added" && (
                        <>
                            <p className={styles.studentSubmissions}> Student Submissions </p>

                            <table className={styles.studentList}>

                                <thead>
                                    <tr>
                                        <th>Student Name</th>

                                        <th>Final Grades</th>

                                        {Array(reviewerCount)
                                            .fill(0)
                                            .map((_, i) => (
                                                <th key={`reviewer-${i}`}>{i === 0 ? "Self" : `Reviewer ${i }`}</th>
                                            ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {activities.map((row, index) => {

                                            console.log(row);

                                        return (
                                            <tr key={row.name}>
                                                <td>
                                                    <div className={styles.studentFullName}>{row[0].profile.name.fullName}</div>
                                                </td>

                                                <td>
                                                    <div className={styles.studentFullName}>{finalGrades[row[0].userId]}</div>
                                                </td>

                                                {row.slice(1).map((r) => {
                                                    const isDataEmpty = r.review_score.length === 0;


                                                    const tdClassName = isDataEmpty ? styles.emptyScore : styles.nonEmptyScore;

                                                    return (
                                                        <td key={r.name.fullName}>
                                                            <ScoreCard data={r} questions={assg.total_questions} activities={myActivities} freezeAssignment={freezeAssignment}>
                                                                <div className={tdClassName}>{r.name.fullName}</div>
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

            <ReleaseScorePopup releaseScore={releaseScore} showReleaseConfirmation={showReleaseConfirmation} setShowReleaseConfirmation={setShowReleaseConfirmation} />
        </>
    );
}
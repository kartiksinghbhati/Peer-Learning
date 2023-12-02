import React, { useContext, useEffect, useState } from "react";
import { G_API, API } from "../../config";
import AuthContext from "../../AuthContext";
import styles from './StudentAssignmentView2.module.css';
import { ReactComponent as AssignmentIcon } from "./Assests/Assignment.svg";
//import { ReactComponent as MoreIcon } from "./Assests/more.svg";
import { ReactComponent as Line } from "./Assests/Line.svg";
import Thumbnail from "./Assests/thumbnail.png";
import People from "./Assests/People.svg";
import bottom from "../Images/Bottom.png";
import Spinner from "../Spinner/Spinner";
import MarksPopup from "../Popups/MarksPopup";
import ViewReport2Popup from "../Popups/ViewReport2Popup";
import ViewReport1Popup from "../Popups/ViewReport1Popup";


var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function StudentAssignmentView2({ assg, activities, marks, youractivities }) {

    const { user, userData } = useContext(AuthContext);
    const [TeachersName, setTeachersName] = useState([]);
    const [marksvalue, SetmarksValue] = useState(false);
    const [viewReport1, setViewReport1] = useState(false);
    const [viewReport2, setViewReport2] = useState(false);
    const [index, setIndex] = useState(-1);
    const [spin, setspin] = useState(true);
    const [finalGrade, setFinalGrades] = useState(0);

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

    const truncate = (str) => {
        if (str) {
            return str.length > 60 ? str.substring(0, 59) + "..." : str;
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
                    setTeachersName(res.teachers[g].profile.name.fullName);
                });

                await fetch(`${API}/api/assignmentscore?User_id=${user.sub}&Assignment_id=${assg._id}`)
                    .then((res) => res.json())
                    .then((res) => {
                        console.log(res);
                        if (res.length > 0) {
    
                                setFinalGrades(res[0].final_grade);
                                setspin(false);
                        }
                        else{
                            setFinalGrades(0);
                            setspin(false);
                        }
                    });
        }
    }

    useEffect(() => { loadData() }, [userData.token]);

    var marksum = 0;
    for (var i = 0; i < marks.length; i++) {
        marksum = marksum + marks[i];
    }
    const openModelAnswerSheet = () => {
        if (assg.modelAnswerSheetUrl) {
            // Check if the modelAnswerSheetLink exists in your assignment data
            window.open(assg.modelAnswerSheetUrl, '_blank'); // Opens in a new tab
        } else {
            // Handle the case where the link is not available
            alert('Model Answer Sheet link is not available');
        }
    };
    var sum = 0;
    var x = [];
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
                                <p className={styles.teacher}>{TeachersName} <span className={styles.dot}>.</span> {month[(assg.creationTime.substring(5, 7)) - 1]} {assg.creationTime.substring(8, 10)}</p>
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
                                        <img id={styles.thumbnail2} src={Thumbnail} />
                                        <div id={styles.written}>
                                            <p id={styles.ques}>No Question Paper Uploaded</p>
                                        </div>
                                    </div>
                                }
                            </div>
                            {/* <div className={styles.moreIcon}>
                                <MoreIcon />
                            </div> */}
                        </div>
                        <div className={styles.pdfDiv}>
                            <div className={styles.upper}>
                                <p id={styles.work}>Your Work </p>
                                <img id={styles.people} src={People} />
                            </div>
                            <div id={styles.progress}>
                                <p id={styles.peer}>Peer review Progress </p>
                                <div id={styles.lines}>
                                    <Line id={styles.line1} />
                                    <p id={styles.reviewed}>6/6</p>
                                </div>
                            </div>
                            <a href={assg.alternateLink} target="_blank">
                                <button className={styles.btn1}>Open In Classroom </button>
                            </a>
                            <button className={styles.btn1} onClick={openModelAnswerSheet}>Open Model Answer Sheet </button>
                            <button className={styles.btn1} onClick={() => SetmarksValue(true)}>View Scoring Matrix </button>
                            <button className={styles.btn2}>View Detailed Analytics</button>
                            <button className={styles.btn3}>Reviews Completed</button>
                        </div>
                    </div>
                    <div className={styles.lower}>
                        <p id={styles.Reviews}>Final Grade = {finalGrade} </p>
                        <p id={styles.Reviews}>Peer Reviews performed </p>
                        <div className={styles.performed}>
                            <div>
                                <p id={styles.rev}>Reviews Performed </p>
                            </div>
                            <div id={styles.allreviews}>
                                {youractivities?.map((activity, j) => (

                                    

                                    <div id={styles.report} key={j}>
                                        <div id={styles.nameandmarks}>
                                            {j === 0 ? (
                                                <p id={styles.aa}>Yourself</p>
                                            ) : (
                                                <p id={styles.aa}>Peer {j}</p>
                                            )}
                                            {/* Display marks based on the activity and who gave the review */}
                                            {j === 0 ? (
                                                // Display marks given by the student (yourself)
                                                <p id={styles.marks}>{activity.review_score.reduce((sum, score) => sum + score, 0)}/{marksum}</p>
                                            ) : (
                                                // Display marks given by peers
                                                <p id={styles.marks}>{activity.review_score.reduce((sum, score) => sum + score, 0)}/{marksum}</p>
                                            )}
                                        </div>
                                        <button className={styles.btn4} onClick={() => {setViewReport1(true); setIndex(j)}}>View questionwise Report</button>
                                    </div>
                                ))}

                            </div>
                        </div>
                        <p id={styles.Reviews}>Peer Reviews recieved </p>
                        <div className={styles.performed}>
                            <div>
                                <p id={styles.rev}>Reviews Received </p>
                            </div>
                            <div id={styles.allreviews}>
                                {activities.map((activity, j) => (
                                    <>
                                        {(j == 0) ?
                                            <div id={styles.report}>
                                                <div id={styles.nameandmarks}>
                                                    <p id={styles.aa}>Yourself</p>
                                                    <p id={styles.marks}>{activity.review_score.reduce((sum, score) => sum + score, 0)}/{marksum}</p>
                                                </div>
                                                <button className={styles.btn4} onClick={() => {setViewReport2(true); setIndex(j)}}>View questionwise Report</button>
                                            </div>
                                            :
                                            <div id={styles.report}>
                                                <div id={styles.nameandmarks}>
                                                    <p id={styles.aa}>Peer {j}</p>
                                                    <p id={styles.marks}>{activity.review_score.reduce((sum, score) => sum + score, 0)}/{marksum}</p>
                                                </div>
                                                <button className={styles.btn4} onClick={() => {setViewReport2(true); setIndex(j)}}>View questionwise Report</button>
                                            </div>
                                        }
                                    </>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>}
            {<img src={bottom} alt="Image" className={styles.bottom} />}
            <MarksPopup marksvalue={marksvalue} SetmarksValue={SetmarksValue} marks={marks} activities={activities} />
            <ViewReport1Popup viewReport1={viewReport1} setViewReport1={setViewReport1} index={index} marks={marks} youractivities={youractivities}/>
            <ViewReport2Popup viewReport2={viewReport2} setViewReport2={setViewReport2} index={index} marks={marks} activities={activities}/>
        </>
    )
}

export default StudentAssignmentView2

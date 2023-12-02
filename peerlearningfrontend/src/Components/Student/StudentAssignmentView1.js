import React, { useContext, useEffect, useState } from "react";
import { G_API, API } from "../../config";
import AuthContext from "../../AuthContext";
import styles from './StudentAssignmentView1.module.css';
import { ReactComponent as AssignmentIcon } from "./Assests/Assignment.svg";
//import { ReactComponent as MoreIcon } from "./Assests/more.svg";
import { ReactComponent as Line } from "./Assests/Line.svg";
import Thumbnail from "./Assests/thumbnail.png";
import People from "./Assests/People.svg";
import bottom from "../Images/Bottom.png";
import Spinner from "../Spinner/Spinner";

import PopUp from "../Popups/PopUp";
import Self from "../Popups/SelfPopup";
import Submitpop from "../Popups/Submitpop";
import FinalisePopup from "../Popups/FinalisePop";
import SelfFinalisePopup from "../Popups/selfFinalisePopup";
import MarksPopup from "../Popups/MarksPopup";


var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function StudentAssignmentView1({ assg, self, activities, marks, setSelf, setActivities }) {

    const { userData } = useContext(AuthContext);
    const [spin, setSpin] = useState(true);
    const [TeachersName, setTeachersName] = useState([]);
    const [val, setval] = useState(-1);
    const [wrapper, setwrapper] = useState(false);
    const [wrap, setwrap] = useState(false);
    const [Finalise, SetFinalise] = useState(false);
    const [selfFinalise, SetselfFinalise] = useState(false);
    const [sub, setsub] = useState(false);
    const [marksvalue, SetmarksValue] = useState(false);
    const [count, setCount] = useState(0);
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

                await fetch(`${API}/api/assignmentscore?User_id=${self.author_id}&Assignment_id=${assg._id}`)
                    .then((res) => res.json())
                    .then((res) => {
                        console.log(res);
                        if (res.length > 0) {
    
                                setFinalGrades(res[0].final_grade);
                                setSpin(false);
                        }
                        else{
                            setFinalGrades(0);
                            setSpin(false);
                        }
                    });

                    //setSpin(false);
        }
    }

    useEffect(() => { loadData() }, [userData.token, assg, self]);

    const openModelAnswerSheet = () => {
        if (assg.modelAnswerSheetUrl) {
            // Check if the modelAnswerSheetLink exists in your assignment data
            window.open(assg.modelAnswerSheetUrl, '_blank'); // Opens in a new tab
        } else {
            // Handle the case where the link is not available
            alert('Model Answer Sheet link is not available');
        }
    };


    return (
        <> {spin ? <Spinner/> :<div>
                <div className={styles.mainDiv}>
                    <div className={styles.contentDiv}>
                        <div>
                            <AssignmentIcon className={styles.AssgIcon} />
                        </div>
                        <div className={styles.midDiv}>
                            <h4 className={styles.AssgnName}>{truncate(assg.assignment_title)}</h4>
                            <p className={styles.teacher}>{TeachersName} <span className={styles.dot}>.</span> {month[(assg.creationTime.substring(5, 7)) - 1]} {assg.creationTime.substring(8, 10)}</p>
                            <div className={styles.pointsanddue}>
                                {assg.maxPoints ? <p className={styles.points}>{assg.maxPoints} Points</p> : <p className={styles.points}>Points not Assigned</p>}
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
                                    <img id={styles.thumbnail1} src={Thumbnail} />
                                    <div id={styles.written}>
                                        <p id={styles.ques}>No Question Paper Uploaded</p>
                                        {/* <p id={styles.type}>PDF</p> */}
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
                                {/* <p id={styles.reviewed}>{count()}/{activities.length+1}</p> */}
                                <p id={styles.reviewed}>{count}/{activities.length + 1}</p>
                            </div>
                        </div>
                        <a href={assg.alternateLink} target="_blank">
                            <button className={styles.btn1}>Open In Classroom </button>
                        </a>
                        <button className={styles.btn1} onClick={openModelAnswerSheet}>Open Model Answer Sheet </button>
                        <button className={styles.btn1} onClick={() => SetmarksValue(true)}>View Scoring Matrix </button>
                        <button className={styles.btn2} onClick={() => setsub(true)}>Submit Reviews </button>
                    </div>
                </div>
                <div className={styles.Evaluation}>
                    {assg.isFreeze && !spin ? <p id={styles.reviews}>Final Grade = {finalGrade} </p> : null}
                    <p id={styles.reviews}>Peer Reviews to be performed </p>
                    <div className={styles.Main}>

                        {self._id ?
                            <div id={styles.yourself}>
                                <p id={styles.content}>Yourself </p>
                                <a href={self.material_drive_link} target="_blank">
                                    <div id={styles.Box}>
                                        <img id={styles.thumbnail1} src={Thumbnail} />
                                        <div id={styles.written}>
                                            <p id={styles.ques}>Their Submission</p>
                                            <p id={styles.type}>PDF</p>
                                        </div>
                                    </div>
                                </a>
                                {
                                    self.reviewer_comment[0] === 'yes' ?
                                        <>
                                            <button id={styles.btn} disabled><p id={styles.classroom} >Score Matrix Updated</p></button>
                                            <button id={styles.btn3} disabled><p id={styles.classroom1}>Score Finalised</p></button>
                                        </> :
                                        <>
                                            <button id={styles.btn} onClick={() => setwrap(true)}><p id={styles.classroom} >Fill / Update Score Matrix</p></button>
                                            <button id={styles.btn3} onClick={() => SetselfFinalise(true)}><p id={styles.classroom1}>Finalize Score</p></button>
                                        </>
                                }
                            </div>
                            : <div><h1>Not Assigned</h1></div>
                        }
                        {activities.map((activity, u) => (
                            <div id={styles.yourself}>
                                <p id={styles.content}>Peer - {u + 1}</p>
                                <a href={activities[u].material_drive_link} target="_blank">
                                    <div id={styles.Box}>
                                        <img id={styles.thumbnail1} src={Thumbnail} />
                                        <div id={styles.written}>
                                            <p id={styles.ques}>Their Submission</p>
                                            <p id={styles.type}>PDF</p>
                                        </div>
                                    </div>
                                </a>
                                {
                                    activity.reviewer_comment[0] === 'yes' ?
                                        <>
                                            <button id={styles.btn} disabled><p id={styles.classroom} >Score Matrix Updated</p></button>
                                            <button id={styles.btn3} disabled><p id={styles.classroom1}>Score Finalised</p></button>
                                        </> :
                                        <>
                                            <button id={styles.btn} onClick={() => { setwrapper(true); setval(u) }}><p id={styles.classroom}>Fill / Update Score Matrix</p></button>
                                            <button id={styles.btn3} onClick={() => { SetFinalise(true); setval(u) }}><p id={styles.classroom1}>Finalize Score</p></button>
                                        </>
                                }
                            </div>
                        ))
                        }
                    </div>
                </div>
            </div>
                }
            {<img src={bottom} alt="Image" className={styles.bottom} />}

            <PopUp wrapperValue={wrapper} SetWrapperValue={setwrapper} marks={marks} activities={activities} setActivities={setActivities} i={val} />

            <Self wrapperValue={wrap} SetWrapperValue={setwrap} self={self} marks={marks} setSelf={setSelf} />

            <FinalisePopup Finalise={Finalise} SetFinalise={SetFinalise} activities={activities} setActivities={setActivities} i={val} count={count} setCount={setCount} />
            <SelfFinalisePopup selfFinalise={selfFinalise} SetselfFinalise={SetselfFinalise} self={self} setSelf={setSelf} count={count} setCount={setCount} />
            <Submitpop Sub={sub} SetSub={setsub} self={self} setSelf={setSelf} activities={activities} setActivities={setActivities} />

            {/* Scoring Matrix */}
            <MarksPopup marksvalue={marksvalue} SetmarksValue={SetmarksValue} marks={marks} activities={activities} />
            
        </>
    )
}

export default StudentAssignmentView1
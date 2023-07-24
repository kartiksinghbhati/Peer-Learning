import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../AuthContext";
import { G_API, API } from "../../config";
import styles from './TeacherCoursePage.module.css';
import PeerAssignmentCard from "../AssignmentCard/PeerAssignmentCard";
import AllAssignmentCard from '../AssignmentCard/AssignmentCard';
import AddPeerAssignment from "./AddPeerAssignment";
import Spinner from "../Spinner/Spinner";
import bannerimg from '../Images/Banner1.png';
import bottomimg from '../Images/Bottom.png';
import peopleimg from '../Images/People.png';
import noassignimg from '../Images/noassign.jpg';


const TeacherCoursePage = () => {

    const navigate = useNavigate();
    const [TeacherName, setTeacherName] = useState([]);
    const [allAssignments, setAllAssignments] = useState([]);
    const [peerAssignments, setPeerAssignments] = useState([]);
    const [css, setcss] = useState(false);
    const [spin, setSpin] = useState(true);

    const { userData, course } = useContext(AuthContext);

    const loadData = async () =>{
        if (userData.token && course.id) {
          await fetch(`${G_API}/courses/${course.id}/teachers`, { // fetch the teacher name of the course
            method: "GET",
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          })
            .then((res) => res.json())
            .then((res) => {
              var len = res.teachers.length;
              setTeacherName(res.teachers[len - 1].profile.name.fullName);
            });
    
          await fetch(`${G_API}/courses/${course.id}/courseWork`, { //fetch all the assignments from classrooom and store it in assignments using setAllAssignments
            method: "GET",
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          })
            .then((res) => res.json())
            .then((res) => {
              setAllAssignments(res.courseWork);
    
              let assignmentMap = {};
              if (res.courseWork !== undefined) {
                res.courseWork.forEach((c) => {
                  assignmentMap[c.id] = c;
                });
              }
    
              fetch(`${API}/api/assignment?course_id=${course.id}`, { 
                method: "GET",
              })
                .then((res) => res.json())
                .then((res) => {
                  let tt = [];
                  res.forEach((t) => {
                    tt.push({ ...t, ...assignmentMap[t.assignment_id] });
                  });
                  setPeerAssignments(tt);
                });
    
            });

            setSpin(false);
        }
      }
    
    useEffect(() => { loadData() }, [userData.token]);
    

    let name = "";
    if (peerAssignments.length != 0) {
        name = peerAssignments[0].course_name;
    }

    var idArr = [];
    if (allAssignments) {
        for (var i = 0; i < allAssignments.length; i++) {
            idArr.push(allAssignments[i].id);
        }
    }


    const f1 = () => {
        setcss(true)
    }
    const f2 = () => {
        setcss(false)
    }
    const OnPeople = () => {
        console.log("Teacher OnPeople Clicked");
        navigate(`/people/${course.id}`);
    }

    // console.log("All Assignments");
    //           console.log(allAssignments);

    // console.log("Peer Assignments");
    //               console.log(peerAssignments);

    console.log("spin");
    console.log(spin);
    

    return (
      <>
        {
          spin ? <Spinner/> :
          <div className="TeacherCoursePage">
            <div className={styles.topBtn}>
              <span className={styles.u} >Stream</span>
              <span onClick={OnPeople} className={styles.notu}>People</span>
            </div>
            <div>
                <div className={styles.banner}>
                  <img src={bannerimg} alt="Image" className={styles.img}></img>
                  <p style={{ marginTop: "-104.88px", paddingLeft: "32px", fontWeight: "600", paddingBottom: "15px", color: "white", fontSize: "36px", lineHeight: "43.88px" }}>{course.name}</p>
                  <div style={{ marginTop: "-24px", paddingLeft: "32px", display: "flex" }}>
                    <p style={{ fontWeight: "500", color: "white", fontSize: "22px", lineHeight: "26.82px", paddingRight: "24px" }}>{TeacherName} </p>
                    <img onClick={() => OnPeople()} src={peopleimg} alt="Image" style={{ width: "25px", height: "24px", cursor: "pointer" }} />
                  </div>
                </div>

                <div className={styles.container}>
                    <div className={styles.form}>
                        <div className={styles.formBtn}>
                            <span onClick={f2} className={css ? styles.not : styles.underline}>Peer Learning Assignments</span>
                            <span onClick={f1} className={css ? styles.underline : styles.not}>All Assignments</span>
                        </div>
                        {css ?
                            <div className="assignment_list" style={{ marginTop: "20px" }} >
                                {/* if not display the msg no assignments */}
                                {allAssignments.length === 0 ? (
                                    <div className="null_assignment" style={{ marginLeft: "50%", marginTop: "50px" }}>
                                        <img src={noassignimg} alt="logo" width="400" height="250" />
                                        <h3 className={styles.heading}>No assignment on selected course</h3>
                                    </div>
                                ) : (<>
                                    <AddPeerAssignment allAssignments={allAssignments} setPeerAssignments={setPeerAssignments}/>
                                    
                                    {allAssignments.map((p) => (
                                        <AllAssignmentCard assignment={p} peerAssignments={peerAssignments}/>
                                    ))
                                    }
                                </>)}
                            </div>
                            :
                            <div className="assignment_list" style={{ marginTop: "20px" }} >
                                {/* if not display the msg no assignments */}
                                {peerAssignments.length === 0 ? (
                                    <div className="null_assignment" style={{ marginLeft: "50%", marginTop: "50px" }}>
                                        <img src={noassignimg} alt="logo" width="400" height="250" />
                                        <h3 className={styles.heading}>No assignment with peer review on selected course</h3>
                                    </div>
                                ) : (<>
                                    {peerAssignments.map((p) => (
                                        <PeerAssignmentCard peerAssignments={p} ids={idArr} />
                                    ))
                                    }
                                </>)}

                                
                            </div>}
                    </div>
                </div>
            </div>
            {<img src={bottomimg} alt="Image" className={styles.bottom} />}
          </div>
        }
      </>
    )
}

export default TeacherCoursePage
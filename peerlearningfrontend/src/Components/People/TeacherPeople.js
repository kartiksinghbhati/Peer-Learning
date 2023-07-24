import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './TeacherPeople.module.css';
import mail from './mail.svg';
import Line from './Line.svg';
import AuthContext from "../../AuthContext";




function TeacherPeople() {

    const navigate = useNavigate();
  const [TeachersName, setTeachersName] = useState([]);
  const { userData, course } = useContext(AuthContext);

  useEffect(() => { loadData() }, [userData.token]);

  const loadData = async () =>{
    if (userData.token) {
      await fetch(`https://classroom.googleapis.com/v1/courses/${course.id}/teachers`, //gets the list of all teachers enrolled in the course
            {
                method: "GET",
                headers: {
                Authorization: `Bearer ${userData.token}`,
                },
            }
        )
        .then((res) => res.json())
        .then((res) => {
        setTeachersName(res.teachers);
        });
    }
  }

  const OnAssign = () => {
    navigate(`/scourse/${course.id}`);
  }

    return (
        <>
            <div className={styles.topBtn}>
                <span onClick={OnAssign} className={styles.notu}>Stream</span>
                <span className={styles.u}>People</span>
            </div>
            <div className={styles.Teachers}> Teachers
            <img src={Line} id={styles.line} />
            {TeachersName.map((i,p) => {
                var email = TeachersName[p].profile.emailAddress;
                var mails = `mailto:${email}`;
                return(
                <>
                <div id={styles.profile} key={i}>
                <div id={styles.leftpart}>
                    <img src={"https:"+TeachersName[p].profile.photoUrl} id={styles.pic} />
                    <p id={styles.name}>{TeachersName[p].profile.name.fullName}</p>
                </div>
                <a href={mails} target="_blank"><img src={mail} id={styles.mail}/></a>
                </div>
                </>
                )
                })}
            </div>
        </>
    )
}

export default TeacherPeople

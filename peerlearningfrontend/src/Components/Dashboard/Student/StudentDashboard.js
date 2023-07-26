import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../../../AuthContext';
import Profile_tab from "./comp/profile_tab/profile_tab";
import Student_progress from "./comp/student_progress/student_progress";
import "./StudentDashboard.css";
import Dropdown from "./comp/dropdown/dropdown";
import Course from "./comp/course/course";

export default function StudentDashboard() {

  const { userData, setUserData } = useContext(AuthContext);

  const [courses, setCourses] = useState([]);
  const [spin, setSpin] = useState(true);

  const loadData = async () =>{
    if (userData.token) {
      setUserData((u) => ({ ...u, loader: u.loader + 1 }));
      await fetch("https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE", {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${userData.token}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setUserData((u) => ({ ...u, loader: u.loader - 1 }));
          setCourses(res.courses);
          setSpin(false);
        });
  
    }
  }

  useEffect(() => { loadData() }, [userData.token]);


  return (
    <div className="studentdashboard">
      <div className="container_student_page1">
        <div className="profile_tab_student_progress">
          <Profile_tab len={courses.length}/>
          <Student_progress />
        </div>

        <div className="score">
          <div className="score_1">
            <h3>Commulative Consistency score</h3>
            <Dropdown />
          </div>
          <div className="score_1">
            <h3>Commulative Consistency score</h3>
            <Dropdown />
          </div>
        </div>
        <div className="course_page1_container">
          <h4 className="course_page_heading">Courses</h4>
          {courses ? courses.map((data,index) => (
             <Course key={data.id} data={data} index={index}/>
          )) : null}
        </div>
      </div>
    </div>
  )
}

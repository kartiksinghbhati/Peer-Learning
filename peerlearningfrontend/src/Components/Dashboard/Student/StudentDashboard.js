import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../../../AuthContext';
import Spinner from "../../Spinner/Spinner";
import Profile_tab from "./comp/profile_tab/profile_tab";
import Student_progress from "./comp/student_progress/student_progress";
import "./StudentDashboard.css";
import Dropdown from "./comp/dropdown/dropdown";
import Course from "./comp/course/course";


export default function StudentDashboard() {

  const { user, userData, setUserData } = useContext(AuthContext);

  const [courses, setCourses] = useState([]);
  const [spin, setSpin] = useState(true);
  const [dataFromChild, setDataFromChild] = useState(0);
  const [xyz, setXyz] = useState([]);  //for storing courses where student is teacter

  const updateDataFromChild = (data) => {
    setDataFromChild((prevDataFromChild) => prevDataFromChild + data);
  };


    const loadData = async () =>{
    if (userData.token) {
      setUserData((u) => ({ ...u, loader: u.loader + 1 }));
      let COURSES = []; 
      await fetch("https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE", {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${userData.token}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setUserData((u) => ({ ...u, loader: u.loader - 1 }));
          COURSES = res.courses;
          setCourses(res.courses);
        });        

        let len = COURSES.length;
        let arr = [];
          for (let i = 0; i< len; i++) {
            await fetch(`https://classroom.googleapis.com/v1/courses/${COURSES[i].id}/teachers`, {
              method: "GET",
              headers: {
                'Authorization': `Bearer ${userData.token}`,
              },
            })
              .then((r) => r.json())
              .then((r) => {
                  r.teachers.forEach((teacher) => {
                    if (teacher.profile.emailAddress === user.email) {
                      arr.push( COURSES[i]);
                    }
                  });
                  
              });
          }
          setXyz(arr);
          setSpin(false);
  
    }
  }

  useEffect(() => { loadData() }, [userData.token]);


  return (
    spin ? <Spinner/> :
    <div className="studentdashboard">
      <div className="container_student_page1">
        <div className="profile_tab_student_progress">
          <Profile_tab len={courses.length} dataFromChild={dataFromChild}/>
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
          {courses
            ? courses.map((data, index) => {
                // Check if the course exists in the `xyz` array
                const courseExistsInXyz = xyz.some((course) => course.id === data.id);
                
                // If the course exists in `xyz`, skip rendering it
                if (courseExistsInXyz) {
                  return null;
                }

                // If the course is not present in `xyz`, render the Course component
                return (
                  <Course
                    key={data.id}
                    data={data}
                    index={index}
                    sendDataToParent={updateDataFromChild}
                  />
                );
              })
            : null}
          {/* {courses ? courses.map((data,index) => (
             <Course key={data.id} data={data} index={index} sendDataToParent={updateDataFromChild}/>
          )) : null} */}
        </div>
      </div>
    </div>
  )
}
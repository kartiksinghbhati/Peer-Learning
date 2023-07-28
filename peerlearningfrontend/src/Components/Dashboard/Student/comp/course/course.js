import React, { useContext, useEffect, useState } from "react";
import "./course.css";
import { API } from "../../../../../config";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../../../AuthContext";
function Course(props) {

  const navigate = useNavigate();
  const { user, userData, setCourse, role, setRole} = useContext(AuthContext);
  const [peerAssignments, setPeerAssignments] = useState([]);

  const loadData = async () =>{
    if (userData.token) {
      await fetch(`https://classroom.googleapis.com/v1/courses/${props.data.id}/teachers`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${userData.token}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
            var len = res.teachers.length;
            //setPhoto("https:"+res.teachers[len-1].profile.photoUrl);
            //setTeacherName(res.teachers[len-1].profile.name.fullName);
            res.teachers.forEach((teacher) => {
              if (teacher.profile.emailAddress === user.email) {
                setRole("teacher");
              }
            });
        });
    }

    if (userData.token && props.data.id) {

      await fetch(`${API}/api/assignment?course_id=${props.data.id}`, { 
        method: "GET",
      })
        .then((res) => res.json())
        .then((res) => {
          let tt = [];
          res.forEach((t) => {
            tt.push(t);
          });
          setPeerAssignments(tt);
          props.sendDataToParent(tt.length); 
        });

    }
  }

  useEffect(() => {
    
    loadData()
  }, [userData.token, user.email]);

  
  let peerAssigned = 0;
  if (peerAssignments) {
    for (var i = 0; i <peerAssignments.length; i++) {
      if(peerAssignments[i].status==="Assigned"){
        peerAssigned++;
      }
    }
  }
  var result = (peerAssignments.length - peerAssigned) / peerAssigned;
  var roundedResult = result.toFixed(2);
  var roundedNumber = parseFloat(roundedResult);




  const OnCourseClick = () => {
    setCourse(props.data);
    navigate(`/Dashboard/student/${props.data.id}`);
  }

  return (
    <div className="course_container" onClick={OnCourseClick}>
      <div className="course_heading_banner">
        <h4 className="course_heading_topic">{props.data.name}</h4>
      </div>

      <div className="student_course_container">
        <div className="students_course_details">
          <div className="progress_course_data">
            <h5>Total Peer Assignments: </h5>
            <h5>Peer Review Performed: </h5>
            <h5>Peer Review Recived: </h5>
            <h5>Completion Rate: </h5>
          </div>
          <div className="student_course_no">
            <h5>{peerAssignments.length}</h5>
            <h5>{peerAssignments.length - peerAssigned}</h5>
            <h5>{peerAssigned}</h5>
            {
              peerAssignments.length===0 ? <h5>0</h5> : <h5>{roundedNumber}</h5>
            } 
          </div>
        </div>
        <div className="student_cummulative_assignment_grade">
          <h3>A+</h3>
        </div>
        <div className="student_cummulative_consistency_grade">
          <h3>B</h3>
        </div>
      </div>
    </div>
  );
}

export default Course;

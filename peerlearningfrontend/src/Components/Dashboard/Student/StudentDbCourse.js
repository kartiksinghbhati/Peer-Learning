import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../../../AuthContext';
import { G_API, API } from "../../../config";
import "./StudentDbCourse.css";
import Spinner from "../../Spinner/Spinner";
import StudentDropdown_with_content from './comp/student_dropdown_with_content/student_dropdown_with_content';
import Student_assignments from './comp/student_assignemnts/student_assignments';

export default function StudentDbCourse() {

  const { userData, course } = useContext(AuthContext);
  const [TeachersName, setTeachersName] = useState([]);
  const [peerAssignments, setPeerAssignments] = useState([]);
  const [spin, setSpin] = useState(true);

  const loadData = async () => {
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
          setTeachersName(res.teachers[len - 1].profile.name.fullName);
          //setSpin1(false);
        });

        await fetch(`${API}/api/assignment?course_id=${course.id}`, {
          method: "GET",
        })
          .then((res) => res.json())
          .then((res) => {
            let tt = [];
            res.forEach((t) => {
              tt.push(t);
            });
            setPeerAssignments(tt);
            
          });

          setSpin(false);
  
    }
  }

  useEffect(() => { loadData() }, [userData.token]);

  let peerAssigned = 0;
  if (peerAssignments) {
    for (var i = 0; i < peerAssignments.length; i++) {
      if (peerAssignments[i].status === "Assigned") {
        peerAssigned++;
      }
    }
  }
  var result = (peerAssignments.length - peerAssigned) / peerAssigned;
  var roundedResult = result.toFixed(2);
  var roundedNumber = parseFloat(roundedResult);


  return (
    spin ? <Spinner /> :
      <div className="studentdashboard">
        <div className='student_page2_container'>
          <div className="course_container">
            <div className="course_heading_banner">
              <h4 className="course_heading_topic">{course.name}</h4>
              <h6 className='course_teacher_name'>{TeachersName}</h6>
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
                    peerAssignments.length === 0 ? <h5>0</h5> : <h5>{roundedNumber}</h5>
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
          <StudentDropdown_with_content />
          <StudentDropdown_with_content />
          <div className='student_assignments'>
            <h3>Peer Assignments</h3>

            <div className="assignment_list" style={{ marginTop: "20px" }} >
              {/* if not display the msg no assignments */}
              {peerAssignments.length === 0 ? (
                <div className="null_assignment" style={{ marginLeft: "25%", marginTop: "50px" }}>
                  {/* <img src={noassignimg} alt="logo" width="400" height="250" /> */}
                  <h4 className="heading">No assignment on selected course</h4>
                </div>
              ) : (<>
                {peerAssignments.slice().reverse().map((p) => (
                  <Student_assignments peerAssignment={p} TeachersName={TeachersName} />
                ))
                }
              </>)}
            </div>
          </div>
        </div>
      </div>
  )
}

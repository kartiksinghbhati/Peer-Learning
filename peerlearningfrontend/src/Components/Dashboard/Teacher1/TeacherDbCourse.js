import React, { useContext, useEffect, useState } from "react";
import "./teacherDbCourse.css";
import { G_API, API } from "../../../config";
import SearchBar from "./comp/searchBar/searchBar";
import TeacherDropdown_with_content from "./comp/teacher_dropdown_with_content/teacher_dropdown_with_content";
import Course_without_banner from "./comp/Course_without_Banner/Course_without_Banner";
import Spinner from "../../Spinner/Spinner";
import AuthContext from "../../../AuthContext";

function TeacherDbCourse() {
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

  return (
    spin ? <Spinner /> :
      <div className="teacherDashboardCourseContainer">
        <div className="assignment">
          <div className="assignment_heading_banner">
            <h4 className="assignment_heading_topic_banner">
              {course.name}
            </h4>
          </div>
          <div className="assignment_content">
            <div >
              <h1 className="heading">26</h1>
              <h6 className="description">Average score by students</h6>
            </div>
            <div className='assignment_content_leftBorder'>
              <h1 className="heading">4</h1>
              <h6 className="description">Total Questions</h6>
            </div>
            <div className='assignment_content_leftBorder'>
              <h1 className="heading">74%</h1>
              <h6 className="description">Average student participation rate</h6>
            </div>
            <div className='assignment_content_leftBorder'>
              <h1 className="heading">26</h1>
              <h6 className="description">Queries Recieved</h6>
            </div>
            <div className="last assignment_content_leftBorder">
              <h1 className="heading">4</h1>
              <h6 className="description">Queries Reviewed</h6>
            </div>

          </div>
        </div>

        <SearchBar />
        <TeacherDropdown_with_content />
        <TeacherDropdown_with_content />
        <div className="teacherCourse">
          <h3>Peer Assignment</h3>
          <div className="assignment_list" style={{ marginTop: "20px" }} >
            {/* if not display the msg no assignments */}
            {peerAssignments.length === 0 ? (
              <div className="null_assignment" style={{ marginLeft: "25%", marginTop: "50px" }}>
                {/* <img src={noassignimg} alt="logo" width="400" height="250" /> */}
                <h4 className="heading">No assignment on selected course</h4>
              </div>
            ) : (<>
              {peerAssignments.slice().reverse().map((p) => (
                <Course_without_banner peerAssignment={p} TeachersName={TeachersName} />
              ))
              }
            </>)}
          </div>
        </div>
      </div>
  );
}

export default TeacherDbCourse;

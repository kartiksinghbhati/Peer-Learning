import React from "react";
import "./course.css";
import { useNavigate } from "react-router-dom";
function Course(props) {

  const navigate = useNavigate();

  const OnCourseClick = () => {
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
            <h5>6</h5>
            <h5>24</h5>
            <h5>24</h5>
            <h5>100%</h5>
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

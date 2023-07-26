import React from "react";
import "./course.css";
function Course() {
  return (
    <div className="course_container">
      <div className="course_heading_banner">
        <h4 className="course_heading_topic">Peer Learning</h4>
      </div>

      <div className="student_course_container">
        <div className="students_course_details">
          <div className="progress_course_data">
            <h5>Total courses enrolled: </h5>
            <h5>Total courses enrolled: </h5>
            <h5>Total courses enrolled: </h5>
          </div>
          <div className="student_course_no">
            <h5>24</h5>
            <h5>24</h5>
            <h5>24</h5>
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

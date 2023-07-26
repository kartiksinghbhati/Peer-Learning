import React from "react";
import "./student_progress.css";
function Student_progress() {
  return (
    <div className="student_progress_container">
      <div className="peer_activity">
        <h3 className="peer_activity_heading">Peer Activity</h3>
        <div className="student_progress_course_details">
          <div className="progress_course_data">
            <h5>Total courses enrolled : </h5>
            <h5>Total courses enrolled : </h5>
            <h5>Total courses enrolled : </h5>
          </div>
          <div className="progress_course_no">
            <h5>24</h5>
            <h5>24</h5>
            <h5>24</h5>
          </div>
        </div>
      </div>
      <div className="cummulative_assignment_grade">
        <div className="grade_img"></div>
        <h3>Cummulative Assignment Grade</h3>
      </div>
      <div className="cummulative_consistency_grade">
        <h3>B</h3>
      </div>
    </div>
  );
}

export default Student_progress;

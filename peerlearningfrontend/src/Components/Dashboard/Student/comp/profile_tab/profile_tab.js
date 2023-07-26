import React from "react";
import './profile_tab.css'
function Profile_tab() {
  return (
    <div className="profile_tab_container">
      <div className="student_profile_details">
        <div className="student_profile_image"></div>
        <div className="student_proflie_data">
          <h5 className="student_name">Avnit Kumar Anand</h5>
          <h6 className="student_email">202051040@iiitvadodara.ac.in</h6>
        </div>
      </div>

      <div className="student_course_details">
        <div className="course_data">
          <h5>Total courses enrolled : </h5>
          <h5>Total courses enrolled : </h5>
          <h5>Total courses enrolled : </h5>
        </div>
        <div className="course_no">
          <h5>24</h5>
          <h5>24</h5>
          <h5>24</h5>
        </div>
      </div>
    </div>
  );
}

export default Profile_tab;

import React, { useContext } from "react";
import './profile_tab.css'
import AuthContext from "../../../../../AuthContext";

function Profile_tab(props) {

  const { user } = useContext(AuthContext);

  return (
    <div className="profile_tab_container">
      <div className="student_profile_details">
        <div className="student_profile_image"></div>
        <div className="student_proflie_data">
          <h5 className="student_name">{user.given_name + " "+user.family_name}</h5>
          <h6 className="student_email">{user.email}</h6>
        </div>
      </div>

      <div className="student_course_details">
        <div className="course_data">
          <h5>Total courses enrolled : </h5>
          <h5>Peer Assignments Recived : </h5>
          <h5>Peer Assignments Completed: </h5>
        </div>
        <div className="course_no">
          <h5>{props.len}</h5>
          <h5>{props.dataFromChild/2}</h5>
          <h5>0</h5>
        </div>
      </div>
    </div>
  );
}

export default Profile_tab;

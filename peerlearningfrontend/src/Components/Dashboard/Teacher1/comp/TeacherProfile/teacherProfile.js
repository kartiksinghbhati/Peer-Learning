import React, { useContext } from "react";
import "./teacherProfile.css";
import AuthContext from "../../../../../AuthContext";

function TeacherProfile() {

  const { user } = useContext(AuthContext);

  return (
      <div className="profile">
        <div className="profile_details">
          <div className="profile_image"></div>
          <div className="proflie_data">
            <h5 className="teacher_name">{user.given_name + " "+user.family_name}</h5>
            <h6 className="teacher_email">{user.email}</h6>
          </div>
        </div>
        <div className="profile_content">
          <div >
            <h1 className="heading">26</h1>
            <h6 className="description">Average score by students</h6>
          </div>
          <div className="profile_content_left_border">
            <h1 className="heading">4</h1>
            <h6 className="description">Total Questions</h6>
          </div>
          <div className="profile_content_left_border">
            <h1 className="heading">74%</h1>
            <h6 className="description">Average student participation rate</h6>
          </div>
          <div className="profile_content_left_border">
            <h1 className="heading">26</h1>
            <h6 className="description">Queries Recieved</h6>
          </div>
          <div className="last profile_content_left_border">
            <h1 className="heading">4</h1>
            <h6 className="description">Queries Reviewed</h6>
          </div>
        </div>
      </div>
  );
}

export default TeacherProfile;

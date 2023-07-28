import React, { useContext } from "react";
import "./Course_without_Banner.css";
import AuthContext from "../../../../../AuthContext";
import { useNavigate } from "react-router-dom";

function Course_without_banner(props) {

  const navigate = useNavigate();
  const { setAssignment } = useContext(AuthContext);

  const OnAssignmentClick = () => {
    setAssignment(props.peerAssignment);
    navigate(`/Dashboard/teacher/${props.peerAssignment.course_id}/${props.peerAssignment._id}`);
  }
  
  return (
    <div className="assignment">
      <div className="assignment_heading" onClick={OnAssignmentClick}>
        <h4 className="assignment_heading_topic_with_banner">
          {props.peerAssignment.assignment_title}
        </h4>
        <h6 className="assignment_heading_teacher">{props.TeachersName}</h6>
      </div>
      <div className="assignment_content">
        <div>
          <h1 className="heading">26</h1>
          <h6 className="description">Average score by students</h6>
        </div>
        <div className="assignment_content_leftBorder">
          <h1 className="heading">4</h1>
          <h6 className="description">Total Questions</h6>
        </div>
        <div className="assignment_content_leftBorder">
          <h1 className="heading">74%</h1>
          <h6 className="description">Average student participation rate</h6>
        </div>
        <div className="assignment_content_leftBorder">
          <h1 className="heading">26</h1>
          <h6 className="description">Queries Recieved</h6>
        </div>
        <div className="last assignment_content_leftBorder">
          <h1 className="heading">4</h1>
          <h6 className="description">Queries Reviewed</h6>
        </div>
        
      </div>
    </div>
  );
}

export default Course_without_banner;

import React, { useContext } from "react";
import './student_assignments.css'
import AuthContext from "../../../../../AuthContext";
import { useNavigate } from "react-router-dom";

function Student_assignments(props) {

  const navigate = useNavigate();
  const { setAssignment } = useContext(AuthContext);

  const OnAssignmentClick = () => {
    setAssignment(props.peerAssignment);
    navigate(`/Dashboard/student/${props.peerAssignment.course_id}/${props.peerAssignment._id}`);
  }

  return (
    <div className="student_assignments_container">
      <div className="student_assignment_heading" onClick={OnAssignmentClick}>
        <h4 className="student_assignment_heading_topic">
        {props.peerAssignment.assignment_title}
        </h4>
        <h6 className="student_assignment_heading_teacher">{props.TeachersName}</h6>
      </div>
      <div className="student_assignment_content">
        <div>
          <h1 className="heading">26</h1>
          <h6 className="description">Average score recieved</h6>
        </div>
        <div>
          <h1 className="heading">22</h1>
          <h6 className="description">class average score</h6>
        </div>
        <div>
          <h1 className="heading">4</h1>
          <h6 className="description">total questions</h6>
        </div>
        <div>
          <h1 className="heading">A+</h1>
          <h6 className="description">Assignemnt Grade</h6>
        </div>
        <div className="last">
          <h1 className="heading">B</h1>
          <h6 className="description">Consistency Grade</h6>
        </div>
      </div>
    </div>
  );
}

export default Student_assignments;

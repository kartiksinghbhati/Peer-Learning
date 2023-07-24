import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from '../../AuthContext';
import './AssignmentCard.css'
import assignmentimg from '../Images/Assignment.png';
import moreimg from '../Images/more.png';

export default function AssignmentCard(props){

  const navigate = useNavigate();

  const { role, setAssignment } = useContext(AuthContext);

  var day = '-';
  var month = '-';
  var year = '-';
  if (props.assignment.creationTime) {
    day = props.assignment.creationTime.substring(8, 10);
    month = props.assignment.creationTime.substring(5, 7);
    year = props.assignment.creationTime.substring(0, 4);
  }


  var peerassId = [];
  for (let i = 0; i < props.peerAssignments.length; i++) {
    console.log("FOR LOOP");
    peerassId.push(props.peerAssignments[i].assignment_id);
  }

  const OnCard = () => {

    if (role === "student") {
      var res = peerassId.indexOf(props.assignment.id);
      if (res == -1){
        setAssignment(props.assignment);
        navigate(`/inacourse/${props.assignment.courseId}/${props.assignment.id}`);
      }
      else{
        setAssignment(props.peerAssignments[res]);
        navigate(`/acourse/${props.peerAssignments[res].course_id}/${props.peerAssignments[res]._id}`);
      } 
    }
    else {
      var res = peerassId.indexOf(props.assignment.id);
      if (res == -1){
        setAssignment(props.assignment);
        navigate(`/inacourse/${props.assignment.courseId}/${props.assignment.id}`);
      }
      else{
        setAssignment(props.peerAssignments[res]);
        navigate(`/acourse/${props.peerAssignments[res].course_id}/${props.peerAssignments[res]._id}`);
      }
    }
  }
  

  return (
    <>
        <div onClick={OnCard} className="submain" >
        <div className="left-part">
            <div className="Image"><img src={assignmentimg} alt="assignmentimg"/></div>
            <div>
            <div className="section">{props.assignment.title}</div>
            <div className="date">{day}/{month}/{year}</div>
            </div>
        </div>
        <div className="MoreImage"><img src={moreimg} alt="More-Options"/>
            <div className="options">
            <a href={props.assignment.alternateLink}>View in Classroom <i className="fa fa-external-link" aria-hidden="true"></i></a>
            </div>
        </div>
        </div>
  </>
  )
}
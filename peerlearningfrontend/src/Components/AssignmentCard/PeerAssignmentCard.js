import React, { useContext, useEffect, useState } from "react";
import AuthContext from '../../AuthContext';
import { useNavigate } from "react-router-dom";
import './AssignmentCard.css'
import asimg from '../Images/Assignment.png';
import more from '../Images/more.png';

const PeerAssignmentCard = (props) => {

  const navigate = useNavigate();
  const { role, setAssignment } = useContext(AuthContext);
  const [opt, setopt] = useState(false);
  var reviewDeadline = "";

  const truncate = (str) => {
    if (str) {
      return str.length > 75 ? str.substring(0, 75) + "..." : str;
    }
  }
  var day = '-';
  var month = '-';
  var year = '-';
  if(props.peerAssignments.creationTime)
  {
    day = props.peerAssignments.creationTime.substring(8,10);
    month = props.peerAssignments.creationTime.substring(5, 7);
    year = props.peerAssignments.creationTime.substring(0, 4);
  }
  const f1 = () => {
    setopt(true)
  }

  const OnCard = () => {
    setAssignment(props.peerAssignments);
    navigate(`/acourse/${props.peerAssignments.courseId}/${props.peerAssignments.id}`);
  }


  return (
  <>
    {props.ids.map((e)=>(
      e === props.peerAssignments.assignment_id ? 
    <div onClick={OnCard} className="submain" >
      <div className="left-part">
        <div className="Image"><img src={asimg} alt="Assignment-Image"/></div>
        <div>
          <div className="section">{props.peerAssignments.assignment_title}</div>
          <div className="date">{day}/{month}/{year}</div>
        </div>
      </div>
      <div className="MoreImage"><img src={more} onClick={f1} alt="More-Options"/>
        <div className="options">
          <a href={props.peerAssignments.alternateLink}>View in Classroom <i className="fa fa-external-link" aria-hidden="true"></i></a>
        </div>
      </div>
    </div>
    :
    null
    ))}
  </>
  );
};

export default PeerAssignmentCard;
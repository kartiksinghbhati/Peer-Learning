import React, { useContext, useEffect, useState } from 'react'
import './teacherDbAssignment.css'
import { G_API } from "../../../config";
import Spinner from "../../Spinner/Spinner";
import SearchBar from './comp/searchBar/searchBar';
import TeacherDropdown_with_content from './comp/teacher_dropdown_with_content/teacher_dropdown_with_content';
import TeacherQuestions from './comp/Questions/teacher_questions';
import AuthContext from '../../../AuthContext';

function TeacherDbAssignment() {
  const { userData, course, assignment } = useContext(AuthContext);
  const [TeachersName, setTeachersName] = useState([]);
  const [spin, setSpin] = useState(true);


  const loadData = async () =>{
    if (userData.token && course.id) {
      
      await fetch(`${G_API}/courses/${course.id}/teachers`, { // fetch the teacher name of the course
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          var len = res.teachers.length;
          setTeachersName(res.teachers[len - 1].profile.name.fullName);
          setSpin(false);
        });   
    }
  }

  useEffect(() => {loadData()}, [userData.token]);

  return (
    spin ? <Spinner/> :
    <div className='teacherDbAssignmentContainer'>
      <div className="assignment">
      <div className="assignment_heading">
        <h4 className="assignment_heading_topic_with_banner">
          {assignment.assignment_title}
        </h4>
        <h6 className="assignment_heading_teacher">{TeachersName}</h6>
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
      <SearchBar/>
      <TeacherDropdown_with_content/>
      <TeacherDropdown_with_content/>
      <div className="teacherAssignment">
        <h3>Questions</h3>
        {Array.from({ length: assignment.total_questions }, (_, index) => (
          <TeacherQuestions key={index} quesNum={index+1} maxScore={assignment.max_marks_per_question}/>
        ))}
          {/* <TeacherQuestions/>
          <TeacherQuestions/>
          <TeacherQuestions/>
          <TeacherQuestions/>
          <TeacherQuestions/>
          <TeacherQuestions/> */}
      </div>
    </div>
  )
}

export default TeacherDbAssignment;

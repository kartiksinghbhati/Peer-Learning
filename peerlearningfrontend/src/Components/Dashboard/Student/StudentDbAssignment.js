import React, { useContext, useEffect, useState } from "react";
import "./StudentDbAssignment.css";
import { G_API } from "../../../config";
import Spinner from "../../Spinner/Spinner";
import StudentDropdown_with_content from "./comp/student_dropdown_with_content/student_dropdown_with_content";
import Questions from "./comp/questions/questions";
import AuthContext from "../../../AuthContext";

function StudentDbAssignment() {
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
    <div className="student_page3_container">
      <div className="student_assignments_container">
      <div className="student_assignment_heading" >
        <h4 className="student_assignment_heading_topic">
          {assignment.assignment_title}
        </h4>
        <h6 className="student_assignment_heading_teacher">{TeachersName}</h6>
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
      <StudentDropdown_with_content/>
      <StudentDropdown_with_content/>
      <div className='assignments_questions'>
        <h3>Questions</h3>
        {Array.from({ length: assignment.total_questions }, (_, index) => (
          <Questions key={index} quesNum={index+1} maxScore={assignment.max_marks_per_question}/>
        ))}
                    
      </div>
    </div>
  );
}

export default StudentDbAssignment;

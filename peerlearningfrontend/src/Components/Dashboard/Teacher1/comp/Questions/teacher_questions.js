import React from 'react'
import './teacher_questions.css'
function TeacherQuestions(props) {
  return (
    <div className='teacher_questions_container'>
      <div className="teacher_questions_heading">
        <h4 className="teacher_questions_heading_topic">
          Question {props.quesNum}
        </h4>
        <h6 className="teacher_questions_heading_teacher">Max score - {props.maxScore}</h6>
      </div>
      <div className="teacher_questions_content">
        <div>
          <h1 className="heading">2</h1>
          <h6 className="description">Average score recieved</h6>
        </div>
        <div className='questions_column_left_border'>
          <h1 className="heading">2.4</h1>
          <h6 className="description">class average score</h6>
        </div>
        <div className='questions_column_left_border'>
          <h1 className="heading">4</h1>
          <h6 className="description">total Reviewers</h6>
        </div >
        <div className="last ">
          <h1 className="heading">3</h1>
          <h6 className="description">Consistency Score</h6>
        </div>
      </div>
    </div>
  )
}

export default TeacherQuestions

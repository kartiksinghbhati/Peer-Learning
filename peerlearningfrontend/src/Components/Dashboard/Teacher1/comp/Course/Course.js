import React from 'react'
import './Course.css'

function TeacherCourse(props) {

  return (
    <div className="assignment">
      <div className="assignment_heading_banner">
        <h4 className="assignment_heading_topic_banner">
          {props.data.name}
        </h4>
      </div>
      <div className="assignment_content">
        <div >
          <h1 className="heading">26</h1>
          <h6 className="description">Average score by students</h6>
        </div>
        <div className='assignment_content_leftBorder'>
          <h1 className="heading">4</h1>
          <h6 className="description">Total Questions</h6>
        </div>
        <div className='assignment_content_leftBorder'>
          <h1 className="heading">74%</h1>
          <h6 className="description">Average student participation rate</h6>
        </div>
        <div className='assignment_content_leftBorder'>
          <h1 className="heading">26</h1>
          <h6 className="description">Queries Recieved</h6>
        </div>
        <div className="last assignment_content_leftBorder">
          <h1 className="heading">4</h1>
          <h6 className="description">Queries Reviewed</h6>
        </div>
        
      </div>
    </div>
  )
}

export default TeacherCourse;

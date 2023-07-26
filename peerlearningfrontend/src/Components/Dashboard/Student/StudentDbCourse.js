import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../../../AuthContext';
import "./StudentDbCourse.css";
import Course from "./comp/course/course";
import StudentDropdown_with_content from './comp/student_dropdown_with_content/student_dropdown_with_content';
import Student_assignments from './comp/student_assignemnts/student_assignments';

export default function StudentDbCourse() {

    return (
        <div className="studentdashboard">
            <div className='student_page2_container'>
                <div className="course_container">
                    <div className="course_heading_banner">
                        <h4 className="course_heading_topic">Course Name</h4>
                    </div>

                    <div className="student_course_container">
                        <div className="students_course_details">
                            <div className="progress_course_data">
                                <h5>Total Peer Assignments: </h5>
                                <h5>Peer Review Performed: </h5>
                                <h5>Peer Review Recived: </h5>
                                <h5>Completion Rate: </h5>
                            </div>
                            <div className="student_course_no">
                                <h5>6</h5>
                                <h5>24</h5>
                                <h5>24</h5>
                                <h5>100%</h5>
                            </div>
                        </div>
                        <div className="student_cummulative_assignment_grade">
                            <h3>A+</h3>
                        </div>
                        <div className="student_cummulative_consistency_grade">
                            <h3>B</h3>
                        </div>
                    </div>
                </div>
                <StudentDropdown_with_content />
                <StudentDropdown_with_content />
                <div className='student_assignments'>
                    <h3>Peer Assignments</h3>
                    <Student_assignments />
                    <Student_assignments />
                    <Student_assignments />
                    <Student_assignments />
                </div>
            </div>
        </div>
    )
}

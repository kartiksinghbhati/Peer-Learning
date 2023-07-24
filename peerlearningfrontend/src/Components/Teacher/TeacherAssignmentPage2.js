import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../AuthContext";
import { G_API, API } from "../../config";
import TeacherAssignmentView1 from "./TeacherAssignmentView1";
import TeacherAssignmentView2 from "./TeacherAssignmentView2";
import Spinner from "../Spinner/Spinner";


const TeacherAssignmentPage2 = () => {

    const { user, userData, setUserData, assignment, role } = useContext(AuthContext);
    const _id = assignment._id;
    const course_id = assignment.course_id;

    const [assignment1, setAssignment1] = useState([]); //for storing info about the assignment fetched from both classroom and peer learning
    //const [assignment2, setAssignment2] = useState({});
    const [activities, setActivities] = useState([]); //for storing info about a student and their reviewers info with marks and comments
    //const [self, setSelf] = useState({});
    const [mail, setMail] = useState("");
    const [reviewerCount, setReviewerCount] = useState(0);
    const [marks, setMarks] = useState([]); //for storing marks matrix
    const [spin1, setSpin1] = useState(true);
    const [spin2, setSpin2] = useState(true);

    // console.log("id: "+_id);
    // console.log("course id: "+course_id);

    const loadData = async () =>{
        if (userData.token) {
            // setUserData((u) => ({ ...u, loader: u.loader + 1 }));
            await fetch(`${API}/api/peer/assignment?peer_assignment_id=${_id}`)
              .then((res) => res.json())
              .then(async (res) => {
                console.log(res);
                await fetch(
                  `${G_API}/courses/${course_id}/courseWork/${res.assignment_id}`,
                  {
                    method: "GET",
                    headers: {
                      Authorization: `Bearer ${userData.token}`,
                    },
                  }
                )
                  .then((r) => r.json())
                  .then((r) => {
                    setAssignment1({ ...res, ...r }); 
                    setMarks(res.max_marks_per_question);
                    setSpin1(false);
                  });
              });
          }
    }

    useEffect(() => { loadData() }, [userData.token]);

    const getTeacherReviews = async () => {
        //setUserData((u) => ({ ...u, loader: u.loader + 1 }));
        await fetch(`${API}/api/peeractivity?peer_assignment_id=${_id}`) //for getting reviews and comments of students
            .then((res) => res.json())
            .then((res) => {
            // console.log("res for getting reviews and comments");
            // console.log(res);
            fetch(
                `https://classroom.googleapis.com/v1/courses/${course_id}/students`, //gets the list of all students enrolled in the course
                {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${userData.token}`,
                },
                }
            )
                .then((r) => r.json())
                .then((r) => {
                setUserData((u) => ({ ...u, loader: u.loader - 1 }));
                
                let a = [];
                let authorMap = {};  //for storing the list of all students info with their id as key
                r.students.forEach((s) => {
                    authorMap[s.userId] = [s];
                });
                
                res.forEach((activity) => {
                    if (authorMap[activity.author_id] !== undefined) {
                    authorMap[activity.author_id] = [
                        ...authorMap[activity.author_id],
                        {
                        ...activity,
                        ...authorMap[activity.reviewer_id][0].profile,
                        },
                    ];
                    }
                });

                Object.keys(authorMap).forEach((author) => {
                    a.push(authorMap[author]);
                });
                setActivities([...a]);
                let em = []; //store ids of students who have not submitted their reviews
                res.forEach((act) => {
                    if (act.review_score.length === 0) {
                    em.push(authorMap[act.reviewer_id][0].profile.emailAddress);
                    }
                });
                var countReviewr = 0;
                a.forEach((tttt) => {
                    if (countReviewr < (tttt.length)) {
                    countReviewr = tttt.length - 1;
                    }
                });
                
                setReviewerCount(countReviewr);
                
                setMail(
                    "mailto:" +
                    encodeURI(em) +
                    "?subject=" +
                    encodeURI("Complete the review process ASAP") +
                    "&body=" +
                    encodeURI(
                    "Submit the reviews on assigned answersheets. Link - https://serene-agnesi-9ee115.netlify.app/"
                    )
                );

                setSpin2(false);
                
                });
            });
    };    

    useEffect(() => { getTeacherReviews(); }, [role, assignment1._id, assignment1.status]);

    // console.log("assignment");
    // console.log(assignment1);
    // console.log("self");
    // console.log(self);
    // console.log("activites");
    // console.log(activities);
    // console.log("Marks");
    // console.log(marks);

    return (
        <>
        {spin1 && spin2 ? <Spinner/>
            :   <div className="dashboard">
                    <div className="contain">
                        {/* <TeacherAssignmentView2 assg={assignment1} /> */}
                        {/* <TeacherAssignmentView1 assg={assignment1} activities={activities} marks={marks} reviewerCount={reviewerCount}/> */}
                        {  
                            assignment1.status === "Assigned" ? <TeacherAssignmentView1 assg={assignment1} activities={activities} marks={marks} reviewerCount={reviewerCount}/>
                            : <TeacherAssignmentView2 assg={assignment1} /> 
                        }
                    </div>
                </div>
        }
        </>
    );
};

export default TeacherAssignmentPage2;
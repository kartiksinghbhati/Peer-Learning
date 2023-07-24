import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../AuthContext";
import { G_API, API } from "../../config";
import StudentAssignmentView1 from "./StudentAssignmentView1";
import StudentAssignmentView2 from "./StudentAssignmentView2";
import Spinner from "../Spinner/Spinner";


const StudentAssignmentPage2 = () => {

    const { user, userData, setUserData, assignment, role } = useContext(AuthContext);
    const _id = assignment._id;
    const course_id = assignment.course_id;

    const [assignment1, setAssignment1] = useState([]); //for storing info about the assignment fetched from both classroom and peer learning
    const [assignment2, setAssignment2] = useState({});
    const [activities, setActivities] = useState([]); //for storing info about a student and their reviewers info with marks and comments
    const [self, setSelf] = useState({});
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

    const getStudentReviews1 = async () => {
        //setUserData((u) => ({ ...u, loader: u.loader + 1 }));
        await fetch(`${API}/api/reviewerassignments?course_work_id=${assignment1.assignment_id}&user_id=${user.sub}`)
        .then((res) => res.json())
        .then((res) => {
            //console.log("getStudentReviews1 Res");
            //console.log(res);
          let ac = [];
          res.forEach((r) => {
            if (r.review_score.length === 0) {
              r.review_score = Array(assignment1.total_questions).fill(0);
              r.reviewer_comment = Array(assignment1.total_questions).fill("");
            }
            if (r.author_id !== r.reviewer_id) {
              ac.push(r);
            } else {
              console.log(r);
              setSelf(r);
            }
          });
          setActivities(ac);
          setSpin2(false);
        });
    };

    const getStudentReviews2 = async () => {
        //setUserData((u) => ({ ...u, loader: u.loader + 1 }));
        await fetch(`${API}/api/reviews?peer_assignment_id=${_id}&student_id=${user.sub}`)
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
            setActivities(res);
            setSpin2(false);
            //setUserData((u) => ({ ...u, loader: u.loader - 1 }));
          });
    }; 

    useEffect(() => { 
        if (role === "student" && assignment1.status === "Assigned"){
            getStudentReviews1();
            console.log("gsr1");
        }
        if (role === "student" && assignment1.status === "Grading"){
            getStudentReviews2();
        }        
    }, [role, assignment1._id, assignment1.status]);

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
                        {  role === "student" ?
                                // <StudentAssignmentView1 assg={assignment}  self={self} activities={activities} marks={marks} setSelf={setSelf} setActivities={setActivities} />
                                // <StudentAssignmentView2 assg={assignment} activities={activities} marks={marks} setActivities={setActivities}/>
                                 assignment1.status === "Assigned" ? <StudentAssignmentView1 assg={assignment1}  self={self} activities={activities} marks={marks} setSelf={setSelf} setActivities={setActivities} />
                                 : <StudentAssignmentView2 assg={assignment1} activities={activities} marks={marks} setActivities={setActivities}/>
                            : null
                        }
                    </div>
                </div>
        }
        </>
    );
};

export default StudentAssignmentPage2;
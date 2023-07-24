import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../../AuthContext";
import { G_API, API } from "../../config";
import StudentCourseView2 from "../Student/StudentAssignmentView1";
import Spinner from "../Spinner/Spinner";


const CourseView = () => {
    const id = "63f0f8333eb3207a2418b6d3";

    const { course_id } = useParams(); //id is for assignment's _id of peer assignment
    const [assignment, setAssignment] = useState([]); //for storing info about the assignment fetched from both classroom and peer learning
    const [assignment2, setAssignment2] = useState({});
    const [role, setRole] = useState("student");
    const [activities, setActivities] = useState([]); //for storing info about a student and their reviewers info with marks and comments
    const [self, setSelf] = useState({});
    const [mail, setMail] = useState("");
    const [reviewerCount, setReviewerCount] = useState(0);
    const [marks, setMarks] = useState([]); //for storing marks matrix
    const [spin1, setSpin1] = useState(true);
    const [spin2, setSpin2] = useState(true);

//   const [studentRollNo, setStudentRollNo] = useState();
//   const [studentInfo, setStudentInfo] = useState({
//     RollNo: "",
//     studentUserId: "",
//   });
  
    const { user, userData, setUserData } = useContext(AuthContext);

    const loadData = async () =>{
        if (userData.token) {
            // setUserData((u) => ({ ...u, loader: u.loader + 1 }));
            await fetch(`${API}/api/peer/assignment?peer_assignment_id=${id}`)
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
                    setAssignment({ ...res, ...r }); 
                    setMarks(res.max_marks_per_question);
                    setSpin1(false);
                  });
              });
          }
    }

    useEffect(() => { loadData() }, [userData.token]);


    const loadData2 = async () =>{
        if (userData.token) {
        
            await fetch(`${G_API}/courses/${course_id}/teachers`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${userData.token}`,
            },
            })
            .then((res) => res.json())
            .then((res) => {
                res.teachers.forEach((teacher) => {
                if (teacher.profile.emailAddress === user.email) {
                    setRole("teacher");
                }
                });
            });
        }
    }

    useEffect(() => { loadData2() }, []);

    const getStudentReviews1 = async () => {
        //setUserData((u) => ({ ...u, loader: u.loader + 1 }));
        await fetch(`${API}/api/reviewerassignments?course_work_id=${assignment.assignment_id}&user_id=${user.sub}`)
        .then((res) => res.json())
        .then((res) => {
            //console.log("getStudentReviews1 Res");
            //console.log(res);
          let ac = [];
          res.forEach((r) => {
            if (r.review_score.length === 0) {
              r.review_score = Array(assignment.total_questions).fill(0);
              r.reviewer_comment = Array(assignment.total_questions).fill("");
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
        await fetch(`${API}/api/reviews?peer_assignment_id=${id}&student_id=${user.sub}`)
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
            setActivities(res);
            //setUserData((u) => ({ ...u, loader: u.loader - 1 }));
          });
    };

    const getTeacherReviews = async () => {
        //setUserData((u) => ({ ...u, loader: u.loader + 1 }));
        await fetch(`${API}/api/peeractivity?peer_assignment_id=${id}`) //for getting reviews and comments of students
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
                
                });
            });
    };    

    useEffect(() => { 
        if (role === "student" && assignment.status === "Assigned"){
            getStudentReviews1();
            console.log("gsr1");
        }
        if (role === "student" && assignment.status === "Grading"){
            getStudentReviews2();
        }
        if(role === "teacher"){
            getTeacherReviews();
        }

        
    }, [role, assignment._id, assignment.status]);

    // console.log("assignment");
    // console.log(assignment);
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
                            <StudentCourseView2 assg={assignment}  self={self} activities={activities} marks={marks} setSelf={setSelf} setActivities={setActivities} />
                            : null
                        }
                    </div>
                </div>
        }
        </>
    );
};

export default CourseView;
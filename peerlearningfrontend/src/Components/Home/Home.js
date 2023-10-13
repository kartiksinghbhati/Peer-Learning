// import React, { useState, useContext, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import styles from "./Home.module.css";
// import CourseCard from "../CourseCard/CourseCard";
// import AuthContext from "../../AuthContext";
// import Spinner from "../Spinner/Spinner";
// import bottomimg from "../Images/Bottom.png";
// import calendarimg from "../Images/Calendar.png";
// import dashboardimg from "../Images/dashboard.png";
// import queryimg from "../Images/Query.png";
// import todoimg from "../Images/To-do.png";
// import rev from "../Images/Review.png";
// import Cookies from "js-cookie"; // Import the js-cookie library

// const Home = () => {
//   const navigate = useNavigate();

//   const [courses, setCourses] = useState([]);
//   const [isTeacher, setIsTeacher] = useState(true);
//   const [spin, setSpin] = useState(true);
//   const { user, userData, setUserData } = useContext(AuthContext);

//   // const myFunction1 = async () => {
//   //   if (!userData.token) {
//   //     navigate("/login");
//   //   }
//   // };
//   // useEffect(() => {
//   //   myFunction1();
//   // }, []);

//   const loadData = async () => {
//     const accessToken = Cookies.get("accessToken"); // Get the access token from the cookie
//     const user1 = Cookies.get("user");
//     console.log(user1);

//     if (accessToken) {
//       setUserData((u) => ({ ...u, loader: u.loader + 1 }));
//       await fetch("https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE", {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       })
//         .then((res) => res.json())
//         .then((res) => {
//           setUserData((u) => ({ ...u, loader: u.loader - 1 }));
//           setCourses(res.courses);

//           let len = res.courses.length;
//           for (let i = 0; i < len; i++) {
//             fetch(`https://classroom.googleapis.com/v1/courses/${res.courses[i].id}/teachers`, {
//               method: "GET",
//               headers: {
//                 Authorization: `Bearer ${accessToken}`,
//               },
//             })
//               .then((r) => r.json())
//               .then((r) => {
//                 r.teachers.forEach((teacher) => {
//                   if (teacher.profile.emailAddress !== user1.email) {
//                     setIsTeacher(false);
//                   }
//                 });
//               });
//           }

//           setSpin(false);
//         });
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   return (
//     <>
//       {spin ? (
//         <Spinner />
//       ) : (
//         <div className="home">
//           <div className="home1">
//             <div className="head">
//               <Link to="/Query">
//                 <button className="btm3">
//                   <img src={queryimg} alt="Queries" /> Queries
//                 </button>
//               </Link>
//               <Link to="/Todo">
//                 <button className="btm3">
//                   <img src={todoimg} alt="Todos" /> To-Do
//                 </button>
//               </Link>
//               <Link to="/Calendar">
//                 <button className="btm3">
//                   <img src={calendarimg} alt="Calendar" /> Calendar
//                 </button>
//               </Link>
//               {isTeacher ? (
//                 <button className="btm3">
//                   <img src={rev} alt="Review" /> Review
//                 </button>
//               ) : null}
//               {isTeacher ? (
//                 <Link to="/Dashboard/teacher">
//                   <button className="btm3">
//                     <img src={dashboardimg} alt="dashboard" /> Dashboard
//                   </button>
//                 </Link>
//               ) : (
//                 <Link to="/Dashboard/student">
//                   <button className="btm3">
//                     <img src={dashboardimg} alt="dashboard" /> Dashboard
//                   </button>
//                 </Link>
//               )}
//             </div>
//           </div>
//           <div className={styles.home2}>
//             {courses
//               ? courses.map((data, index) => (
//                   <CourseCard key={data.id} data={data} index={index} />
//                 ))
//               : null}
//           </div>
//           {<img src={bottomimg} alt="bottomimg" className="bottom" />}
//         </div>
//       )}
//     </>
//   );
// };

// export default Home;



import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import styles from './Home.module.css';
import CourseCard from '../CourseCard/CourseCard';
import AuthContext from '../../AuthContext';
import Spinner from '../Spinner/Spinner';
import bottomimg  from '../Images/Bottom.png';
import calendarimg  from '../Images/Calendar.png';
import dashboardimg  from '../Images/dashboard.png';
import queryimg  from '../Images/Query.png';
import todoimg  from '../Images/To-do.png';
import rev from "../Images/Review.png";



const Home = () => {

  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [isTeacher, setIsTeacher] = useState(true);
  const [spin, setSpin] = useState(true);
  const { user, userData, setUserData } = useContext(AuthContext);


  const myFunction1 = async () =>{
    if (!userData.token) {
      navigate("/login");
    } 
  }
  useEffect(() => {
    myFunction1();
  }, []);


  const loadData = async () =>{
    if (userData.token) {
      setUserData((u) => ({ ...u, loader: u.loader + 1 }));
      await fetch("https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE", {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${userData.token}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setUserData((u) => ({ ...u, loader: u.loader - 1 }));
          setCourses(res.courses);
          //console.log(res.courses);

          let len = res.courses.length;
          for (let i = 0; i< len; i++) {
            fetch(`https://classroom.googleapis.com/v1/courses/${res.courses[i].id}/teachers`, {
              method: "GET",
              headers: {
                'Authorization': `Bearer ${userData.token}`,
              },
            })
              .then((r) => r.json())
              .then((r) => {
                  r.teachers.forEach((teacher) => {
                    if (teacher.profile.emailAddress !== user.email) {
                      setIsTeacher(false);
                    }
                  });
              });
          }

          setSpin(false);
        });


  
    }
  }

  useEffect(() => { loadData() }, [userData.token]);


  return (
    <>
    {
      spin ? <Spinner/> :
      <div className="home">
        <div className="home1">
          <div className="head">
            <Link to="/Query">
              <button className="btm3"><img src={queryimg} alt="Queries" /> Queries</button>
            </Link>
            <Link to="/Todo">
              <button className="btm3"><img src={todoimg} alt="Todos" /> To-Do</button>
            </Link>
            <Link to="/Calendar">
              <button className="btm3"><img src={calendarimg} alt="Calendar"/> Calendar</button>
            </Link>
            {
                isTeacher ?
                <button className="btm3"><img src={rev} alt="Review" /> Review</button> :
                null
            }
            {
                isTeacher ?
                  <Link to="/Dashboard/teacher">
                    <button className="btm3"><img src={dashboardimg} alt="dashboard"/> Dashboard</button>
                  </Link>
                :
                  <Link to="/Dashboard/student">
                    <button className="btm3"><img src={dashboardimg} alt="dashboard"/> Dashboard</button>
                  </Link>
            }
          </div>
        </div>
        <div className={styles.home2}>

          {courses ? courses.map((data,index) => (
            <CourseCard key={data.id} data={data} index={index} />  //image={imgArr[index % 5]}
          )) : null}

        </div>
        {<img src={bottomimg} alt="bottomimg" className="bottom" />}
      </div>
    }
  </>
  )
}

export default Home

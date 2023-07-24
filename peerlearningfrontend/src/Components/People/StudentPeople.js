// import React, { useContext, useEffect, useState } from "react";
// import styles from './StudentPeople.module.css';
// import mail from './mail.svg';
// import Line from './Line.svg';
// import AuthContext from "../../AuthContext";
// import bottom from '../Images/Bottom.png';

// function StudentPeople(props) {

//   const [StudentName, setStudentName] = useState([]);
//   const { userData, setUserData } = useContext(AuthContext);

//   useEffect(() => { loadData() }, [userData.token]);

//   const loadData = async () =>{
//     if (userData.token) {
//       await fetch(
//         `https://classroom.googleapis.com/v1/courses/${props.teach.id}/students`, //gets the list of all students enrolled in the course
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${userData.token}`,
//           },
//         }
//       )
//         .then((res) => res.json())
//         .then((res) => {
//           setStudentName(res.students);
//         });
//     }
//   }

//   console.log(StudentName[0].profile.name.fullName);
      
//     //var len = StudentName.length;
//     return (
//       <>
//         console.log(StudentName[0].profile.name.fullName);
//       </>
//         <>

//           <div className={styles.Students}> Students
//           <div id="num">{len} students</div>
//           <img src={Line} id={styles.line} />

//           {StudentName.map((i,p) => {
//             var email = StudentName[p].profile.emailAddress;
//             var mails = `mailto:${email}`;
//             var name = StudentName[p].profile.name.fullName;
//             setUserData({
//               pictureurl: "https:"+StudentName[p].profile.photoUrl,
//               name: name,
//             })
//             return(
//             <>
//             <div id={styles.profile}>
//               <div id={styles.leftpart}>
//                 <img src={"https:"+StudentName[p].profile.photoUrl} id={styles.pic} />
//                 <p id={styles.name}>{StudentName[p].profile.name.fullName}</p>
//               </div>
//               <a href={mails} target="_blank"><img src={mail} id={styles.mail}/></a>
//             </div>
//             </>
//             )
//             })}
//           </div>
//           {<img src={bottom} alt="Image" className={styles.btm}/>}
//         </>
//     )
// }

// export default StudentPeople

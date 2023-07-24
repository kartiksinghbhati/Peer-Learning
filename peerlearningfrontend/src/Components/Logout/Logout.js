// import React from "react";
// import { GoogleLogout } from 'react-google-login';
// import styles from './Logout.module.css';
// import homeimg from "./Logout_Image/Home.png";
// import leftimg from "./Logout_Image/left.png";
// import rightimg from "./Logout_Image/right.png";


// function Logout(props) {

//     return (
//         // CSS from Style.css
//         <div id={styles.login}>
//             <div className={styles.left}>
//                 <img src={leftimg} alt="Left Wave" />
//             </div>
//             <div className={styles.container1}>
//                 <div className={styles.row1}>
//                     <div className={styles.col-2}>
//                         <img src={homeimg} alt="Peer Learning" />
//                     </div>
//                     <div className={styles.col-2}>
//                         <h1>Peer Learning Platform</h1>
//                         <h3>A platform specifically designed as an addition to Google Classroom for students to gain the best out of online education, look at solutions not just from their but also from the perspectives of their peers.</h3>
//                         <h3>A platform that not only promotes education but also instills moral integrity within it’s community.</h3>
//                         <div className={styles.SignOutButton1}>
//                             <GoogleLogout
//                                 clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
//                                 buttonText="Sign Out"
//                                 onLogoutSuccess={props.onLogoutSuccess}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div className={styles.right}>
//                 <img src={rightimg} alt="Right Wave" />
//             </div>
//         </div>
//     );
// }

// export default Logout;

// import React, { useContext, useEffect, useState } from "react";
// import styles from "./Login.module.css";
// import homeimg from "../Images/Home.png";
// import left from "../Images/Left.png";
// import right from "../Images/Right.png";
// import AuthContext from "../../AuthContext";
// import jwt_decode from "jwt-decode";
// import { useNavigate } from "react-router-dom";
// //import Cookies from "js-cookie"; // Import the js-cookie library

// function Login() {
//   const SCOPES =
//     "email profile https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.profile.emails https://www.googleapis.com/auth/classroom.profile.photos https://www.googleapis.com/auth/classroom.rosters https://www.googleapis.com/auth/classroom.rosters.readonly https://www.googleapis.com/auth/classroom.coursework.me https://www.googleapis.com/auth/classroom.coursework.students.readonly https://www.googleapis.com/auth/classroom.coursework.students https://www.googleapis.com/auth/classroom.announcements https://www.googleapis.com/auth/drive.file";

//   const navigate = useNavigate();

//   const { setUser, userData, setUserData } = useContext(AuthContext);
//   const [tokenClient, setTokenClient] = useState({});

//   function login() {
//     if (tokenClient) {
//       tokenClient.requestAccessToken();
//     }
//   }

//   function handleCallbackResponse(response) {
//     const UserObject = jwt_decode(response.credential);
//     setUser(UserObject);
//     // Set a cookie with the access token on successful login
//     // Cookies.set("user", UserObject, {
//     //   expires: 7,
//     // }); // Adjust the expiration as needed
//     setUserData({
//       credential: response.credential,
//     });
//     const signInButton = document.getElementById("signIn");
//     if (signInButton) {
//       signInButton.hidden = true;
//     }
//   }

//   useEffect(() => {
//     if (window.google && window.google.accounts) {
//       const google = window.google;
//       google.accounts.id.initialize({
//         client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
//         callback: handleCallbackResponse,
//       });
//       google.accounts.id.renderButton(document.getElementById("signIn"), {
//         theme: "outline",
//         size: "large",
//         shape: "circle",
//       });

//       setTokenClient(
//         google.accounts.oauth2.initTokenClient({
//           client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
//           scope: SCOPES,
//           callback: (tokenResponse) => {
//             setUserData({
//               token: tokenResponse.access_token,
//               loader: 0,
//             });
//             if (tokenResponse.access_token) {
//               // Set a cookie with the access token on successful login
//               // Cookies.set("accessToken", tokenResponse.access_token, {
//               //   expires: 7,
//               // }); // Adjust the expiration as needed
//               navigate("/");
//             }
//           },
//         })
//       );
//     }
//   }, []);

//   return (
//     <div id={styles.login}>
//       <div className={styles.left}>
//         <img src={left} alt="Left Wave" />
//       </div>
//       <div className={styles.container1}>
//         <div className={styles.row1}>
//           <div className={styles.homeimg}>
//             <img src={homeimg} alt="Peer Learning" />
//           </div>
//           <div className={styles.col-2}>
//             <h1 className={styles.title}>Peer Learning Platform</h1>
//             <h3 className={styles.description}>
//               A platform specifically designed as an addition to Google Classroom
//               for students to gain the best out of online education, look at
//               solutions not just from their but also from the perspectives of
//               their peers.
//             </h3>
//             <h3 className={styles.description}>
//               A platform that not only promotes education but also instills moral
//               integrity within its community.
//             </h3>

//             <div className={styles.SignInButton}>
//               <div id="signIn"></div>
//               {userData.credential ? (
//                 <>
//                   <button onClick={login}>Access Token</button>
//                 </>
//               ) : null}
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className={styles.right}>
//         <img src={right} alt="Right Wave" />
//       </div>
//     </div>
//   );
// }

// export default Login;



import React, {useContext, useState, useEffect} from "react";
import styles from './Login.module.css';
import homeimg from "../Images/Home.png";
import left from "../Images/Left.png";
import right from "../Images/Right.png";
import AuthContext from "../../AuthContext";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";


function Login() {

    const SCOPES = "email profile https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.profile.emails https://www.googleapis.com/auth/classroom.profile.photos https://www.googleapis.com/auth/classroom.rosters https://www.googleapis.com/auth/classroom.rosters.readonly https://www.googleapis.com/auth/classroom.coursework.me https://www.googleapis.com/auth/classroom.coursework.students.readonly https://www.googleapis.com/auth/classroom.coursework.students https://www.googleapis.com/auth/classroom.announcements https://www.googleapis.com/auth/drive.file"

    const navigate = useNavigate();
    
    const { setUser,  userData, setUserData } = useContext(AuthContext);
    const [tokenClient, setTokenClient] = useState({});

    function login() {
        if (tokenClient) {
          tokenClient.requestAccessToken();
        } 
      }
    
      function handleCallbackResponse(response) {
        const UserObject = jwt_decode(response.credential);
        setUser(UserObject);
        setUserData({
          credential: response.credential,
        });
        const signInButton = document.getElementById('signIn');
        if (signInButton) {
          signInButton.hidden = true;
        }
      }
    
      useEffect(() => {
        if (window.google && window.google.accounts) {
          const google = window.google;
          google.accounts.id.initialize({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            callback: handleCallbackResponse,
          });
          google.accounts.id.renderButton(document.getElementById('signIn'), {
            theme: 'outline',
            size: 'large',
            shape: 'circle',
          });
    
          setTokenClient(
            google.accounts.oauth2.initTokenClient({
              client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
              scope: SCOPES,
              callback: (tokenResponse) => {
                setUserData({
                  token: tokenResponse.access_token,
                  loader: 0
                });
                if (tokenResponse.access_token) {
                  navigate('/');
                }
              },
            })
          );
        } 
      }, []);

    // function login(){
    //     tokenClient.requestAccessToken();
    // }

    // function handleCallbackResponse(response){ 
    //     var UserObject = jwt_decode(response.credential);
    //     setUser(UserObject);
    //     setUserData({
    //         credential: response.credential,
    //     });
    //     document.getElementById("signIn").hidden = true;
    // }

    // useEffect(() => {
    //     const google = window.google;
    //     google.accounts.id.initialize({
    //         client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    //         callback: handleCallbackResponse
    //     });
    //     google.accounts.id.renderButton(
    //         document.getElementById("signIn"),
    //         {theme: "outline", size: "large", shape:"circle"} 
    //     );
    //     setTokenClient(
    //         google.accounts.oauth2.initTokenClient({
    //             client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    //             scope: SCOPES,
    //             callback: (tokenResponse) => {
    //                 setUserData({
    //                     token: tokenResponse.access_token,
    //                     loader: 0,
    //                 });
    //                 if (tokenResponse.access_token) {
    //                     navigate('/');
    //                 }
    //             }
    //         })
    //     );
    // }, []);

    return (
        <div id={styles.login}>
            <div className={styles.left}>
                <img src={left} alt="Left Wave" />
            </div>
            <div className={styles.container1}>
                <div className={styles.row1}>
                    <div className={styles.homeimg}>
                        <img src={homeimg} alt="Peer Learning" />
                    </div>
                    <div className={styles.col-2}>
                        <h1 className={styles.title}>Peer Learning Platform</h1>
                        <h3 className={styles.description}>A platform specifically designed as an addition to Google Classroom for students to gain the best out of online education, look at solutions not just from their but also from the perspectives of their peers.</h3>
                        <h3 className={styles.description}>A platform that not only promotes education but also instills moral integrity within it’s community.</h3>

                        <div className={styles.SignInButton}>
                            <div id="signIn"></div>
                            {userData.credential ? 
                            <>
                                <button onClick={login}>Give Access to Classroom</button>
                            </> 
                        : null}
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.right}>
                <img src={right} alt="Right Wave"/>
            </div>
        </div>
    );
}

export default Login;

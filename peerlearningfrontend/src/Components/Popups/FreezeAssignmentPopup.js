import React, { useContext, useState } from "react";
import styles from "./FinalisePop.module.css";


export default function FreezeAssignmentPopup({ activities, freezeAssignment, showFreezeConfirmation, setShowFreezeConfirmation, finalGrades }) {
    
    const [isLoading, setIsLoading] = useState(false);

    function finalGradeCal(activities) {

        let finalGrades = [];
        
        activities.forEach((s) => {
          if(s.length>1){
            let grades = 0;
            for (let i = 1; i < s.length; i++) {
              let score = s[i].review_score;
              for(let j = 0; j < score.length; j++){
                grades = grades + score[j];
              }
            }
            let avgGrades = grades/((s.length-1)*s[1].review_score); 
            finalGrades[s[0].userId] = [avgGrades];
          }
          
        });

        return finalGrades;
      }

    const handleFreezeAssignment = () => {

        setIsLoading(true);
        finalGrades = finalGradeCal(activities);
        freezeAssignment();
        setIsLoading(false);
        setShowFreezeConfirmation(false);
    }

    return (
        <>
            {showFreezeConfirmation ? (
                <div id={styles.popup_wrapper} >
                    <div id={styles.whole}>
                        <div className={styles.finalize}>
                            <div id={styles.up}>
                                <p id={styles.submit}>Freeze Assignment Marks </p>
                                <div id={styles.popup_close} onClick={() => setShowFreezeConfirmation(false)}> X </div>
                            </div>
                            {isLoading ? (
                                <p id={styles.loading}>Calculating marks...</p>
                            ) : (
                                <p id={styles.reviews}>Do you want to Freeze Assignment Marks ?</p>
                            )}
                            <div className={styles.option}>
                                {isLoading ? (
                                    <button id={styles.btn} disabled>Yes</button>
                                ) : (
                                    <button id={styles.btn} onClick={handleFreezeAssignment}>Yes</button>
                                )}
                                <button id={styles.btn1} onClick={() => setShowFreezeConfirmation(false)}>No</button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    )
}


// import React, { useContext, useEffect, useState } from "react";
// import styles from "./FinalisePop.module.css";

// export default function FreezeAssignmentPopup({ freezeAssignment, showFreezeConfirmation, setShowFreezeConfirmation }) {

//     const finalMarksCal = async () => {

//         try {
//             if (userData.token) {
                
//                 await fetch(`${API}/api/addassignmentscore?peer_assignment_id=${_id}`, {
//                 method: "POST",
//                 headers: {
//                     Accept: "application/json",
//                     "Content-Type": "application/json",
//                 },
//                   body: JSON.stringify({
//                     peer_assignment_id: _id,
//                   }),
//                 })
//                   .then((res) => res.json())
//                   .then((res) => {
//                     console.log(res);
//                   });

//               }
//           } catch (error) {
//             console.error('Error:', error);
//           }
//     }

//     return (
//         <>
//             {
//                 showFreezeConfirmation ? <div id={styles.popup_wrapper} >
//                     <div id={styles.whole}>
//                         <div className={styles.finalize}>
//                             <div id={styles.up}>
//                                 <p id={styles.submit}>Freeze Assignment Marks </p>
//                                 <div id={styles.popup_close} onClick={() => setShowFreezeConfirmation(false)}> X </div>
//                             </div>
//                             <p id={styles.reviews}>Do you want to Freeze Assignment Marks ?</p>
//                             <div className={styles.option}>
//                                 <button id={styles.btn} onClick={(e) => { setShowFreezeConfirmation(false); freezeAssignment() }}>Yes</button>
//                                 <button id={styles.btn1} onClick={() => setShowFreezeConfirmation(false)}>No</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div> : null
//             }

//         </>
//     )
// }
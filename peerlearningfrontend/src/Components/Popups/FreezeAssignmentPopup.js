import React, { useContext, useState } from "react";
import AuthContext from "../../AuthContext";
import { API } from "../../config";
import styles from "./FinalisePop.module.css";


export default function FreezeAssignmentPopup({ assg, activities, freezeAssignment, showFreezeConfirmation, setShowFreezeConfirmation }) {
    
    const { userData } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    function finalGradeCal(activities) {
        
        let final_grades = [];
        
        activities.forEach((s) => {
          if(s.length>1){
            let grades = 0;
            for (let i = 1; i < s.length; i++) {
              let score = s[i].review_score;
              for(let j = 0; j < score.length; j++){
                grades = grades + score[j];
              }
            }
            let avgGrades = grades/(s.length-1); 
            final_grades[s[0].userId] = parseFloat(avgGrades.toFixed(2));
          }
          
        });

        return final_grades;
    }


    const finalMarksStore = async (index, grade) => {
        try {
            if (userData.token) {
                await fetch(`${API}/api/addassignmentscore?User_id=${index}&Assignment_id=${assg._id}&final_grade=${grade}`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        User_id: index,
                        Assignment_id: assg._id,
                        final_grade: grade,
                    }),
                })
                .then((res) => res.json())
                .then((res) => {
                    console.log(res);
                });
            }
        } catch (error) {
            console.error('Error:', error);
            
        }
    }

    const handleFreezeAssignment = async () => {

        setIsLoading(true);
    
        try {
            
            let final_grades = finalGradeCal(activities);
            //setFinalGrades(final_grades);
            
            const gradesArray = Object.entries(final_grades); 

            await Promise.all(gradesArray.map((entry) => finalMarksStore(entry[0], entry[1])));

            freezeAssignment();
            setShowFreezeConfirmation(false);
            
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }

        
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



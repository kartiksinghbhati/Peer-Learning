import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../AuthContext";
import { API } from "../../config";
import styles from "./FinalisePop.module.css";

export default function StopPeerLearningPopup({ assg, finalGrades, stopPeerLearning, showStopConfirmation, setShowStopConfirmation }) {

    const { userData } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    
    // const finalMarksCal = async (grade, index) => {
    //     try {
    //         console.log("bbbbb");
    //         if (userData.token) {
    //             console.log("aaaaaa");

    //             await fetch(`${API}/api/addassignmentscore?Assignment_id=${assg._id}`, {
    //                 method: "POST",
    //                 headers: {
    //                     Accept: "application/json",
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify({
    //                     User_id: index,
    //                     Assignment_id: assg._id,
    //                     final_grade: grade,
    //                 }),
    //             })
    //             .then((res) => res.json())
    //             .then((res) => {
    //                 console.log("final grades to db");
    //                 console.log(res);
                    
    //             });
    //         }
    //     } catch (error) {
    //         console.error('Error:', error);
            
    //     }
    // }

    const handleStopAssignment =  () => {
        setIsLoading(true);
    
        try {
            // Use Promise.all to wait for all async operations to complete
            //await Promise.all(finalGrades.map((grade, index) => finalMarksCal(grade, index)));
    
            // All requests are completed here
            stopPeerLearning();
            setShowStopConfirmation(false);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    }
    

    // const handleStopAssignment = () => {

    //     setIsLoading(true);
        
    //      console.log("before");

    //     console.log(finalGrades);

    //     finalGrades.forEach((grade, index) => {
    //         finalMarksCal(grade, index);
    //     });

    //      console.log("after");

    //     stopPeerLearning();
        
    //     setIsLoading(false);

    //     setShowStopConfirmation(false);
    // }

    return (
        <>
            {showStopConfirmation ? (
                <div id={styles.popup_wrapper} >
                    <div id={styles.whole}>
                        <div className={styles.finalize}>
                            <div id={styles.up}>
                                <p id={styles.submit}> Stop Peer Assignment </p>
                                <div id={styles.popup_close} onClick={() => setShowStopConfirmation(false)}> X </div>
                            </div>
                            {isLoading ? (
                                <p id={styles.loading}>Wait...</p>
                            ) : (
                                <p id={styles.reviews}> Do you want to stop peer assignment ? </p>
                            )}
                            <div className={styles.option}>
                                {isLoading ? (
                                    <button id={styles.btn} disabled>Yes</button>
                                ) : (
                                    <button id={styles.btn} onClick={handleStopAssignment}>Yes</button>
                                )}
                                <button id={styles.btn1} onClick={() => setShowStopConfirmation(false)}>No</button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    )
    
    // return (
    //     <>
    //         {
    //             showStopConfirmation ? <div id={styles.popup_wrapper} >
    //                 <div id={styles.whole}>
    //                     <div className={styles.finalize}>
    //                         <div id={styles.up}>
    //                             <p id={styles.submit}> Stop Peer Assignment </p>
    //                             <div id={styles.popup_close} onClick={() => setShowStopConfirmation(false)}> X </div>
    //                         </div>
    //                         <p id={styles.reviews}>Do you want to stop peer assignment ?</p>
    //                         <div className={styles.option}>
    //                             <button id={styles.btn} onClick={(e) => { setShowStopConfirmation(false); stopPeerLearning() }}>Yes</button>
    //                             <button id={styles.btn1} onClick={() => setShowStopConfirmation(false)}>No</button>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div> : null
    //         }

    //     </>
    // )
}
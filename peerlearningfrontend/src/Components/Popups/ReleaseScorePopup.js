import React from "react";
import styles from "./FinalisePop.module.css";

export default function ReleaseScorePopup({ releaseScore, showReleaseConfirmation, setShowReleaseConfirmation }) {

    return (
        <>
            {
                showReleaseConfirmation ? <div id={styles.popup_wrapper} >
                    <div id={styles.whole}>
                        <div className={styles.names}>
                            <div id={styles.up}>
                                <p id={styles.submit}> Release Scores </p>
                                <div id={styles.popup_closed} onClick={() => setShowReleaseConfirmation(false)}> X </div>
                            </div>
                            <p id={styles.reviews}> Do you want to Release Scores ?  </p>
                            <div className={styles.option}>
                                <button id={styles.btn} onClick={(e) => { setShowReleaseConfirmation(false);  releaseScore();}}>Yes</button>
                                <button id={styles.btn1} onClick={() => setShowReleaseConfirmation(false)}>No</button>
                            </div>
                        </div>
                    </div>
                </div> : null
            }

        </>
    )
}
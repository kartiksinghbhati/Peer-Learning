import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../AuthContext";
import { API } from "../../config";
import styles from "./FinalisePop.module.css";

export default function StopPeerLearningPopup({ stopPeerLearning, showStopConfirmation, setShowStopConfirmation }) {

    return (
        <>
            {
                showStopConfirmation ? <div id={styles.popup_wrapper} >
                    <div id={styles.whole}>
                        <div className={styles.finalize}>
                            <div id={styles.up}>
                                <p id={styles.submit}>Stop Peer Assignment </p>
                                <div id={styles.popup_close} onClick={() => setShowStopConfirmation(false)}> X </div>
                            </div>
                            <p id={styles.reviews}>Do you want to stop peer assignment ?</p>
                            <div className={styles.option}>
                                <button id={styles.btn} onClick={(e) => { setShowStopConfirmation(false); stopPeerLearning() }}>Yes</button>
                                <button id={styles.btn1} onClick={() => setShowStopConfirmation(false)}>No</button>
                            </div>
                        </div>
                    </div>
                </div> : null
            }

        </>
    )
}
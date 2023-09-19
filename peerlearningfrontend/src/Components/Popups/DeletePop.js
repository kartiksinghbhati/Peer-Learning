import React, { useContext, useEffect, useState } from "react";
// import AuthContext from "../../AuthContext";
import { API } from "../../config";
import styles from "./FinalisePop.module.css";

export default function DeletePopup({ peerAssignmentId, onDelete, showDeleteConfirmation, setShowDeleteConfirmation }) {
    //const history = useHistory();
    // const { userData, setUserData, setOpen, setMessage } = useContext(
    //     AuthContext
    // );

    const handleDeletePeerAssigment = async () => {

        // console.log("delete");

        try {
          await fetch(`${API}/api/deleteassignment?peer_assignment_id=${peerAssignmentId}`, {
            method: "DELETE",
          });

          onDelete(peerAssignmentId);
    
        } catch (err) {
          console.log(err);
        }
      }

    return (
        <>
            {
                showDeleteConfirmation ? <div id={styles.popup_wrapper} >
                    <div id={styles.whole}>
                        <div className={styles.finalize}>
                            <div id={styles.up}>
                                <p id={styles.submit}>Delete Peer Assignment </p>
                                <div id={styles.popup_close} onClick={() => setShowDeleteConfirmation(false)}> X </div>
                            </div>
                            <p id={styles.reviews}>Are you sure you want to delete this peer assignment?</p>
                            <div className={styles.option}>
                                <button id={styles.btn} onClick={(e) => { setShowDeleteConfirmation(false); handleDeletePeerAssigment() }}>Yes</button>
                                <button id={styles.btn1} onClick={() => setShowDeleteConfirmation(false)}>No</button>
                            </div>
                        </div>
                    </div>
                </div> : null
            }

        </>
    )
}
import React from "react";
import "./PopUp.css";
import { API } from "../../config";

export default function Self({ wrapperValue, SetWrapperValue, self, marks, setSelf }) {

    const handleSelfScoreChange = (k, e) => {
        let { value, min, max } = e.target;
        value = Math.max(Number(min), Math.min(Number(max), Number(value)));
        const s = self;
        s.review_score[k] = value;
        setSelf({ ...self });
    };

    const saveMarks = async (row) => {
        console.log(row);

        await fetch(`${API}/api/reviewassignment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                peer_activity_id: row._id,
                review_score: row.review_score,
                reviewer_comment: row.reviewer_comment,
            }),
        })
            .then((res) => res.json())
            .then(
                (res) => {
                    SetWrapperValue(false);
                },
                (err) => {

                    alert("Some thing went wrong while saving review");
                    SetWrapperValue(false);
                }
            );
    };

    return (
        <>
            {
                wrapperValue ? <div id="popup_wrapper" >
                    <div id="whole">
                        <div className="matrix">
                            <div id="up">
                                <p id="peer1"> Self Evaluation</p>
                                <div id="popup_close" onClick={() => SetWrapperValue(false)}> X </div>
                            </div>
                            <div className="box1">
                                {self.review_score.map((active, k) => (
                                    <div className="main1" key={k}>
                                        <button id="ques">Question {k + 1}</button>
                                        <input
                                            id="score"
                                            type="number"
                                            value={self.review_score[k]}
                                            min={0}
                                            max={marks[k]}
                                            onChange={(e) => handleSelfScoreChange(k, e)} />
                                    </div>
                                ))}
                            </div>
                            <div id="button">
                                <button id="saveButton" onClick={() => saveMarks(self)}>Save</button>
                                <button id="cancelButton" onClick={() => SetWrapperValue(false)}>Cancel</button>
                            </div>

                        </div>
                    </div>
                </div> : null
            }

        </>
    )
}
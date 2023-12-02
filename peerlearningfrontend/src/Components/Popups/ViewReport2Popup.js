import React from "react";
import "./PopUp.css";

export default function ViewReport2Popup({ viewReport2, setViewReport2, index, marks, activities}) {

    return (
        <>
            {
                viewReport2 ? <div id="popup_wrapper" >
                    <div id="whole">
                        <div className="matrix">
                            <div id="up">
                                <p id="peer1"> Scoring Matrix</p>
                                <div id="popup_close" onClick={() => setViewReport2(false)}> X </div>
                            </div>
                            <div className="box1">
                                
                                {activities[index].review_score.map((score, k) => (
                                    <div className="main1" key={k}>
                                        <button id="ques1">Question {k + 1}</button>
                                        <button id="score12">{score}/{marks[k]}</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div> : null
            }

        </>
    )
}
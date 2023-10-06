import React from "react";
import "./PopUp.css";

export default function ViewReport1Popup({ viewReport1, setViewReport1, index, marks, youractivities}) {


    return (
        <>
            {
                viewReport1 ? <div id="popup_wrapper" >
                    <div id="whole">
                        <div className="matrix">
                            <div id="up">
                                <p id="peer1"> Scoring Matrix</p>
                                <div id="popup_close" onClick={() => setViewReport1(false)}> X </div>
                            </div>
                            <div className="box1">
                                
                                {youractivities[index].review_score.map((score, k) => (
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
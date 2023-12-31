import React from 'react'
import { NavLink } from 'react-router-dom';
import '../Todo/todostyle.css';
import { useState } from 'react';
import Arrow from '../Todo/images/Arrow.svg';
import bottom from '../Images/Bottom.png'
import Assignment from '../Todo/images/Assignment.svg';

const Done = () => {
    const [Value, setValue] = useState(true);
    return (
        <>
            <div className="list">
                <NavLink activeClassName='menu_active' className="nav-link anchorlink" to="/Todo">Assigned</NavLink>
                <NavLink activeClassName='menu_active' className="nav-link anchorlink" to="/Missing">Missing</NavLink>
                <NavLink activeClassName='menu_active' className="nav-link anchorlink" to="/Done">Done</NavLink>
            </div>
            <div className="assigned1">
                <div id="week1">
                    <p>Done Early</p>
                    <div id="Arrow1">
                        <img src={Arrow} onClick={() => setValue(!Value)} />
                    </div>
                </div>
            </div>
            <div className="assigned">
                <div className="left-side">
                    <div className="Image"><img src={Assignment} id="picAssign" /></div>
                    <div>
                        <div className="sec"><p>Lab 9</p></div>
                        <div className="sub"><p>CS 303 (Computer Networks)</p></div>
                    </div>
                </div>
                <div className="time"><p id="time2">Today 6:00 PM</p></div>
            </div>
            <div className="assigned">
                <div className="left-side">
                    <div className="Image"><img src={Assignment} id="picAssign" /></div>
                    <div>
                        <div className="sec"><p>Lab 9</p></div>
                        <div className="sub"><p>CS 303 (Computer Networks)</p></div>
                    </div>
                </div>
                <div className="time"><p id="time2">Today 6:00 PM</p></div>
            </div>
            <div className="assigned1">
                <div id="week3">
                    <p>This Week</p>
                    <div id="Arrow1">
                        <img src={Arrow} onClick={() => setValue(!Value)} />
                    </div>
                </div>
            </div>
            <div className="assigned">
                <div className="left-side">
                    <div className="Image"><img src={Assignment} id="picAssign" /></div>
                    <div>
                        <div className="sec"><p>Lab 9</p></div>
                        <div className="sub"><p>CS 303 (Computer Networks)</p></div>
                    </div>
                </div>
                <div className="time"><p id="time2">Today 6:00 PM</p></div>
            </div>
            <div className="assigned">
                <div className="left-side">
                    <div className="Image"><img src={Assignment} id="picAssign" /></div>
                    <div>
                        <div className="sec"><p>Lab 9</p></div>
                        <div className="sub"><p>CS 303 (Computer Networks)</p></div>
                    </div>
                </div>
                <div className="time"><p id="time2">Today 6:00 PM</p></div>
            </div>
            <div className="assigned1">
                <div id="week3">
                    <p>Last Week</p>
                    <div id="Arrow1">
                        <img src={Arrow} onClick={() => setValue(!Value)} />
                    </div>
                </div>
            </div>
            <div className="assigned">
                <div className="left-side">
                    <div className="Image"><img src={Assignment} id="picAssign" /></div>
                    <div>
                        <div className="sec"><p>Lab 9</p></div>
                        <div className="sub"><p>CS 303 (Computer Networks)</p></div>
                    </div>
                </div>
                <div className="time"><p id="time2">Today 6:00 PM</p></div>
            </div>
            <div className="assigned">
                <div className="left-side">
                    <div className="Image"><img src={Assignment} id="picAssign" /></div>
                    <div>
                        <div className="sec"><p>Lab 9</p></div>
                        <div className="sub"><p>CS 303 (Computer Networks)</p></div>
                    </div>
                </div>
                <div className="time"><p id="time2">Today 6:00 PM</p></div>
            </div>
            <div className="assigned1">
                <div id="week3">
                    <p>Earlier</p>
                    <div id="Arrow2">
                        <img src={Arrow} onClick={() => setValue(!Value)} />
                    </div>
                </div>
            </div>
            <div className="assigned">
                <div className="left-side">
                    <div className="Image"><img src={Assignment} id="picAssign" /></div>
                    <div>
                        <div className="sec"><p>Lab 9</p></div>
                        <div className="sub"><p>CS 303 (Computer Networks)</p></div>
                    </div>
                </div>
                <div className="time"><p id="time2">Today 6:00 PM</p></div>
            </div>
            <div className="assigned">
                <div className="left-side">
                    <div className="Image"><img src={Assignment} id="picAssign" /></div>
                    <div>
                        <div className="sec"><p>Lab 9</p></div>
                        <div className="sub"><p>CS 303 (Computer Networks)</p></div>
                    </div>
                </div>
                <div className="time"><p id="time2">Today 6:00 PM</p></div>
            </div>
            {<img src={bottom} alt="Image" className="btm" />}
        </>
    )
}

export default Done

import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Resolve.module.css';
import { useState } from 'react';
import Arrow from '../images/Arrow.svg';
import bottom from '../../Images/Bottom.png'
import Card from '../Card/Card';

const Resolved = () => {
    const [Value, setValue] = useState(true);

    const navigate = useNavigate();

    const OnUnderReview = () => {
        navigate('/Query');
    }

    const OnResolved = () => {
        navigate('/Resolved');
    }

    return (
        <>
            <div className={styles.querytopBtn}>
                <span onClick={OnUnderReview} className={styles.queryu}>Under Review</span>
                <span onClick={OnResolved} className={styles.querynotu}>Resolved</span>
            </div>

            <div className={styles.assigned1}>
                <div id="week1">
                    <p>This Week</p>
                    <div id="Arrow1">
                        <img src={Arrow} onClick={() => setValue(!Value)} />
                    </div>
                </div>
            </div>

            <Card/>
            <Card/>
            <Card/>

            <div className={styles.assigned1}>
                <div id="week2">
                    <p>Last Week</p>
                    <div id="Arrow1">
                        <img src={Arrow} onClick={() => setValue(!Value)} />
                    </div>
                </div>
            </div>

            <Card/>
            <Card/>


            <div className={styles.assigned1}>
                <div id="week3">
                    <p>Earlier</p>
                    <div id="Arrow1">
                        <img src={Arrow} onClick={() => setValue(!Value)} />
                    </div>
                </div>
            </div>
            <Card/>
            <Card/>
            <Card/>

            {<img src={bottom} alt="Image" className="btm" />}
        </>
    )
}

export default Resolved

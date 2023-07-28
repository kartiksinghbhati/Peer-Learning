import React, { useState } from 'react'
import styles from './UnderReview.module.css';
import Arrow from '../images/Arrow.svg';
import bottom from '../../Images/Bottom.png'
import Card from '../Card/Card';

const UnderReview = () => {
    const [Value, setValue] = useState(true);
    return (
        <>
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

            <div className={styles.assigned1}>
                <div id="week3">
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
                    <div id="Arrow2">
                        <img src={Arrow} onClick={() => setValue(!Value)} />
                    </div>
                </div>
            </div>
            <Card/>
            <Card/>
            <Card/>
            {<img src={bottom} alt="Image" className={styles.btm} />}
        </>
    )
}

export default UnderReview

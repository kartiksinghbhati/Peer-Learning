import React from 'react'

import styles from './Card.module.css';

import Assignment from '../images/Assignment.svg';

const Card = () => {
    
    return (
        <>   
            <div className={styles.assigned}>
                <div className={styles.leftside}>
                    <div className={styles.Image}><img src={Assignment} id="picAssign" /></div>
                    <div>
                        <div className={styles.sec}><p>Lab 9</p></div>
                        <div className={styles.sub}><p>CS 303 (Computer Networks)</p></div>
                    </div>
                </div>
                <div className={styles.time}><p id="time1">Today 6:00 PM</p></div>
            </div>
        </>
    )
}

export default Card

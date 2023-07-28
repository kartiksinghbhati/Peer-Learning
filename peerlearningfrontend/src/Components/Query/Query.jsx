import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Query.module.css';
import UnderReview from './UnderReview/UnderReview';


const Query=()=>{

    const navigate = useNavigate();

    const OnUnderReview = () => {
        navigate('/Resolved');
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
        <UnderReview/> 
    </>
    )
}
export default Query;
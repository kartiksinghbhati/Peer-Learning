import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import styles from './Home.module.css';
import CourseCard from '../CourseCard/CourseCard';
import AuthContext from '../../AuthContext';
import Spinner from '../Spinner/Spinner';
import bottomimg  from '../Images/Bottom.png';
import calendarimg  from '../Images/Calendar.png';
import queryimg  from '../Images/Query.png';
import todoimg  from '../Images/To-do.png';



const Home = () => {

  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [spin, setSpin] = useState(true);
  const { userData, setUserData } = useContext(AuthContext);


  const myFunction1 = async () =>{
    if (!userData.token) {
      navigate("/login");
    } 
  }
  useEffect(() => {
    myFunction1();
  }, []);


  const loadData = async () =>{
    if (userData.token) {
      setUserData((u) => ({ ...u, loader: u.loader + 1 }));
      await fetch("https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE", {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${userData.token}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setUserData((u) => ({ ...u, loader: u.loader - 1 }));
          setCourses(res.courses);
          //console.log(res.courses);
          setSpin(false);
        });
  
    }
  }

  useEffect(() => { loadData() }, [userData.token]);



  return (
    <>
    {
      spin ? <Spinner/> :
      <div className="home">
        <div className="home1">
          <div className="head">
            <button className="btm3"><img src={queryimg} alt="Queries" /> Queries</button>
            <Link to="/Todo">
              <button className="btm3"><img src={todoimg} alt="Todos" /> To-Do</button>
            </Link>
            <Link to="/Calendar">
              <button className="btm3"><img src={calendarimg} alt="Calendar"/> Calendar</button>
            </Link>
          </div>
        </div>
        <div className={styles.home2}>

          {courses ? courses.map((data,index) => (
            <CourseCard key={data.id} data={data} index={index} />  //image={imgArr[index % 5]}
          )) : null}

        </div>
        {<img src={bottomimg} alt="bottomimg" className="bottom" />}
      </div>
    }
  </>
  )
}

export default Home

import React, { useContext, useEffect, useState } from "react";
import "./teacherDashboard.css";
import AuthContext from "../../../AuthContext";
import Spinner from "../../Spinner/Spinner";
import TeacherProfile from "./comp/TeacherProfile/teacherProfile";
import SearchBar from "./comp/searchBar/searchBar";
import TeacherCourse from "./comp/Course/Course";


function TeacherDashboard() {

  const { user, userData, setUserData } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [spin, setSpin] = useState(true);

  const loadData = async () => {
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
          setSpin(false);
        });
    }
  }

  useEffect(() => { loadData() }, [userData.token]);

  return (
    spin ? <Spinner /> :
      <div className="teacherDashboardContainer">
        <TeacherProfile />
        <SearchBar />
        <div className="student_course">
          <h3>Courses</h3>

          {courses ? courses.map((data, index) => (
            <TeacherCourse key={data.id} data={data} index={index} />
          )) : null}
        </div>
      </div>
  );
}

export default TeacherDashboard;

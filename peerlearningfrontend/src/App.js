import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './Components/Login/Login';
import Home from "./Components/Home/Home";
import StudentCoursePage from "./Components/Student/StudentCoursePage";
import StudentAssignmentPage1 from "./Components/Student/StudentAssignmentPage1";
import StudentAssignmentPage2 from "./Components/Student/StudentAssignmentPage2";
import TeacherCoursePage from "./Components/Teacher/TeacherCoursePage";
import TeacherAssignmentPage1 from "./Components/Teacher/TeacherAssignmentPage1";
import TeacherAssignmentPage2 from "./Components/Teacher/TeacherAssignmentPage2";
import TeacherPeople from "./Components/People/TeacherPeople";
import Calendar from './Components/Calendar/Calendar';
import Help from './Components/Help/Help';
import TodoList from './Components/Todo/TodoList';
import Missing from './Components/Todo/Missing';
import Done from './Components/Todo/Done';
import Query from './Components/Query/Query';
import AuthContext from './AuthContext';
import { ShowNavbar } from "./Components/ShowNavbar/ShowNavbar";
import StudentDashboard from "./Components/Dashboard/Student/StudentDashboard";



function App() {

  const [user, setUser] = useState({});
  const [course, setCourse] = useState({});
  const [assignment, setAssignment] = useState({});
  const [role, setRole] = useState("student");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [userData, setUserData] = useState({
    credential: undefined,
    token: undefined,
    loader: 0,
  });

  return (

    <div>

      <AuthContext.Provider value={{ user, setUser, userData, setUserData, course, setCourse, assignment, setAssignment, role, setRole, open, setOpen, message, setMessage }}>



        <Router>
          <ShowNavbar/>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/dashboard/student" element={<StudentDashboard />} />
            <Route exact path="/Calendar" element={<Calendar />} />
            <Route exact path="/Help" element={<Help />} />
            <Route exact path="/Todo" element={<TodoList />} />
            <Route exact path="/Missing" element={<Missing />}/>
            <Route exact path="/Done" element={<Done />}/>
            <Route exact path="/Query" element={<Query />} />
            <Route exact path="/scourse/:course_id" element={<StudentCoursePage />} />
            <Route exact path="/tcourse/:course_id" element={<TeacherCoursePage />} />
            <Route exact path="/people/:course_id" element={<TeacherPeople />} />
            <Route exact path="/acourse/:course_id/:assignment_id" element={role === "student" ? <StudentAssignmentPage2 /> : <TeacherAssignmentPage2 />} />
            <Route exact path="/inacourse/:course_id/:assignment_id" element={role === "student" ? <StudentAssignmentPage1 /> : <TeacherAssignmentPage1 />} />
          </Routes>
        </Router>

      </AuthContext.Provider>

    </div>
  );
}

export default App;

import React, { useState,  useEffect, useContext } from 'react';
import { ReactComponent as Hamburger } from '../Navbar/Images/hamburger.svg';
import { ReactComponent as HelpIcon } from '../Navbar/Images/Help.svg';
import { ReactComponent as CalendarIcon } from '../Navbar/Images/Calendar.svg';
import { ReactComponent as QueryIcon } from '../Navbar/Images/Query.svg';
import { ReactComponent as TodoIcon } from '../Navbar/Images/To-do.svg';
import { Link, useNavigate } from "react-router-dom";
import './Nav.css';
import { IconContext } from 'react-icons';
import * as AiIcons from 'react-icons/ai';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Logout from '@mui/icons-material/Logout';
import AuthContext from '../../AuthContext';

export default function Navbar(props) {

  const navigate = useNavigate();

  const { user, userData, setUserData, setCourse } = useContext(AuthContext);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [Value, setValue] = useState(true);
  const [courses, setCourses] = useState([]);

   // Function to toggle the sidebar open/close state
   const showSidebar = (event) => {
    setSidebarOpen(!sidebarOpen);
  };


  const handleLogout = () => {
    setUserData({
      credential: undefined,
      token: undefined,
      loader: 0,
    });
    navigate('/login');
  }


  const truncate = (str) => {
    if (str.length>25) {
      let substr = str.substring(0,25);
      return substr + "...";
    }
    else{
      return str;
    }
  }


  useEffect(() => {
    if (userData.token) {
      setUserData((u) => ({ ...u, loader: u.loader + 1 }));
      fetch("https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE", {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${userData.token}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setUserData((u) => ({ ...u, loader: u.loader - 1 }));
          setCourses(res.courses);
        });
  
    }
  
  }, [userData.token]);

  const handlesubmitcourse = async (item) => {
    try {
      setCourse(item);
      
      if (userData.token) {
        await fetch(`https://classroom.googleapis.com/v1/courses/${item.id}/teachers`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${userData.token}`,
          },
        })
          .then((res) => res.json())
          .then((res) => {
              var len = res.teachers.length;
              res.teachers.forEach((teacher) => {
                if (teacher.profile.emailAddress === user.email) {
                  navigate(`/tcourse/${item.id}`);
                }
                else{
                  navigate(`/scourse/${item.id}`);
                }
              });
          });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (

    <>

      <IconContext.Provider value={{ color: '#fff' }}>

        <div className='navbar container-fluid'>

          <Link to='#' className='menu-bars'>
            <Hamburger onClick={showSidebar} />
          </Link>
          <Link to='/'>
            <h4 className="navbar-title-name">{props.text}</h4>
          </Link>

          <div className="navbar-right-side-icon">
            <Link to="/Help" className="help_page_icon" data-toggle="tooltip" data-placement="botom" title="Help"><HelpIcon/></Link>
            <Link  data-toggle="tooltip" data-placement="botom" title={user.name}>
            <img className="profile_user_name" src={user.picture} alt='userimg' onClick={() => setValue(!Value)}></img>
            </Link>

            <MenuItem className={Value ? "nav_hide" : "nav_show"} onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </div>
        </div>


        <nav className={sidebarOpen ? 'nav-menu active' : 'nav-menu'}>
          
          <ul className='nav-menu-items' onClick={showSidebar}>

            <li className='navbar-toggle'>
              <Link to='#' className='menu-closebars'>
                <AiIcons.AiOutlineClose  className="closebars"/>
              </Link>
            </li>

            <li className="top-sidebar-icon">
            <CalendarIcon/>
            <Link to="/Calendar">
              <p className="top-li-elements">Calendar</p>
            </Link>
            </li>

            <li className="top-sidebar-icon">
            <TodoIcon/>
            <Link to="/Todo">
              <p className="top-li-elements">To-do</p>
            </Link>
            </li>
            
            <li className="top-sidebar-icon">
            <HelpIcon/>
            <Link to="/Help">
              <p className="top-li-elements">Help</p>
            </Link>
            </li>

            <li className="top-sidebar-icon">
            <QueryIcon/>
            <Link to="/Query">
              <p className="top-li-elements">Query</p>
            </Link>
            </li>

            <hr className="hr_line"></hr>

            {courses.map((item, index) => {
              return (
                <li key={index} onClick={() => handlesubmitcourse(item)}>
                  <div className="list-elements">
                  <p className="first_letter">{item.name.charAt(0)}</p>
                  <Link className="sidebar_name" to={item.path}>
                    <span className="sp1">{truncate(item.name)}</span>
                  </Link>
                  </div>
                
                </li>
              );
            })}

          </ul>
        </nav>

        </IconContext.Provider>
    </>
  )
}

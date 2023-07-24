import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../Navbar/Navbar';

export const ShowNavbar = ({children}) => {

    const location = useLocation();
    const [showNavbar,  setShowNavbar] = useState(false);
    const [navbarText, setNavbarText] = useState('');

    useEffect(() => {
        if(location.pathname === '/login'){
            setShowNavbar(false);
        }
        else{
            setShowNavbar(true);
            switch (location.pathname) {
              case '/dashboard':
                setNavbarText('Dashboard');
                break;
              default:
                setNavbarText('Peer Learning');
            }
        }
    }, [location])
  return (
    <div>{showNavbar && <Navbar text={navbarText} />}</div>
  )
}

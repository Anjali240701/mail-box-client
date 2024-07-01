import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { authActions } from '../../store/auth-reducer';
import LogOut from './LogOut';
import classes from "./Header.module.css";

const Header = () => {
  const isLogin = useSelector(state => state.authentication.isLogin);
  const inboxMails = useSelector(state => state.compose.fetchMail);
  const dispatch = useDispatch();
  const history = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (inboxMails) {
      let count = 0;
      Object.keys(inboxMails).forEach((mail) => {
        if (inboxMails[mail].read === false) {
          count = count + 1;
          console.log(count);
          setUnreadCount(count);
        }
      });
    }
  }, [inboxMails]);

  const logOutHandler = () => {
    dispatch(authActions.logout());
    history('/auth');
  };

  return (
    <header className={classes.header}>
      <img src='https://freepngimg.com/download/icon/iphone/64645-icons-computer-email-address-png-file-hd.png' alt='mail'/>
      <h1>Mail-Box</h1>
      <nav>
        <ul>
          <li>
            <NavLink to="/"  className={({ isActive }) => isActive ? classes.active : undefined} exact >
              Home
            </NavLink>
          </li>
          
          {isLogin && (
            <li>
              <NavLink to='/compose'
                className={({ isActive }) => isActive ? classes.active : undefined}>
                Compose
              </NavLink>
            </li>
          )}
          {isLogin && (
            <li>
              <NavLink to="/inbox"  
                className={({ isActive }) => isActive ? classes.active : undefined} >
                Inbox
                {unreadCount > 0 && <span>{unreadCount} Unread</span>}
              </NavLink>
            </li>
          )}   
          {isLogin && (
            <li>
              <NavLink to="/sent"  
                className={({ isActive }) => isActive ? classes.active : undefined} >
                Sent Mails
              </NavLink>
            </li>
          )}
          {isLogin && (
            <LogOut onClick={logOutHandler}>
              LogOut
            </LogOut>
          )}      
        </ul>
      </nav>
    </header>
  );
};

export default Header;

import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import Header from './Components/Layout/Header';
import AuthPage from './Components/Pages/AuthPage';
import HomePage from './Components/Pages/HomePage';
import InboxPage from './Components/Pages/InboxPage';
import ComposeMailPage from './Components/Pages/ComposeMailPage';
import SentPage from './Components/Pages/SentPage';

function App() {
  const isLogin = useSelector(state => state.authentication.isLogin);
  
  return (
    <Fragment>
      <Header />
      <main>
        <Routes>
          <Route path='/' element={isLogin ? <HomePage /> : <Navigate to='/auth' />} />
          <Route path='/auth' element={!isLogin ? <AuthPage /> : <Navigate to='/' />} />
          <Route path='/compose' element={isLogin ? <ComposeMailPage /> : <Navigate to='/auth' />} />
          <Route path='/inbox' element={isLogin ? <InboxPage /> : <Navigate to='/auth' />} />
          <Route path='/sent' element={isLogin ? <SentPage /> : <Navigate to='/auth' />} />
        </Routes>
      </main>
    </Fragment>
  );
}

export default App;
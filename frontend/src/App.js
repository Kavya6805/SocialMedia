import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate, matchPath } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Home from './components/Home';
import Sidebar from './components/Sidebar';
import ProfilePage from './components/ProfilePage';
import UserProfile from './components/UserProfile';
import PrivateProfilePage from './components/PrivateProfilePage';
import DirectMessage from './components/DirectMessage';
import Settings from './components/Settings';
import { useSelector } from 'react-redux';
import SendPasswordResetEmail from './components/SendPasswordResetEmail';
import InputPost, { PostOnClick } from './components/InputPost';

// Sample suggestions data
const suggestions = [
  { id: 1, name: 'John Doe', mutualFriends: 10, img: 'https://via.placeholder.com/50', isPrivate: false },
  { id: 2, name: 'Jane Smith', mutualFriends: 8, img: 'https://via.placeholder.com/50', isPrivate: true },
  { id: 3, name: 'Michael Johnson', mutualFriends: 5, img: 'https://via.placeholder.com/50', isPrivate: false },
];

const AppContent = ({ darkMode, setDarkMode }) => {
  const { access_token } = useSelector(state => state.auth)
  console.log(access_token);
  const validRoutes = ['/', '/directmessage', '/dashboard', '/user/profile/:userId', '/user/profile', '/private-profile/:id', '/settings'];
  const location = useLocation();
  const isSidebarVisible = validRoutes.some(route => matchPath(route, location.pathname));
  
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        bgcolor: darkMode ? '#333' : '#fafafa',
        color: darkMode ? '#fff' : '#000',
      }}
    >
      {isSidebarVisible && (
        <Box
          sx={{
            width: { xs: '60px', sm: '250px' },
            position: 'fixed',
            height: '100vh',
            bgcolor: darkMode ? '#444' : '#fff',
            zIndex: 1000,
            transition: 'width 0.3s',
          }}
        >
          <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />
        </Box>
      )}
      <Box
        sx={{
          flex: 1,
          marginLeft: isSidebarVisible ? { xs: '60px', sm: '250px' } : '0px',
          overflowY: 'auto',
          padding: 2,
          boxSizing: 'border-box',
          width: '100%',
          transition: 'margin-left 0.3s',
        }}
      >
        <Routes>
          <Route path="/">
            <Route path="signup" element={!access_token ? <SignUp /> : <Navigate to='/' />} />
            <Route path="signin" element={!access_token ? <SignIn /> : <Navigate to='/' />} />
            <Route path="" element={
              access_token ? (
                <Home darkMode={darkMode} />
              ) : (
                location.pathname === '/signin' || location.pathname === '/signup' ? (
                  location.pathname === '/signin' ? <SignIn /> : <SignUp />
                ) : (
                  <Navigate to="/signin" />
                )
              )
            } />
            <Route path="user/profile" element={<ProfilePage darkMode={darkMode} />} />
            <Route path="directmessage" element={<DirectMessage darkMode={darkMode} />} />
            <Route path="user/profile/:userId" element={<ProfilePage darkMode={darkMode}  />} />
            {/* suggestions={suggestions} */}
            <Route path="private-profile/:id" element={<PrivateProfilePage darkMode={darkMode} suggestions={suggestions} />} />
            <Route path="sendpasswordresetemail" element={<SendPasswordResetEmail />} />
            <Route path='settings' element={<Settings darkMode={darkMode} />} />
            <Route path='post/create' element={<PostOnClick />} />
          </Route>
          <Route path="*" element={<h1>Error 404 Page not found !!</h1>} />
        </Routes>
      </Box>
    </Box>
  );
};
{/* <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="contact" element={<Contact />} />
            <Route path="login" element={!access_token ? <LoginReg /> : <Navigate to='/dashboard' />} />
            <Route path="register" element={!access_token ? <LoginReg /> : <Navigate to='/dashboard' />} />
            <Route path="sendpasswordresetemail" element={<SendPasswordResetEmail />} />
            <Route path="user/reset/:id/:token" element={<ResetPassword />} />
            <Route path="profile" element={access_token ? <Profile /> : <Navigate to="/login" />} />
            <Route path="profile" element={<Profile />} />
            <Route path="dashboard" element={access_token ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="profile/:activepage" element={<Profile />} />
            <Route path="topartist/:artisidt" element={<ArtistPage/>} />
            <Route path="user/:userId/profile" element={<OtheruserProfile/>} />
          </Route>
          <Route path="/spotifycallback" element={<SpotifyCallback />} />
          <Route path="*" element={<h1>Error 404 Page not found !!</h1>} />
        </Routes>
      </BrowserRouter> */}
function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Router>
      <CssBaseline />
      <AppContent darkMode={darkMode} setDarkMode={setDarkMode} />
    </Router>
  );
}

export default App;

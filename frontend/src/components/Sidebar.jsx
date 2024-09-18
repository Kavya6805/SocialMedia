import React, { useEffect, useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Modal,
  TextField,
  Typography,
  Avatar,
  Button,
  Badge,
} from '@mui/material';
import { FaHome, FaSearch, FaPaperPlane, FaBell, FaPlusSquare, FaUserCircle, FaMoon, FaSun, FaTimes, FaUserPlus, FaUserCheck, FaUserTimes } from 'react-icons/fa';
import { styled } from '@mui/material/styles';
import { blue, red, green, yellow, grey } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { unSetUserToken } from '../redux/features/authSlice';
import { unSetMyPosts, unsetOtherUserInfo, unsetUserInfo, unSetUserPosts } from '../redux/features/userSlice';
import { removeToken } from '../redux/services/LocalStorageService';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-bootstrap';
import { useSearchUsersQuery } from '../redux/services/userDetailApi';
import CloseIcon from '@mui/icons-material/Close';
import { unsetFollowers, unsetFollowing } from '../redux/features/followersSlice';


// Define styled components
// const SuggestionList = styled(List)(({ theme }) => ({
//   padding: 0,
// }));

// const SuggestionListItem = styled(ListItem)(({ theme }) => ({
//   padding: '8px 16px',
// }));

// const SuggestionListItemText = styled(ListItemText)(({ theme }) => ({
//   padding: '4px 0',
// }));

const NotificationList = styled(List)(({ theme }) => ({
  padding: 0,
}));

const NotificationListItem = styled(ListItem)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '10px 20px',
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const savePastSearch = (user) => {
  const pastSearches = JSON.parse(localStorage.getItem('pastSearches')) || [];
  const isAlreadyInSearches = pastSearches.some((search) => search.id === user.id);

  if (!isAlreadyInSearches) {
    // Add new user to past searches
    localStorage.setItem('pastSearches', JSON.stringify([...pastSearches, user]));
  }
};

// Helper function to retrieve past searches from localStorage
const getPastSearches = () => {
  const pastSearches = JSON.parse(localStorage.getItem('pastSearches')) || [];
  return pastSearches.reverse();
};

const Sidebar = ({ darkMode, setDarkMode }) => {
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const [openNotificationModal, setOpenNotificationModal] = useState(false);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const dispatch = useDispatch()

  const handleOpenSearchModal = () => {
    setOpenSearchModal(true);
    setIsSidebarMinimized(true);
  };

  const handleCloseSearchModal = () => {
    setOpenSearchModal(false);
    setIsSidebarMinimized(false);
    setSearchTerm('')
  };

  const handleOpenNotificationModal = () => {
    setOpenNotificationModal(true);
    setIsSidebarMinimized(true);
  };

  const handleCloseNotificationModal = () => {
    setOpenNotificationModal(false);
    setIsSidebarMinimized(false);
  };
  const handleLogoutClick = () => {
    dispatch(unsetUserInfo({ id: "", username: "", email: "" }));
    dispatch(unSetUserToken({ access_token: null }));
    dispatch(unsetOtherUserInfo({ id: "", username: "", email: "" ,name:"",date_of_birth:"",bio:""}))
    dispatch(unSetUserPosts([]))
    dispatch(unsetFollowers([]))
    dispatch(unsetUserInfo({ id: "", username: "", email: "" }));
    dispatch(unSetUserToken({ access_token: null }));
    dispatch(unsetFollowing());
    dispatch(unsetUserInfo());

    // Unset user posts
    dispatch(unSetUserPosts());

    // Unset other posts
    dispatch(unsetOtherUserInfo());

    // Unset my posts
    dispatch(unSetMyPosts());

    // Unset other user info
    dispatch(unsetOtherUserInfo());
    dispatch(unSetUserToken());
    // Unset following
    dispatch(unsetFollowers());
    removeToken();
    localStorage.removeItem('pastSearches')
    removeToken()
    localStorage.removeItem('pastSearches')
    navigate('/signin')
  };

 
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedSuggestions, setDisplayedSuggestions] = useState([]); // Store all suggestions here
  const { data: searchSuggestions = [], isLoading } = useSearchUsersQuery(searchTerm, {
    skip: false, // Always fetch, even if searchTerm is empty
  });

  useEffect(() => {
    if (!searchTerm) {
      const pastSearches = getPastSearches();
      setDisplayedSuggestions(pastSearches); // Set past searches initially
    }
  }, []); // Run only once on component mount

  // Update displayed suggestions when search suggestions are available
  useEffect(() => {
    if (searchTerm && !isLoading && searchSuggestions.length > 0) {
      // Only update suggestions when there's a search term and new results
      setDisplayedSuggestions(searchSuggestions);
    }
  }, [searchSuggestions, searchTerm, isLoading]);

  // Handle user clicking on a suggestion
  const handleSuggestionClick = (user) => {
    handleCloseSearchModal(); 
    savePastSearch(user); // Store user to past searches
    navigate(`/user/profile/${user.id}`); // Navigate to the user's profile
  };

  // Function to remove a suggestion
  const handleRemoveSuggestion = (id, event) => {
    event.stopPropagation(); // Prevent ListItem click from triggering
    setDisplayedSuggestions((prevSuggestions) =>
      prevSuggestions.filter((suggestion) => suggestion.id !== id)
    );
    // Update localStorage after removing suggestion
    const updatedPastSearches = displayedSuggestions.filter((suggestion) => suggestion.id !== id);
    localStorage.setItem('pastSearches', JSON.stringify(updatedPastSearches));
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const notifications = [
    { id: 1, type: 'friend_request', from: 'John Doe', avatar: '/path/to/avatar1.jpg' },
    { id: 2, type: 'comment', from: 'Alex Jones', details: 'Commented on your post', avatar: '/path/to/avatar2.jpg' },
    { id: 3, type: 'like', from: 'Emma Watson', details: 'Liked your photo', avatar: '/path/to/avatar3.jpg' },
    { id: 4, type: 'mention', from: 'Taylor Swift', details: 'Mentioned you in a post', avatar: '/path/to/avatar4.jpg' },
    { id: 5, type: 'friend_request', from: 'Jane Smith', avatar: '/path/to/avatar5.jpg' },
  ];

  const handleAcceptRequest = (id) => {
    console.log(`Accepted request with id ${id}`);
    // Handle accept logic here
  };

  const handleRejectRequest = (id) => {
    console.log(`Rejected request with id ${id}`);
    // Handle reject logic here
  };
  const navigate = useNavigate(); // Initialize the useNavigate hook

  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        sx={{
          width: isSidebarMinimized ? 60 : { xs: 60, sm: 240 }, // Sidebar width based on state
          height: '100vh',
          backgroundColor: darkMode ? '#222' : '#fff',
          borderRight: '1px solid #dbdbdb',
          paddingTop: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: isSidebarMinimized ? 'center' : 'flex-start',
          transition: 'width 0.3s',
          overflow: 'hidden',
          position: 'relative', // Ensure position is relative for child absolute positioning
        }}
      >
        <List sx={{ width: '100%', padding: 0 }}>
          {[
            { text: 'Home', icon: <FaHome />, onClick: () => navigate('/') },
            { text: 'Search', icon: <FaSearch />, onClick: handleOpenSearchModal },
            { text: 'Messages', icon: <FaPaperPlane />, onClick: () => navigate('/directmessage') },
            { text: 'Notifications', icon: <Badge badgeContent={5} color="primary"><FaBell /></Badge>, onClick: handleOpenNotificationModal },
            { text: 'Create', icon: <FaPlusSquare />, onClick: () => navigate('/post/create') },
            { text: 'Profile', icon: <FaUserCircle />, onClick: () => navigate('/user/profile') },
          ].map((item, index) => (
            <ListItem
              button
              key={index}
              onClick={item.onClick}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isSidebarMinimized ? 'center' : 'flex-start',
                padding: '10px 20px', // Adjust padding for spacing
                '&:hover': {
                  backgroundColor: darkMode ? '#333' : '#f5f5f5',
                },
                color: darkMode ? '#fff' : '#000',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 'auto',
                  justifyContent: 'center',
                  color: darkMode ? '#fff' : '#000',
                  margin: isSidebarMinimized ? '10px 0' : '10px', // Add margin for spacing
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!isSidebarMinimized && <ListItemText primary={item.text} />}
            </ListItem>
          ))}
        </List>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            marginTop: 'auto',
            padding: 2,
          }}
        >
          <IconButton
            onClick={() => setDarkMode(!darkMode)}
            sx={{ color: darkMode ? '#ff8501' : '#ff8501' }}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </IconButton>
          <Button
            component={NavLink}
            to="/signin"
            onClick={() => {
              handleLogoutClick();
            }}
          >
            Logout
          </Button>


        </Box>
      </Box>

      {/* Search Modal */}
      <Modal
        open={openSearchModal}
        onClose={handleCloseSearchModal}
        aria-labelledby="search-modal-title"
        aria-describedby="search-modal-description"
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          position: 'absolute',
          top: 0,
          left: 60, // Adjust based on sidebar width
          padding: '16px',
        }}
      >
        <Box
          sx={{
            width: { xs: '80%', sm: '25%' },
            bgcolor: darkMode ? '#444' : 'background.paper',
            border: 'none',
            boxShadow: 24,
            p: 2,
            color: darkMode ? '#fff' : '#000',
            borderRadius: '8px',
            height: '100%',
          }}
        >
          <Typography variant="h6" style={{ paddingBottom: 20 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Search</span>
              <IconButton onClick={handleCloseSearchModal} sx={{ color: darkMode ? '#fff' : '#000' }}>
                <FaTimes />
              </IconButton>
            </Box>
          </Typography>

          <TextField
            id="search-modal-description"
            label="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />

          {/* Suggestion List */}
          {isLoading && <p>Loading...</p>}

          <List>
      {displayedSuggestions.length > 0 ? (
        displayedSuggestions.map((suggestion) => (
          <ListItem
            button
            key={suggestion.id}
            onClick={() => handleSuggestionClick(suggestion)} // Pass the full suggestion object
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar src={"http://127.0.0.1:8000" + suggestion.profile_picture} />
              <ListItemText primary={suggestion.username} />
            </Box>
            <IconButton
              edge="end"
              onClick={(event) => handleRemoveSuggestion(suggestion.id, event)}
            >
              <CloseIcon />
            </IconButton>
          </ListItem>
        ))
      ) : (
        <Typography variant="body2">No suggestions found</Typography>
      )}
    </List>
        </Box>
      </Modal>

      {/* Notifications Modal */}
      <Modal
        open={openNotificationModal}
        onClose={handleCloseNotificationModal}
        aria-labelledby="notification-modal-title"
        aria-describedby="notification-modal-description"
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start', // Align modals to the left
          position: 'absolute',
          top: 0,
          left: 60, // Adjust based on sidebar width
          padding: '16px',
        }}
      >
        <Box
          sx={{
            width: { xs: '80%', sm: '30%' },
            height: {
              xs: '100vh',    // For extra-small screens (mobile)
              sm: '100vh',    // For small screens (tablet)
              md: '100vh',    // For medium screens (small laptop)
              lg: '100vh',    // For large screens (laptop and up)
            },
            maxHeight: '95vh', // Ensure modal doesn't exceed 90% of viewport height
            bgcolor: darkMode ? '#444' : 'background.paper',
            border: 'none',
            boxShadow: 24,
            p: 2,
            color: darkMode ? '#fff' : '#000',
            borderRadius: '8px',
            overflow: 'hidden', // Hide overflow for better appearance
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h6" style={{ paddingBottom: 20 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Notifications</span>
              <IconButton onClick={handleCloseNotificationModal} sx={{ color: darkMode ? '#fff' : '#000' }}>
                <FaTimes />
              </IconButton>
            </Box>
          </Typography>

          <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
            <NotificationList>
              {notifications.map((notification) => (
                <NotificationListItem key={notification.id}>
                  <Avatar src={notification.avatar} sx={{ marginRight: 2 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <ListItemText
                      primary={
                        notification.type === 'friend_request'
                          ? `Friend request from ${notification.from}`
                          : notification.details
                      }
                      secondary={
                        notification.type === 'friend_request' && (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleAcceptRequest(notification.id)}
                              sx={{ borderRadius: 20 }}
                            >
                              <FaUserCheck style={{ marginRight: 8 }} /> Accept
                            </Button>
                            <Button
                              variant="outlined"
                              color="secondary"
                              onClick={() => handleRejectRequest(notification.id)}
                              sx={{ borderRadius: 20 }}
                            >
                              <FaUserTimes style={{ marginRight: 8 }} /> Reject
                            </Button>
                          </Box>
                        )
                      }
                    />
                  </Box>
                </NotificationListItem>
              ))}
            </NotificationList>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', paddingTop: 2 }}>
            <Button variant="text" color="primary" onClick={() => console.log('Mark all as read')}>
              Mark all as read
            </Button>
            <Button variant="text" color="secondary" onClick={() => console.log('Clear all')}>
              Clear all
            </Button>
          </Box>
        </Box>

      </Modal>
    </Box>
  );
};

export default Sidebar;

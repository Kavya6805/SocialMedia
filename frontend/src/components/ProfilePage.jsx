// import React from 'react';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Button,
  Tabs,
  Tab,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Modal,
  TextField,
  InputAdornment,
  Stack,
  Divider,
  Card, CardMedia
} from '@mui/material';
import { Instagram, Twitter, LinkedIn, Edit, Close, PhotoCamera, Favorite, Comment } from '@mui/icons-material';
import { getToken, removeToken } from '../redux/services/LocalStorageService';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetLoggedUserQuery } from '../redux/services/userAuthApi';
import { setMyPosts, setUserInfo, setUserPosts, unSetMyPosts, unsetOtherUserInfo, unsetUserInfo, unSetUserPosts } from '../redux/features/userSlice';
import { unSetUserToken } from '../redux/features/authSlice';
import { useCheckFollowStatusQuery, useFollowUserMutation, useGetFollowersQuery, useGetFollowingQuery, useGetOtherUserDetailQuery, useUnfollowUserMutation, useUpdateUserProfileMutation } from '../redux/services/userDetailApi';
import { setFollowers, setFollowing, unsetFollowers, unsetFollowing } from '../redux/features/followersSlice';
import MyFollowers, { FollowersList, FollowingList } from './MyFollowers';
import UserProfile from './UserProfile';
import { useFetchProfilePostsQuery } from '../redux/services/userFunctionalityApi';

const ProfilePage = ({ darkMode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isFollowing, setIsFollowing] = useState(false);
  const { access_token } = getToken();
  // console.log("a"+access_token);
  const userInfo = useSelector((state) => state.user);
  const { userId: urlUserId } = useParams();
  // const location = useLocation();
  // const { name, age } = location.state || {};
  const userIdToUse = urlUserId || userInfo.id;


  const { data: loggedUserData, error: loggedUserError, isSuccess: loggedUserSuccess } = useGetLoggedUserQuery(access_token);

  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();
  const { data: fetchPosts, error: fetchPostsError, isSuccess: fetchPostsSuccess } = useFetchProfilePostsQuery({ userId: userIdToUse, access_token })
  console.log(fetchPosts);


  const [followerscount, setFollowersCount] = useState(0)
  const [followingcount, setFollowingCount] = useState(0)
  const [followersDataList, setFollowersData] = useState([]);
  const [followingDataList, setFollowingData] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({
    id: "",
    email: "",
    username: "",
    profile_picture: "",
    bio: "",
    backgroundImage: ""
  });
  // console.log(loggedUserData);
  // console.log(loggedUserSuccess);
  const [editedData, setEditedData] = useState({
    username: userInfo.username,
    email: userInfo.email,
    name: '',
    profile_picture: '',
    backgroundImage: '',
    bio: '',
    date_of_birth: ''
  });
  const [updateUserProfile] = useUpdateUserProfileMutation();
  const [error, setError] = useState(null);
  const [postlength, setPostlength] = useState(0)
  const [isFirstFetch, setIsFirstFetch] = useState(true);

  useEffect(() => {
    if (loggedUserError && loggedUserError.status === 401) {
      handleLogout();
    } else if (loggedUserData && loggedUserSuccess) {
      setUserData({
        id: loggedUserData.id,
        email: loggedUserData.email,
        username: loggedUserData.username,
        name: loggedUserData.name,
        profile_picture: loggedUserData.profile_picture,
        bio: loggedUserData.bio,
        date_of_birth: loggedUserData.date_of_birth,
        backgroundImage: loggedUserData.backgroundImage
      });

      dispatch(setUserInfo({
        id: loggedUserData.id,
        email: loggedUserData.email,
        username: loggedUserData.username,
        name: loggedUserData.name,
        bio: loggedUserData.bio,
        date_of_birth: loggedUserData.date_of_birth,

      }));
      if (fetchPostsSuccess && isFirstFetch) {
        const postsData = fetchPosts.posts; // Assuming 'posts' is the key inside fetched data

        if (urlUserId) {
          // If there's a URL user ID, store posts in setUserPosts (probably viewing another user's profile)
          dispatch(setUserPosts(postsData));
        } else {
          // If no URL user ID, store posts in setMyPosts (viewing your own profile)
          dispatch(setMyPosts(postsData));
        }

        // Set the length of the posts
        setPostlength(postsData.length);

        // Prevent further dispatches
        setIsFirstFetch(false);
      }
      if (userInfo) {
        setEditedData({
          username: userInfo.username || '',
          email: userInfo.email || '',
          name: userInfo.name || '',
          profile_picture: userInfo.profile_picture || '',
          backgroundImage: userInfo.backgroundImage || '',
          bio: userInfo.bio || '',
          date_of_birth: userInfo.date_of_birth || ''
        });
      }
    }

  }, [loggedUserData, loggedUserError, loggedUserSuccess, fetchPostsSuccess, fetchPosts, userInfo, isFirstFetch, dispatch]);

  const handleLogout = () => {
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
    // Unset following
    dispatch(unsetFollowers());
    removeToken();
    localStorage.removeItem('pastSearches')
    navigate('/signin');
  };


  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleOpenEditModal = () => {
    setEditMode(true);
  };

  const handleCloseEditModal = () => {
    setEditMode(false);
    setError('')
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      // Directly store the File object
      setEditedData(prevState => ({
        ...prevState,
        [field]: file, // No base64 conversion, just store the File object
      }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object
    const formData = new FormData();

    // Append form data to FormData object
    Object.keys(editedData).forEach(key => {
      if (editedData[key]) {
        if (editedData[key] instanceof File) {
          formData.append(key, editedData[key]);
        } else if (editedData[key] !== undefined && editedData[key] !== '') {
          formData.append(key, editedData[key]);
        }
      }
    });

    try {
      // Replace with actual access token
      const access_token = localStorage.getItem('access_token');

      // Call the update API using RTK Query Mutation
      const response = await updateUserProfile({ userData: editedData, access_token }).unwrap();

      console.log('Profile updated successfully:', response);
      window.location.reload();

      // pop nakhvanu che----------------------
      setEditMode(false)
    } catch (err) {
      // Handle error from the API
      console.error('Error updating profile:', err);
      console.log(editedData);
      if (err.data.username) {
        setError(err.data.username || 'Error updating profile');
      }
      else if (err.data.profile_picture) {
        setError(err.data.profile_picture || 'Error updating profile');
      }
      else if (err.data.backgroundImage) {
        setError(err.data.backgroundImage || 'Error updating profile');
      }
      else if (err.data.bio) {
        setError(err.data.bio || 'Error updating profile');
      }
      else if (err.data.name) {
        setError(err.data.name || 'Error updating profile');
      }
      else if (err.data.email) {
        setError(err.data.email || 'Error updating profile');
      }
    }
  };
  const isMyProfile = urlUserId == userData.id || !urlUserId;

  const posts = useSelector((state) => state.user.posts || [])
  const myposts = useSelector((state) => state.user.myPosts || [])



  return (
    <>
      {isMyProfile ? (
        <>
          <Box
            sx={{
              padding: { xs: 2, sm: 3, md: 4 },
              backgroundColor: darkMode ? '#1e1e1e' : 'background.default',
              color: darkMode ? '#fff' : '#000',
              minHeight: '100vh',
            }}
          >
            <Card
              sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: 1,
                minHeight: '200px',

              }}
            >
              <CardMedia
                component="img"
                image={"http://127.0.0.1:8000" + userData.backgroundImage}
                alt="Background"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 0,
                  objectFit: 'cover',
                  opacity: 0.5
                }}
              />
              <Avatar
                src={"http://127.0.0.1:8000" + userData.profile_picture}
                sx={{
                  width: 96,
                  height: 96,
                  border: `3px solid primary.main`,
                  marginBottom: 2,
                  marginTop: 2,
                  zIndex: 1,
                }}
              />
              {isMyProfile ?
                (<IconButton
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    color: 'common.white',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    },
                  }}
                  onClick={handleOpenEditModal}
                >
                  <Edit />
                </IconButton>) : ""}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2, color: "black", zIndex: 1, }}>
                <Typography variant="h6">{userData.username}</Typography>
              </Box>
              <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', sm: '1rem', color: "black" }, zIndex: 1, }}>
                {userData.bio}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 1 }}>
                <IconButton color="inherit"><Instagram /></IconButton>
                <IconButton color="inherit"><Twitter /></IconButton>
                <IconButton color="inherit"><LinkedIn /></IconButton>
              </Box>
            </Card>
            <Tabs
              value={tabIndex}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                marginBottom: 2,
                backgroundColor: 'background.paper',
                borderRadius: 1,
                boxShadow: 1,
                maxWidth: '100%',
                whiteSpace: 'nowrap',
              }}
            >

              <Tab label={`Posts (${postlength})`} />
              <Tab label={`Followers (${followerscount})`} />
              <Tab label={`Following (${followingcount})`} />
              <MyFollowers
                userId={userInfo.id}
                setFollowersData={setFollowersData}
                setFollowingData={setFollowingData}
                setFollowersCount={setFollowersCount}
                setFollowingCount={setFollowingCount}
              />
            </Tabs>

            {tabIndex === 0 && (
              <Grid container spacing={2} sx={{ marginTop: 2 }}>

                {myposts.map((post) => (
                  <Grid item xs={12} sm={6} md={4} key={post.id}>
                    <Paper
                      sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: 1,
                        width: '100%',
                        height: { xs: '200px', sm: '250px', md: '300px' },
                        '& img': {
                          width: '100%',
                          height: '100%',
                          objectFit: 'fill',
                          transition: 'transform 0.3s',
                        },
                        '&:hover img': {
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      <img src={post.attachments[0].get_media_url} alt={`Post ${post.id}`} />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          color: 'common.white',
                          opacity: 0,
                          transition: 'opacity 0.3s',
                          '&:hover': {
                            opacity: 1,
                          },
                        }}
                      >
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          <Favorite sx={{ verticalAlign: 'middle', mr: 0.5 }} /> {post.likes_count}
                        </Typography>
                        <Typography variant="h6">
                          <Comment sx={{ verticalAlign: 'middle', mr: 0.5 }} /> {post.comments.length}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}

            {tabIndex === 1 && (
              <FollowersList userId={userInfo.id} followersData={followersDataList} />
            )}

            {tabIndex === 2 && (
              <FollowingList userId={userInfo.id} followingData={followingDataList} />
            )}

            {/* Enhanced Edit Profile Modal */}
            <Modal
              open={editMode}
              onClose={handleCloseEditModal}
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Paper
                sx={{
                  padding: 4,
                  backgroundColor: darkMode ? '#2e2e2e' : 'background.paper',
                  color: darkMode ? '#fff' : '#000',
                  maxWidth: '500px',
                  width: '100%',
                  borderRadius: 2,
                  boxShadow: 3,
                  position: 'relative',
                }}
              >

                {error ? <IconButton
                  sx={{ position: 'absolute', top: 90, right: 16 }}
                  onClick={handleCloseEditModal}
                >
                  <Close />
                </IconButton> : <IconButton
                  sx={{ position: 'absolute', top: 16, right: 16 }}
                  onClick={handleCloseEditModal}
                >
                  <Close />
                </IconButton>}

                {error && <p style={{ color: 'red' }}>{error}</p>}
                <Typography variant="h6" gutterBottom>Edit Profile</Typography>


                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  {/* Edit Avatar */}
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                    <Avatar src={"http://127.0.0.1:8000" + userData.profile_picture} sx={{ width: 72, height: 72 }} />
                    <Button
                      variant="outlined"
                      startIcon={<PhotoCamera />}
                      component="label"
                      sx={{ borderRadius: '50px' }}
                    >
                      Change Avatar
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => handleImageUpload(e, 'profile_picture')}
                      />
                    </Button>
                  </Stack>

                  {/* Edit Background Image */}
                  <Box
                    sx={{
                      backgroundImage: `url(${editedData.backgroundImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: 10,
                      // height: 100,
                      mb: 1,
                    }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<PhotoCamera />}
                    component="label"
                    sx={{ borderRadius: '50px', mb: 1 }}
                  >
                    Change Background
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => handleImageUpload(e, 'backgroundImage')}
                    />
                  </Button>

                  {/* Edit Name */}
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Name"
                    name="name"
                    value={editedData.name}
                    onChange={handleInputChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton edge="end">
                            <Edit />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiInputBase-root': { borderRadius: '50px' } }}
                  />

                  {/* Edit Username */}
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Username"
                    name="username"
                    value={editedData.username}
                    onChange={handleInputChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton edge="end">
                            <Edit />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiInputBase-root': { borderRadius: '50px' } }}
                  />

                  {/* Edit Email */}
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Email"
                    name="email"
                    value={editedData.email}
                    onChange={handleInputChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton edge="end">
                            <Edit />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiInputBase-root': { borderRadius: '50px' } }}
                  />

                  {/* Edit Bio */}
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Bio"
                    name="bio"
                    value={editedData.bio}
                    onChange={handleInputChange}
                    multiline
                    rows={2}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton edge="end">
                            <Edit />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiInputBase-root': { borderRadius: '15px' } }}
                  />

                  {/* Edit Birthdate */}
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Birthdate"
                    name="date_of_birth"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={editedData.date_of_birth}
                    onChange={handleInputChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton edge="end">
                            <Edit />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiInputBase-root': { borderRadius: '50px' } }}
                  />

                  {/* Save Changes Button */}
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{
                      mt: 1.5,
                      py: 1,
                      borderRadius: '50px',
                      background: `linear-gradient(45deg, #2196F3, #21CBF3)`,
                    }}
                    type="submit"
                  >
                    Save Changes
                  </Button>
                </form>
              </Paper>
            </Modal>
          </Box ></>) : <UserProfile posts={posts} />}
    </>
  );
};

export default ProfilePage;
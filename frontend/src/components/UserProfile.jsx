import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
    Box,
    Typography,
    Avatar,
    Button,
    Grid,
    Card,
    CardMedia,
    Divider,
    Modal
} from '@mui/material';
import { useCheckFollowStatusQuery, useFollowUserMutation, useGetOtherUserDetailQuery, useUnfollowUserMutation } from '../redux/services/userDetailApi';
import { getToken } from '../redux/services/LocalStorageService';
import MyFollowers from './MyFollowers';
import { useDispatch, useSelector } from 'react-redux';
// import { setOtherPosts, setOtherProfilePosts } from '../redux/features/userSlice';
// import { useFetchPostsQuery } from '../redux/services/userFunctionalityApi';


const UserProfile = ({ posts,darkMode }) => {
    const { userId } = useParams();
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const { userId: urlUserId } = useParams();
    const [followerscount, setFollowersCount] = useState(0)
    const [followingcount, setFollowingCount] = useState(0)
    const [followersDataList, setFollowersData] = useState([]);
    const [followingDataList, setFollowingData] = useState([]);
    const [userData, setUserData] = useState({
        id: "",
        email: "",
        username: "",
        profile_picture: "",
        bio: "",
        backgroundImage: "",
        is_private: ""
    });
    const access_token = localStorage.getItem('access_token')

    

    const { data: otherUserData, error: otherUserError, isSuccess: otherUserSuccess } = useGetOtherUserDetailQuery({ userId: urlUserId, access_token }, { skip: !urlUserId });
    const { data: followStatus, error: followError, isLoading: followLoading } = useCheckFollowStatusQuery(
        { userId: urlUserId, access_token },
        { skip: !urlUserId } // Only check follow status if viewing another user's profile
    );

    useEffect(() => {
        if (otherUserData && otherUserSuccess) {
            setUserData({
                id: otherUserData.id,
                email: otherUserData.email,
                username: otherUserData.username,
                backgroundImage: otherUserData.backgroundImage,
                profile_picture: otherUserData.profile_picture,
                bio: otherUserData.bio,
                date_of_birth: otherUserData.date_of_birth,
                is_private: userData.is_private
            });
        }
        if (followStatus) {
            setIsFollowing(followStatus.isFollowing);
        }
    }, [otherUserData, otherUserSuccess, followStatus]);
// }, []);
useEffect(() => {
    // This effect will run when the page loads
}, []);
    


    const handleImageClick = (img) => {
        setSelectedImage(img);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };
    const [followUser] = useFollowUserMutation();
    const [unfollowUser] = useUnfollowUserMutation();
    const handleFollowUnfollow = async () => {
        if (isFollowing) {
            try {
                await unfollowUser({ urlUserId, access_token }).unwrap();  // Unwrap to handle success/failure
                setIsFollowing(false);  // Update state to unfollow
            } catch (error) {
                console.error("Error unfollowing user", error);
            }
        } else {
            try {
                await followUser({ urlUserId, access_token }).unwrap();
                setIsFollowing(true);  // Update state to follow
            } catch (error) {
                console.error("Error following user", error);
            }
        }
        window.location.reload();
    };
    const otherPosts = posts || [];  // If posts is not an array, default to an empty array
    console.log(otherPosts);
    


    return (
        <Box
            sx={{
                bgcolor: darkMode ? '#121212' : '#fafafa', // Darker background for dark mode
                color: darkMode ? '#ffffff' : '#000000', // Text color changes in dark mode
                padding: 2,
                maxWidth: 1200,
                margin: 'auto',
            }}
        >
            {/* Profile Header */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderBottom: 1,
                    borderColor: darkMode ? '#444' : '#e0e0e0',
                    paddingBottom: 2,
                    marginBottom: 2,
                }}
            >
                <Avatar
                    src={"http://127.0.0.1:8000" + userData.profile_picture}
                    alt={userData.name}
                    sx={{
                        width: 150,
                        height: 150,
                        border: `4px solid ${darkMode ? '#888' : '#ddd'}`, // Softer border in dark mode
                        marginBottom: 2
                    }}
                />
                <Typography variant="h4" sx={{ marginBottom: 1 }}>
                    {userData.username}
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 3,
                        marginBottom: 2,
                    }}
                >
                    <MyFollowers
                        userId={userData.id}
                        setFollowersData={setFollowersData}
                        setFollowingData={setFollowingData}
                        setFollowersCount={setFollowersCount}
                        setFollowingCount={setFollowingCount}
                    />
                    <Typography variant="body2" sx={{ color: darkMode ? '#bbb' : 'textSecondary' }}>
                    <strong>{otherPosts?.filter(post => post.created_by.id == urlUserId).length}</strong> Posts
                    </Typography>
                    <Typography variant="body2" sx={{ color: darkMode ? '#bbb' : 'textSecondary' }}>
                        <strong>{followerscount}</strong> Followers
                    </Typography>
                    <Typography variant="body2" sx={{ color: darkMode ? '#bbb' : 'textSecondary' }}>
                        <strong>{followingcount}</strong> Following
                    </Typography>
                </Box>
                <Button
                    variant={isFollowing ? 'outlined' : 'contained'}
                    color={"primary"}
                    onClick={handleFollowUnfollow}
                >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                </Button>
            </Box>

            <Divider sx={{ marginBottom: 2, borderColor: darkMode ? '#444' : '#e0e0e0' }} />

            {/* Posts Section */}
            <Box>
                {otherPosts.is_private ? (
                    <Typography variant="h6">This account is private. Follow to see their posts.</Typography>
                ) : (
                    <Grid container spacing={2}>
                        {!otherPosts ? (
                            <Typography variant="h6">No posts yet.</Typography>
                        ) : (
                            otherPosts.filter(post => post.created_by.id == urlUserId) // Only include posts where post.id matches userData.id
                            .map((post, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card
                                        sx={{
                                            position: 'relative',
                                            overflow: 'hidden',
                                            boxShadow: darkMode ? 5 : 3, // Enhanced shadow in dark mode
                                            backgroundColor: darkMode ? '#1e1e1e' : '#ffffff', // Card background
                                            width: '100%',
                                            height: 300, // Fixed height
                                            '&:hover .overlay': {
                                                opacity: 1,
                                            },
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            height="100%"
                                            image={post.attachments[0].get_media_url}
                                            alt={post.Body}
                                            sx={{ objectFit: 'cover', cursor: 'pointer' }}
                                            onClick={() => handleImageClick(post.img)}
                                        />
                                        <Box
                                            className="overlay"
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                bgcolor: 'rgba(0, 0, 0, 0.7)',
                                                color: '#ffffff',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                opacity: 0,
                                                transition: 'opacity 0.3s ease',
                                                textAlign: 'center',
                                                padding: 2,
                                            }}
                                        >
                                            <Typography variant="body2" sx={{ marginBottom: 1 }}>
                                                {post.likes_count} ❤
                                            </Typography>
                                            <Typography variant="body2">
                                                {post.comments.length} 💬
                                            </Typography>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))
                        )}
                    </Grid>
                )}
            </Box>

            {/* Modal for enlarged image view */}
            <Modal
                open={!!selectedImage}
                onClose={handleCloseModal}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Box
                    sx={{
                        maxWidth: '90%',
                        maxHeight: '90%',
                        overflow: 'auto',
                    }}
                >
                    <img
                        src={selectedImage}
                        alt="Selected"
                        style={{
                            width: '100%',
                            height: 'auto',
                            objectFit: 'contain',
                        }}
                    />
                </Box>
            </Modal>
        </Box>
    );
};

export default UserProfile;


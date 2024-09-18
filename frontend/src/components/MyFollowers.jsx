
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFollowers, setFollowing } from '../redux/features/followersSlice';
import { useGetFollowersQuery, useGetFollowingQuery } from '../redux/services/userDetailApi';
import { getToken } from '../redux/services/LocalStorageService';
import { useNavigate } from 'react-router-dom';
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

const MyFollowers = ({ userId, setFollowersData, setFollowingData,setFollowersCount,setFollowingCount }) => {
    const dispatch = useDispatch();
    const { access_token } = getToken();

    const { data: followersData, error: followersError, isSuccess: followersSuccess } = useGetFollowersQuery({ userId, access_token });
    const { data: followingData, error: followingError, isSuccess: followingSuccess } = useGetFollowingQuery({ userId, access_token });

    useEffect(() => {
        if (followersSuccess && followersData) {
            dispatch(setFollowers(followersData));
            setFollowersData(followersData);
            setFollowersCount(followersData.length || 0);
        }

        if (followingSuccess && followingData) {
            dispatch(setFollowing(followingData));
            setFollowingData(followingData);
            setFollowingCount(followingData.length || 0);
        }
    }, [followersSuccess, followersData, followingSuccess, followingData, dispatch, setFollowersData, setFollowingData, setFollowersCount, setFollowingCount]);

    if (followersError || followingError) {
        return <div>Error: {followersError?.message || followingError?.message}</div>;
    }

    if (!followersSuccess || !followingSuccess) {
        return <div>Loading...</div>;
    }
    // console.log(followersData);

    // followersCount = followersData?.length || 0;
    // followingCount = followingData?.length || 0;


    return (
        <>
            {/* Show follower and following counts */}
            {/* <Tab label={`Posts (${user.posts.length})`} /> */}


        </>
    );
};

export default MyFollowers;


const FollowersList = ({ followersData, userId }) => {
    const navigate = useNavigate(); // Hook for navigation

    const handleProfileClick = (followerId) => {
        navigate(`/user/profile/${followerId}`); // Redirect to user's profile
    };

    console.log(followersData)
    return (
        <div>
            <List sx={{ backgroundColor: 'background.paper', borderRadius: 1, boxShadow: 1 ,cursor:'pointer'}} >
                {followersData.map((follower) => (
                    <ListItem key={follower.follower_id} divider onClick={() => handleProfileClick(follower.user_id)} >
                        <ListItemAvatar>
                            <Avatar src={"http://127.0.0.1:8000/"+follower.follower_profile_picture} />
                        </ListItemAvatar>
                        <ListItemText primary={follower.follower_username} sx={{ color: '#000' }} />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

const FollowingList = ({ followingData }) => {
    const navigate = useNavigate(); // Hook for navigation

    const handleProfileClick = (userId) => {
        navigate(`/user/profile/${userId}`); // Redirect to user's profile
    };

    return (
        <div>
            <List sx={{ backgroundColor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
                {followingData.map((following) => (
                    <ListItem key={following.user_id} divider onClick={() => handleProfileClick(following.user_id)} sx={{cursor:'pointer'}} >
                        <ListItemAvatar>
                            <Avatar src={"http://127.0.0.1:8000/"+following.user_profile_picture } />
                        </ListItemAvatar>
                        <ListItemText primary={following.user_username}
                            sx={{ color: '#000' }}
                        />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};


export { FollowersList, FollowingList }
import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Avatar, Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock'; // Importing Lock Icon from MUI

// Sample data for demonstration
const userProfiles = [
    { id: 1, name: 'John Doe', img: 'https://via.placeholder.com/150', posts: 30, followers: 120, following: 80, bio: 'Lover of all things tech. Enjoys hiking and reading.', isPrivate: false },
    { id: 2, name: 'Taylor Swift', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoFPj9hbgyEURqM6SMsk_hLZfgTgxVWULM4Q&s', posts: 15, followers: 200, following: 100, bio: 'Avid traveler and photographer. Always seeking new adventures.', isPrivate: true },
    { id: 3, name: 'Michael Johnson', img: 'https://via.placeholder.com/150', posts: 10, followers: 50, following: 30, bio: 'Tech enthusiast and gamer. Passionate about software development.', isPrivate: false },
];

const PrivateProfile = ({ darkMode }) => {
    const { id } = useParams();
    const userProfile = userProfiles.find((user) => user.id === parseInt(id));

    const [requested, setRequested] = useState(false);

    if (!userProfile) {
        return <div>User not found</div>; 
    }

    const handleFollowClick = () => {
        setRequested(!requested);
    };

    // Define inline styles for the button
    const buttonStyles = {
        marginTop: '16px', // mt: 3
        borderRadius: '20px', // borderRadius: 20
        backgroundColor: '#1976d2', // Blue background color
        color: 'white',
        '&:hover': {
            backgroundColor: '#115293' // Darker blue for hover effect
        }
    };

    return (
        <Container sx={{
            bgcolor: darkMode ? '#121212' : '#fafafa', // Darker background for dark mode
            color: darkMode ? '#ffffff' : '#000000', // Text color changes in dark mode
            padding: 2,
            maxWidth: 1200,
            margin: 'auto',
        }}>
            {/* Header Section */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Avatar
                    src={userProfile.img}
                    alt={userProfile.name}
                    sx={{ width: 120, height: 120, border: '5px solid white', margin: '0 auto' }}
                />
                <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 3, fontWeight: 'bold', color: darkMode ? '#ffffff' : '#000000' }}>
                    {userProfile.name}
                </Typography>
                <Row className="text-center" sx={{ color: darkMode ? '#ffffff' : '#000000' }}>
                    <Col>
                        <Typography variant="h6">{userProfile.posts}</Typography>
                        <Typography variant="subtitle2">Posts</Typography>
                    </Col>
                    <Col>
                        <Typography variant="h6">{userProfile.followers}</Typography>
                        <Typography variant="subtitle2">Followers</Typography>
                    </Col>
                    <Col>
                        <Typography variant="h6">{userProfile.following}</Typography>
                        <Typography variant="subtitle2">Following</Typography>
                    </Col>
                </Row>
                <Box sx={{ mt: 3, px: 3 }}>
                    <Typography variant="body1" sx={{ color: darkMode ? '#cccccc' : '#000000' }}>
                        {userProfile.bio}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    style={buttonStyles} // Apply inline styles
                    onClick={handleFollowClick}
                >
                    {requested ? 'Requested' : 'Follow'}
                </Button>
            </Box>

            {/* Private Account Notice */}
            {userProfile.isPrivate && (
                <Box sx={{
                    borderTop: `1px solid ${darkMode ? '#333333' : '#e0e0e0'}`,
                    pt: 4,
                    textAlign: 'center',
                    borderRadius: '0 0 15px 15px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    bgcolor: darkMode ? '#1f1f1f' : '#f5f5f5'
                }}>
                    <LockIcon sx={{ fontSize: 50, color: darkMode ? '#ffffff' : '#757575' }} />
                    <Typography variant="h6" component="h3" sx={{ mt: 2, color: darkMode ? '#ffffff' : '#000000' }}>
                        This account is private
                    </Typography>
                    <Typography variant="body1" sx={{ color: darkMode ? '#cccccc' : '#000000' }}>
                        Follow to see their photos and videos.
                    </Typography>
                    <Button
                        variant="contained"
                        style={buttonStyles} // Apply inline styles
                        onClick={handleFollowClick}
                    >
                        {requested ? 'Requested' : 'Follow'}
                    </Button>
                </Box>
            )}
        </Container>
    );
};

export default PrivateProfile;

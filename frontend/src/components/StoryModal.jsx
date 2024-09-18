import React, { useState, useEffect } from 'react';
import { Modal, Carousel } from 'react-bootstrap';
import { Typography, Box, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
// import './Home.css';

const StoryModal = ({ showStoryModal, handleCloseStoryModal, stories, initialStoryIndex }) => {
    const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex || 0);
    const [progress, setProgress] = useState(0);
    const [completedStories, setCompletedStories] = useState([]);
    const [timer, setTimer] = useState(null);
    const storyDuration = 10000; // 10 seconds per story

    useEffect(() => {
        if (showStoryModal) {
            setCurrentStoryIndex(initialStoryIndex || 0);
            startTimer();
        }
        return () => clearInterval(timer);
    }, [showStoryModal]);

    useEffect(() => {
        if (showStoryModal) {
            startTimer();
        }
    }, [currentStoryIndex]);

    const startTimer = () => {
        setProgress(0);
        const increment = 100 / (storyDuration / 100);
        const newTimer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(newTimer);
                    handleNextStory();
                    return 100;
                }
                return prev + increment;
            });
        }, 100);

        setTimer(newTimer);
    };

    const handleNextStory = () => {
        setProgress(0);
        setCompletedStories(prev => [...prev, stories[currentStoryIndex].id]);
        setCurrentStoryIndex(prevIndex => {
            const nextIndex = prevIndex + 1;
            if (nextIndex < stories.length) {
                return nextIndex;
            }
            handleCloseStoryModal();
            return prevIndex;
        });
    };

    const handleSelect = (index) => {
        if (!completedStories.includes(stories[index].id)) {
            setCurrentStoryIndex(index);
            setProgress(0);
            clearInterval(timer);
            startTimer();
        }
    };

    const handleStoryClick = (index) => {
        if (!completedStories.includes(stories[index].id)) {
            setCurrentStoryIndex(index);
            setProgress(0);
            clearInterval(timer);
            startTimer();
        }
    };

    return (
        <Modal
            show={showStoryModal}
            onHide={handleCloseStoryModal}
            dialogClassName="modal-fullscreen"
            contentClassName="modal-content-fullscreen"
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Body className="p-0 d-flex justify-content-center align-items-center position-relative modal-body-custom">
                {stories.length > 0 && (
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            maxWidth: '500px',
                            borderRadius: '15px',
                            overflow: 'hidden',
                            boxShadow: '0px 0px 30px rgba(0, 0, 0, 0.8)',
                            position: 'relative',
                        }}
                    >
                        <Carousel
                            activeIndex={currentStoryIndex}
                            onSelect={handleSelect}
                            interval={null}
                            controls={false}
                            indicators={false}
                            wrap={false}
                            style={{ height: '100%' }}
                        >
                            {stories.map((story, index) => (
                                <Carousel.Item key={story.id} style={{ height: '100%' }}>
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            position: 'relative',
                                            borderRadius: '15px',
                                            overflow: 'hidden',
                                            // border: '2px solid rgba(0, 0, 0, 0.2)',
                                        }}
                                        onClick={() => handleStoryClick(index)}
                                    >
                                        <Box
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                padding: '1rem',
                                            }}
                                        >
                                            <img
                                                src={story.img}
                                                alt={story.name}
                                                style={{
                                                    maxWidth: '100%',
                                                    maxHeight: '100%',
                                                    objectFit: 'cover',
                                                    borderRadius: '10px',
                                                    boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.5)',
                                                }}
                                            />
                                        </Box>
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                // background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3))',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                padding: '1rem',
                                                color: 'white',
                                                zIndex: 2,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'flex-end',
                                                }}
                                            >
                                                <IconButton
                                                    onClick={handleCloseStoryModal}
                                                    sx={{
                                                        color: 'white',
                                                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                                        },
                                                    }}
                                                >
                                                    <Close />
                                                </IconButton>
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'flex-end',
                                                    mb: 2,
                                                }}
                                            >
                                                <Typography
                                                    variant="h5"
                                                    component="div"
                                                    sx={{
                                                        mb: 0.5,
                                                        fontWeight: 'bold',
                                                        textShadow: '0px 2px 10px rgba(0, 0, 0, 0.7)',
                                                    }}
                                                >
                                                    {story.name}
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        height: '6px',
                                                        width: '100%',
                                                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                                        position: 'relative',
                                                        borderRadius: '3px',
                                                        overflow: 'hidden',
                                                        boxShadow: 'inset 0px 0px 5px rgba(0, 0, 0, 0.3)',
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            height: '100%',
                                                            width: `${progress}%`,
                                                            backgroundColor: 'white',
                                                            transition: 'width 0.1s linear',
                                                        }}
                                                    />
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </Box>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default StoryModal;


/*
 import React, { useState, useEffect } from 'react';
import { Modal, Carousel } from 'react-bootstrap';
import { Typography, Box, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import './Home.css';

const StoryModal = ({ showStoryModal, handleCloseStoryModal, stories, initialStoryIndex }) => {
    const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex || 0);
    const [progress, setProgress] = useState(0);
    const [completedStories, setCompletedStories] = useState([]);
    const [timer, setTimer] = useState(null);
    const storyDuration = 10000; // 10 seconds per story

    useEffect(() => {
        if (showStoryModal) {
            // Reset story index and start timer if modal is shown
            setCurrentStoryIndex(initialStoryIndex || 0);
            startTimer();
        }
        // Cleanup timer when component unmounts or modal closes
        return () => clearInterval(timer);
    }, [showStoryModal]);

    useEffect(() => {
        // Restart timer when story index changes
        if (showStoryModal) {
            startTimer();
        }
    }, [currentStoryIndex]);

    const startTimer = () => {
        setProgress(0);
        const increment = 100 / (storyDuration / 100);
        const newTimer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(newTimer);
                    handleNextStory();
                    return 100;
                }
                return prev + increment;
            });
        }, 100);

        setTimer(newTimer);
    };

    const handleNextStory = () => {
        setProgress(0);
        setCompletedStories(prev => [...prev, stories[currentStoryIndex].id]);
        setCurrentStoryIndex(prevIndex => {
            const nextIndex = prevIndex + 1;
            if (nextIndex < stories.length) {
                return nextIndex;
            }
            handleCloseStoryModal();
            return prevIndex;
        });
    };

    const handleSelect = (index) => {
        if (!completedStories.includes(stories[index].id)) {
            setCurrentStoryIndex(index);
            setProgress(0);
            clearInterval(timer);
            startTimer();
        }
    };

    const handleStoryClick = (index) => {
        if (!completedStories.includes(stories[index].id)) {
            setCurrentStoryIndex(index);
            setProgress(0);
            clearInterval(timer);
            startTimer();
        }
    };

    return (
        <Modal
            show={showStoryModal}
            onHide={handleCloseStoryModal}
            dialogClassName="modal-fullscreen"
            contentClassName="modal-content-fullscreen"
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Body className="p-0 d-flex justify-content-center align-items-center position-relative modal-body-custom">
                {stories.length > 0 && (
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            position: 'relative',
                            maxWidth: '500px',
                            borderRadius: '15px',
                            overflow: 'hidden',
                            boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.6)',
                        }}
                    >
                        <Carousel
                            activeIndex={currentStoryIndex}
                            onSelect={handleSelect}
                            interval={null}
                            controls={false}
                            indicators={false}
                            wrap={false}
                            style={{ height: '100%' }}
                        >
                            {stories.map((story, index) => (
                                <Carousel.Item key={story.id} style={{ height: '100%' }}>
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            position: 'relative',
                                            borderRadius: '15px',
                                            overflow: 'hidden',
                                        }}
                                        onClick={() => handleStoryClick(index)}
                                    >
                                        <Box
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                padding: '1rem', // Optional: padding to add space around the image
                                            }}
                                        >
                                            <img
                                                src={story.img}
                                                alt={story.name}
                                                style={{
                                                    maxWidth: '100%',
                                                    maxHeight: '100%',
                                                    objectFit: 'contain', // Use contain to ensure the whole image is visible
                                                    display: 'block',
                                                    margin: 'auto',
                                                }}
                                            />
                                        </Box>
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                padding: '1rem',
                                                zIndex: 2,
                                                color: 'white',
                                                backdropFilter: 'blur(6px)',
                                            }}
                                        >
                                            <Typography
                                                variant="h6"
                                                component="div"
                                                sx={{
                                                    mb: 0.5,
                                                    textShadow: '0px 2px 10px rgba(0, 0, 0, 0.7)',
                                                }}
                                            >
                                                {story.name}
                                            </Typography>
                                            <Box
                                                sx={{
                                                    height: '4px',
                                                    width: '100%',
                                                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                                    position: 'relative',
                                                    borderRadius: '2px',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        height: '100%',
                                                        width: `${progress}%`,
                                                        backgroundColor: 'white',
                                                        transition: 'width 0.1s linear',
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                    </Box>
                                </Carousel.Item>
                            ))}
                        </Carousel>
                        <IconButton
                            onClick={handleCloseStoryModal}
                            sx={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                zIndex: 2,
                                color: 'white',
                            }}
                        >
                            <Close />
                        </IconButton>
                    </Box>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default StoryModal;

 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Modal, Carousel } from 'react-bootstrap';
import { Avatar, Typography, Box, IconButton, TextField } from '@mui/material';
import { Favorite, Comment, Share, Bookmark } from '@mui/icons-material';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './Home.css'
import throttle from 'lodash/throttle';
import StoryModal from './StoryModal';
import { Link, useNavigate } from 'react-router-dom';
import { useAddCommentMutation, useFetchPostsQuery, useLikePostMutation } from '../redux/services/userFunctionalityApi';
import { getToken } from '../redux/services/LocalStorageService';
import { setOtherPosts, setUserId, setUserInfo, setUserPosts } from '../redux/features/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useGetLoggedUserQuery } from '../redux/services/userAuthApi';


// Story data
const stories = [
  { id: 1, name: 'Preeti', img: 'https://assets.vogue.in/photos/5fd20134627a009203fa47b2/2:3/w_1920,c_limit/kiara%20advani%20beauty%20skincare%20makeup%20hair.jpg', viewed: false },
  { id: 2, name: 'Dimple', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLXgBwAX3EnD4cwUBHngoatlDGiaHsI9IMIA&s', viewed: true },
  { id: 3, name: 'Reet', img: 'https://assets.vogue.in/photos/5fd20134627a009203fa47b2/2:3/w_1920,c_limit/kiara%20advani%20beauty%20skincare%20makeup%20hair.jpg', viewed: false },
  { id: 4, name: 'Katha', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiOq30Hq9oYy4R8KaXqrMMYkp01jSOqSIZOg&s', viewed: true },
  { id: 5, name: 'Rashmi', img: 'https://assets.vogue.in/photos/5fd20134627a009203fa47b2/2:3/w_1920,c_limit/kiara%20advani%20beauty%20skincare%20makeup%20hair.jpg', viewed: false },
];


// Trending topics data
const trendingTopics = [
  { id: 1, topic: '#TechNews', tweets: '120K' },
  { id: 2, topic: '#ReactJS', tweets: '80K' },
  { id: 3, topic: '#WebDevelopment', tweets: '65K' },
];

// Suggestions for you data
const suggestions = [
  { id: 1, name: 'John Doe', mutualFriends: 10, img: 'https://via.placeholder.com/50', isPrivate: false },
  { id: 2, name: 'Jane Smith', mutualFriends: 8, img: 'https://via.placeholder.com/50', isPrivate: true },
  { id: 3, name: 'Michael Johnson', mutualFriends: 5, img: 'https://via.placeholder.com/50', isPrivate: false },
];

// Emojis to suggest
const emojiSuggestions = ['😊', '😂', '😍', '👍', '🎉'];

const Home = () => {
  // const [posts, setPosts] = useState(postsData);
  const [showAllComments, setShowAllComments] = useState({});
  const [selectedStory, setSelectedStory] = useState(null);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [initialStoryIndex, setInitialStoryIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0); // Manage current index
  const [progress, setProgress] = useState(0);
  const [isFirstFetch, setIsFirstFetch] = useState(true);
  const postlikeuserid = useSelector((state) => state.user.postlikeuserid);


  // trend='#coding'
  const { access_token } = getToken()
  const { data: userposts, error, isLoading } = useFetchPostsQuery({ access_token });
  console.log(userposts);

  const { data: loggedUserData, error: loggedUserError, isSuccess: loggedUserSuccess } = useGetLoggedUserQuery(access_token);
  const dispatch = useDispatch()
  const [likePost] = useLikePostMutation(); // RTK Query hook



  const progressRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (showStoryModal && selectedStory) {
      setProgress(0);
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prev + (100 / 15); // progress over 15 seconds
        });
      }, 1000);

      return () => clearInterval(timer);
    }
    if (loggedUserSuccess && isFirstFetch) {
      dispatch(setUserId({ postlikeuserid: loggedUserData.id }));
      setIsFirstFetch(false)
    }
  }, [showStoryModal, selectedStory, dispatch, isFirstFetch]);

  // const handleSave = (id) => {
  //   setPosts(posts.map(post =>
  //     post.id === id ? { ...post, saved: !post.saved } : post
  //   ));
  // };

  // const handleCommentChange = (event, id) => {
  //   const { value } = event.target;
  //   setPosts(posts.map(post =>
  //     post.id === id ? { ...post, newComment: value } : post
  //   ));
  // };

  // const handleCommentSubmit = (id) => {
  //   setPosts(posts.map(post =>
  //     post.id === id
  //       ? {
  //         ...post,
  //         comments: [...post.comments, { text: post.newComment, avatar: 'https://via.placeholder.com/30' }],
  //         newComment: '',
  //       }
  //       : post
  //   ));
  // };

  // const toggleShowAllComments = (id) => {
  //   setShowAllComments(prevState => ({
  //     ...prevState,
  //     [id]: !prevState[id],
  //   }));
  // };

  const handleProfileRedirect = (isPrivate, id) => {
    if (isPrivate) {
      navigate(`user/private-profile/${id}`);
    } else {
      navigate(`user/profile/${id}`, { state: { userPosts: userposts } });
    }
  };

  const handleStoryClick = (story) => {
    setSelectedStory(story);
    setShowStoryModal(true);
  };

  const handleCloseStoryModal = () => {
    setShowStoryModal(false);
    setSelectedStory(null);
  };
  const handleOpenStoryModal = (index) => {
    setInitialStoryIndex(index); // Set the correct index of the story to open
    setShowStoryModal(true);
  };
  const handleScroll = useCallback(
    throttle((event) => {
      if (event.deltaY > 0) {
        // Scroll down: go to next item
        setCurrentIndex((prevIndex) => (prevIndex + 1) % stories.length);
      } else {
        // Scroll up: go to previous item
        setCurrentIndex((prevIndex) => (prevIndex - 1 + stories.length) % stories.length);
      }
    }, 300), // Throttle delay
    [stories.length]
  );
  // const [liked,setLiked]=useState(false)
  const [likedPosts, setLikedPosts] = useState({}); // Store temporary liked states

  const handleLike = async (postId) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId], // Toggle like state for the specific post
    }));

    try {
      // Send like request to the backend
      const response = await likePost({ postId, access_token }).unwrap();
      console.log("Like response:", response);

      if (response.message === "Already liked") {
        // If the user already liked, revert the optimistic update
        setLikedPosts((prev) => ({
          ...prev,
          [postId]: false,
        }));
      }
    } catch (error) {
      console.error("Error liking the post:", error);
      // If there's an error, revert the optimistic update
      setLikedPosts((prev) => ({
        ...prev,
        [postId]: false,
      }));
    }
  };
  console.log(postlikeuserid);
  console.log(userposts);


  return (
    <Container fluid>
      <Row>
        {/* Centered Content */}
        <Col md={8} lg={6} className="mx-auto">
          {/* Stories Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Stories
            </Typography>
            <Box
              sx={{
                display: 'flex',
                overflowX: 'auto',
                overflowY: 'hidden',
                whiteSpace: 'nowrap',
                padding: '10px 0',
                '&::-webkit-scrollbar': {
                  display: 'none'
                }
              }}
            >
              <TransitionGroup>
                {stories.map(story => (
                  <CSSTransition key={story.id} timeout={300} classNames="fade">
                    <Box
                      sx={{
                        display: 'inline-block',
                        textAlign: 'center',
                        marginRight: 2, // spacing between story items
                      }}
                      onClick={() => handleOpenStoryModal(story.id - 1)} // Pass the correct index
                    >
                      <Avatar
                        src={story.img}
                        sx={{
                          width: 80,
                          height: 80,
                          cursor: 'pointer',
                          border: story.viewed ? '2px solid gray' : '2px solid blue',
                        }}
                      />
                      <Typography variant="caption" sx={{ mt: 1 }}>
                        {story.name}
                      </Typography>
                    </Box>
                  </CSSTransition>
                ))}
              </TransitionGroup>
            </Box>
          </Box>

          {/* Posts */}
          {!userposts ? (
            <div>No posts available.</div>
          ) : (
            userposts.map(post => (
              <Card key={post.id} className="mb-4 shadow-sm">
                <Card.Header style={{ cursor: "pointer" }} className="d-flex align-items-center bg-light" onClick={() => handleProfileRedirect(post.created_by.is_private, post.created_by.id)}>
                  <Avatar src={"http://127.0.0.1:8000" + post.created_by.profile_picture} alt={post.created_by.username} sx={{ mr: 2 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{post.created_by.username}</Typography>
                </Card.Header>
                {/* Conditionally render images */}
                {post.attachments && post.attachments.length === 1 ? (
                  <img
                    className="d-block w-100"
                    src={post.attachments[0].get_media_url}
                    alt="Post Image"
                    style={{ height: 'auto', maxHeight: '500px', objectFit: 'fill' }}
                  />
                ) : null}
                <Card.Body>
                  <Typography variant="body1" gutterBottom>{post.body}</Typography>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <IconButton aria-label="like" onClick={() => handleLike(post.id)}>
                        <Favorite sx={{ color: post.likes.some((like) => like.created_by.id === postlikeuserid) || likedPosts[post.id] ? 'red' : 'inherit' }} />
                      </IconButton>
                      <span>{likedPosts[post.id] ? post.likes_count + 1 : post.likes_count}</span>
                    </div>
                    <div>
                      <IconButton aria-label="comment">
                        <Comment />
                      </IconButton>
                      <span>{post.comments_count}</span>
                    </div>
                    <div>
                      <IconButton aria-label="share">
                        <Share />
                      </IconButton>
                    </div>
                    <div>
                      <IconButton aria-label="save" onClick={() => { }}>
                        <Bookmark sx={{ color: post.saved ? 'black' : 'inherit' }} />
                      </IconButton>
                    </div>
                  </div>
                  {/* Comments Section */}
                  <CommentsSection post={post} />
                </Card.Body>
              </Card>
            ))
          )}
        </Col>

        {/* Right Sidebar */}
        <Col md={4} className="d-none d-md-block">
          {/* Trending Topics */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              Trending Topics
            </Typography>
            <ListGroup>
              {trendingTopics.map(topic => (
                <ListGroup.Item key={topic.id}>
                  <Typography variant="body2">
                    {topic.topic} <span style={{ float: 'right' }}>{topic.tweets} Tweets</span>
                  </Typography>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Box>

          {/* Suggestions for You */}
          <Box>
            <Typography variant="h5" component="h2" gutterBottom>
              Suggestions for You
            </Typography>
            <ListGroup>
              {suggestions.map(suggestion => (
                <ListGroup.Item
                  key={suggestion.id}
                  action
                  onClick={() => handleProfileRedirect(suggestion.isPrivate, suggestion.id)}
                >
                  <div className="d-flex align-items-center">
                    <Avatar src={suggestion.img} alt={suggestion.name} sx={{ mr: 2 }} />
                    <div>
                      <Typography variant="subtitle1">{suggestion.name}</Typography>
                      <Typography variant="body2">{suggestion.mutualFriends} mutual friends</Typography>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Box>
        </Col>
      </Row>
      {/* Story Model */}
      <StoryModal
        showStoryModal={showStoryModal}
        handleCloseStoryModal={handleCloseStoryModal}
        stories={stories}
        initialStoryIndex={initialStoryIndex} // Pass the initial story index
      />
    </Container >
  );
};
export default Home;



const CommentsSection = ({ post }) => {
  const [addComment] = useAddCommentMutation();
  const [newComment, setNewComment] = useState('');
  const [emojiSuggestions] = useState(['😊', '😂', '❤️']);
  const [showAll, setShowAll] = useState(false); // State to control comment visibility
  const access_token = localStorage.getItem("access_token");

  const handleCommentSubmit = async (postId) => {
    if (newComment.trim()) {
      await addComment({ postId, comment: newComment, access_token });
      setNewComment(''); // Clear input after submit
    }
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleShowAll = () => {
    setShowAll(true);
  };

  // Show only 2 comments initially, show all if 'showAll' is true
  const visibleComments = showAll ? post.comments : post.comments.slice(0, 2);

  return (
    <Box>
      {/* Display existing comments */}
      <Box sx={{ mt: 2 }}>
        {post.comments.map((comment) => (
          <Box key={comment.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar src={"http://127.0.0.1:8000" + comment.created_by.profile_picture} sx={{ width: 30, height: 30, mr: 1 }} />
            <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', mr: 1 }}>
              {comment.created_by.username}:
            </Typography>
            <Typography variant="body2" gutterBottom>{comment.text}</Typography>
          </Box>
        ))}
        {!showAll && post.comments.length > 2 && (
          <Button onClick={handleShowAll} sx={{ mt: 2 }}>
            Show All
          </Button>
        )}
      </Box>

      {/* {post.comments.map((comment) => (
        <div className="comment">
          <img src={comment.created_by['profile_picture']} alt={comment.created_by['username']} className="comment-avatar" />
          <div className="comment-body">
            <strong>{comment.created_by['username']}</strong>
            <p>{comment.body}</p>
          </div>
        </div>
      ))} */}

      {/* Add new comment */}
      <Box sx={{ mt: 2 }}>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Add a comment..."
          value={newComment}
          onChange={handleCommentChange}
          InputProps={{
            endAdornment: (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {emojiSuggestions.map((emoji, index) => (
                  <IconButton key={index} onClick={() => setNewComment(newComment + emoji)}>
                    <Typography>{emoji}</Typography>
                  </IconButton>
                ))}
                <IconButton aria-label="emoji">
                  <EmojiEmotionsIcon />
                </IconButton>
              </Box>
            ),
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleCommentSubmit(post.id);
            }
          }}
        />
      </Box>
    </Box>
  );
};

// export default CommentsSection;


const PostCommentsModal = ({ post }) => {
  const [openComment, setOpenComment] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const handleShowAll = () => {
    setShowAll(true);
  };

  const handleOpencommentsModal = () => {
    setOpenComment(true);
  };

  const handleClose = () => {
    setOpenComment(false);
    setShowAll(false); // reset showAll state when modal closes
  };

  return (
    <>
      {/* Button to trigger modal */}
      <Button onClick={handleOpencommentsModal}>
        View Comments ({post.comments.length})
      </Button>

      {/* Modal for displaying comments */}
      <Modal open={openComment} onClose={handleClose}>
        <Box sx={{ width: 400, bgcolor: 'background.paper', p: 3, mx: 'auto', mt: 10, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Comments
          </Typography>

          {/* Comment section */}
          {post.comments.slice(0, showAll ? post.comments.length : 2).map((comment) => (
            <Box key={comment.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar src={"http://127.0.0.1:8000" + comment.created_by.profile_picture} sx={{ width: 30, height: 30, mr: 1 }} />
              <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', mr: 1 }}>
                {comment.created_by.username}:
              </Typography>
              <Typography variant="body2" gutterBottom>{comment.text}</Typography>
            </Box>
          ))}

          {/* Show All button */}
          {!showAll && post.comments.length > 2 && (
            <Button onClick={handleShowAll} sx={{ mt: 2 }}>
              Show All
            </Button>
          )}

          {/* Close button */}
          <Button onClick={handleClose} sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
};


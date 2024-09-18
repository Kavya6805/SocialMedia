import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Button,
  IconButton,
  TextField,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CallIcon from '@mui/icons-material/Call';
import VideocamIcon from '@mui/icons-material/Videocam';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import Picker from 'emoji-picker-react';
import MicOffIcon from '@mui/icons-material/MicOff';
import MicIcon from '@mui/icons-material/Mic';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import ChatIcon from '@mui/icons-material/Chat';
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const DirectMessage = () => {
  const [showRequests, setShowRequests] = useState(false);
  const [showHiddenRequests, setShowHiddenRequests] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState({
    'Group 1': [
      { text: 'Hey there!', sender: 'Other' },
      { text: 'Hi! How are you?', sender: 'You' }
    ],
    'Group 2': [{ text: 'Hello Group 2!', sender: 'Other' }]
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [username, setUsername] = useState('user_1');
  const [isEditingUsername, setIsEditingUsername] = useState(false);

  // State for modals
  const [openVideoCall, setOpenVideoCall] = useState(false);
  const [openVoiceCall, setOpenVoiceCall] = useState(false);

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isVolumeOn, setIsVolumeOn] = useState(true);

  const fileInputRef = useRef(null);
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(min-width:601px) and (max-width:900px)');

  const handleRequestsClick = () => {
    setShowRequests(true);
    setShowHiddenRequests(false);
  };

  const handleBackClick = () => {
    if (showHiddenRequests) {
      setShowHiddenRequests(false);
    } else {
      setShowRequests(false);
    }
  };

  const handleHiddenRequestsClick = () => {
    setShowHiddenRequests(true);
  };

  const handleChatClick = (chatName) => {
    setActiveChat(chatName);
    setShowRequests(false);
    setShowHiddenRequests(false);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && activeChat) {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [activeChat]: [...(prevMessages[activeChat] || []), { text: newMessage, sender: 'You' }]
      }));
      setNewMessage('');

      setTimeout(() => {
        setMessages((prevMessages) => ({
          ...prevMessages,
          [activeChat]: [...(prevMessages[activeChat] || []), { text: 'Got it! Thanks.', sender: 'Other' }]
        }));
      }, 1000);
    }
  };

  const handleEmojiClick = (event, emojiObject) => {
    if (emojiObject && emojiObject.emoji) {
      setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
    }
    setShowEmojiPicker(false);
  };

  const handleAttachClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewMessage((prevMessage) => prevMessage + ` [Attachment: ${file.name}]`);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleEditUsernameClick = () => {
    setIsEditingUsername(true);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleUsernameBlur = () => {
    setIsEditingUsername(false);
  };

  const handleUsernameKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleUsernameBlur();
    }
  };

  const handleOpenVideoCall = () => {
    setOpenVideoCall(true);
  };

  const handleCloseVideoCall = () => {
    setOpenVideoCall(false);
  };

  const handleOpenVoiceCall = () => {
    setOpenVoiceCall(true);
  };

  const handleCloseVoiceCall = () => {
    setOpenVoiceCall(false);
  };

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const handleToggleCamera = () => {
    setIsCameraOn((prev) => !prev);
  };

  const handleToggleVolume = () => {
    setIsVolumeOn((prev) => !prev);
  };

  const handleEndCall = () => {
    handleCloseVideoCall();
    handleCloseVoiceCall();
  };

  return (
    <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} height="100vh">
      {/* Sidebar */}
      <Box
        width={isMobile ? (activeChat ? '0px' : '100%') : isTablet ? '250px' : '300px'}
        borderRight={!isMobile && '1px solid #ddd'}
        p={2}
        overflow="auto"
        display={activeChat && isMobile ? 'none' : 'block'}
        position="relative"
        transition="width 0.3s ease"
      >
        {isMobile && activeChat && (
          <IconButton
            onClick={() => setActiveChat(null)}
            style={{ position: 'absolute', top: 10, left: 10 }}
          >
            <ArrowBackIosIcon />
          </IconButton>
        )}
        <Box display="flex" alignItems="center" mb={2} justifyContent="space-between">
          {isEditingUsername ? (
            <TextField
              value={username}
              onChange={handleUsernameChange}
              onBlur={handleUsernameBlur}
              onKeyPress={handleUsernameKeyPress}
              autoFocus
              fullWidth
            />
          ) : (
            <Typography variant="h6">{username}</Typography>
          )}
          <IconButton onClick={handleEditUsernameClick}>
            <EditIcon />
          </IconButton>
        </Box>

        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="subtitle1">Messages</Typography>
          <Button variant="text" onClick={handleRequestsClick}>
            <Typography variant="subtitle1">Requests</Typography>
          </Button>
        </Box>

        {!showRequests && !showHiddenRequests && (
          <Box>
            <Box display="flex" alignItems="center" mb={2} onClick={() => handleChatClick('Group 1')} sx={{ cursor: 'pointer' }}>
              <Avatar sx={{ bgcolor: '#eee', width: 40, height: 40, mr: 1 }}>👤</Avatar>
              <Box>
                <Typography variant="subtitle2">Group 1</Typography>
                <Typography variant="caption" color="textSecondary">
                  You sent an attachment · 8m
                </Typography>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" mb={2} onClick={() => handleChatClick('Group 2')} sx={{ cursor: 'pointer' }}>
              <Avatar sx={{ bgcolor: '#eee', width: 40, height: 40, mr: 1 }}>👤</Avatar>
              <Box>
                <Typography variant="subtitle2">Group 2</Typography>
                <Typography variant="caption" color="textSecondary">
                  You sent an attachment · 8m
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {showRequests && !showHiddenRequests && (
          <Box>
            <IconButton onClick={handleBackClick}>
              <ArrowBackIosIcon />
            </IconButton>
            <Typography variant="h6">Message Requests</Typography>
            <Box display="flex" alignItems="center" mb={2} onClick={() => handleHiddenRequestsClick()} sx={{ cursor: 'pointer' }}>
              <Avatar sx={{ bgcolor: '#eee', width: 40, height: 40, mr: 1 }}>
                <VisibilityOffIcon />
              </Avatar>
              <Typography variant="subtitle2">Hidden Requests</Typography>
            </Box>
          </Box>
        )}

        {showHiddenRequests && (
          <Box>
            <IconButton onClick={handleBackClick}>
              <ArrowBackIosIcon />
            </IconButton>
            <Typography variant="h6">Hidden Requests</Typography>
          </Box>
        )}
      </Box>

      {/* Chat Box */}
      <Box flexGrow={1} display="flex" flexDirection="column" position="relative">
        {activeChat && (
          <Box p={2} borderBottom="1px solid #ddd" display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center">
              <Avatar sx={{ bgcolor: '#eee', width: 40, height: 40, mr: 1 }}>👤</Avatar>
              <Typography variant="h6">{activeChat}</Typography>
            </Box>
            <Box>
              <IconButton onClick={handleOpenVoiceCall}>
                <CallIcon />
              </IconButton>
              <IconButton onClick={handleOpenVideoCall}>
                <VideocamIcon />
              </IconButton>
            </Box>
          </Box>
        )}
        <Box flexGrow={1} p={2} overflow="auto">
          {activeChat &&
            messages[activeChat]?.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={message.sender === 'You' ? 'flex-end' : 'flex-start'}
                mb={2}
              >
                <Typography
                  variant="body1"
                  sx={{
                    bgcolor: message.sender === 'You' ? '#e0f7fa' : '#e0e0e0',
                    color: 'textPrimary',
                    borderRadius: 2,
                    p: 1.5,
                    maxWidth: '60%'
                  }}
                >
                  {message.text}
                </Typography>
              </Box>
            ))}
        </Box>

        {activeChat && (
          <Box display="flex" alignItems="center" p={2} borderTop="1px solid #ddd">
            <IconButton onClick={() => setShowEmojiPicker((prev) => !prev)}>
              <EmojiEmotionsIcon />
            </IconButton>
            <IconButton onClick={handleAttachClick}>
              <AttachFileIcon />
            </IconButton>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Type a message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <IconButton onClick={handleSendMessage}>
              <SendIcon />
            </IconButton>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            {showEmojiPicker && (
              <Box position="absolute" bottom="60px" left="50px" zIndex={1}>
                <Picker onEmojiClick={handleEmojiClick} />
              </Box>
            )}
          </Box>
        )}

        {/* Video Call Modal */}
        <Dialog open={openVideoCall} onClose={handleCloseVideoCall} fullWidth maxWidth="md">
          <DialogTitle>Video Call</DialogTitle>
          <DialogContent sx={{ p: 0, height:"auto" }}>
            <Box display="flex" justifyContent="space-around" alignItems="center" minHeight="350px">
              <Box display="flex" flexDirection="column" alignItems="center">
                <Avatar sx={{ bgcolor: '#eee', width: 80, height: 80, mb: 1 }}>👤</Avatar>
                <Typography variant="h6">{activeChat}</Typography>
              </Box>
              <Box display="flex" flexDirection="column" alignItems="center">
                <IconButton onClick={handleToggleMute}>
                  {isMuted ? <MicOffIcon color="error" /> : <MicIcon color="primary" />}
                </IconButton>
                <IconButton onClick={handleToggleCamera}>
                  {isCameraOn ? <VideocamIcon color="primary" /> : <VideocamOffIcon color="error" />}
                </IconButton>
                <IconButton onClick={handleToggleVolume}>
                  {isVolumeOn ? <VolumeUpIcon color="primary" /> : <VolumeOffIcon color="error" />}
                </IconButton>
              </Box>
            </Box>
          </DialogContent>
          <Divider />
          <DialogActions>
            <IconButton onClick={handleEndCall} color="error">
              <PhoneDisabledIcon />
            </IconButton>
            <IconButton onClick={handleCloseVideoCall} color="primary">
              <ChatIcon />
            </IconButton>
          </DialogActions>
        </Dialog>

        {/* Voice Call Modal */}
        <Dialog open={openVoiceCall} onClose={handleCloseVoiceCall} fullWidth maxWidth="xs">
          <DialogTitle>Voice Call</DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            <Box display="flex" justifyContent="space-around" alignItems="center" minHeight="200px">
              <Box display="flex" flexDirection="column" alignItems="center">
                <Avatar sx={{ bgcolor: '#eee', width: 60, height: 60, mb: 1 }}>👤</Avatar>
                <Typography variant="h6">{activeChat}</Typography>
              </Box>
              <Box display="flex" flexDirection="column" alignItems="center">
                <IconButton onClick={handleToggleMute}>
                  {isMuted ? <MicOffIcon color="error" /> : <MicIcon color="primary" />}
                </IconButton>
                <IconButton onClick={handleToggleVolume}>
                  {isVolumeOn ? <VolumeUpIcon color="primary" /> : <VolumeOffIcon color="error" />}
                </IconButton>
              </Box>
            </Box>
          </DialogContent>
          <Divider />
          <DialogActions>
            <IconButton onClick={handleEndCall} color="error">
              <PhoneDisabledIcon />
            </IconButton>
            <IconButton onClick={handleCloseVoiceCall} color="primary">
              <ChatIcon />
            </IconButton>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default DirectMessage;

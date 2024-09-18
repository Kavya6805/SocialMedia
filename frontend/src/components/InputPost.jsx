import Profile from '../assets/profile-pic.jpeg';
import { Container, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import FormGroup from "@mui/material/FormGroup";
import SendIcon from "@mui/icons-material/Send";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
// import avatarImage from "./icon.jpg"; // Adjust the path to your image

import { useDispatch, useSelector } from "react-redux";
import { useCreatePostMutation } from "../redux/services/userFunctionalityApi";
import { getToken } from "../redux/services/LocalStorageService";
import { useNavigate } from "react-router-dom";
import { increment } from "../redux/features/userSlice"

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function InputPost({open,setOpen,handleClose,darkMode}) {
  const { access_token } = getToken();
  const [server_error, setServerError] = useState({});
  const [server_msg, setServerMsg] = useState({});
  const dispatch = useDispatch();
  const [userPost] = useCreatePostMutation();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedBody, setSelectedBody] = useState("");

  const handleFileChange = (event) => {
    console.log(event.target.files[0]);

    setSelectedFile(event.target.files[0]);
  };

  const handleShare = async (event) => {
    event.preventDefault();
    // const data = new FormData(event.currentTarget);
    // const actualData = {
    //   body: data.get('post_body'),
    //   image: data.get('image'),

    // }
    const formData = new FormData();
    formData.append("body", selectedBody);
    formData.append("image", selectedFile);

    // console.log("xyz " + JSON.stringify(data.get('image')));
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    const res = await userPost({ FormData:formData, access_token });
    if (res.error) {
      setServerMsg({});
      setServerError(res.error.error);  
      console.log(res.error);
    }
    if (res.data) {
      dispatch(increment());
      console.log(res.data)
      setServerError({})
      setServerMsg(res.data)
      setOpen(false)
      navigate('/')
      document.getElementById("create-post").reset();
    }
  };

  const { name } = useSelector((state) => state.user);


  return (
    <>
      {/* <Button
        variant="contained"
        onClick={handleOpen}
        color="info"
        sx={{
          backgroundColor: "#4CA2FF",
          color: "#ffffff",
          marginLeft: 2,
          textTransform: "none",
          borderRadius: "8px",
          padding: "6px 16px",
          fontSize: "14px",
        }}
      >
        + Create Post
      </Button> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          marginTop: "20vh",
        }}
      >
        <Box>
          <Container
            maxWidth="md"
            sx={{
              bgcolor: "white",
              borderRadius: "10px",
              p: "10px",
              height: "60vh",
            }}
          >
            <form method="POST" onSubmit={handleShare} id="create-post">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "15%",
                }}
              >
                <Box
                  sx={{
                    borderRadius: "100%",
                    height: "50px",
                    width: "50px",
                    display: "inline",
                    mr: "10px",
                  }}
                  component="img"
                  src={Profile}
                />

                <Typography variant="h2" fontSize={"20px"}>
                  {name}
                </Typography>
              </Box>

              <TextField
                id="outlined-multiline-static"
                label={`What's in your mind ${name}?`}
                multiline
                rows={7}
                sx={{ width: "100%", marginLeft: "1%", marginTop: "3vh" }}
                onChange={(e) => setSelectedBody(e.target.value)}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginTop: "3vh",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <InsertPhotoIcon sx={{ display: "flex", fontSize: "35px" }} />
                  {/* <Insert type="Image" sx={{ display: "flex" }} name="image" /> */}
                  <input
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </Box>
              </Box>
              <Button
                variant="outlined"
                color="secondary"
                type="submit"
                sx={{
                  width: "100%",
                  color: "black",
                  marginTop: "4vh",
                }}
              >
                Share
              </Button>
            </form>
          </Container>
        </Box>
      </Modal>
    </>
  );
}
function PostOnClick() {
  const navigate=useNavigate()
  const [open, setOpen] = useState(true); // Manage modal open state
  const handleClose = () => {setOpen(false)
    navigate('/')
  }
  return (
    <>
      
      {/* Modal component */}
      <InputPost open={open} setOpen={setOpen} handleClose={handleClose} darkMode={false} />
    </>
  );
}

export {PostOnClick}
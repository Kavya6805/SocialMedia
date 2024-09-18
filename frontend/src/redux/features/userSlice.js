import { createSlice } from '@reduxjs/toolkit'

const initialState = {

  id:"",
  postlikeuserid:null,
  email: "",
  username: "",
  bio: "",
  date_of_birth: "",
  name: "",
  posts: [],
  otherPosts:[],
  myPosts:[]
}

export const userSlice = createSlice({
  name: 'user_info',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.id=action.payload.id
      state.email = action.payload.email
      state.username = action.payload.username
      state.name = action.payload.name
      state.date_of_birth = action.payload.date_of_birth
      state.bio = action.payload.bio
    },
    unsetUserInfo: (state, action) => {
      state.id=''
      state.email = ''
      state.username = ''
      state.name = ''
      state.date_of_birth = ''
      state.bio = ''
    },
    increment: (state) => {
      state.posts_count += 1;
    },
    setUserPosts: (state, action) => {
      state.posts = action.payload; // Store posts in the state
    },
    unSetUserPosts: (state, action) => {
      state.posts = []; // Store posts in the state
    },
    setOtherPosts: (state, action) => {
      state.otherPosts=action.payload
    },
    unSetOtherPosts: (state, action) => {
      state.otherPosts=[]
      
    },
    setMyPosts: (state, action) => {
      state.myPosts=action.payload
    },
    unSetMyPosts: (state, action) => {
      state.myPosts=[]
      
    },
    setOtherUserInfo: (state, action) => {
      state.id=action.payload.id
      state.email = action.payload.email
      state.username = action.payload.username
      state.name = action.payload.name
      state.date_of_birth = action.payload.date_of_birth
      state.bio = action.payload.bio
    },
    unsetOtherUserInfo: (state, action) => {
      state.id=''
      state.email = ''
      state.username = ''
      state.name = ''
      state.date_of_birth = ''
      state.bio = ''
    },
    setUserId: (state, action) => {
      state.postlikeuserid = action.payload.postlikeuserid;
    }
  }
})

export const { setUserInfo, unsetUserInfo, increment, setUserPosts,unSetUserPosts,setOtherPosts,setOtherUserInfo,unsetOtherUserInfo,setUserId,setOtherProfilePosts,unSetOtherProfilePosts,setMyPosts,unSetMyPosts } = userSlice.actions

export default userSlice.reducer
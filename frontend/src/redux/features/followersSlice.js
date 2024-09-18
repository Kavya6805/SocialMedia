import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  followers: [],
  following: [],
};

export const followersSlice = createSlice({
  name: 'followers',
  initialState,
  reducers: {
    setFollowers: (state, action) => {
      state.followers = action.payload.followers;
    },
    unsetFollowers: (state) => {
      state.followers = [];
    },
    setFollowing: (state, action) => {
      state.following = action.payload.following;
    },
    unsetFollowing: (state) => {
      state.following = [];
    },
  },
});

export const { setFollowers, unsetFollowers, setFollowing, unsetFollowing } = followersSlice.actions;

export default followersSlice.reducer;

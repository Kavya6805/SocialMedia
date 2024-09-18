import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const userDetailsApi = createApi({
  reducerPath: 'userDetailsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/' }),
  endpoints: (builder) => ({
    getFollowers: builder.query({
        query: ({ userId, access_token }) => {
          console.log(userId);
          
          return{
            url: `users/${userId}/followers/`, 
            method: 'GET',
            headers: {
              'authorization': `Bearer ${access_token}`,
            }
          }
        }
      }),
        getFollowing: builder.query({
            query: ({userId, access_token }) => ({
              url: `users/${userId}/following/`,
              method: 'GET',
              headers: {
                'authorization': `Bearer ${access_token}`,
              },
            }),
          }),
        getOtherUserDetail: builder.query({
            query: ({userId, access_token }) => ({
              url: `user/${userId}/profile/`,
              method: 'GET',
              headers: {
                'authorization': `Bearer ${access_token}`,
              },
            }),
          }),
        followUser:builder.mutation({
          query:({urlUserId,access_token})=>(
            {
              url:`follow/`,
              method:'POST',
              body:{"user_id": urlUserId},
              headers:{
                'authorization': `Bearer ${access_token}`,
              }
            }
          )
        }),
        unfollowUser:builder.mutation({
          query:({urlUserId,access_token})=>(
            {
              url:`unfollow/`,
              method:'POST',
              body:{"user_id": urlUserId},
              headers:{
                'authorization': `Bearer ${access_token}`,
              }
            }
          )
        }),
        checkFollowStatus: builder.query({
          query: ({ userId, access_token }) => ({
            url: `/users/${userId}/is-following/`,
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }),
        }),
        updateUserProfile: builder.mutation({
          query: ({ userData, access_token }) => {
            console.log(userData);
            const formData = new FormData();

            // Append all user data to FormData, including both text fields and files
            Object.keys(userData).forEach((key) => {
              formData.append(key, userData[key]);
            });
        
            return{
            url: `user/profile/updateprofile/`,  // Assuming this is the endpoint for updating the profile
            method: 'PUT',
            body: formData,  // This will contain the updated profile data like username, birthdate, etc.
            headers: {
              'authorization': `Bearer ${access_token}`,
            },
          }},
        }),
        searchUsers: builder.query({
          query: (searchTerm) => `search/?q=${searchTerm}`,
        }),
    }),
})

export const {useGetFollowersQuery,useGetFollowingQuery,useGetOtherUserDetailQuery,useFollowUserMutation,useUnfollowUserMutation,useCheckFollowStatusQuery,useUpdateUserProfileMutation,useSearchUsersQuery }=userDetailsApi
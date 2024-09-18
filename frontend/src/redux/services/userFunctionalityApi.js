import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const userFunctionalityApi = createApi({
    reducerPath: 'userFunctionalityApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/' }),
    tagTypes: ['Post'],  // Add tagTypes for caching/invalidation
  
    endpoints: (builder) => ({
      createPost: builder.mutation({
        query: ({ FormData, access_token }) => ({
          url: `post/create/`,
          method: 'POST',
          body: FormData,
          headers: {
            authorization: `Bearer ${access_token}`,  // Authorization header
          },
        }),
  
        // This will invalidate the 'Post' cache tag after the mutation
        invalidatesTags: ['Post'],
      }),
      
      // Example of a query using 'Post' cache
      getPosts: builder.query({
        query: () => 'post/list',
        providesTags: ['Post'],  // Indicates that this query provides the 'Post' cache
      }),
      fetchPosts: builder.query({
        query: ({trend = '',access_token}) => ({
          url: `posts/`,
          method: 'GET',
          headers: {
            'authorization': `Bearer ${access_token}`,  
            'Content-type': 'application/json'
          },
          params: trend ? { trend } : {},
        }),
      }),
      fetchProfilePosts:builder.query({
        query: ({userId,access_token}) => ({
          url: `post-profile/?id=${userId}`,
          headers:{
            'authorization': `Bearer ${access_token}`,
            'Content-type': 'application/json'
          }
        })
      }),
      likePost: builder.mutation({
        query: ({postId,access_token}) => {
          // console.log(postId);
          return{
          url: `post/${postId}/like/`,
          method: 'POST',
          headers:{
            'authorization': `Bearer ${access_token}`,
            'Content-type': 'application/json'
          },
        }},
      }),
      addComment: builder.mutation({
        query: ({ postId, comment, access_token }) => {
          return {
            url: `post/${postId}/comment/`,
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${access_token}`,
              'Content-type': 'application/json',
            },
            body: JSON.stringify({ comment }), // Payload for the comment
          };
        },
      }),
    })
  })
  
export const {useCreatePostMutation,useFetchPostsQuery,useGetPostsQuery,useFetchProfilePostsQuery,useLikePostMutation,useAddCommentMutation }=userFunctionalityApi
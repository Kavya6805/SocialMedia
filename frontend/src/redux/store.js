import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { userAuthApi } from '../redux/services/userAuthApi'
import authReducer from '../redux/features/authSlice'
import userReducer from '../redux/features/userSlice'
import { userDetailsApi } from './services/userDetailApi'
import { userFunctionalityApi } from './services/userFunctionalityApi'

const saveStateToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('reduxState', serializedState);
  } catch (e) {
    console.error("Could not save state", e);
  }
};

// Function to load state from localStorage
const loadStateFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('reduxState');
    if (serializedState === null) return undefined; // Return undefined to use the initial state
    return JSON.parse(serializedState);
  } catch (e) {
    console.error("Could not load state", e);
    return undefined;
  }
};
// Load the state from localStorage
const persistedState = loadStateFromLocalStorage();
export const store = configureStore({
  reducer: {
    [userAuthApi.reducerPath]: userAuthApi.reducer,
    auth: authReducer,
    user: userReducer,
    [userDetailsApi.reducerPath]: userDetailsApi.reducer,
    [userFunctionalityApi.reducerPath]: userFunctionalityApi.reducer,

  },
  preloadedState: persistedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userAuthApi.middleware)
      .concat(userDetailsApi.middleware)
      .concat(userFunctionalityApi.middleware)
})

setupListeners(store.dispatch)

store.subscribe(() => {
  const state = store.getState();
  console.log('Current state:', state); // Debugging

  saveStateToLocalStorage({
    user: state.user, // Save the 'user' part of the state
    otherUser: state.otherUser, // Ensure 'otherUser' state is included if needed
  });
});



import { createSlice } from "@reduxjs/toolkit";
import userService from "../services/users";

const userSlice = createSlice({
  name: "users",
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload;
    },
  },
});

export const { setUsers } = userSlice.actions;

export const initializeUsers = () => async (dispatch) => {
  const users = await userService.getAll();
  dispatch(setUsers(users));
};

// Add a selector for fetching a user by ID
export const selectUserById = (state, userId) => 
  state.users.find(user => user.id === userId);


export default userSlice.reducer;

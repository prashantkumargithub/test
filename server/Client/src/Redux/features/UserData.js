import { createSlice } from "@reduxjs/toolkit";

const initialState = { value: undefined };

export const UserData = createSlice({
    name: "UserData",
    initialState,
    reducers: {
        setUserData: (state, action) => {
            state.value = action.payload;
        }
    }
})

export const { setUserData } = UserData.actions;
export default UserData.reducer;

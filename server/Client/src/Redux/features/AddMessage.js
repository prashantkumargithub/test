import { createSlice } from "@reduxjs/toolkit";

const initialState = { 
  value: [],
};

export const AddMessage = createSlice({
    name: "AddMessage",
    initialState,
    reducers: {
        setAddMessage: (state, action) => {
            state.value = state.value.concat(action.payload.value);
        },
        setEmptyAddMessage: (state, action) => {
            state.value = action.payload.value;
        },
    }
});

export const { setAddMessage,setEmptyAddMessage } = AddMessage.actions;
export default AddMessage.reducer;

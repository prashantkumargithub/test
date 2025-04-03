import { createSlice } from "@reduxjs/toolkit";

const initialState = { value: undefined };

export const Slice = createSlice({
    name: "ChatType",
    initialState,
    reducers: {
        setSelectedChatType: (state, action) => {
            state.value = action.payload;
        }
    }
})

export const { setSelectedChatType } = Slice.actions;
export default Slice.reducer;

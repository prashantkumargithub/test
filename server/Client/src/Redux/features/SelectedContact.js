import { createSlice } from "@reduxjs/toolkit";

const initialState = { value: {} };

export const selectedContacts = createSlice({
    name: "SelectedContacts",
    initialState,
    reducers: {
        setSelectedContacts: (state, action) => {
            state.value = action.payload;
        }
    }
})

export const { setSelectedContacts } = selectedContacts.actions;
export default selectedContacts.reducer;

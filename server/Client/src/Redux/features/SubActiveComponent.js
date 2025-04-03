import { createSlice } from "@reduxjs/toolkit";

const initialState = { value: undefined };

export const SubActiveComponentSlice = createSlice({
    name: "SubActiveComponent",
    initialState,
    reducers: {
        setSubActiveComponent: (state, action) => {
            state.value = action.payload;
        }
    }
})

export const { setSubActiveComponent } = SubActiveComponentSlice.actions;
export default SubActiveComponentSlice.reducer;

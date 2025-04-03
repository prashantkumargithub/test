import { createSlice } from "@reduxjs/toolkit";

const initialState = { value: "chat" };

export const activeComponentSlice = createSlice({
    name: "ActiveComponent",
    initialState,
    reducers: {
        setActiveComponent: (state, action) => {
            state.value = action.payload;
        }
    }
})

export const { setActiveComponent } = activeComponentSlice.actions;
export default activeComponentSlice.reducer;

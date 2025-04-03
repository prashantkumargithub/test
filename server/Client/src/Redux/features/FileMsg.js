import { createSlice } from "@reduxjs/toolkit";

const initialState = { 
    isUploading: false,
    isDownloading: false,
    fileUploadProgress: 0,
    fileDownloadProgress: 0,
};

export const FileMsg = createSlice({
    name: "FileMsg",
    initialState,
    reducers: {
        setUploadingStatus: (state, action) => {
            state.isUploading = action.payload;
        },
        setDownloadingStatus: (state, action) => {
            state.isDownloading = action.payload;
        },
        setFileUploadProgress: (state, action) => {
            state.fileUploadProgress = action.payload;
        },
        setFileDownloadProgress: (state, action) => {
            state.fileDownloadProgress = action.payload;
        },
        resetFileMsgState: (state) => {
            state.isUploading = false;
            state.isDownloading = false;
            state.fileUploadProgress = 0;
            state.fileDownloadProgress = 0;
        },
    }
});

export const { 
    setUploadingStatus, 
    setDownloadingStatus, 
    setFileUploadProgress, 
    setFileDownloadProgress,
    resetFileMsgState 
} = FileMsg.actions;

export default FileMsg.reducer;

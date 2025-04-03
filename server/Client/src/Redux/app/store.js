import { configureStore } from "@reduxjs/toolkit";
import chatTypeReducer from "../features/Slice";
import activeComponentReducer from "../features/ActiveComponent"
import selectedContactsReducer from "../features/SelectedContact";
import userDataReducer from "../features/UserData";
import AddMessageReducer from "../features/AddMessage";
 import fileMsgReducer from "../features/FileMsg";
import subActiveComponentReducer from "../features/SubActiveComponent"

export const store = configureStore({
  reducer: {
    ChatType: chatTypeReducer,//The message page
    ActiveComponent:activeComponentReducer,//The component who is active liek home , ctories, contact
    SelectedContact :selectedContactsReducer,//Contact User data of the selectd chat
    UserData:userDataReducer,//Admin user data
    AddMessage:AddMessageReducer,//New message
    FileMsg:fileMsgReducer,//File in message states
    SubActiveComponent:subActiveComponentReducer,//Ffor sub componetns
  },
});

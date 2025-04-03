import { HOST } from "@/utils/constant";
import { createContext, useContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { setAddMessage } from "../Redux/features/AddMessage";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const dispatch = useDispatch();
  const UserData = useSelector((state) => state.UserData.value);
  const ChatType = useSelector((state) => state.ChatType.value);
  const SelectedContact = useSelector((state) => state.SelectedContact.value);

  const chatTypeRef = useRef(ChatType);
  const selectedContactRef = useRef(SelectedContact);

  // Update the refs when state changes
  useEffect(() => {
    chatTypeRef.current = ChatType;
    selectedContactRef.current = SelectedContact;
  }, [ChatType, SelectedContact]);

  useEffect(() => {
    if (UserData) {
      socket.current = io(import.meta.env.VITE_HOST_URL, {
        withCredentials: true,
        query: { UserId: UserData._id },
      });
      

      socket.current.on("connect", () => {});

      const handleRecieveMessage = (message) => {
        const currentChatType = chatTypeRef.current;
        const currentSelectedContact = selectedContactRef.current;

        if (currentChatType !== undefined &&
            (currentSelectedContact._id === message.sender._id ||
             currentSelectedContact._id === message.recipent._id)) {
          dispatch(setAddMessage({
            value: message,
          }));
        }
      };

      // Listen for messages
      socket.current.on("recieveMessage", handleRecieveMessage);

      // Cleanup on component unmount or UserData change
      return () => {
        socket.current.disconnect();
      };
    }
  }, [UserData, dispatch]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};

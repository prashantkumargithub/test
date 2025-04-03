import { useSocket } from "@/context/SocketContext";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { apiClient } from "@/lib/api-client";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { UPLOAD_FILE_ROUTES, UNBLOCKED_USER_ROUTES } from "@/utils/constant";
import { useDispatch } from "react-redux";
import {
  setUploadingStatus,
  setFileUploadProgress,
} from "@/Redux/features/FileMsg";
import { setSelectedChatType } from "@/Redux/features/Slice";
import { setSelectedContacts } from "@/Redux/features/SelectedContact";
import { useNavigate } from "react-router-dom";

function MessageBar(props) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const emojiRef = useRef();
  const InputFileRef = useRef();
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [emojiPicker, setEmojiPicker] = useState(false);
  const ChatType = useSelector((state) => state.ChatType.value);
  const SelectedContact = useSelector((state) => state.SelectedContact.value);
  const UserData = useSelector((state) => state.UserData.value);
  const [isFocused, setIsFocused] = useState(false);

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (ChatType === "contact") {
      if (message.length !== 0) {
        socket.emit("sendMessage", {
          sender: UserData._id,
          recipent: SelectedContact._id,
          messageType: "text",
          content: message,
          fileUrl: undefined,
          fileName: undefined,
        });
        setMessage("");
      }
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  // Message with files
  const handleAttachmentsClick = () => {
    if (InputFileRef.current) {
      InputFileRef.current.click();
    }
  };

  const handleAttachmentsChange = async (event) => {
    try {
      const token = localStorage.getItem("User_Token");
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        dispatch(setUploadingStatus(true));
        dispatch(setFileUploadProgress(50));
        const response = await apiClient.post(UPLOAD_FILE_ROUTES, formData, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(setFileUploadProgress(90));
        if (response.status === 200) {
          dispatch(setFileUploadProgress(100));
          dispatch(setUploadingStatus(false));
          if (ChatType === "contact") {
            socket.emit("sendMessage", {
              sender: UserData._id,
              recipent: SelectedContact._id,
              messageType: "file",
              content: undefined,
              fileUrl: response.data.filePath,
              fileName: response.data.fileName,
            });
          }
        }
      }
    } catch (err) {
      dispatch(setFileMsg({ isUploading: false }));
      if (axios.isAxiosError(err)) {
        toast({
          variant: "destructive",
          title: err.response?.data || "An error occurred",
          description: "Check the credentials you entered",
        });
      } else {
        toast({
          variant: "destructive",
          title: `An unexpected error occurred ${err}`,
          description: "Please try again later",
        });
      }
    }
  };

  return (
    <div
      className={`h-[10vh] flex justify-center items-center pr-2 pl-1 ${
        isFocused ? "mb-8" : "mb-8"
      } transition-all duration-300`}
    >
      <div className="flex-1 flex bg-[#8696a026] rounded-l-lg items-center gap-5 pr-5">
          <input
            type="text"
            className="flex-1 p-4 bg-transparent rounded-md focus:border-none focus:outline-none w-full"
            placeholder="Type a message"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration 300 transition-all"
            onClick={handleAttachmentsClick}
          >
            <GrAttachment className="text-2xl" />
          </button>
          <input
            type="file"
            className="hidden"
            ref={InputFileRef}
            onChange={handleAttachmentsChange}
          />
          <div className="relative hidden lg:flex">
            <button
              className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration 300 transition-all"
              onClick={() => {
                setEmojiPicker(true);
              }}
            >
              <RiEmojiStickerLine className="text-2xl" />
            </button>
            <div className="absolute bottom-16 right-0" ref={emojiRef}>
              <EmojiPicker
                open={emojiPicker}
                theme="dark"
                onEmojiClick={handleAddEmoji}
                autoFocusSearch={false}
              />
            </div>
          </div>
      </div>
      <button
        className="bg-[#1bc052] rounded-r-lg flex items-center justify-center px-5  py-4 text-neutral-500 focus:bg-[#359153] focus:border-none focus:outline-none focus:text-white duration 300 transition-all"
        onClick={handleSendMessage}
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
}

export default MessageBar;

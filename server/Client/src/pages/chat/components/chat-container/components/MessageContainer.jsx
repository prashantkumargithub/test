import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAddMessage, setEmptyAddMessage } from "@/Redux/features/AddMessage";
import { apiClient } from "@/lib/api-client";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import {
  DELETE_MESSAGE_ROUTES,
  GET_MESSAGE_ROUTES,
  HOST,
} from "@/utils/constant";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoClose, IoCreate, IoTrash } from "react-icons/io5";
import {
  setDownloadingStatus,
  setFileDownloadProgress,
} from "@/Redux/features/FileMsg";
import { FaTrash } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyChatContainer from "../../empytChat-container/index";

function MessageContainer(props) {
  const scrollRef = useRef();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [ShowImage, setShowImage] = useState(false);
  const [ImageURL, setImageURL] = useState(null);
  const [ImageName, setImageName] = useState(null);
  const ChatType = useSelector((state) => state.ChatType.value);
  const SelectedContact = useSelector((state) => state.SelectedContact.value);
  const UserData = useSelector((state) => state.UserData.value);
  const AddMessage = useSelector((state) => state.AddMessage.value);
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [skeleton, setSkeleton] = useState(true);
  // Clear messages before fetching new ones based on the selected contact and chat type
  useEffect(() => {
      if (ChatType === "contact") {
        dispatch(setEmptyAddMessage({ value: [] }));
        getMessage();
      }
  }, [ChatType,SelectedContact]);

  // Fetch messages from the server
  const getMessage = async () => {
    setSkeleton(true);
    const token = localStorage.getItem("User_Token");
    try {
      const response = await apiClient.post(
        GET_MESSAGE_ROUTES,
        {
          id: SelectedContact._id,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 200) {
        setSkeleton(false);
        dispatch(setEmptyAddMessage({ value: [] }));
        dispatch(
          setAddMessage({
            value: response.data.messages,
          })
        );
      }
    } catch (err) {
      setSkeleton(false);
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
  // Scroll to the latest message when new messages are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [AddMessage]);
  //File message
  const CheckIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };
  //Downlaod file
  const downlaodFile = async (url, name) => {
    dispatch(setFileDownloadProgress(30));
    dispatch(setDownloadingStatus(true));
    const response = await apiClient.get(
      `${import.meta.env.VITE_HOST_URL}/file/MsgFiles/${url}`,
      { responseType: "blob" }
    );
    dispatch(setFileDownloadProgress(50));
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", name);
    document.body.appendChild(link);
    dispatch(setFileDownloadProgress(90));
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    dispatch(setFileDownloadProgress(100));
    dispatch(setDownloadingStatus(false));
  };
  // Function to render the message history
  const renderMessages = () => {
    let lastDate = null;
    return AddMessage.map((message, index) => {
      const messageDate = moment(message.timestamp).format("DD-MM-YYYY");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {/* Display date when it changes */}
          {showDate && (
            <div className="text-center text-gray-500 my-2 ">
              {moment(message.timestamp).format("LL")}
            </div>
          )}

          {/* Render message for 'contact' type chat */}
          {ChatType === "contact" && (
            <div>
              <div
                className={`w-full flex ${
                  message.sender._id === SelectedContact._id
                    ? "justify-start"
                    : "justify-end"
                }`}
              >
                {message.messageType === "text" && (
                  <div
                    onMouseEnter={() => {
                      setHoveredMessageId(message._id);
                    }}
                    onMouseLeave={() => {
                      setHoveredMessageId(null);
                    }}
                  >
                    {message.sender._id !== SelectedContact._id &&
                      hoveredMessageId === message._id && (
                        <button
                          className="m-2 text-red-500 hover:text-red-700"
                          onClick={() =>
                            handleDeleteMessage(
                              message._id,
                              message.messageType,
                              message.fileUrl
                            )
                          }
                        >
                          <FaTrash />
                        </button>
                      )}
                    <div
                      className={`${
                        message.sender._id === SelectedContact._id
                          ? "bg-gray-200 text-black"
                          : "bg-blue-500 text-white"
                      } inline-block p-3 rounded-xl max-w-xs break-words my-1`}
                    >
                      {message.content}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {moment(message.timestamp).format("LT")}
                    </div>
                  </div>
                )}

                {message.messageType === "file" && (
                  <div>
                    <div
                      onMouseEnter={() => {
                        setHoveredMessageId(message._id);
                      }}
                      onMouseLeave={() => {
                        setHoveredMessageId(null);
                      }}
                      className="flex items-center"
                    >
                      {message.sender._id !== SelectedContact._id &&
                        hoveredMessageId === message._id && (
                          <button
                            className="m-2 text-red-500 hover:text-red-700"
                            onClick={() =>
                              handleDeleteMessage(
                                message._id,
                                message.messageType,
                                message.fileUrl
                              )
                            }
                          >
                            <FaTrash />
                          </button>
                        )}
                      <div
                        className={`${
                          message.sender._id === SelectedContact._id
                            ? "bg-gray-200 text-black"
                            : "bg-blue-500 text-white"
                        } rounded-xl max-w-xs break-words my-1 flex-1 p-1`}
                      >
                        {CheckIfImage(message.fileUrl) ? (
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              setShowImage(true);
                              setImageURL(message.fileUrl);
                              setImageName(message.fileName);
                            }}
                          >
                            <img
                              src={`${
                                import.meta.env.VITE_HOST_URL
                              }/file/MsgFiles/${message.fileUrl}`}
                              alt="Image"
                              className=" rounded-lg"
                              height={200}
                              width={200}
                            />
                          </div>
                        ) : (
                          <div
                            className="cursor-pointer p-2"
                            onClick={() =>
                              downlaodFile(message.fileUrl, message.fileName)
                            }
                          >
                            <MdFolderZip className="text-5xl" />
                            {message.fileName}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {moment(message.timestamp).format("LT")}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      );
    });
  };
  const handleDeleteMessage = async (MsgId, MsgType, fileUrl) => {
    try {
      const token = localStorage.getItem("User_Token");
      const response = await apiClient.delete(
        DELETE_MESSAGE_ROUTES,
        {
          data: {
            MsgId: MsgId,
            MsgType: MsgType,
            fileUrl: fileUrl,
          },
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 200) {
        getMessage();
      }
    } catch (err) {
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
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 w-full custom-scrollbar min-h-[70vh] max-h-[80vh]">
      {skeleton && (
        <div>
          <div className="w-full  flex justify-start">
            <div className="block  space-x-2">
              <Skeleton className="h-4 w-[200px] mb-2" />
              <Skeleton className="h-4 w-[200px] mb-2" />
            </div>
          </div>
          <div className="w-full flex justify-end">
            <div className="block  space-x-2">
              <Skeleton className="h-4 w-[200px] mb-2" />
              <Skeleton className="h-4 w-[200px] mb-2" />
            </div>
          </div>
        </div>
      )}{" "}
      {renderMessages()}
      <div ref={scrollRef} />
      {ShowImage && (
        <div className="fixed  z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col ">
          <div>
            <img
              src={`${import.meta.env.VITE_HOST_URL}/file/MsgFiles/${ImageURL}`}
              className={`max-h-[80vh] h-auto p-1 sm:max-w-[700px]    mx-1 my-2 w-[calc(100%-1rem)]  bg-cover border-2 border-blue-500 rounded-lg`}
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-2 ">
            <button className="p-3 text-2xl rounded-full hover:bg-gray-600 cursor-pointer transition-all duration-300">
              <IoMdArrowRoundDown
                onClick={() => downlaodFile(ImageURL, ImageName)}
              />
            </button>
            <button className="p-3 text-2xl rounded-full hover:bg-gray-600 cursor-pointer transition-all duration-300">
              <IoClose onClick={() => setShowImage(false)} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageContainer;

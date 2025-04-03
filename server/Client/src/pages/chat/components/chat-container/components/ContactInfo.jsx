import React from "react";
import { RiCloseFill } from "react-icons/ri";
import { setSubActiveComponent } from "@/Redux/features/SubActiveComponent";
import { useDispatch } from "react-redux";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useSelector } from "react-redux";
import { apiClient } from "@/lib/api-client";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { BLOCKED_USER_ROUTES, DELETE_CHAT_ROUTES } from "@/utils/constant";
import { setSelectedChatType } from "@/Redux/features/Slice";
import { setSelectedContacts } from "@/Redux/features/SelectedContact";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function ContactInfo(props) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const Contact_info = useSelector((state) => {
    return state.SelectedContact.value;
  });
  let Theme = {};
  if (props.theme === "dark") {
    Theme = {
      bg: "bg-[#19232c] ",
      text: "text-white",
      secondarText: "text-slate-300",
      border: "[#2f303b]",
    };
  } else {
    Theme = {
      bg: "bg-[#fff]",
      text: "text-black",
      secondarText: "text-slate-500",
      border: "[#f7f4f4]",
    };
  }
  const handleDeleteChat = async () => {
    try {
      const token = localStorage.getItem("User_Token");
      if (!token) {
        toast({
          variant: "destructive",
          title: "Authentication error",
          description: "No token found. Please log in again.",
        });
        return;
      }

      const response = await apiClient.delete(DELETE_CHAT_ROUTES, {
        data: {
          id: Contact_info._id,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      const { status } = response;
      if (status === 200) {
        dispatch(setSubActiveComponent(undefined));
        dispatch(setSelectedChatType(undefined));
        dispatch(setSelectedContacts({}));
        toast({
          variant: "success",
          title: "Chat deleted successfully.",
        });
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
          title: `An unexpected error occurred: ${err.message}`,
          description: "Please try again later",
        });
      }
    }
  };
  const getInitials = (firstName = "", lastName = "") => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };

  const handleBlockUser = async () => {
    try {
      const token = localStorage.getItem("User_Token");
      if (!token) {
        toast({
          variant: "destructive",
          title: "Login Please",
          description: "No token found. Please log in again.",
        });
        navigate("/auth");
        return;
      }

      const response = await apiClient.post(
        BLOCKED_USER_ROUTES,
        {
          id: Contact_info._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      const { status } = response;
      if (status === 200) {
        dispatch(setSubActiveComponent(undefined));
        dispatch(setSelectedChatType(undefined));
        dispatch(setSelectedContacts({}));
        toast({
          variant: "success",
          title: "User Blocked successfully.",
        });
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
          title: `An unexpected error occurred: ${err.message}`,
          description: "Please try again later",
        });
      }
    }
  };

  return (
    <div
      className={`${Theme.bg} border-l-2 border-${Theme.border}  w-[100vw] lg:w-[30vw] z-30 h-full  overflow-y-scroll custom-scrollbar duration 300 transition-all`}
    >
      <div
        className={`h-[10vh] border-b-2 fixed z-30 ${Theme.bg}  border-${Theme.border} w-full gap-5 flex items-center p-2`}
      >
        <button
          className={`duration 300 transition-all ${Theme.button}`}
          onClick={() => {
            dispatch(setSubActiveComponent(undefined));
          }}
        >
          <RiCloseFill className="text-3xl" />
        </button>
        <p className={`text-xl `}>Details</p>
      </div>
      <div
        className={`h-auto mt-[10vh] border-b-8${
          props.theme === "dark" ? "border-[#111b21] " : "border-[#f3f4f7]"
        } w-full  p-2 `}
      >
        <Dialog
        >
          <DialogTrigger asChild>
            <div className="flex justify-center items-center cursor-pointer">
              <Avatar className="h-40 w-40 rounded-full">
                {Contact_info?.image ? (
                  <AvatarImage
                    src={`${import.meta.env.VITE_HOST_URL}/image/profileImage/${
                      Contact_info?.image
                    }`}
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div
                    className={`uppercase w-40 h-40 text-xl flex items-center justify-center rounded-full ${getColor(
                      Contact_info?.color
                    )}`}
                  >
                    {getInitials(
                      Contact_info?.firstName,
                      Contact_info?.lastName
                    )}
                  </div>
                )}
              </Avatar>
            </div>
          </DialogTrigger>
          <DialogContent
            className={`sm:max-w-80 mx-2 my-1 w-[calc(100%-2rem)] mr-1 border  rounded-xl ${
              props.theme === "dark"
                ? " bg-slate-900 border-slate-900 text-white"
                : "border-white"
            }`}
          >
            <DialogHeader>
              <DialogTitle>
              {Contact_info?.firstName} {Contact_info?.lastName}
              </DialogTitle>
            </DialogHeader>
            <div className="flex justify-center items-center w-full">
                {Contact_info?.image ? (
                  <img
                    src={`${import.meta.env.VITE_HOST_URL}/image/profileImage/${
                      Contact_info?.image
                    }`}
                    alt="Profile"
                    className="object-fit w-auto max-w-80 max-h-80 h-auto rounded-xl"
                  />
                ) : (
                  <div
                    className={`uppercase w-80 h-80 text-3xl flex items-center justify-center  ${getColor(
                      Contact_info?.color
                    )}`}
                  >
                    {getInitials(
                      Contact_info?.firstName,
                      Contact_info?.lastName
                    )}
                  </div>
                )}
            </div>
          </DialogContent>
        </Dialog>
        <div className="flex justify-center items-center">
          <div className="">
            <p className="text-xl font-semibold">
              {Contact_info?.firstName} {Contact_info?.lastName}
            </p>
            <p
              className={`text-lg text-center ${
                props.theme === "dark" ? "text-slate-500 " : "text-slate-500"
              }`}
            >
              {Contact_info?.UserName}
            </p>
          </div>
        </div>
        <div className="px-4 ">
          <p className={`text-lg font-semibold `}>About</p>
          <p className={`text-lg ${Theme.secondarText} `}>
            {Contact_info?.bio}
          </p>
        </div>
        <div className="px-4 ">
          <p className={`text-lg font-semibold`}>Contact</p>
          <p className={`text-lg  ${Theme.secondarText} `}>
            Email: {Contact_info?.email}
          </p>
          <p className={`text-lg  ${Theme.secondarText} `}>
            Mobile: +91 {Contact_info?.phone}
          </p>
        </div>
      </div>
      <div
        className={`h-[20vh] border-t-8 ${
          props.theme === "dark" ? "border-[#111b21] " : "border-[#f3f4f7]"
        } w-full`}
      >
        <div className="p-2 gap-5 ">
          <p
            className={`text-lg  text-red-500 hover:text-red-600 cursor-pointer`}
            onClick={handleDeleteChat}
          >
            Delete Chat
          </p>
          {/* <AlertDialog>
            <AlertDialogTrigger>
              <p
                className={`text-lg  text-red-500 hover:text-red-600 cursor-pointer`}
              >
                Block
              </p>
            </AlertDialogTrigger>
            <AlertDialogContent
              className={`rounded-2xl mx-1 my-2 w-[calc(100%-2rem)] mr-1 border ${
                props.theme == "dark"
                  ? " bg-slate-900 border-slate-900 text-white"
                  : "border-white"
              }`}
            >
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to block?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  You won't be able to send or receive messages until you
                  unblock. The messages will be deleted and can't be backup.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  className={`${props.theme == "dark" ? " text-black" : ""}`}
                >
                  Cancle
                </AlertDialogCancel>
                <AlertDialogAction
                  className={`font-bold text-lg text-red-500 border border-red-500 bg-transparent hover:bg-red-500 hover:text-white`}
                  onClick={handleBlockUser}
                >
                  Block
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog> */}
        </div>
      </div>
    </div>
  );
}

export default ContactInfo;

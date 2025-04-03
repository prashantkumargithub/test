import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDispatch } from "react-redux";
import { setActiveComponent } from "@/Redux/features/ActiveComponent";
import { setSelectedContacts } from "@/Redux/features/SelectedContact";
import { setSelectedChatType } from "@/Redux/features/Slice";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { apiClient } from "@/lib/api-client";
import { GET_USER_LIST_DM_ROUTES } from "@/utils/constant";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import {
  IoArrowForwardOutline,
  IoHelp,
  IoLanguage,
  IoChatbox,
} from "react-icons/io5";
import { MdSecurity } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
function ProfileContainer(props) {
  //Definig variable and states
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const ChatType = useSelector((state) => {
    return state.ChatType.value;
  });
  const ActiveComponent = useSelector((state) => {
    return state.ActiveComponent.value;
  });
  const SubActiveComponent = useSelector(
    (state) => state.SubActiveComponent.value
  );
  const [User, setUser] = useState([]);
  const [SearchedUsers, setSearchedUsers] = useState([]);
  const [SearchedTerm, setSearchedTerm] = useState("");
  //Theme conditions
  let Theme = {};
  if (props.theme === "dark") {
    Theme = {
      bg: "bg-[#19232c] ",
      border: "border-[#2f303b] ",
      search: "bg-[#222e35] .input-dark",
      badge: "bg-[#111b21] hover:text-white",
      text: "text-white",
    };
  } else {
    Theme = {
      bg: "bg-[#fff]",
      border: "border-[#f7f4f4] ",
      search: "bg-[#f3f4f7] .input-light",
      badge: "bg-[#a8aaa9] text-[#fff]",
      text: "text-black",
    };
  }
  const transition = {
    duration: 0.3,
    ease: "easeInOut",
  };

  const variants = {
    initial: { opacity: 0, y: 100 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 100 },
  };

  const getInitials = (firstName = "", lastName = "") => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };
  return (
    <>
      <div
        className={`${Theme.bg} ${
          SubActiveComponent === "ContactInfo" ? "w-0" : " w-full"
        } lg:w-[23vw] lg:border-r-2 ${Theme.border}`}
      >
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transition}
          variants={variants}
        >
          <div className="lg:static relative">
            <div
              className={`lg:pt-5 text-3xl p-1 font-semibold flex items-center justify-between border-b-2 ${Theme.border} `}
            >
              <span className="p-3">Settings</span>
            </div>
          </div>
          <div className="h-[62vh] lg:h-[70vh] w-full p-3 relative">
            <Link to="/AccountSettings">
            {/* //Acount Settings */}
            <div className={`h-auto w-full  p-2 cursor-pointer   `}>
              <div className="flex justify-between px-4 gap-3 items-center">
                <div className="flex justify-center items-center gap-2">
                  <Avatar className="h-12 w-12 rounded-full">
                    {props.user?.image ? (
                      <AvatarImage
                        src={`${
                          import.meta.env.VITE_HOST_URL
                        }/image/profileImage/${props.user?.image}`}
                        alt="Profile"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div
                        className={`uppercase w-12 h-12 text-xl flex items-center justify-center rounded-full ${getColor(
                          props.user?.color
                        )}`}
                      >
                        {getInitials(
                          props.user?.firstName,
                          props.user?.lastName
                        )}
                      </div>
                    )}
                  </Avatar>
                  <p className="text-lg ">
                    {props.user?.firstName} {props.user?.lastName}
                    <p
                      className={`text-md text-center ${
                        props.theme === "dark"
                          ? "text-slate-500 "
                          : "text-slate-500"
                      }`}
                    ></p>
                  </p>
                </div>
                <IoArrowForwardOutline className="text-xl" />
              </div>
            </div>
            </Link>
            {/* Security settings  */}
            <Link to="/SecuritySettings">
              <div className={`h-auto w-full  p-2 cursor-pointer   pt-3`}>
                <div className="flex justify-between px-4 gap-3 items-center">
                  <div className="flex justify-center items-center gap-2">
                    <MdSecurity className="text-2xl" />
                    <p className="text-lg ">Security Settings</p>
                  </div>
                  <IoArrowForwardOutline className="text-xl" />
                </div>
              </div>
            </Link>
            {/* Help adn Support  */}
            <Link to="/HelpSettings">
              <div className={`h-auto w-full  p-2 cursor-pointer  pt-3 `}>
                <div className="flex justify-between px-4 gap-3 items-center">
                  <div className="flex justify-center items-center gap-2">
                    <IoHelp className="text-2xl" />
                    <p className="text-lg ">Help and Support</p>
                  </div>
                  <IoArrowForwardOutline className="text-xl" />
                </div>
              </div>
            </Link>

            {/* Logout  */}
            <div className={`h-auto w-full  p-2 cursor-pointer  pt-3 `}>
              <div className="flex justify-between px-4 gap-3 items-center">
                <AlertDialog>
                  <AlertDialogTrigger>
                    <div className="flex text-red-500 gap-3">
                      <IoIosLogOut className={`text-2xl`} />
                      <p className={`text-lg`}>Logout</p>
                    </div>
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
                        Are you sure you want to log out?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        You won't be able to send or receive messages until you
                        log back in.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        className={`${
                          props.theme == "dark" ? " text-black" : ""
                        }`}
                      >
                        Stay Connected
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className={`font-bold text-lg text-red-500 border border-red-500 bg-transparent hover:bg-red-500 hover:text-white`}
                        onClick={() => {
                          localStorage.removeItem("User_Token");
                          navigate("/")
                        }}
                      >
                        Log Out
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default ProfileContainer;

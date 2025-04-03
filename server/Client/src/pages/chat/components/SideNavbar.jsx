import React, { useState } from "react";
import icon from "@/assets/icon.svg";
import { IoHomeOutline } from "react-icons/io5";
import { GrGroup } from "react-icons/gr";
import { RiUserSearchLine } from "react-icons/ri";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { setActiveComponent } from "@/Redux/features/ActiveComponent";
import { useSelector } from "react-redux";
import { IoIosLogOut } from "react-icons/io";
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
import { Link,useLocation, useNavigate } from "react-router-dom";

const SideNavbar = (props) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate()
  const [Logout, setLogout] = useState(false)
  const ChatType = useSelector((state) => {
    return state.ChatType.value;
  });
  const ActiveComponent = useSelector((state) => {
    return state.ActiveComponent.value;
  });
  const UserData = useSelector((state) => {
    return state.UserData.value;
  });
  const SubActiveComponent = useSelector((state) => state.SubActiveComponent.value);

  let theme = {};
  if (props.theme === "dark") {
    theme = {
      bg: "bg-[#111b21]",
      hover: "hover:bg-[#8696a026]",
      text: "text-slate-300",
      active:"bg-[#525b63]",
    };
  } else {
    theme = {
      bg: "bg-[#f3f4f7]",
      hover: "hover:bg-gray-100",
      text: "text-slate-900",
      active:"bg-slate-300"
    };
  }

  // Apply and remove background color on body
  React.useEffect(() => {
    document.body.classList.add("bg-[#f0f2f5]");
    return () => document.body.classList.remove("bg-[#f0f2f5]");
  }, []);
  //first and last anem first letter
  const getInitials = (firstName = "", lastName = "") => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };
  if(  location.pathname === '/Settings' ||  location.pathname === '/HelpSettings' || location.pathname === '/SecuritySettings' || location.pathname ==="/AccountSettings"){
    dispatch(setActiveComponent("profile"));
  }
  else  if(  location.pathname === '/contacts'){
    dispatch(setActiveComponent("contact"));
  }
  return (
    <div
      className={`flex absolute  ${ChatType === "contact" ? "z-0" : "z-30"} ${SubActiveComponent ==="ContactInfo" ? "hidden lg:flex" : ""}`}
    >
      <div
        className={`lg:h-screen h-16 lg:w-16 w-full fixed bottom-0 p-1 lg:pt-5 ${theme.bg}`}
      >
        <div className="lg:inline-flex hidden">
          <img src={icon} alt="App Icon" />
        </div>
        <ul className="flex flex-row w-full lg:flex-col lg:pt-2 lg:h-[85%] lg:items-start lg:justify-start lg:space-y-1 space-x-4 lg:space-x-0 justify-evenly items-center">
          <Link to="/chat"
            className={`text-5xl flex items-center justify-center w-12 h-12 m-1 p-2 cursor-pointer rounded-lg ${
              theme.hover
            } ${ActiveComponent === "chat" ? theme.active : ""}`}
            onClick={() => {
              dispatch(setActiveComponent("chat"));
            }}
          >
            <IoHomeOutline className={`text-3xl ${theme.text}`} />
          </Link>
          {/* <li
            className={`text-5xl flex items-center justify-center w-12 h-12 m-1 p-2 cursor-pointer ${theme.hover} rounded-full`}
          >
            <GrGroup className={`text-3xl ${theme.text}`} />
          </li> */}
          <Link to="/contacts"
            className={`text-5xl flex items-center justify-center w-12 h-12 m-1 p-2 cursor-pointer ${
              theme.hover
            } rounded-lg  ${
              ActiveComponent === "contact" ? theme.active : ""
            } `}
            onClick={() => {
              dispatch(setActiveComponent("contact"));
            }}
          >
            <RiUserSearchLine className={`text-3xl ${theme.text}`} />
          </Link>
          <Link to="/Settings"
          onClick={() => {
            dispatch(setActiveComponent("profile"));
          }}
            className={`text-5xl flex flex-col items-center justify-center w-12 h-12 m-1 p-2 cursor-pointer ${theme.hover} rounded-lg lg:absolute lg:bottom-[70px] ${ActiveComponent === "profile" ? theme.active : ""}`}
          >
            <Avatar className="h-10 w-10 rounded-full">
              {props.user?.image ? (
                <AvatarImage
                  src={`${import.meta.env.VITE_HOST_URL}/image/profileImage/${
                    props.user?.image
                  }`}
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div
                  className={`uppercase w-10 h-10 text-xl flex items-center justify-center rounded-full ${getColor(
                    props.user?.color
                  )}`}
                >
                  {getInitials(props.user?.firstName, props.user?.lastName)}
                </div>
              )}
            </Avatar>
          </Link>
          <li
            className={`text-5xl hidden lg:flex items-center justify-center w-12 h-12 mb-5 p-2 cursor-pointer ${theme.hover} rounded-full lg:absolute lg:bottom-5`}
          >
            <AlertDialog>
              <AlertDialogTrigger>
                <IoIosLogOut className={`text-3xl ${theme.text}`} onClick={()=>setLogout(true)} />
              </AlertDialogTrigger>
              <AlertDialogContent  className={`rounded-2xl mx-1 my-2 w-[calc(100%-2rem)] mr-1 border ${props.theme=="dark" ? " bg-slate-900 border-slate-900 text-white" :"border-white"}`}>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to log out?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    You won't be able to send or receive messages until you log
                    back in.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className={`${props.theme=="dark" ? " text-black" :""}`}>Stay Connected</AlertDialogCancel>
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
          </li>
        </ul>
      </div>
    </div>

  );
};

export default SideNavbar;

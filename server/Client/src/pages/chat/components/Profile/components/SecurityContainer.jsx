import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { apiClient } from "@/lib/api-client";
import {
  DELETE_ALL_CHATS_ROUTE,
  HELP_FORM_ROUTES,
  LOGIN_ALERT_ROUTE,
} from "@/utils/constant";
import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import {
  IoArrowBackSharp,
  IoArrowForwardOutline,
  IoHelp,
  IoLanguage,
} from "react-icons/io5";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
import MoonLoader from "react-spinners/MoonLoader";
import { Switch } from "@/components/ui/switch";

function SecurityContainer(props) {
  //Defining variable and states
  const navigate = useNavigate();
  const { toast } = useToast();
  const SubActiveComponent = useSelector(
    (state) => state.SubActiveComponent.value
  );
  const UserData = useSelector((state) => state.UserData.value);
  const [disabled, setDisabled] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(null);
  // Theme conditions
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
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
  };
  useEffect(() => {
    if (UserData && UserData.loginAlert !== undefined) {
      setLoginAlerts(UserData.loginAlert);
    }
  }, [UserData]);

  const handleDelteAllChats = async () => {
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

      const response = await apiClient.delete(DELETE_ALL_CHATS_ROUTE, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      const { status } = response;
      if (status === 200) {
        toast({
          variant: "success",
          title: "Chats deleted successfully.",
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
  const handleLoginAlerts = async () => {
    setDisabled(true);
  
    // Toggle and get the new value of loginAlerts
    const updatedLoginAlerts = !loginAlerts;
    setLoginAlerts(updatedLoginAlerts);
    
    const token = localStorage.getItem("User_Token");
    if (token) {
      try {
        const response = await apiClient.post(
          LOGIN_ALERT_ROUTE,
          { loginAlert: updatedLoginAlerts },  // Send the updated value
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          setDisabled(false);
          toast({
            variant: "success",
            title: "Login Alert updated successfully",
          });
        }
      } catch (err) {
        setDisabled(false);
        if (axios.isAxiosError(err) && err.response) {
          toast({
            variant: "destructive",
            title: `An unexpected error occurred`,
            description: "Please try again.",
          });
        } else {
          toast({
            variant: "destructive",
            title: `An unexpected error occurred.`,
            description: "Please try again.",
          });
        }
      }
    } else {
      localStorage.removeItem("User_Token");
      navigate("/auth");
    }
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
              className={`lg:pt-5 text-3xl px-4 font-semibold flex items-center justify-between border-b-2 ${Theme.border} `}
            >
              <Link to="/Settings">
                <IoArrowBackSharp className="text-3xl" />
              </Link>
              <span className="p-2">Security</span>
            </div>
          </div>
          <div className="h-[62vh] lg:h-[70vh] w-full p-3 relative">
            {/* Login ALerts  */}
            <div
              className={`h-auto w-full  p-2 cursor-pointer  pt-3 border-b ${Theme.border} `}
            >
              <div className="flex justify-between  items-center">
                <div className="flex justify-center items-center gap-2 break">
                  <p className="text-lg ">
                    <p>Login Alerts!</p>
                    <p className="text-slate-500">
                      Receive emails when your account is logged in.
                    </p>
                  </p>
                </div>
                <p className="text-xl">
                  {disabled ? (
                    <MoonLoader color="#ffffff" size={20} />
                  ) : (
                    <Switch
                      checked={loginAlerts}
                      onCheckedChange={handleLoginAlerts}
                    />
                  )}
                </p>
              </div>
            </div>
            {/* Delte all chats */}
            <div
              className={`h-auto w-full  p-2 cursor-pointer  pt-3 border-b ${Theme.border} `}
            >
              <AlertDialog>
                <AlertDialogTrigger>
                  <div className="flex justify-between px-2 gap-3 items-center">
                    <p className="text-red-500 w-full text-lg">
                      Delete all chats
                    </p>
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
                      Are you sure you want to Delete all chats?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will delete all your chat history permanently
                      and cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      className={`${
                        props.theme == "dark" ? " text-black" : ""
                      }`}
                    >
                      Cancle
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className={`font-bold text-lg text-red-500 border border-red-500 bg-transparent hover:bg-red-500 hover:text-white`}
                      onClick={handleDelteAllChats}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default SecurityContainer;

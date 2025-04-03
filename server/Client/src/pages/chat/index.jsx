import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiClient } from "@/lib/api-client";
import { getUserData_ROUTES } from "@/utils/constant";
import { useToast } from "@/components/ui/use-toast";
import SideNavbar from "./components/SideNavbar";
import MessageContainer from "./components/Message-container";
import EmptyChatContainer from "./components/empytChat-container";
import ChatContainer from "./components/chat-container";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setUserData } from "@/Redux/features/UserData";
import ContactContainer from "./components/Contact";
import ContactInfo from "./components/chat-container/components/ContactInfo";

function Chat() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState();
  const dispatch = useDispatch();
  const ChatType = useSelector((state) => state.ChatType.value);
  const ActiveComponent = useSelector((state) => state.ActiveComponent.value);
  const SubActiveComponent = useSelector((state) => state.SubActiveComponent.value);
  const FileMsg = useSelector((state) => state.FileMsg);

  // Dark or light theme
  const [theme, setTheme] = useState(() => {
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    return darkModeQuery.matches ? "dark" : "light";
  });

  useEffect(() => {
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      setTheme(e.matches ? "dark" : "light");
    };

    darkModeQuery.addEventListener("change", handleChange);
    setTheme(darkModeQuery.matches ? "dark" : "light");

    return () => {
      darkModeQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    let ThemeColor = {};
    if (theme === "dark") {
      document.body.className = "bg-[#121212]";
      ThemeColor = { text: "text-white" };
    } else {
      document.body.className = "bg-[#f3f4f7]";
      ThemeColor = { text: "text-black" };
    }

    document.body.className = ThemeColor.text;

    return () => {
      document.body.className = "";
    };
  }, [theme]);

  useEffect(() => {
    const getUserData = async () => {
      const token = localStorage.getItem("User_Token");
      if (token) {
        try {
          const response = await apiClient.get(getUserData_ROUTES, {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.status === 200) {
            setUser(response.data.UserData);
            dispatch(setUserData(response.data.UserData));
            const { isVerified, profileSetup } = response.data.UserData;
            if (!isVerified) {
              navigate("/verify");
            } else if (!profileSetup) {
              navigate("/profile");
            }
          }
        } catch (err) {
          if (axios.isAxiosError(err) && err.response) {
            switch (err.response.status) {
              case 400:
                localStorage.removeItem("User_Token");
                navigate("/auth");
                break;
              case 401:
                localStorage.removeItem("User_Token");
                navigate("/auth");
                break;
              default:
                toast({
                  variant: "destructive",
                  title: err.response.data || `An error occurred`,
                  description: "Something went wrong. Please try again.",
                });
            }
          } else {
            toast({
              variant: "destructive",
              title: `An unexpected error occurred`,
              description: "Please try again.",
            });
          }
        }
      } else {
        localStorage.removeItem("User_Token");
        navigate("/auth");
      }
    };

    getUserData();
  }, [navigate, toast]);

  const renderSubActiveComponent = () => {
    return SubActiveComponent === "ContactInfo" ? (
      <ContactInfo theme={theme} />
    ) : (
      <div></div>
    );
  };

  return (
    <>
      <SideNavbar theme={theme} user={user} />
      <div
        className={`lg:ml-16 flex h-[100vh] overflow-hidden ${
          theme === "dark" ? "text-white" : "text-black"
        }`}
      >
        {ActiveComponent === "chat" && (
          <MessageContainer theme={theme} user={user} />
        )}
        {ActiveComponent === "contact" && (
          <ContactContainer theme={theme} user={user} />
        )}
        {ChatType ? (
          <ChatContainer theme={theme} user={user} />
        ) : (
          <EmptyChatContainer theme={theme} user={user} />
        )}
        {FileMsg.isUploading && (
          <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
            <h5 className="text-3xl animate-pulse">Uploading File..</h5>
            <span>{FileMsg.fileUploadProgress}%</span>
          </div>
        )}
        {/* Render the SubActiveComponent */}
        {renderSubActiveComponent()}
        {FileMsg.isDownloading && (
          <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
            <h5 className="text-3xl animate-pulse">Downloading File..</h5>
            {FileMsg.fileDownloadProgress}%
          </div>
        )}
      </div>
    </>
  );
}

export default Chat;

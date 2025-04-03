import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiClient } from "@/lib/api-client";
import { getUserData_ROUTES } from "@/utils/constant";
import { useToast } from "@/components/ui/use-toast";
import SideNavbar from "@/pages/chat/components/SideNavbar";
import EmptyChatContainer from "@/pages/chat/components/empytChat-container";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setUserData } from "@/Redux/features/UserData";
import ProfileContainer from "./components/ProfileContainer";
import HelpContainer from "./components/HelpContainer";

function HelpSupport() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState();
  const dispatch = useDispatch();
  const ChatType = useSelector((state) => state.ChatType.value);
  const ActiveComponent = useSelector((state) => state.ActiveComponent.value);
  const UserData = useSelector((state) => state.UserData.value);
  const SubActiveComponent = useSelector((state) => state.SubActiveComponent.value);

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
                toast({
                  variant: "destructive",
                  title: "Session expired.",
                  description: "Please log in again.",
                });
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
    if(!UserData){
      getUserData();
    }
    else{
      setUser(UserData)
    }
  }, [navigate, toast]);


  return (
    <>
      <SideNavbar theme={theme} user={user} />
      <div    
        className={`lg:ml-16 flex h-[100vh] overflow-hidden ${
          theme === "dark" ? "text-white" : "text-black"
        }`}
      >
          <HelpContainer theme={theme} user={user}/>
          <EmptyChatContainer theme={theme} user={user} />
      </div>
    </>
  );
}

export default HelpSupport;

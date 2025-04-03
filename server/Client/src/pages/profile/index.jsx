import React, { useState, useEffect } from "react";
import Background from "@/assets/profile.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import logo from "@/assets/logo.svg";
import icon from "@/assets/icon.svg";
import axios from "axios";
import { apiClient } from "@/lib/api-client";
import { getUserData_ROUTES, PROFILESETUP_ROUTES } from "@/utils/constant";
import MoonLoader from "react-spinners/MoonLoader";

function Profile() {
  //Dlecaring important variable
  const { toast } = useToast();
  const navigate = useNavigate();
  const [btnDisplay, setBtnDisplay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [FName, setFName] = useState("");
  const [LName, setLName] = useState("");
  const [bio, setBio] = useState("");
  const [Username, setUsername] = useState("");
  const [email, setemail] = useState("");
  //theme
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
    return () => {
      darkModeQuery.removeEventListener("change", handleChange);
    };
  }, []);
  let theme_bg = "bg-white text-black md:border-white";
  let text = "text-black";
  let input = "";
  let button = "";
  let lable = "";
  let logoColor = "text-green-900 ";
  let sloganColor = "text-sky-900";
  if (theme === "dark") {
    useEffect(() => {
      document.body.className = "bg-slate-800";
      return () => {
        document.body.className = "";
      };
    });
    theme_bg = "bg-slate-900 text-white md:border-slate-900";
    text = "text-white";
    input = "bg-slate-800 border-slate-800 ";
    button = "bg-slate-700 hover:bg-slate-800";
    lable = "bg-slate-800 text-white ";
    logoColor = "text-green-500 ";
    sloganColor = "text-sky-500";
  } else {
    useEffect(() => {
      document.body.className = "bg-[#f3f4f7]";
      return () => {
        document.body.className = "";
      };
    });
    lable = "bg-slate-200  text-gray-800";
  }

  // getting looged user data
  const token = localStorage.getItem("User_Token");
  useEffect(() => {
    const getUserData = async () => {
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
            setemail(response.data.UserData.email);
            setUsername(response.data.UserData.UserName);
            setFName(response.data.UserData.firstName);
            setLName(response.data.UserData.lastName);
            setBio(response.data.UserData.bio);
            if (response.data.UserData.profileSetup) {
              navigate("/chat");
            }
          }
        } catch (err) {
          if (axios.isAxiosError(err)) {
            if (err.response?.status === 400) {
              localStorage.removeItem("User_Token");
              navigate("/auth");
            } else if (err.response?.status === 401) {
              toast({
                variant: "destructive",
                title: "Session expired.",
                description: "Please log in again.",
              });
              localStorage.removeItem("User_Token");
              navigate("/auth");
            } else {
              toast({
                variant: "destructive",
                title: err.response?.data || "An error occured",
                description: "Something went wrong. Please try again.",
              });
            }
          }
        }
      } else {
        localStorage.removeItem("User_Token");
        navigate("/auth");
      }
    };

    getUserData();
  }, [navigate, toast]);
  //validating user input

  const validateInput = () => {
    if (!FName.length) {
      toast({
        variant: "destructive",
        title: "First Name is required",
      });
      return false;
    }
    if (!Username.length) {
      toast({
        variant: "destructive",
        title: "Username is required",
      });
      return false;
    }
    if (!bio.length) {
      toast({
        variant: "destructive",
        title: "Bio is required",
      });
      return false;
    }

    return true;
  };

  //Handling Profile setup
  const handleSubmit = async () => {
    if (validateInput()) {
      try {
        setBtnDisplay(true);
        setLoading(true);
        const response = await apiClient.post(
          PROFILESETUP_ROUTES,
          {
            FName,
            LName,
            Username,
            bio,
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if ((response.status = 200)) {
          toast({
            variant: "success",
            title: "Profiel Setup completed",
          });
          navigate("/avtar");
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
        setBtnDisplay(false);
        setLoading(false);
      }
    }
  };
  return (
    <>
      <div className="h-[30vh] bg-green-900 w-full">
        <div className="h-[100vh] md:w-[100vw] w-full bg-transparent flex md:items-center md:justify-center ">
          <div
            className={`overflow-x-hidden xl:overflow-hidden  h-[100vh] md:h-[85vh]  xl:h-[80vh]  2xl:h-[70vh] md:pb-2 pb-20  ${theme_bg} text-opacity-90 md:shadow-2xl w-full md:w-[90vw] lg:w-[70vw] xl:w-[70vw] md:rounded-3xl grid xl:grid-cols-2`}
          >
            <div className="flex justify-between m-3 xl:hidden">
              <img src={icon} alt="Victory" className="xl:hidden h-[100px]" />
              <h1 className="text-3xl md:text-4xl text-green-900 xl:hidden">
                ConnectyPi{" "}
                <span className="text-base mt-1 font-bold block px-3 text-sky-900">
                  Stay connected, Always
                </span>
              </h1>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center flex-col">
                <div className="flex flex-col items-center justify-center">
                  <h1 className="text-3xl font-bold md:text-5xl mt-8 md:mt-2">
                    Profile
                  </h1>
                </div>
                <div className="text-center w-[90%]">
                  <p className="muted font-md m-4">
                    Complete your profile by filling Basic informations.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center w-[80%] gap-3 mt-3">
                <Input
                  placeholder="First Name"
                  type="text"
                  value={FName}
                  disabled={btnDisplay}
                  onChange={(e) => setFName(e.target.value)}
                  className={input}
                />{" "}
                <Input
                  placeholder="Last Name"
                  type="text"
                  value={LName}
                  disabled={btnDisplay}
                  onChange={(e) => setLName(e.target.value)}
                  className={input}
                />
              </div>
              <div className="flex items-center justify-center w-[80%] gap-3 mt-3">
                <Input
                  placeholder="Username"
                  type="text"
                  value={Username}
                  disabled={btnDisplay}
                  onChange={(e) => setUsername(e.target.value)}
                  className={input}
                />{" "}
              </div>
              <div className="grid w-[80%] gap-3 mt-3 font-semibold">
                <Textarea
                  placeholder="Type your bio here..."
                  value={bio}
                  disabled={btnDisplay}
                  onChange={(e) => setBio(e.target.value)}
                  className={input}
                />{" "}
              </div>
              <Button
                className={`rounded-full p-6 text-lg gap-2 mt-3 flex justify-center items-center ${button}`}
                disabled={btnDisplay}
                onClick={handleSubmit}
              >
                {loading ? (
                  <MoonLoader color="#ffffff" size={20} />
                ) : (
                  "Complete"
                )}{" "}
              </Button>
            </div>
            <div className="hidden xl:flex flex-col justify-center items-center p-0 gap-2">
              <div className="flex justify-between ">
                <h1 className={`text-3xl md:text-4xl ${logoColor}`}>
                  ConnectyPi{" "}
                  <span
                    className={`text-base mt-1 font-bold block px-3 ${sloganColor}`}
                  >
                    Stay connected, Always
                  </span>
                </h1>
                <img src={icon} alt="Victory" className="h-[100px]" />
              </div>{" "}
              <img src={Background} alt="Background" className="h-[350px]" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;

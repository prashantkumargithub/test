import { React, useState, useEffect } from "react";
import Background from "@/assets/verify1.png";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.svg";
import icon from "@/assets/icon.svg";
import { useParams } from "react-router-dom";
import { apiClient } from "@/lib/api-client";
import { RESETPASSWORD_ROUTES } from "@/utils/constant";
import axios from "axios";
import MoonLoader from "react-spinners/MoonLoader";
import { IoEye, IoEyeOff } from "react-icons/io5";

function Newpassword() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userId, token } = useParams();
  const [Password, setPassword] = useState("");
  const [CPassword, setCPassword] = useState("");
  const [loading, setloading] = useState(false);
  const [disable, setdisable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
  let CButton = "";
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
    CButton = "bg-slate-800 border-slate-800";
  } else {
    useEffect(() => {
      document.body.className = "bg-[#f3f4f7]";
      return () => {
        document.body.className = "";
      };
    });
    lable = "bg-slate-200  text-gray-800";
  }
  useEffect(() => {
    const getUserData = async () => {
      const token = localStorage.getItem("User_Token");
      if (token) {
        navigate("/chat");
      }
    };

    getUserData();
  }, [navigate]);
  const validateInput = () => {
    if (!Password.length) {
      toast({
        variant: "destructive",
        title: "Password is required",
      });
      return false;
    }
    if (Password.length < 6) {
      toast({
        variant: "destructive",
        title:
          "Your password must be at least 6 characters long. Create a password that keeps your account secure.",
      });
      return false;
    }
    if (CPassword !== Password) {
      toast({
        variant: "destructive",
        title: "Passwords do not match!",
        description: "Please make sure your passwords match. Try again.",
      });
      return false;
    }
    return true;
  };
  const ChangePassword = async () => {
    if (validateInput()) {
      try {
        setdisable(true);
        setloading(true);
        const response = await apiClient.post(
          RESETPASSWORD_ROUTES,
          {
            userId,
            token,
            Password,
            CPassword,
          },
          { withCredentials: true }
        );
        if (response.status == 200) {
          toast({
            variant: "success",
            title: "Password",
          });
          navigate(`/auth`);
        }
        setloading(false);
        setdisable(false);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status == 401) {
            setTimeout(() => {
              navigate("/forgetPassword");
            }, 2000);
            toast({
              variant: "destructive",
              title: err.response?.data || "An error occurred",
              description: "Please try agian to reset password",
            });
          }
          toast({
            variant: "destructive",
            title: err.response?.data || "An error occurred",
            description: "Check the credentials you entered",
          });
          setTimeout(() => {
            navigate("/forgetPassword");
          }, 2000);
        } else {
          toast({
            variant: "destructive",
            title: `An unexpected error occurred ${err}`,
            description: "Please try again later",
          });
        }
        setloading(false);
        setdisable(false);
      }
    }
  };
  const handleKeyPassword = (e) => {
    if (e.key === "Enter") {
      ChangePassword();
    }
  };

  return (
    <>
      <div className="h-[30vh] bg-green-900 w-full">
        <div className="h-auto md:w-[100vw] w-full bg-transparent flex md:items-center md:justify-center ">
          <div
            className={`overflow-x-hidden xl:overflow-hidden  h-[100vh] md:h-[85vh]  xl:h-[80vh]  2xl:h-[70vh] pb-40 md:pb-2  ${theme_bg} text-opacity-90 md:shadow-2xl w-full md:w-[90vw] lg:w-[70vw] xl:w-[70vw] md:rounded-3xl grid xl:grid-cols-2`}
          >
            <div className="flex justify-between m-3 xl:hidden">
              <Link to="/forgetPassword" className="font-semibold text-3xl">
                &larr;
              </Link>
              <img src={icon} alt="Victory" className="xl:hidden h-[100px]" />
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center justify-center flex-col">
                <div className="flex items-center justify-center">
                  <h1 className="text-4xl font-bold md:text-5xl">
                    New Password
                  </h1>
                </div>
                <div className="text-center w-[70%]">
                  <p className="muted font-md m-4">
                    Hi {"Prashant kumar"}, Please enter your new password to
                    change your password.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center w-[80%] gap-5 m-3">
                <div className="relative w-full">
                  <Input
                    placeholder="New Password"
                    type={showPassword ? "text" : "password"}
                    value={Password}
                    disabled={disable}
                    onChange={(e) => setPassword(e.target.value)}
                    className={input}
                  />
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <IoEyeOff size={20} />
                    ) : (
                      <IoEye size={20} />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center w-[80%] gap-5 m-3">
                <div className="relative w-full">
                  <Input
                    placeholder="Confirm Password"
                    type={showPassword ? "text" : "password"}
                    value={CPassword}
                    disabled={disable}
                    onChange={(e) => setCPassword(e.target.value)}
                    className={input}
                    onKeyDown={(e) => handleKeyPassword(e)}
                  />
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <IoEyeOff size={20} />
                    ) : (
                      <IoEye size={20} />
                    )}
                  </div>
                </div>
              </div>
              <Button
                className={`rounded-full p-6 text-lg gap-2 flex justify-center items-center ${button}`}
                disabled={disable}
                onClick={ChangePassword}
              >
                {loading ? (
                  <MoonLoader color="#ffffff" size={20} />
                ) : (
                  "Change Password"
                )}
              </Button>
              <div className="hidden  xl:block w-[25%] self-start">
                <Link to="/forgetPassword" className="">
                  <p
                    className={`text-red-500 w-full font-md border-2  text-md font-semibold rounded-full p-3 px-4 text-center ml-5 hover:bg-red-500 hover:text-white hover:border-red-500 ${CButton}`}
                  >
                    {" "}
                    Cancel
                  </p>
                </Link>
              </div>
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

export default Newpassword;

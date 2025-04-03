import React, { useState, useEffect } from "react";
import Background from "@/assets/auth.png";
import Victory from "@/assets/victory.svg";
import logo from "@/assets/logo.svg";
import icon from "@/assets/icon.svg";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { apiClient } from "@/lib/api-client";
import {
  LOGIN_ROUTES,
  SINGUP_ROUTES,
  GOOGLE_AUTH_ROUTES,
} from "@/utils/constant";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import MoonLoader from "react-spinners/MoonLoader";
import { IoEye, IoEyeOff } from "react-icons/io5";

function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setemail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setpassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
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

  const validateSignup = () => {
    if (!email.length) {
      toast({
        variant: "destructive",
        title: "Email is required",
      });
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast({
        variant: "destructive",
        title: "Please enter a valid email",
      });
      return false;
    }
    if (!phone.length) {
      toast({
        variant: "destructive",
        title: "Phone is required",
      });
      return false;
    }
    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(phone)) {
      toast({
        variant: "destructive",
        title: "Invalid phone number!",
        description:
          "Your phone number must be exactly 10 digits long. Please enter a valid phone number.",
      });
      return false;
    }
    if (!password.length) {
      toast({
        variant: "destructive",
        title: "Password is required",
      });
      return false;
    }
    if (password.length < 6) {
      toast({
        variant: "destructive",
        title:
          "Your password must be at least 6 characters long. Create a password that keeps your account secure.",
      });
      return false;
    }
    if (ConfirmPassword !== password) {
      toast({
        variant: "destructive",
        title: "Passwords do not match!",
        description: "Please make sure your passwords match. Try again.",
      });
      return false;
    }

    return true;
  };
  const validateLogin = () => {
    if (!email.length) {
      toast({
        variant: "destructive",
        title: "Please fill all fileds",
      });
      return false;
    }
    if (!password.length) {
      toast({
        variant: "destructive",
        title: "Please fill all fileds",
      });
      return false;
    }
    return true;
  };
  const handleLogin = async () => {
    if (validateLogin()) {
      try {
        setloading(true);
        setdisable(true);
        const response = await apiClient.post(
          LOGIN_ROUTES,
          {
            email,
            password,
          },
          { withCredentials: true }
        );
        if (response.status == 200) {
          localStorage.setItem("User_Token", response.data.token);
          if (!response.data.user.isVerified) {
            setTimeout(() => {
              navigate("/verify");
            }, 1000);
          } else if (!response.data.user.profileSetup) {
            setTimeout(() => {
              navigate("/profile");
            }, 1000);
          } else {
            setTimeout(() => {
              navigate("/chat");
            }, 1000);
          }
          toast({
            variant: "success",
            title: "Login Successfuly",
          });
        }
        setloading(false);
        setdisable(false);
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
            title: "An unexpected error occurred",
            description: "Please try again later",
          });
        }
        setloading(false);
        setdisable(false);
      }
    }
  };
  const handleSignup = async () => {
    if (validateSignup()) {
      try {
        setloading(true);
        setdisable(true);
        const response = await apiClient.post(
          SINGUP_ROUTES,
          {
            email,
            phone,
            password,
            ConfirmPassword,
          },
          { withCredentials: true }
        );

        if (response.status == 201) {
          localStorage.setItem("User_Token", response.data.token);
          if (!response.data.user.isVerified) {
            setTimeout(() => {
              navigate("/verify");
            }, 1000);
          } else {
            setTimeout(() => {
              navigate("/chat");
            }, 1000);
          }
          toast({
            variant: "success",
            title: "SignUp Successfuly",
          });
        }
        setloading(false);
        setdisable(false);
      } catch (err) {
        setloading(false);
        setdisable(false);
        if (axios.isAxiosError(err)) {
          toast({
            variant: "destructive",
            title: "Signup failed",
            description:
              err.response?.data || "Check the credentials you entered.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "An unexpected error occurred",
            description: "Please try again later.",
          });
        }
      }
    }
  };
  const handleGoogleAuth = async (user) => {
    try {
      const response = await apiClient.post(
        GOOGLE_AUTH_ROUTES,
        {
          user,
        },
        { withCredentials: true }
      );
      if (response.status == 200) {
        localStorage.setItem("User_Token", response.data.token);
        if (!response.data.user.isVerified) {
          setTimeout(() => {
            navigate("/verify");
          }, 1000);
        } else if (!response.data.user.profileSetup) {
          setTimeout(() => {
            navigate("/profile");
          }, 1000);
        } else {
          setTimeout(() => {
            navigate("/chat");
          }, 1000);
        }
        toast({
          variant: "success",
          title: "Login Successfuly",
        });
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast({
          variant: "destructive",
          title: err.response?.data || "An error occurred",
          description:
            "Email you entered is not register. Please SignUp first.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "An unexpected error occurred",
          description: "Please try again later",
        });
      }
      setloading(false);
      setdisable(false);
    }
  };
  const handleKeyPassword = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const handleKeySingup = (e) => {
    if (e.key === "Enter") {
      handleSignup();
    }
  };

  useEffect(() => {
    const getUserData = async () => {
      const token = localStorage.getItem("User_Token");
      if (token) {
        navigate("/chat");
      }
    };

    getUserData();
  }, [navigate]);

  return (
    <>
      <div className="h-[30vh] bg-green-900 w-full">
        <div className="h-[100vh] md:w-[100vw] w-full bg-transparent flex md:items-center md:justify-center">
          <div
            className={`overflow-x-hidden xl:overflow-hidden h-[100vh] md:h-[85vh] xl:h-[80vh] 2xl:h-[70vh] md:pb-2 ${theme_bg} text-opacity-90 md:shadow-2xl w-full md:w-[90vw] lg:w-[70vw] xl:w-[70vw] md:rounded-3xl grid xl:grid-cols-2`}
          >
            <div className="flex justify-between m-3 xl:hidden">
              <img src={icon} alt="Victory" className="h-[100px]" />
              <div>
                <p className={`text-3xl md:text-4xl ${logoColor}`}>
                  ConnectyPi{" "}
                </p>
                <span
                  className={`text-base mt-1 font-bold  px-3 ${sloganColor}`}
                >
                  Stay connected, Always
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center lg:justify-center">
              <div className="flex flex-col lg:items-center lg:justify-center">
                <h1 className="text-3xl font-bold md:text-5xl">
                  Welcome{""}
                  <img
                    src={Victory}
                    alt="Victory"
                    className="h-[100px] inline"
                  />
                </h1>
              </div>

              <div className="flex items-center justify-center w-full mb-5">
                <Tabs className="w-3/4" defaultValue="login">
                  <TabsList className="bg-transparent rounded-none w-full text-white">
                    <TabsTrigger
                      className={`data-[state=active]:bg-transparent ${text} text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:${text} data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300`}
                      value="login"
                    >
                      LogIn
                    </TabsTrigger>
                    <TabsTrigger
                      className={`data-[state=active]:bg-transparent ${text} text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:${text} data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300`}
                      value="signup"
                    >
                      SignUp
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent
                    className="flex flex-col gap-3 mt-2" // Adjusted margin-top to shift tabs up
                    value="login"
                  >
                    <Input
                      placeholder="Username, email or phone number"
                      type="email"
                      disabled={disable}
                      value={email}
                      onChange={(e) => setemail(e.target.value)}
                      className={input}
                    />

                    <div className="relative w-full">
                      <Input
                        placeholder="Password"
                        type={showPassword ? "text" : "password"}
                        disabled={disable}
                        value={password}
                        onChange={(e) => setpassword(e.target.value)}
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
                    <Button
                      className={`rounded-full p-6 text-lg gap-2 flex justify-center items-center ${button}`}
                      disabled={disable}
                      onClick={handleLogin}
                    >
                      {loading ? (
                        <MoonLoader color="#ffffff" size={20} />
                      ) : (
                        "Login"
                      )}
                    </Button>
                    <Link to="/forgetPassword">
                      <p className="text-blue-600 font-md p-0 m-0 text-underline">
                        Forget Password?
                      </p>
                    </Link>
                  </TabsContent>
                  <TabsContent className="flex flex-col gap-3" value="signup">
                    <Input
                      placeholder="Email"
                      type="email"
                      value={email}
                      disabled={disable}
                      onChange={(e) => setemail(e.target.value)}
                      className={input}
                    />
                    <div style={{ position: "relative" }}>
                      <span
                        style={{
                          position: "absolute",
                          left: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#aaa",
                        }}
                      >
                        +91
                      </span>
                      <Input
                        placeholder="Phone Number"
                        type="tel"
                        value={phone}
                        disabled={disable}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{ paddingLeft: "40px" }}
                        className={input}
                      />
                    </div>
                    <div className="relative w-full">
                      <Input
                        placeholder="Password"
                        type={showPassword ? "text" : "password"}
                        disabled={disable}
                        value={password}
                        onChange={(e) => setpassword(e.target.value)}
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
                    
                     <div className="relative w-full">
                     <Input
                      placeholder="Confirm Password"
                      type={showPassword ? "text" : "password"}
                      value={ConfirmPassword}
                      disabled={disable}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={input}
                      onKeyDown={(e) => handleKeySingup(e)}
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
                    <div
                      className={`flex items-center space-x-2 p-2 gap-2 ${lable} rounded-lg shadow-sm mt-1 w-[100%] font-semibold`}
                    >
                      <Label htmlFor="" className="font-semibold">
                        By clicking the{" "}
                        <span className="font-semibold text-blue-500">
                          Continue
                        </span>{" "}
                        button, you will accept our{" "}
                        <span className="font-semibold text-blue-500">
                          terms & conditions
                        </span>{" "}
                        and{" "}
                        <span className="font-semibold text-blue-500">
                          Privacy Policy
                        </span>
                        .
                      </Label>
                    </div>
                    <Button
                      className={`rounded-full p-6 text-lg gap-2 flex justify-center items-center ${button}`}
                      disabled={disable}
                      onClick={handleSignup}
                    >
                      {loading ? (
                        <MoonLoader color="#ffffff" size={20} />
                      ) : (
                        "SignUp"
                      )}
                    </Button>
                  </TabsContent>
                </Tabs>
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
              </div>
              <img src={Background} alt="Background" className="h-[350px]" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Auth;

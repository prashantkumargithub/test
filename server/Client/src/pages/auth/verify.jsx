import { React, useState, useEffect } from "react";
import Background from "@/assets/verify1.png";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.svg";
import icon from "@/assets/icon.svg";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import {
  SENDOTP_ROUTES,
  VERIFYOTP_ROUTES,
  getUserData_ROUTES,
} from "@/utils/constant";
import axios from "axios";
import MoonLoader from "react-spinners/MoonLoader";

function Verify() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [OTP, setOTP] = useState("");
  const [email, setemail] = useState("");
  const [disable, setdisable] = useState(false);
  const [display, setdisplay] = useState(false);
  const [displayBTN, setdisplayBTN] = useState(false);
  const [loading, setloading] = useState(false);
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
  let CButton = "";
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

  const getUserData = async () => {
    const token = localStorage.getItem("User_Token");
    if (token) {
      try {
        const response = await apiClient.get(getUserData_ROUTES, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json", // Example header
            Authorization: `Bearer ${token}`, // Example header for authorization
            // Add any other headers you need
          },
        });
        if (response.statusText === "OK") {
          setemail(response.data.UserData.email);
          const profileSetup = response.data.UserData.profileSetup;
        }
      } catch (error) {}
    }
  };
  getUserData();

  const validateInput = () => {
    if (!email.length) {
      toast({
        variant: "destructive",
        title: "Email is required",
      });
      return false;
    }
    const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailPattern.test(email)) {
      toast({
        variant: "destructive",
        title: "Please enter a valid email",
        description:
          "Only Gmail addresses are accepted. Please use your Gmail address to proceed.(E.g example.gmail.com)",
      });
      return false;
    }
    return true;
  };
  const validateInputOTP = () => {
    if (!OTP.length) {
      toast({
        variant: "destructive",
        title: "OTP is required",
      });
      return false;
    }
    if (OTP.length < 6) {
      toast({
        variant: "destructive",
        title: "The OTP must be 6 digits long.",
      });
      return false;
    }
    return true;
  };
  const handleSendOTP = async () => {
    if (validateInput()) {
      try {
        setdisable(true);
        setloading(true);
        const response = await apiClient.post(
          SENDOTP_ROUTES,
          {
            email,
          },
          { withCredentials: true }
        );
        if (response.statusText == "OK") {
          toast({
            variant: "success",
            title: "OTP sent successfully",
          });
          setdisplay(true);
        }
        setdisplay(true);
        setloading(false);
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
  const handleOTP = async () => {
    if (validateInputOTP()) {
      try {
        setdisable(true);
        setloading(true);
        setdisplayBTN(true);
        const response = await apiClient.post(
          VERIFYOTP_ROUTES,
          {
            email,
            OTP,
          },
          { withCredentials: true }
        );
        if (response.statusText == "OK") {
          toast({
            variant: "success",
            title: "Email verified Successfully",
          });
          navigate("/chat");
        }
        setdisplay(true);
        setloading(false);
        setdisplayBTN(false);
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
        setloading(false);
        setdisable(false);
        setdisplayBTN(false);
      }
    }
  };
  const handleResendOTP = async () => {
    if (validateInput()) {
      try {
        setdisable(true);
        setloading(true);
        const response = await apiClient.post(
          SENDOTP_ROUTES,
          {
            email,
          },
          { withCredentials: true }
        );
        if (response.statusText == "OK") {
          toast({
            variant: "success",
            title: "OTP Resent successfully",
          });
          setdisplay(true);
        }
        setdisplay(true);
        setloading(false);
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

  const handleKeySendOtp = (e) => {
    if (e.key === "Enter") {
      handleSendOTP();
    }
  };
  const handleKeyOtp = (e) => {
    if (e.key === "Enter") {
      handleOTP();
    }
  };

  useEffect(() => {
    const getUserData = async () => {
      const token = localStorage.getItem("User_Token");
      if (!token) {
        navigate("/auth");
      }
    };

    getUserData();
  }, [navigate]);
  return (
    <>
      <div className="h-[30vh] bg-green-900 w-full">
        <div className="h-[100vh] md:w-[100vw] w-full bg-transparent flex md:items-center md:justify-center ">
          <div
            className={`overflow-x-hidden xl:overflow-hidden  h-[100vh] md:h-[85vh]  xl:h-[80vh]  2xl:h-[70vh] md:pb-2  pb-40 ${theme_bg} text-opacity-90 md:shadow-2xl w-full md:w-[90vw] lg:w-[70vw] xl:w-[70vw] md:rounded-3xl grid xl:grid-cols-2`}
          >
            <div className="flex justify-between m-3 xl:hidden">
              <img src={icon} alt="Victory" className="xl:hidden h-[100px]" />
              <h1 className={`text-3xl md:text-4xl ${logoColor}`}>
                ConnectyPi{" "}
                <span
                  className={`text-base mt-1 font-bold block px-3 ${sloganColor}`}
                >
                  Stay connected, Always
                </span>
              </h1>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center justify-center flex-col">
                <div className="flex items-center justify-center">
                  <h1 className="text-4xl font-bold md:text-5xl">Verify</h1>
                </div>
                <div className="text-center w-[100%]">
                  <p className="muted font-md m-4">
                    Activate your account by verifying your email now!
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center w-full px-5">
                <Input
                  placeholder="Enter your email"
                  className={`py-5 border-r-0 rounded-r-none ${input} disabled`}
                  type="email"
                  disabled={true}
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  onKeyDown={(e) => handleKeySendOtp(e)}
                />{" "}
                <Button
                  className={`rounded-full py-6 lg:py-5 text-lg rounded-l-none font-semibold ${button}`}
                  disabled={disable}
                  onClick={handleSendOTP}
                >
                  {loading ? (
                    <MoonLoader color="#ffffff" size={20} />
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </div>
              {!display && ( <div className="flex w-full px-4">
                <div
                  className="flex justify-between mt-3"
                  onClick={() => {
                    localStorage.removeItem("User_Token");
                    navigate("/");
                  }}
                >
                  <p
                    className={`text-red-500 w-full font-md border-2  text-md font-semibold rounded-full p-3 px-4 text-center ml-5 hover:bg-red-500 hover:text-white hover:border-red-500 ${CButton}`}
                  >
                    {" "}
                    Cancel
                  </p>
                </div>
              </div>)}
             
              {display ? (
                <div>
                  <div className="font-bold w-[100%] pt-5">Email OTP:</div>
                  <div className="flex items-center justify-center w-full gap-5 m-3">
                    <InputOTP
                      maxLength={6}
                      value={OTP}
                      onChange={(OTP) => setOTP(OTP)}
                      onKeyDown={(e) => handleKeyOtp(e)}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="input-dark" />
                      </InputOTPGroup>
                      <InputOTPGroup>
                        <InputOTPSlot index={1} className="input-dark" />
                      </InputOTPGroup>
                      <InputOTPGroup>
                        <InputOTPSlot index={2} className="input-dark" />
                      </InputOTPGroup>
                      <InputOTPGroup>
                        <InputOTPSlot index={3} className="input-dark" />
                      </InputOTPGroup>
                      <InputOTPGroup>
                        <InputOTPSlot index={4} className="input-dark" />
                      </InputOTPGroup>
                      <InputOTPGroup>
                        <InputOTPSlot index={5} className="input-dark" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <Button
                      className={`rounded-full p-6 text-lg gap-2 flex justify-center items-center ${button}`}
                      onClick={handleOTP}
                      disabled={displayBTN}
                    >
                      {loading ? (
                        <MoonLoader color="#ffffff" size={20} />
                      ) : (
                        "Verify OTP"
                      )}
                    </Button>
                    <span
                      className="mt-2 text-blue-500 cursor-pointer"
                      onClick={handleResendOTP}
                    >
                      Resend Code
                    </span>
                  </div>
                </div>
              ) : (
                ""
              )}
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

export default Verify;

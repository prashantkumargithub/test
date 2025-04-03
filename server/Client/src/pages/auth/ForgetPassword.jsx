import React, { useState, useEffect } from "react";
import Background from "@/assets/ForgetPassword2.png";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.svg";
import icon from "@/assets/icon.svg";
import { apiClient } from "@/lib/api-client";
import {
  SENDOTP_FORGETPASSWORD_ROUTES,
  VERIFYOTP_ROUTES,
  SENDLINK_FORGETPASSWORD_ROUTES,
} from "@/utils/constant";
import axios from "axios";
import MoonLoader from "react-spinners/MoonLoader";

function ForgetPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [OTP, setOTP] = useState("");
  const [email, setemail] = useState("");
  const [display, setdisplay] = useState(false);
  const [displayBTN, setdisplayBTN] = useState(false);
  const [disable, setdisable] = useState(false);
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
  let CButton = "";
  let button = "";
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
    CButton = "bg-slate-800 border-slate-800";
    button = "bg-slate-600 hover:bg-slate-700";
    logoColor = "text-green-500 ";
    sloganColor = "text-sky-500";
  } else {
    useEffect(() => {
      document.body.className = "bg-[#f3f4f7]";
      return () => {
        document.body.className = "";
      };
    });
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
          SENDOTP_FORGETPASSWORD_ROUTES,
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
          navigate(
            `/Newpassword/${response.data.user._id}/${response.data.token}`
          );
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
        setdisable(true);
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
  const handleSendLink = async () => {
    if (validateInput()) {
      try {
        setdisable(true);
        setloading(true);
        const response = await apiClient.post(
          SENDLINK_FORGETPASSWORD_ROUTES,
          {
            email,
          },
          { withCredentials: true }
        );
        if (response.status == 200) {
          toast({
            variant: "success",
            title: "Link sent successfully",
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
    const handleKeySendLink = (e) => {
      if (e.key === "Enter") {
        handleSendLink();
      }
    };

  return (
    <>
      <div className="h-[30vh] bg-green-900 w-full">
        <div className="h-[100vh] md:w-[100vw] w-full bg-transparent flex md:items-center md:justify-center ">
          <div
            className={`overflow-x-hidden xl:overflow-hidden  h-[100vh] md:h-[85vh]  xl:h-[80vh]  2xl:h-[70vh] pb-12 md:pb-2  ${theme_bg} text-opacity-90 md:shadow-2xl w-full md:w-[90vw] lg:w-[70vw] xl:w-[70vw] md:rounded-3xl grid xl:grid-cols-2 `}
          >
            <div className="flex justify-between m-3 xl:hidden">
              <Link to="/auth" className="font-bold text-4xl">
                &larr;
              </Link>
              <img src={icon} alt="Victory" className="xl:hidden h-[100px]" />
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center flex-col">
                <div className="flex items-center justify-center">
                  <h1 className="text-4xl font-bold md:text-5xl my-2">
                    Forget Password
                  </h1>
                </div>
              </div>
              <div className="flex justify-between  w-[50%]"></div>
              <div className="flex items-center justify-center w-full">
                <Tabs defaultValue="OTP" className="w-3/4">
                  <TabsList className="bg-transparent rounded-none w-full">
                    <TabsTrigger
                      className={`data-[state=active]:bg-transparent ${text} text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:${text} data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300`}
                      value="OTP"
                    >
                      By OTP
                    </TabsTrigger>
                    <TabsTrigger
                      className={`data-[state=active]:bg-transparent ${text} text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:${text} data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300`}
                      value="LINK"
                    >
                      By Link
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent
                    className="flex flex-col justify-center gap-3 mt-10"
                    value="OTP"
                  >
                    <p className="muted">
                      We will send you a Code on email to Reset your Password
                    </p>

                    <div className="flex w-full ">
                      <Input
                        placeholder="Enter your email"
                        className={`py-5 border-r-0 rounded-r-none ${input}`}
                        type="email"
                        disabled={disable}
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
                    <div className="flex justify-between mt-3">
                      <Link to="/auth" className="">
                        <p
                          className={`text-red-500 w-full font-md border-2  text-md font-semibold rounded-full p-3 px-4 text-center ml-5 hover:bg-red-500 hover:text-white hover:border-red-500 ${
                            display ? "hidden" : ""
                          } ${CButton}`}
                        >
                          Cancle
                        </p>
                      </Link>
                    </div>
                    {display ? (
                      <div>
                        <div className="font-bold w-[100%]">Email OTP:</div>
                        <div
                          className={`flex items-center justify-center w-full gap-3 m-1`}
                        >
                          <InputOTP
                            maxLength={6}
                            value={OTP}
                            onChange={(OTP) => setOTP(OTP)}
                            onKeyDown={(e) => handleKeyOtp(e)}
                          >
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                            </InputOTPGroup>
                            <InputOTPGroup>
                              <InputOTPSlot index={1} />
                            </InputOTPGroup>
                            <InputOTPGroup>
                              <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPGroup>
                              <InputOTPSlot index={3} />
                            </InputOTPGroup>
                            <InputOTPGroup>
                              <InputOTPSlot index={4} />
                            </InputOTPGroup>
                            <InputOTPGroup>
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                        <div className="flex flex-col justify-center items-center">
                          <Button
                            className={`rounded-full p-6 text-lg gap-2 mt-3 flex justify-center items-center ${button}`}
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
                  </TabsContent>
                  <TabsContent className="flex flex-col gap-5" value="LINK">
                    <p className="muted">
                      We will send you a Link on email to Reset your Password
                    </p>
                    <div className="flex w-full ">
                      <Input
                        placeholder="Enter your email"
                        className={`py-5 border-r-0 rounded-r-none ${input}`}
                        type="email"
                        disabled={disable}
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
                        onKeyDown={(e) => handleKeySendLink(e)}
                      />{" "}
                      <Button
                        className={`rounded-full py-6 lg:py-5 text-lg rounded-l-none font-semibold ${button}`}
                        disabled={disable}
                        onClick={handleSendLink}
                      >
                        {loading ? (
                          <MoonLoader color="#ffffff" size={20} />
                        ) : (
                          "Send Link"
                        )}
                      </Button>
                    </div>
                    <div className="flex justify-between mt-3">
                      <Link to="/auth" className="">
                        <p
                          className={`text-red-500 w-full font-md border-2  text-md font-semibold rounded-full p-3 px-4 text-center ml-5 hover:bg-red-500 hover:text-white hover:border-red-500 ${
                            display ? "hidden" : ""
                          } ${CButton}`}
                        >
                          {" "}
                          Cancle
                        </p>
                      </Link>
                    </div>
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
              </div>{" "}
              <img src={Background} alt="Background" className="h-[350px]" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgetPassword;

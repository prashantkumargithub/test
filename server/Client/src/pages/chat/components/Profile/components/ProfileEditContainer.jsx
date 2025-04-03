import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { apiClient } from "@/lib/api-client";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  Add_PROFILE_COLOR_ROUTE,
  Add_PROFILE_IMAGE_ROUTE,
  CHANGE_PASSWORD_ROUTE,
  PROFILESETUP_ROUTES,
  REMOVE_PROFILE_IMAGE_ROUTE,
  SENDOTP_CHANGE_EMAIL_ROUTES,
  UPDATE_EMAIL_ROUTE,
} from "@/utils/constant";
import { useToast } from "@/components/ui/use-toast";
import {
  IoArrowBackSharp,
  IoArrowForwardOutline,
  IoEye,
  IoEyeOff,
  IoHelp,
  IoKey,
  IoLanguage,
  IoMail,
} from "react-icons/io5";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MoonLoader from "react-spinners/MoonLoader";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { BiSolidEdit } from "react-icons/bi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { setUserData } from "@/Redux/features/UserData";
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { colors, getColor } from "@/lib/utils";
import { FaPlus } from "react-icons/fa";


function ProfileEditContainer(props) {
  //Defining variable and states
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const SubActiveComponent = useSelector(
    (state) => state.SubActiveComponent.value
  );
  const UserData = useSelector((state) => state.UserData.value);
  const fileInputRef = useRef(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false); //dialog
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false); //dialog
  const [isEMailDialogOpen, setIsEMailDialogOpen] = useState(false); //to show email dialog
  const [isPhotDialog, setIsPhotoDialogOpen] = useState(false); //to show email dialog
  const [isPhotUploadDialog, setIsPhotoUploadDialogOpen] = useState(false); //to show email dialog
  const [diabled, setdiabled] = useState(false); //disable buttton
  const [Emaildiabled, setEmaildiabled] = useState(false); //email filed disable
  const [BtnEmaildiabled, setBtnEmaildiabled] = useState(false); //email btn disale
  const [Display, setDisplay] = useState(false); //otp display
  const [showPassword, setShowPassword] = useState(false); //to show pasword
  const [OTPDisable, setOTPDisable] = useState(false); //to disable otp filed
  const [btnDisplay, setBtnDisplay] = useState(false);//Upload photo
  const [loading, setLoading] = useState(false);//photo
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  //User Data
  const [FName, setFName] = useState(""); //name
  const [LName, setLName] = useState("");
  const [bio, setBio] = useState("");
  const [Username, setUsername] = useState("");
  const [CPassword, setCPassword] = useState("");
  const [NPassword, setNPassword] = useState("");
  const [CCPassword, setCCPassword] = useState("");
  const [email, setEmail] = useState("");
  const [OTP, setOTP] = useState("");
  const [Image, setImage] = useState("");
  const [File, setFile] = useState("");


  useEffect(() => {
    if (UserData) {
      setFName(UserData.firstName);
      setLName(UserData.lastName);
      setBio(UserData.bio);
      setUsername(UserData.UserName);
      setSelectedColor(UserData.color)
      setImage(`${
        import.meta.env.VITE_HOST_URL
      }/image/profileImage/${UserData?.image}`);
    }
  }, [UserData]);
  // Theme conditions
  let Theme = {};
  if (props.theme === "dark") {
    Theme = {
      bg: "bg-[#19232c] ",
      border: "border-[#2f303b] ",
      search: "bg-[#222e35] .input-dark",
      badge: "bg-[#111b21] hover:text-white",
      text: "text-white",
      input: "bg-slate-800 border-slate-800 ",
      button: "bg-slate-600 hover:bg-slate-700",
    };
  } else {
    Theme = {
      bg: "bg-[#fff]",
      border: "border-[#f7f4f4] ",
      search: "bg-[#f3f4f7] .input-light",
      badge: "bg-[#a8aaa9] text-[#fff]",
      text: "text-black",
      input: "",
      button: "",
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

  const getInitials = (firstName = "", lastName = "") => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };

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
  const token = localStorage.getItem("User_Token");

  const handleSubmit = async () => {
    if (validateInput()) {
      try {
        setdiabled(true);
        const response = await apiClient.post(
          PROFILESETUP_ROUTES,
          { FName, LName, Username, bio },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          dispatch(setUserData(response.data.user));
          toast({
            variant: "success",
            title: "Profile Updated.",
          });
          setIsDialogOpen(false);
          setdiabled(false);
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
        setdiabled(false);
      }
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const validatePassword = () => {
    if (!CPassword.length || !CCPassword.length || !NPassword.length) {
      toast({
        variant: "destructive",
        title: "Password is required",
      });
      return false;
    }
    if (NPassword.length < 6) {
      toast({
        variant: "destructive",
        title:
          "Your password must be at least 6 characters long. Create a password that keeps your account secure.",
      });
      return false;
    }
    if (CCPassword !== NPassword) {
      toast({
        variant: "destructive",
        title: "Passwords do not match!",
        description: "Please make sure your passwords match. Try again.",
      });
      return false;
    }

    return true;
  };
  const validateEmailInput = () => {
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
    return true;
  };
  const handlePasswordChange = async () => {
    if (validatePassword()) {
      try {
        setdiabled(true);
        const response = await apiClient.post(
          CHANGE_PASSWORD_ROUTE,
          { CPassword, NPassword, CCPassword },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          toast({
            variant: "success",
            title: "Password updated successfully.",
          });
          setIsPasswordDialogOpen(false);
          setdiabled(false);
          setCPassword("");
          setCCPassword("");
          setNPassword("");
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
        setdiabled(false);
      }
    }
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
    if (validateEmailInput()) {
      try {
        setEmaildiabled(true);
        setBtnEmaildiabled(true);
        const response = await apiClient.post(
          SENDOTP_CHANGE_EMAIL_ROUTES,
          {
            email,
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.statusText == "OK") {
          toast({
            variant: "success",
            title: "OTP sent successfully",
          });
          setDisplay(true);
          setBtnEmaildiabled(false);
          setEmaildiabled(false);
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          toast({
            variant: "destructive",
            title: err.response?.data || "An error occurred",
            description: "Check the credentials you entered",
          });
          setEmaildiabled(false);
          setBtnEmaildiabled(false);
        } else {
          toast({
            variant: "destructive",
            title: "An unexpected error occurred",
            description: "Please try again later",
          });
          setEmaildiabled(false);
          setBtnEmaildiabled(false);
        }
      }
    }
  };
  const handleOTP = async () => {
    if (validateInputOTP()) {
      try {
        setOTPDisable(true);
        const response = await apiClient.post(
          UPDATE_EMAIL_ROUTE,
          {
            email,
            OTP,
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.statusText == "OK") {
          toast({
            variant: "success",
            title: "Email updates Successfully",
          });
          dispatch(setUserData(response.data.user));
          setOTPDisable(false);
          setEmaildiabled(false);
          setBtnEmaildiabled(false);
          setIsEMailDialogOpen(false);
          setEmail("");
          setOTP("");
          setDisplay(false);
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
        setOTPDisable(false);
        setEmaildiabled(false);
        setBtnEmaildiabled(false);
      }
    }
  };
  const handleResendOTP = async () => {
    if (validateEmailInput()) {
      try {
        setEmaildiabled(true);
        setBtnEmaildiabled(true);
        const response = await apiClient.post(
          SENDOTP_CHANGE_EMAIL_ROUTES,
          {
            email,
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.statusText == "OK") {
          toast({
            variant: "success",
            title: "OTP sent successfully",
          });
          setDisplay(true);
          setBtnEmaildiabled(false);
          setEmaildiabled(false);
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          toast({
            variant: "destructive",
            title: err.response?.data || "An error occurred",
            description: "Check the credentials you entered",
          });
          setEmaildiabled(false);
          setBtnEmaildiabled(false);
        } else {
          toast({
            variant: "destructive",
            title: "An unexpected error occurred",
            description: "Please try again later",
          });
          setEmaildiabled(false);
          setBtnEmaildiabled(false);
        }
      }
    }
  };

  const handleKeyPressSendOTP = (e) => {
    if (e.key === "Enter") {
      handleSendOTP();
    }
  };
  const handleKeyPressOTP = (e) => {
    if (e.key === "Enter") {
      handleOTP();
    }
  };
  const handleKeyPassword = (e) => {
    if (e.key === "Enter") {
      handlePasswordChange();
    }
  };

  const handleFileInputCLick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    try {
      if(File){
      setBtnDisplay(true);
      setLoading(true);
      const formData = new FormData();
      formData.append("Image", File);
      formData.append("selectedColor", selectedColor);

      const response = await apiClient.post(Add_PROFILE_IMAGE_ROUTE, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast({
          variant: "success",
          title: "Profile Image Uploaded",
        });
        dispatch(setUserData(response.data.user));
          setIsPhotoDialogOpen(false);
          setIsPhotoUploadDialogOpen(false);

      }

      setBtnDisplay(false);
      setLoading(false);
    }
    else{
      setBtnDisplay(true);
      setLoading(true);
      console.log(selectedColor)
      const response = await apiClient.post(Add_PROFILE_COLOR_ROUTE, {selectedColor:selectedColor}, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast({
          variant: "success",
          title: "Profile color updated.",
        });
        dispatch(setUserData(response.data.user));
          setIsPhotoDialogOpen(false);
          setIsPhotoUploadDialogOpen(false);
          setImage("")
          setFile("")


      }

      setBtnDisplay(false);
      setLoading(false);
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
          title: `An unexpected error occurred: ${err}`,
          description: "Please try again later",
        });
      }
      setBtnDisplay(false);
      setLoading(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      setBtnDisplay(true);
      setLoading(true);
      const response = await apiClient.post(REMOVE_PROFILE_IMAGE_ROUTE,{}, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast({
          variant: "success",
          title: "Profile image removed.",
        });
        setBtnDisplay(false);
          setLoading(false);
          setImage("")
          setFile("")
        dispatch(setUserData(response.data.user));
          
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
          title: `An unexpected error occurred: ${err}`,
          description: "Please try again later",
        });
      }
      setBtnDisplay(false);
      setLoading(false);
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
              <span className="p-2">Account</span>
            </div>
          </div>
          <div className="h-[62vh] lg:h-[70vh] w-full relative">
            {/* Profile edit  */}
            <div className={`h-auto w-full  p-2 border-b ${Theme.border}`}>
              <div className={`h-auto w-full p-2 flex gap-3`}>
                <div className="relative">
                  <Avatar className="h-24 w-24 rounded-full">
                    {UserData?.image ? (
                      <AvatarImage
                        src={`${
                          import.meta.env.VITE_HOST_URL
                        }/image/profileImage/${UserData?.image}`}
                        alt="Profile"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div
                        className={`uppercase w-24 h-24 text-2xl flex items-center justify-center rounded-full ${getColor(
                          UserData?.color
                        )}`}
                      >
                        {getInitials(UserData?.firstName, UserData?.lastName)}
                      </div>
                    )}
                  </Avatar>
                  <Dialog
                    open={isPhotDialog}
                    onOpenChange={setIsPhotoDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <IoIosAddCircleOutline
                        className="absolute bottom-1 right-2 text-3xl lg:text-lg-2xl bg-blue-500 rounded-full text-white p-0 cursor-pointer"
                        // You can adjust the text size and color as per your design
                      />
                    </DialogTrigger>
                    <DialogContent
                      className={`sm:max-w-[425px]    mx-1 my-2 w-[calc(100%-2rem)] mr-1 border  rounded-xl ${
                        props.theme === "dark"
                          ? " bg-slate-900 border-slate-900 text-white"
                          : "border-white"
                      }`}
                    >
                      <DialogHeader>
                        <DialogTitle>Update Profile Photo</DialogTitle>
                      </DialogHeader>
                      <div className="gap-4 border-t">
                        <Dialog
                          open={isPhotUploadDialog}
                          onOpenChange={setIsPhotoUploadDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <div className="">
                              <p className="text-lg p-3 flex  items-center gap-1   cursor-pointer">
                                <MdOutlineAddPhotoAlternate className="text-xl" />{" "}
                                Upload photo
                              </p>
                            </div>
                          </DialogTrigger>
                          <DialogContent
                            className={`sm:max-w-[400px] mx-2 my-1 w-[calc(100%-2rem)] mr-1 border  rounded-xl ${
                              props.theme === "dark"
                                ? " bg-slate-900 border-slate-900 text-white"
                                : "border-white"
                            }`}
                          >
                            <DialogHeader>
                              <DialogTitle>Upload Photo</DialogTitle>
                            </DialogHeader>
                            <div className="gap-4 ">
                              <div className="flex flex-col items-center justify-center">
                                <div
                                  className="h-36 w-36 md:w-48 md:h-48 relative flex items-center justify-center"
                                  onMouseEnter={() => setHovered(true)}
                                  onMouseLeave={() => setHovered(false)}
                                >
                                  <Avatar
                                    className={`h-36 w-36 md:w-48 md:h-48 rounded-full border ${getColor(
                                      selectedColor
                                    )}`}
                                  >
                                    {Image ? (
                                      <AvatarImage
                                        src={Image}
                                        alt="Profile"
                                        className=" object-cover w-full h-full rounded-full"
                                      />
                                    ) : (
                                      <div
                                        className={`uppercase w-36 h-36 md:w-48 md:h-48  text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                                          selectedColor
                                        )}`}
                                      >
                                        {getInitials(UserData?.firstName, UserData?.lastName)}
                                      </div>
                                    )}
                                  </Avatar>
                                  
                                    <div
                                      className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer"
                                      onClick={handleFileInputCLick}
                                    >
                                      {
                                        <FaPlus className="text-white text-3xl cursor-pointer" />
                                      }
                                    </div>
                                 
                                  <input
                                    type="file"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    name="profile-image"
                                    accept=".png, .jpg, .jpeg, .svg, .webp"
                                  />
                                </div>
                                {
                                  <div className="w-full gap-5 flex mt-3">
                                    {colors.map((color, index) => (
                                      <div
                                        className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${
                                          selectedColor == index
                                            ? "outline outline-slate-300 outline-2"
                                            : ""
                                        }`}
                                        key={index}
                                        onClick={() => setSelectedColor(index)}
                                      ></div>
                                    ))}
                                  </div>
                                }
                              </div>
                              <Button
                                className={`rounded-full p-6 text-lg gap-2  mt-3 flex justify-center items-center ${Theme.button}`}
                                disabled={btnDisplay}
                                onClick={handleImageUpload}
                              >
                                {loading ? (
                                  <MoonLoader color="#ffffff" size={20} />
                                ) : (
                                  "Continue"
                                )}{" "}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <div className={`${btnDisplay ? "disabled" : ""}`}>
                          <p className="text-red-500  text-lg px-3 cursor-pointer flex gap-1" onClick={handleRemoveImage}>
                            Remove profile picture {loading ?  <MoonLoader color="#ffffff" size={20} /> : ""}
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex justify-center items-center">
                  <div>
                    <p className="text-xl font-semibold">
                      {UserData?.firstName} {UserData?.lastName}
                    </p>
                    <p className="text-lg text-slate-500">
                      {UserData?.UserName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-4 py-2 w-full">
                <div className="">
                  <p className="text-lg">{UserData?.bio}</p>
                  {/* <p className="text-xl font-semibold">About</p> */}
                  <p className="text-xl font-semibold pt-2">Contact Info</p>
                  <p className={`text-md  text-slate-400 break-words`}>
                    {UserData?.email}
                  </p>
                  <p className={`text-md text-slate-400`}>
                    Mobile: +91 {UserData?.phone}
                  </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <div className="flex justify-end items-center">
                      <BiSolidEdit className="text-green-500 text-3xl cursor-pointer text-end" />
                    </div>
                  </DialogTrigger>
                  <DialogContent
                    className={`sm:max-w-[425px]    mx-1 my-2 w-[calc(100%-2rem)] mr-1 border  rounded-xl ${
                      props.theme === "dark"
                        ? " bg-slate-900 border-slate-900 text-white"
                        : "border-white"
                    }`}
                  >
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className="gap-4">
                      <div className="">
                        <div className=" ">
                          <div className="flex items-center justify-center gap-3 mt-3">
                            <Input
                              placeholder="First Name"
                              type="text"
                              value={FName}
                              disabled={diabled}
                              onChange={(e) => setFName(e.target.value)}
                              className={Theme.input}
                            />{" "}
                            <Input
                              placeholder="Last Name"
                              type="text"
                              value={LName}
                              disabled={diabled}
                              onChange={(e) => setLName(e.target.value)}
                              className={Theme.input}
                            />
                          </div>
                          <div className="flex items-center justify-center  gap-3 mt-3">
                            <Input
                              placeholder="Username"
                              type="text"
                              value={Username}
                              disabled={diabled}
                              onChange={(e) => setUsername(e.target.value)}
                              className={Theme.input}
                            />{" "}
                          </div>
                          <div className="grid  gap-3 mt-3 font-semibold">
                            <Textarea
                              placeholder="Type your bio here..."
                              value={bio}
                              disabled={diabled}
                              onChange={(e) => setBio(e.target.value)}
                              className={`${Theme.input}`}
                            />{" "}
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="submit"
                        disabled={diabled}
                        className={` px-4 py-2 rounded-xl ${
                          props.theme === "dark"
                            ? " bg-gray-800 border-slate-500 text-white focus:outline-none hover:bg-gray-600"
                            : "border-white"
                        }`}
                        onClick={handleSubmit}
                      >
                        {diabled ? (
                          <MoonLoader color="#ffffff" size={20} />
                        ) : (
                          "Update"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            {/* Change Password */}
            <div className={`h-auto w-full p-2 border-b ${Theme.border}`}>
              <div className="px-4 py-2 w-full">
                <Dialog
                  open={isPasswordDialogOpen}
                  onOpenChange={setIsPasswordDialogOpen}
                >
                  <DialogTrigger asChild>
                    <div className="flex justify-between items-center cursor-pointer">
                      <p className="text-lg flex justify-center items-center gap-1">
                        <IoKey className="text-xl" />
                        Change Password
                      </p>
                      <IoArrowForwardOutline className="text-2xl cursor-pointer text-end" />
                    </div>
                  </DialogTrigger>
                  <DialogContent
                    className={`sm:max-w-[425px]    mx-1 my-2 w-[calc(100%-2rem)] mr-1 border rounded-xl ${
                      props.theme === "dark"
                        ? " bg-slate-900 border-slate-900 text-white"
                        : "border-white"
                    }`}
                  >
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                    </DialogHeader>
                    <div className="gap-4">
                      <div className="">
                        <div className=" ">
                          <div className="flex items-center justify-center gap-3 mt-3">
                            <Input
                              placeholder="Current Password"
                              type={showPassword ? "text" : "password"}
                              value={CPassword}
                              disabled={diabled}
                              onChange={(e) => setCPassword(e.target.value)}
                              className={Theme.input}
                            />
                          </div>
                          <div className="flex items-center justify-center gap-3 mt-3">
                            <Input
                              placeholder="New Password"
                              type={showPassword ? "text" : "password"}
                              value={NPassword}
                              disabled={diabled}
                              onChange={(e) => setNPassword(e.target.value)}
                              className={Theme.input}
                            />
                          </div>
                          <div className="flex items-center justify-center gap-3 mt-3">
                            <Input
                              placeholder="Confirm Password"
                              type={showPassword ? "text" : "password"}
                              value={CCPassword}
                              disabled={diabled}
                              onChange={(e) => setCCPassword(e.target.value)}
                              className={Theme.input}
                              onKeyDown={(e) => handleKeyPassword(e)}
                            />
                          </div>
                          <div className="flex items-center justify-start gap-2 mt-4 ">
                            <input
                              type="radio"
                              id="option1"
                              name="radioOption"
                              checked={showPassword}
                              onClick={togglePasswordVisibility}
                              className="text-xl cursor-pointer"
                            />
                            <label
                              htmlFor="option1"
                              className="text-md cursor-pointer"
                            >
                              Show Password
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="submit"
                        disabled={diabled}
                        className={`px-4 py-2 rounded-xl ${
                          props.theme === "dark"
                            ? " bg-gray-800 border-slate-500 text-white focus:outline-none hover:bg-gray-600"
                            : "border-white"
                        }`}
                        onClick={handlePasswordChange}
                      >
                        {diabled ? (
                          <MoonLoader color="#ffffff" size={20} />
                        ) : (
                          "Change"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            {/* Change Email */}
            <div className={`h-auto w-full p-2 border-b ${Theme.border}`}>
              <div className="px-4 py-2 w-full">
                <Dialog
                  open={isEMailDialogOpen}
                  onOpenChange={setIsEMailDialogOpen}
                >
                  <DialogTrigger asChild>
                    <div className="flex justify-between items-center cursor-pointer">
                      <p className="text-lg flex justify-center items-center gap-1">
                        <IoMail className="text-xl" />
                        Change Email
                      </p>
                      <IoArrowForwardOutline className="text-2xl cursor-pointer text-end" />
                    </div>
                  </DialogTrigger>
                  <DialogContent
                    className={`sm:max-w-[425px] mx-1 my-2    w-[calc(100%-2rem)] mr-1 border rounded-xl ${
                      props.theme === "dark"
                        ? " bg-slate-900 border-slate-900 text-white"
                        : "border-white"
                    }`}
                  >
                    <DialogHeader>
                      <DialogTitle>Change Email</DialogTitle>
                    </DialogHeader>
                    <div className="gap-4">
                      <div className="">
                        <div className="flex w-full">
                          <Input
                            placeholder="Enter your new email"
                            className={`py-5 border-r-0 rounded-r-none ${Theme.input}`}
                            type="email"
                            disabled={Emaildiabled}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => handleKeyPressSendOTP(e)}
                          />{" "}
                          <Button
                            className={`rounded-full py-6 lg:py-5 text-lg rounded-l-none font-semibold ${Theme.button}`}
                            disabled={Emaildiabled}
                            onClick={handleSendOTP}
                          >
                            {BtnEmaildiabled ? (
                              <MoonLoader color="#ffffff" size={20} />
                            ) : (
                              "Send OTP"
                            )}
                          </Button>
                        </div>
                        {Display ? (
                          <div>
                            <div className="font-bold w-[100%] mt-2">OTP:</div>
                            <div
                              className={`flex items-center justify-center w-full gap-3 m-1`}
                            >
                              <InputOTP
                                maxLength={6}
                                value={OTP}
                                onChange={(OTP) => setOTP(OTP)}
                                onKeyDown={(e) => handleKeyPressOTP(e)}
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
                                className={`rounded-full p-6 text-lg gap-2 mt-3 flex justify-center items-center ${Theme.button}`}
                                onClick={handleOTP}
                                disabled={OTPDisable}
                              >
                                {OTPDisable ? (
                                  <MoonLoader color="#ffffff" size={20} />
                                ) : (
                                  "Verify OTP"
                                )}
                              </Button>
                              <span
                                className="mt-2 text-blue-500 cursor-pointer"
                                onClick={handleResendOTP}
                              >
                                Resend OTP?
                              </span>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default ProfileEditContainer;

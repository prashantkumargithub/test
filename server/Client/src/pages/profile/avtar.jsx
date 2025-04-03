import React, { useState, useRef, useEffect } from "react";
import Background from "@/assets/profile.png";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.svg";
import icon from "@/assets/icon.svg";
import axios from "axios";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { FaPlus } from "react-icons/fa";
import { apiClient } from "@/lib/api-client";
import { getUserData_ROUTES, Add_PROFILE_IMAGE_ROUTE } from "@/utils/constant";
import MoonLoader from "react-spinners/MoonLoader";

function Avtar() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [btnDisplay, setBtnDisplay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setemail] = useState("");
  const [Image, setImage] = useState("");
  const [File, setFile] = useState("");
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const fileInputRef = useRef(null);

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
          if (response.status == 200) {
            setemail(response.data.UserData.email);
            setFirstName(response.data.UserData.firstName);
            setLastName(response.data.UserData.lastName);
            setImage(
              `${import.meta.env.VITE_HOST_URL}/image/profileImage/${
                response.data.UserData.image
              }`
            );
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
  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
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
        navigate("/chat");
      }

      setBtnDisplay(false);
      setLoading(false);
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
      <div className="h-[30vh] bg-green-900 w-full">
        <div className="h-[100vh] md:w-[100vw] w-full bg-transparent flex md:items-center md:justify-center ">
          <div
            className={`overflow-x-hidden xl:overflow-hidden  h-[100vh] md:h-[85vh]  xl:h-[80vh]  2xl:h-[70vh] md:pb-2 pb-20  ${theme_bg} text-opacity-90 md:shadow-2xl w-full md:w-[90vw] lg:w-[70vw] xl:w-[70vw] md:rounded-3xl grid xl:grid-cols-2`}
          >
            <div className="flex justify-between m-3 xl:hidden">
              <img src={icon} alt="Victory" className=" h-[100px]" />
              <h1 className="text-3xl md:text-4xl text-green-900 xl:hidden">
                ConnectyPi{" "}
                <span className="text-base mt-1 font-bold block px-3 text-sky-900">
                  Stay connected, Always
                </span>
              </h1>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center justify-center flex-col">
                <div className="flex items-center justify-center">
                  <h1 className="text-4xl font-bold md:text-5xl">
                    Profile Picture
                  </h1>
                </div>
                <div className="text-center w-[70%]">
                  <p className="muted font-md m-4">
                    Enhance your profile visibility by uploading your profile
                    picture. Click below to upload.
                  </p>
                </div>
              </div>
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
                        {getInitials(firstName, lastName)}
                      </div>
                    )}
                  </Avatar>
                  {hovered ? (
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer"
                      onClick={handleFileInputCLick}
                    >
                      {
                        <FaPlus className="text-white text-3xl cursor-pointer" />
                      }
                    </div>
                  ) : (
                    ""
                  )}
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
                className={`rounded-full p-6 text-lg gap-2  mt-3 flex justify-center items-center ${button}`}
                disabled={btnDisplay}
                onClick={handleImageUpload}
              >
                {loading ? (
                  <MoonLoader color="#ffffff" size={20} />
                ) : (
                  "Continue"
                )}{" "}
              </Button>
              <button
                className={`rounded-full p-4 text-lg gap-2  flex justify-center  items-center text-slate-600`}
                onClick={()=>{navigate("/chat");}}
              >
                Skip
              </button>
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

export default Avtar;

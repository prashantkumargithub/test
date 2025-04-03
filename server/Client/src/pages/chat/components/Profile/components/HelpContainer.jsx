import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { apiClient } from "@/lib/api-client";
import { HELP_FORM_ROUTES } from "@/utils/constant";
import { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MoonLoader from "react-spinners/MoonLoader";

function HelpContainer(props) {
  //Defining variable and states
  const navigate = useNavigate();
  const { toast } = useToast();
  const SubActiveComponent = useSelector(
    (state) => state.SubActiveComponent.value
  );
  const [Message, setMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [diabled, setdiabled] = useState(false);
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
  const validateInput = () => {
    if (!Message.length) {
      toast({
        variant: "destructive",
        title: "Message is required",
      });
      return false;
    }
    return true;
  };

  const handleHelpSubmit = async () => {
    if(validateInput()){
    setdiabled(true);
    const token = localStorage.getItem("User_Token");
    if (token) {
      try {
        const response = await apiClient.post(
          HELP_FORM_ROUTES,
          { message: Message },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          setdiabled(false);
          // Close the dialog box after successful form submission
          setIsDialogOpen(false);
          setMessage("")
          toast({
            variant: "success",
            title: "Form submitted successfully",
            description: "Our team will contact you as soon as possible.",
          });
        }
      } catch (err) {
        setdiabled(false);
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
              <span className="p-3">Help & Support</span>
            </div>
          </div>
          <div className="h-[62vh] lg:h-[70vh] w-full p-3 relative">
            {/* APP language settings  */}
            <div
              className={`h-auto w-full  p-2 cursor-pointer  pt-3 border-b ${Theme.border} `}
            >
              <div className="flex justify-between px-4 gap-3 items-center">
                <div className="flex justify-center items-center gap-2">
                  <IoLanguage className="text-2xl" />
                  <p className="text-lg ">App Language:</p>
                </div>
                <p className="text-xl">English</p>
              </div>
            </div>
            {/* App Version  */}
            <div
              className={`h-auto w-full  p-2 cursor-pointer  pt-3 border-b ${Theme.border} `}
            >
              <div className="flex justify-between px-4 gap-3 items-center">
                <div className="flex justify-center items-center gap-2">
                  <IoIosInformationCircleOutline className="text-2xl" />
                  <p className="text-lg ">App Version:</p>
                </div>
                <p className="text-xl">1.0.0</p>
              </div>
            </div>
            {/* Help and Support */}
            <div
              className={` w-full  p-2 cursor-pointer  pt-3 border-b ${Theme.border} `}
            >
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <div className=" flex  justify-between px-4 gap-3 items-center">
                    <div className="flex justify-center items-center gap-2">
                      <IoHelp className="text-2xl" />
                      <p className="text-lg ">Help & Support</p>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent
                  className={`sm:max-w-[425px] mx-1 my-2 w-[calc(100%-2rem)] mr-1 border  rounded-xl ${
                    props.theme === "dark"
                      ? " bg-slate-900 border-slate-900 text-white"
                      : "border-white"
                  }`}
                >
                  <DialogHeader>
                    <DialogTitle>Help & Support</DialogTitle>
                    <DialogDescription>
                      Please describe your problem below, and we’ll assist you
                      as soon as possible.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <textarea
                        className={`col-span-4 border border-slate-500 rounded-lg p-2  ${
                          props.theme === "dark"
                            ? " bg-gray-600 border-slate-500 text-white focus:outline-none"
                            : "border-white"
                        }`}
                        placeholder="Type your message here."
                        value={Message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                        }}
                      />
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
                      onClick={handleHelpSubmit}
                    >
                      {diabled ? (
                        <MoonLoader color="#ffffff" size={20} />
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default HelpContainer;

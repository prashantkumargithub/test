import { LuMessageSquarePlus } from "react-icons/lu";
// import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosSearch } from "react-icons/io";
import icon from "@/assets/icon.svg";
import ProfileInfo from "./components/ProfileInfo";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDispatch } from "react-redux";
import { setActiveComponent } from "@/Redux/features/ActiveComponent";
import { setSelectedContacts } from "@/Redux/features/SelectedContact";
import { setSelectedChatType } from "@/Redux/features/Slice";
import { setAddMessage } from "@/Redux/features/AddMessage";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { GET_USER_LIST_DM_ROUTES } from "@/utils/constant";
import { apiClient } from "@/lib/api-client";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

function MessageContainer(props) {
  //Definig variable and states
  const dispatch = useDispatch();
  const { toast } = useToast();
  const ChatType = useSelector((state) => {
    return state.ChatType.value;
  });
  const ActiveComponent = useSelector((state) => {
    return state.ActiveComponent.value;
  });
  const SubActiveComponent = useSelector(
    (state) => state.SubActiveComponent.value
  );
  const [User, setUser] = useState([]);
  const [SearchedUsers, setSearchedUsers] = useState([]);
  const [SearchedTerm, setSearchedTerm] = useState("");
  const [IsSkelteon, setIsSkelteon] = useState(false);
  //Theme conditions
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
    initial: { opacity: 0, y: 100 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 100 },
  };

  //Getting the list of Chated user
  useEffect(() => {
    const getContacts = async () => {
      setIsSkelteon(true);
      try {
        const token = localStorage.getItem("User_Token");
        const response = await apiClient.get(GET_USER_LIST_DM_ROUTES, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.contacts) {
          setUser(response.data.contacts);
          setIsSkelteon(false);
        }
      } catch (err) {
        setIsSkelteon(false);
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
      }
    };
    getContacts();
  }, [ChatType, ActiveComponent]);

  //Search contacts
  const SearchContact = (query) => {
    setSearchedTerm(query);
    const results = User.filter((contact) => {
      const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
      return (
        fullName.includes(query.toLowerCase()) || // Check full name
        contact.firstName.toLowerCase().includes(query.toLowerCase()) || // Check first name
        contact.lastName.toLowerCase().includes(query.toLowerCase()) || // Check last name
        contact.phone.includes(query) // Check phone number
      );
    });
    setSearchedUsers(results);
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
              className={`lg:pt-5 text-3xl p-1 font-semibold flex items-center justify-between `}
            >
              <span className="hidden lg:flex">Chats</span>
              <span
                className={`lg:hidden flex flex-row justify-between items-center ${
                  SubActiveComponent === "ContactInfo" ? "hidden" : ""
                } `}
              >
                <img src={icon} alt="" className="h-16 w-16" />
                ConnectyPi
              </span>
              <div className={`text-2xl flex flex-row  `}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger
                      onClick={() => {
                        dispatch(setActiveComponent("contact"));
                      }}
                    >
                      <LuMessageSquarePlus className="lg:block hidden" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Select Contact</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {/* <BsThreeDotsVertical /> */}
              </div>
            </div>
            <div className={`lg:pt-3 p-2 flex items-center justify-center `}>
              <div
                className={`${Theme.search} rounded-lg p-2 flex items-center  w-full`}
              >
                <IoIosSearch className="text-2xl" />
                <input
                  type="text"
                  className="bg-transparent text-md w-full ml-2 focus:outline-none"
                  placeholder="Search chats by name or number..."
                  onChange={(e) => SearchContact(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="h-[70vh] lg:h-[80vh] w-full overflow-x-hidden overflow-scroll p-3 custom-scrollbar relative">
            {/* ProfileInfo components */}
            {IsSkelteon ? (
              <div className={`flex items-center justify- p-3 w-full gap-3 ${Theme.bg} ${
                Theme.text
              } rounded-3xl mt-3 transition-all duration-300 cursor-pointer`}>
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ) : (
              <div className="relative z-0 pb-24">
                {User.length === 0 ? (
                  <div
                    onClick={() => {
                      dispatch(setActiveComponent("contact"));
                    }}
                    className="text-gray-500 mt-2 p-4"
                  >
                    It looks like you haven't started chatting yet. Click here
                    to search for someone to connect with!
                  </div>
                ) : SearchedUsers.length === 0 ? (
                  SearchedTerm.length === 0 ? (
                    User.map((contact) => (
                      <div
                        key={contact._id}
                        onClick={() => {
                          dispatch(setSelectedContacts(contact));
                          dispatch(setSelectedChatType("contact"));
                        }}
                      >
                        <ProfileInfo user={contact} theme={props.theme} />
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 mt-2">No users found</div>
                  )
                ) : (
                  SearchedUsers.map((contact) => (
                    <div
                      key={contact._id}
                      onClick={() => {
                        dispatch(setSelectedContacts(contact));
                        dispatch(setSelectedChatType("contact"));
                      }}
                    >
                      <ProfileInfo user={contact} theme={props.theme} />
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Floating Button */}
            <div
              className={`${
                ChatType === "contact" ? "hidden" : "flex"
              } flex-row  `}
            >
              <div
                className={`lg:hidden w-10 h-10 rounded-xl fixed bottom-[100px] right-5  text-3xl text-white p-6  flex justify-center items-center z-10 bg-green-700 hover:bg-green-800`}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger
                      onClick={() => {
                        dispatch(setActiveComponent("contact"));
                      }}
                    >
                      <LuMessageSquarePlus />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Select Contact</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default MessageContainer;

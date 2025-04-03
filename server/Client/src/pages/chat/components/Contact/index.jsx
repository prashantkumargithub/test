import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosSearch } from "react-icons/io";
import ProfileInfo from "./components/ProfileInfo";
import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { apiClient } from "@/lib/api-client";
import { SEARCH_CONTACTS_ROUTES } from "@/utils/constant";
import { useToast } from "@/components/ui/use-toast";
import { useDispatch } from "react-redux";
import { setActiveComponent } from "@/Redux/features/ActiveComponent";
import { setSelectedContacts } from "@/Redux/features/SelectedContact";
import { setSelectedChatType } from "@/Redux/features/Slice";
import { useSelector } from "react-redux";
import { animationDefaultOtpions } from '@/lib/utils'
import Lottie from 'react-lottie'
function ContactContainer(props) {
  const { toast } = useToast();
  const [SearchContacts, setSearchContacts] = useState([]);
  const token = localStorage.getItem("User_Token");
  const dispatch = useDispatch(); 
  const SubActiveComponent = useSelector((state) => state.SubActiveComponent.value);

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
  const SearchContact = async (SearchTerm) => {
    try {
      const searchTerm = SearchTerm.trim();
      if (searchTerm.length > 0) {
        const response = await apiClient.post(
          SEARCH_CONTACTS_ROUTES,
          { searchTerm },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if(response.status ===200 && response.data.contacts){
          setSearchContacts(response.data.contacts);
        }
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
          title: "An unexpected error occurred",
          description: "Please try again later",
        });
      }
    }
  };
  const selectContact =(contact)=>{
    setSearchContacts([]);
    dispatch(setSelectedContacts(contact));
    dispatch(setSelectedChatType("contact"));
    dispatch(setActiveComponent("chat"));
  }
  return (
    <>
      <div
        className={`${Theme.bg} lg:w-[23vw] lg:border-r-2 ${Theme.border} overflow-hidden ${SubActiveComponent ==="ContactInfo" ? "w-0" : "w-full "}`}
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
              <span className="p-3">Contacts</span>
            </div>
            <div className={`lg:pt-3 p-2 flex items-center justify-center `}>
              <div
                className={`${Theme.search} rounded-lg p-2 flex items-center  w-full`}
              >
                <IoIosSearch className="text-2xl" />
                <input
                  type="text"
                  className="bg-transparent text-sm w-full ml-2 focus:outline-none"
                  placeholder="Name, Username or mobile number"
                  onChange={(e) => SearchContact(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="h-[69vh] lg:h-[70vh] w-full overflow-x-hidden overflow-scroll p-3 custom-scrollbar relative">
            {/* ProfileInfo components */}
            <div className="relative z-0 m-2">
              {SearchContacts.length===0 && <div className="flex flex-col text-gray-500">
              Search for a contact by their Name, username or phone number.
              </div>}
              {SearchContacts.map((contact) => (
                <div key={contact._id} onClick={()=>selectContact(contact)}>
                  <ProfileInfo user={contact} theme={props.theme} />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default ContactContainer;

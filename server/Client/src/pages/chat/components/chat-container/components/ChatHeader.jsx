import { RiCloseFill } from "react-icons/ri";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { setSelectedContacts } from "@/Redux/features/SelectedContact";
import { setSelectedChatType } from "@/Redux/features/Slice";
// import { IoVideocamOutline,IoCallOutline } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import {setSubActiveComponent} from "@/Redux/features/SubActiveComponent"

function ChatHeader(props) {
  const dispatch = useDispatch();
  const getInitials = (firstName = "", lastName = "") => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };
  let Theme = {};
  if (props.theme == "dark") {
    Theme = {
      border: "border-[#2f303b]",
      button: "text-white",
    };
  } else {
    Theme = {
      border: "border-[#f7f4f4]",
      button: "text-black",
    };
  }



  return (
    <div
      className={`h-[10vh] border-b-2 ${Theme.border} flex justify-between items-center px-5 `}
    >
      <div className="flex items-center">
        <div className="flex items-center justify-center ">
          <button
            className={`duration 300 transition-all ${Theme.button}`}
            onClick={() => {
              dispatch(setSelectedChatType(undefined));
              dispatch(setSubActiveComponent(undefined));
              dispatch(setSelectedContacts({}));
            }}
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
        <div className="flex gap-3 items-center justify-center cursor-pointer" onClick={() => {
              dispatch(setSubActiveComponent("ContactInfo"));
            }}>
          <Avatar className="h-10 w-10 rounded-full">
            {props.user?.image ? (
              <AvatarImage
                src={`${import.meta.env.VITE_HOST_URL}/image/profileImage/${
                  props.user?.image
                }`}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            ) : (
              <div
                className={`uppercase w-10 h-10 text-xl flex items-center justify-center rounded-full ${getColor(
                  props.user?.color
                )}`}
              >
                {getInitials(props.user?.firstName, props.user?.lastName)}
              </div>
            )}
          </Avatar>
          <div className="text-lg font-medium">
            {props.user?.firstName
              ? `${props.user?.firstName}  ${props.user?.lastName}`
              : props.user?.UserName}
            <p className="text-xs text-gray-400">+91 {props.user?.phone}</p>
          </div>
        </div>
      </div>
        <div className="text-center text-2xl flex gap-3">
          {/* <IoCallOutline className="cursor-pointer"/>
          <IoVideocamOutline className="cursor-pointer"/> */}
          <BsThreeDotsVertical className="cursor-pointer" onClick={() => {
              dispatch(setSubActiveComponent("ContactInfo"));
            }}/>
        </div>
    </div>
  );
}

export default ChatHeader;


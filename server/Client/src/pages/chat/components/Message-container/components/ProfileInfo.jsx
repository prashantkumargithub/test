import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getColor } from "@/lib/utils";
import moment from "moment";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useSocket } from "@/context/SocketContext";

function ProfileInfo(props) {
  const socket = useSocket();
  const SelectedContact = useSelector((state) => state.SelectedContact.value);
  // Theme conditions
  let Theme = {};
  if (props.theme === "dark") {
    Theme = {
      bg: "bg-[#212b33] hover:bg-[#0f151a]",
      text: "text-white",
    };
  } else {
    Theme = {
      bg: "bg-gray-100 hover:bg-gray-300",
      text: "text-black",
    };
  }

  // Get initials for profile picture
  const getInitials = (firstName = "", lastName = "") => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };

  // Format message date
  const formatMessageDate = (messageDate) => {
    const today = moment().startOf("day");
    const yesterday = moment().subtract(1, "days").startOf("day");
    const messageMoment = moment(messageDate);
    const isToday = messageMoment.isSame(today, "day");
    const isYesterday = messageMoment.isSame(yesterday, "day");

    if (isToday) {
      return messageMoment.format("h:mm A"); // Show time if today
    } else if (isYesterday) {
      return "Yesterday"; // Show 'Yesterday' if the message is from yesterday
    } else {
      return messageMoment.format("MMMM Do YYYY"); // Show full date if not today or yesterday
    }
  };

  return (
    <div
      className={`flex items-center justify-between p-3 w-full ${Theme.bg} ${
        Theme.text
      } ${
        SelectedContact?._id == props.user?._id ? "bg-[#151e25]" : ""
      } rounded-3xl mt-3 transition-all duration-300 cursor-pointer`}
    >
      <div className="flex justify-evenly gap-3">
        <div className="relative">
          {/* Avatar */}
          <Avatar className="h-12 w-12 rounded-full">
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
                className={`uppercase w-12 h-12 text-lg flex items-center justify-center rounded-full ${getColor(
                  props.user?.color
                )}`}
              >
                {getInitials(props.user?.firstName, props.user?.lastName)}
              </div>
            )}
          </Avatar>
          {/* Badge */}
        </div>

        <div className="flex flex-col justify-center">
          <h5 className={`text-sm font-medium ${Theme.text}`}>
            {props.user?.firstName} {props.user?.lastName}
          </h5>
        </div>
      </div>

      <div className="text-right relative">
        <p className="text-xs text-gray-400">
          {formatMessageDate(props.user?.lastMessageTime)}
        </p>
      </div>
    </div>
  );
}

export default ProfileInfo;

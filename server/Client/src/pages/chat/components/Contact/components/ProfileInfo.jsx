import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
function ProfileInfo(props) {
  let Theme ={};
  if(props.theme=="dark"){
    Theme = {
      bg:"bg-[#212b33] hover:bg-[#0f151a]",
      text:"text-white"
    }
  }
  else{
    Theme = {
      bg:"bg-gray-100 hover:bg-gray-300",
      text:"text-black"
    }
  }
  const getInitials = (firstName = "", lastName = "") => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };
  return (
    <div
  className={`flex items-center justify-between p-3 w-full ${Theme.bg} ${Theme.text} rounded-3xl mt-3 transition-all duration-300`}
>
    <div className="flex justify-evenly gap-3">
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

  <div className="flex flex-col justify-center">
    <h5 className={`text-sm font-medium ${Theme.text}`}>{props.user?.firstName? `${props.user?.firstName}  ${props.user?.lastName}` : props.user?.UserName }</h5>
    <p className="text-xs text-gray-400">+91 {props.user?.phone}</p>
  </div>
</div>
</div>

  );
}

export default ProfileInfo;

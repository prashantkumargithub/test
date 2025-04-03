import ChatHeader from "./components/ChatHeader";
import MessageBar from "./components/MessageBar";
import MessageContainer from "./components/MessageContainer";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";

function ChatContainer(props) {
  const dispatch = useDispatch();
  const Contact_info = useSelector((state) => state.SelectedContact.value);
  const SubActiveComponent = useSelector((state) => state.SubActiveComponent.value);
  const ChatType = useSelector((state) => state.ChatType.value);

  let Theme = {};
  if (props.theme === "dark") {
    Theme = {
      bg: "bg-[#19232c]",
    };
  } else {
    Theme = {
      bg: "bg-[#fff]",
    };
  }

  const transition = {
    duration: 0.15,
    ease: "easeInOut",
  };

  const variants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  return (
    <div
      className={`${Theme.bg} top-0 h-[100vh] ${SubActiveComponent === "ContactInfo" ? "hidden lg:flex w-[100vw]" : "w-[100vw] fixed"} flex flex-col lg:static lg:flex-1`}
    >
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        transition={transition}
        variants={variants}
        className="flex flex-col h-full"
      >
        <ChatHeader theme={props.theme} user={Contact_info} />
        <MessageContainer owner={props.user} otherUser={Contact_info} className="flex-1 overflow-y-auto" />
        <MessageBar className="self-end"/>
      </motion.div>
    </div>
  );
}

export default ChatContainer;

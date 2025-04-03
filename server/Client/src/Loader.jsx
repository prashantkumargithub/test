import React,{useState,useEffect} from "react";
import { PuffLoader } from "react-spinners";
import icon from "@/assets/icon.svg";

const Loader = () => {
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
  if (theme === "dark") {
    useEffect(() => {
      document.body.className = "bg-[#222e35]";
      return () => {
        document.body.className = "";
      };
    });
  } else {
    useEffect(() => {
      document.body.className = "bg-[#f3f4f7]";
      return () => {
        document.body.className = "";
      };
    });
  }
  return (
    <div className="flex justify-center items-center h-screen relative">
      {/* App Icon */}
      <div className="absolute z-10">
        <img src={icon} alt="App Icon" className="w-28 h-28" />
      </div>
      <div className="absolute">
        <PuffLoader loading size={200} color="#36d7b7" speedMultiplier={2} />
      </div>
    </div>
  );
};

export default Loader;

import React, { useState,useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Auth from "./pages/auth";
import ForgetPassword from "./pages/auth/ForgetPassword";
import Newpassword from "./pages/auth/Newpassword";
import Verify from "./pages/auth/verify";
import Profile from "./pages/profile";
import Avtar from "./pages/profile/avtar";
import Chat from "./pages/chat";
import ChatProfile from "./pages/chat/components/Profile";
import HelpSupport from "./pages/chat/components/Profile/HelpSupport";
import SecuritySettings from "./pages/chat/components/Profile/SecurtiySettings";
import ProfileEdit from "./pages/chat/components/Profile/ProfileEdit";

function App() {
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
    <BrowserRouter>
      <Routes>
        {/* Auth Route  */}
        <Route exact path="/auth" element={<Auth />} />
        <Route exact path="/forgetPassword" element={<ForgetPassword />} />
        <Route exact path="/verify" element={<Verify />} />
        <Route exact path="/Newpassword/:userId/:token" element={<Newpassword />}
        />
        {/* Profile Route  */}
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/avtar" element={<Avtar />} />
        {/* //Chat routes  */}
        <Route exact path="/chat" element={<Chat />} />
        <Route exact path="/contacts" element={<Chat />} />
        <Route exact path="/Settings" element={<ChatProfile />} />
        <Route exact path="/AccountSettings" element={<ProfileEdit />} />
        <Route exact path="/SecuritySettings" element={<SecuritySettings />} />
        <Route exact path="/HelpSettings" element={<HelpSupport />} />
        <Route path="/*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

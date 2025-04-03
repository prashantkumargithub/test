import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import Loader from "./Loader";
import { Toaster } from "@/components/ui/toaster";
import "./index.css";
import { store } from "./Redux/app/store.js";
import { Provider } from "react-redux";
import { SocketProvider } from "./context/SocketContext.jsx";
const App = React.lazy(() => import("./App.jsx"));

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <SocketProvider>
      <Suspense fallback={<Loader />}>
        <App />
      </Suspense>
      <Toaster closeButton /> 
    </SocketProvider>
  </Provider>
);

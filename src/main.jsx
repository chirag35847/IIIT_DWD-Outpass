import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import './index.css'
import "@rainbow-me/rainbowkit/styles.css";
import { MantineProvider } from "@mantine/core";
import { GoogleOAuthProvider } from '@react-oauth/google';


ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="681225243128-70k09of6c7vao2k8vhven9p4r8rcnegb.apps.googleusercontent.com">
  <React.StrictMode>
    <MantineProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>
  </GoogleOAuthProvider>
);

import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const NavBar = () => {

  return (
    <>
      <div className="z-20 mobile:px-10 lg:px-[10vw] lg:text-[18px] lg:h-[80px] mobile:h-[70px] w-[100vw] flex items-center justify-between font-normal shadow-md fixed nav-light txt-light">
        <div className="cursor-pointer w-[60%] md:w-[20%] flex items-center">
          <Link to="/" className="flex items-center">
            <h1 className="font-md">Outpass Portal</h1>
          </Link>
        </div>
          <ul className="lg:justify-around md:justify-between items-center sm:flex hidden mt-2">
            {/* Menu items */}
            <li className="list-none inline-block mx-2 font-medium hover:border-b-2 border-blue-600 cursor-pointer p-2 transition-all">
              <a href="#home">
                Home
              </a>
            </li>

            {true ? (
              <li className="list-none inline-block mx-2 font-medium  border-blue-600 cursor-pointer p-2 transition-all">
                  <Link to="/auth">Let's Go</Link>
              </li>
            ) : null}
          </ul>
      </div>
    </>
  );
};

export default NavBar;

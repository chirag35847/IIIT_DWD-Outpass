import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="w-[100%] h-[100%] bg-[#fff]/[.45]">
      <div
        className="flex text-center justify-center items-center flex-col pt-[120px] w-[100vw]"
        id="home"
      >
        <div className="z-10 mb-60 pt-10 lg:mt-20 mobile:mt-20">
          <div className="font-bold txt-light mobile:text-[30px] lg:text-[54px] flex justify-center items-center flex-col">
            <h1 className="text-black opacity-100">Welcome to IIITDWD Outpass Portal</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

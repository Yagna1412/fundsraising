import React from "react";

import FunsImage from "../Assests/banner.jpeg";

const BannerImage = ({ title, subtitle }) => {
  

  return (
    <div className="relative h-full w-full">
      <img
        src={FunsImage}
        alt="Fundraising Banner"
        className="h-full w-full object-cover"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 px-5 text-center text-white">
        <h1 className="max-w-4xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed sm:text-lg lg:text-xl">{subtitle}</p>
      </div>
    </div>
  );
};

export default BannerImage;

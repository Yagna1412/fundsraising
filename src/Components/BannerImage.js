import React from "react";

import FunsImage from "../Assests/banner.jpeg";

const BannerImage = ({ title, subtitle }) => {
  

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <img
        src={FunsImage}
        alt="Fundraising Banner"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          textAlign: "center",
          background: "rgba(0,0,0,0.4)",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>{title}</h1>
        <p style={{ fontSize: "1.25rem", maxWidth: "600px" }}>{subtitle}</p>

       
      </div>
    </div>
  );
};

export default BannerImage;

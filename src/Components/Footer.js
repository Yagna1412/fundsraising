import React from "react";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#007A8E",
        color: "white",
        textAlign: "center",
        padding: "25px 10px",
        fontFamily: "Segoe UI, Arial, sans-serif",
        marginTop: "auto",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      
        <hr
          style={{
            border: "none",
            borderTop: "1px solid rgba(255,255,255,0.3)",
            margin: "10px auto 20px auto",
            width: "90%",
          }}
        />

        
        <p style={{ fontSize: "15px", marginTop: "10px", opacity: 0.9 }}>
          © {new Date().getFullYear()} <strong>MyFundraiser</strong> — All rights reserved.
        </p>

        <p style={{ fontSize: "13px", opacity: 0.8, marginTop: "5px" }}>
          Built with ❤️ to help make a difference in the world.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

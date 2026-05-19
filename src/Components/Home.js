import React from "react";
import { useNavigate } from "react-router-dom";
import BannerImage from "./BannerImage";

const Home = () => {
  const navigate = useNavigate();

  const handleNavigation = (destination) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/loginSignup");
      return;
    }

    if (destination === "start") {
      navigate("/create-fundraiser");
    } 
  
    else if (destination === "explore") {
      navigate("/campaigns");
    }
  };

  return (
    <div style={{ overflow: "hidden", margin: 0, padding: 0 }}>
      <div style={{ width: "100%", height: "70vh", maxHeight: "600px" }}>
        <BannerImage
          title="Join the Cause: Make a Difference Today"
          subtitle="Support our fundraising efforts to change lives and empower communities"
        />
      </div>

      <div
        style={{
          padding: "40px 20px",
          textAlign: "center",
          backgroundColor: "#fff",
        }}
      >
        <h2 style={{ fontSize: "26px", color: "#007A8E", marginBottom: "20px" }}>
          Welcome to MyFundraiser
        </h2>

        <p
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            fontSize: "17px",
            lineHeight: "1.6",
            color: "#333",
          }}
        >
          Start or support a fundraiser today and make a real impact in your community.
        </p>

        <div
          style={{
            marginTop: "30px",
            display: "flex",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          {/* Start Fundraiser Button */}
          <button
            style={buttonStyle}
            onClick={() => handleNavigation("start")}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#005F6B")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#007A8E")}
          >
            Start a Fundraiser
          </button>

          {/* Explore Campaigns Button */}
          <button
            style={buttonStyle}
            onClick={() => handleNavigation("explore")}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#005F6B")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#007A8E")}
          >
            Explore Campaigns
          </button>
        </div>
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: "12px 28px",
  fontSize: "16px",
  fontWeight: "600",
  borderRadius: "6px",
  backgroundColor: "#007A8E",
  color: "white",
  border: "none",
  cursor: "pointer",
  transition: "background 0.3s ease",
};

export default Home;

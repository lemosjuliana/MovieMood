import React from "react";

const LogoutButton: React.FC = () => {
  const handleLogout = () => {
    // ✅ Clear stored email
    localStorage.removeItem("mm_email");

    // ✅ Redirect to login page
    window.location.href = "/login";
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        backgroundColor: "#a90d03",
        color: "white",
        border: "none",
        borderRadius: "8px",
        padding: "8px 16px",
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  );
};

export default LogoutButton;

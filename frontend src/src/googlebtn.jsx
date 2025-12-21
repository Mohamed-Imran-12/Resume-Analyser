import React from "react";


const GoogleButton = ({ onClick, disabled }) => {

    const handleClick = () => {
    
    window.location.href = `${window.location.protocol}//${window.location.host}/oauth2/authorization/google`;
  };
  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      style={{
        userSelect: "none",
        WebkitAppearance: "none",
        backgroundColor: " rgba(228, 226, 226, 1)",
        border: "none",
        borderRadius: "10px",
        boxSizing: "border-box",
        alignSelf:"center",
        width:"96%",
        color: "#1f1f1f",
        cursor: disabled ? "default" : "pointer",
        fontFamily: "'Roboto', arial, sans-serif",
        fontSize: "14px",
        height: "35px",
        letterSpacing: "0.25px",
        outline: "none",
        overflow: "hidden",
        padding: "0 12px",
        position: "relative",
        textAlign: "center",
        transition: "background-color .218s, border-color .218s, box-shadow .218s",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        margin:"30px 20px 10px 20px"
      }}
    >
      <div style={{ width: "20px", height: "17.5px", minWidth: "20px" }}>
        <svg
          viewBox="0 0 48 48"
          style={{ display: "block", width: "100%", height: "100%" }}
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
          <path fill="none" d="M0 0h48v48H0z" />
        </svg>
      </div>
      <span style={{ fontWeight:600,flexGrow: 1 }}>Continue with Google</span>
    </button>
  );
};

export default GoogleButton;

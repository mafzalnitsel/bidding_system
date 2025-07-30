// Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import axios from "axios";
import { Typography, Link } from "@material-ui/core";
import { RemoveRedEye, VisibilityOff } from "@mui/icons-material";
import LINKS from "../../Utils/Links";
import { useAlert } from "react-alert";
function Copyright(props) {
  return (
    <Typography variant="body2" color="textSecondary" align="center" {...props}>
      {"Copyright © "}
      <Link color="inherit" href="https://nitsel.com/">
        NITSEL
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const Login = () => {
  const alert = useAlert();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async () => {
    let Password = password;
    let UserName = username;
    let companyDB = "EEPLLIVE"    //OMMP -------bidd
    // let companyDB = "EEPLTEST";
    const body = { UserName, Password, companyDB };
    const api = `${LINKS.api}/Login`;
    await axios
      .post(api, body)
      .then(async function (response) {
        if (!response) return;
        if (response.data.body.SessionId) {
          var resp = response.data.headers["set-cookie"];
          var cook = "";
          resp.forEach((element) => {
            cook = cook + element.replace("HttpOnly;", "");
          });
          if (cook) {
            await localStorage.setItem("cookie", cook);
            await localStorage.setItem("userName", UserName);
            await localStorage.setItem("ShowBranches", true);
            navigate("/Dashboard");
          }
        } else {
          //   let { data } = response;
          //   console.log({ data });
          alert.error(response.data.body.error.message);
        }
      })
      .catch(function (error) { });
  };
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const handleEnterKeyPress = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };
  return (
    <div className="login-container">
      <img src="./Images/nitsel.png" alt="Logo" className="logo" />
      <h2 style={{ color: "#0b9fc8" }}>Login</h2>
      <form>
        <label htmlFor="username">UserCode</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <div style={{ position: "relative" }}>
          <input
            type={isPasswordVisible ? "text" : "password"}
            id="password"
            onKeyDown={handleEnterKeyPress}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="eye-icon" onClick={togglePasswordVisibility}>
            {isPasswordVisible ? <VisibilityOff /> : <RemoveRedEye />}
          </span>
        </div>
        <button
          type="button"
          tabIndex="0"
          style={{ marginTop: "20px" }}
          onClick={handleLogin}
        >
          Login
        </button>
        <Copyright style={{ marginTop: "20px", color: "textSecondary" }} />
      </form>
    </div>
  );
};

export default Login;

import { useRef, useState } from "react";
import "./login.css";
import RoomIcon from "@mui/icons-material/Room";
import axios from "axios";
import Cancel from "@mui/icons-material/Cancel";

// eslint-disable-next-line react/prop-types
const Login = ({ setShowLogin, setCurrentUser }) => {
  const [error, setError] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const res = await axios.post(
        "http://localhost:8000/api/users/login",
        user
      );
      localStorage.setItem("user", res.data.username);
      setCurrentUser(res.data.username);
      setError(false);
      setShowLogin(false);
    } catch (err) {
      setError(true);
    }
  };
  return (
    <div className="loginContainer">
      <div className="logo">
        <RoomIcon />
        HamaPin
      </div>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="email" ref={emailRef} />
        <input type="password" placeholder="password" ref={passwordRef} />
        <button className="loginBtn">Login</button>
        {error && <span className="failure">Something went wrong!</span>}
      </form>
      <Cancel className="loginCancel" onClick={() => setShowLogin(false)} />
    </div>
  );
};

export default Login;

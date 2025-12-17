import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();

  const [empId, setEmpId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault(); 

    const employees = JSON.parse(localStorage.getItem("employees")) || [];

    const found = employees.find(
      (emp) => emp.id === empId && emp.password === password
    );

    if (found) {
      alert("Login Successful!");
      navigate("/attendance");  
    } else {
      alert("Invalid Employee ID or Password");
    }
  };

  return (
    <div className="login-container">
      <div className="image-panel">
        <img src="https://hrms.nuhvin.com/Login.png" alt="Login Illustration" />
      </div>

      <div className="form-panel">
        <h2 className="sign-in-title">Sign In</h2>

        <form onSubmit={handleLogin}>
          <label>Employee Id</label>
          <input
            type="text"
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="links-container">
            <div className="forgot-link">Forgot password?</div>

            <div
              className="hr-register-link"
              onClick={() => navigate("/HrRegister")}
              style={{ cursor: "pointer", color: "blue" }}
            >
              Hr Register
            </div>
          </div>

          <button type="submit" className="login-btn">Log in</button>
        </form>
      </div>
    </div>
  );
}
 
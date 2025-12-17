import "./Mail.css";
import { useNavigate } from "react-router-dom";
import logoImg from "./assets/image.png";

function Mail() {
  const navigate = useNavigate();

  return (
    <div className="main-container">

      <header className="header">
        <img className="img" src={logoImg} alt="logo" />
        <h1 className="logo">HRMSPortal</h1>

        <button
          className="madhu"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </header>

     
      <section className="hero">
        <h2 className="hero-title">Welcome to HR Management System</h2>
        <p className="hero-text">
          Manage employees, attendance, payroll, leave requests, and more.
        </p>
        <button className="get-started">
          Get Started
        </button>
      </section>

      {/* Cards */}
      <div className="card-container">
        <div
          className="card1"
          onClick={() => navigate("/employee")}
        >
          <h3 className="card-title">Employee Management</h3>
          <p className="card-text">
            Add and manage employee records easily.
          </p>
        </div>

        <div
          className="card2"
          onClick={() => navigate("/admin")}
        >
          <h3 className="card-title">Attendance Tracking</h3>
          <p className="card-text">
            Track attendance and working hours.
          </p>
        </div>

        <div
          className="card3"
          onClick={() => navigate("/payroll")}
        >
          <h3 className="card-title">Payroll & Reports</h3>
          <p className="card-text">
            Generate payroll and reports quickly.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Mail;

import React, { useState } from "react";
import "./Hr.css";

export default function HRRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.password) {
      alert("Please fill all required fields");
      return;
    }

    console.log("HR Registered:", form);
    alert("HR Registered Successfully!");

    // Reset form
    setForm({
      name: "",
      email: "",
      phone: "",
      department: "",
      password: ""
    });
  };

  return (
    <div className="register-page">
      <div className="register-box">
        <h2>HR Registration</h2>

        <form onSubmit={handleSubmit}>
          
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter full name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Phone</label>
          <input
            type="number"
            name="phone"
            placeholder="Enter phone number"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <label>Department</label>
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
          >
            <option value="">Select Department</option>
            <option value="HR">HR</option>
            <option value="IT">IT</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
          </select>

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button className="btn" type="submit">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

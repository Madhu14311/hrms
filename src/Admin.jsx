import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [leaveRecords, setLeaveRecords] = useState([]);

  // Fetch data and poll localStorage every second
  useEffect(() => {
    const fetchData = () => {
      const savedAttendance = localStorage.getItem("attendance_records");
      const savedLeaves = localStorage.getItem("leave_records");

      if (savedAttendance) setAttendanceRecords(JSON.parse(savedAttendance));
      if (savedLeaves) setLeaveRecords(JSON.parse(savedLeaves));
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);

    return () => clearInterval(interval);
  }, []);

  // Approve leave
  const handleApproveLeave = (index) => {
    const updatedLeaves = [...leaveRecords];
    updatedLeaves[index].status = "Approved";
    setLeaveRecords(updatedLeaves);
    localStorage.setItem("leave_records", JSON.stringify(updatedLeaves));
  };

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      {/* Attendance Table */}
      <div className="card">
        <h2>Attendance Records</h2>
        <table className="table">
          <thead>
            <tr>
              
              <th>Date</th>
              <th>Name</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Hours Worked</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.length === 0 ? (
              <tr>
                <td colSpan="5">No records yet.</td>
              </tr>
            ) : (
              attendanceRecords.map((r, index) => (
                <tr key={index}>
                  <td>{r.date}</td>
                  <td>{r.name}</td>
                  <td>{r.checkIn}</td>
                  <td>{r.checkOut}</td>
                  <td>{r.hours} hrs</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Leave Table */}
      <div className="card">
        <h2>Leave Records</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th> {/* ✅ added */}
              <th>Date</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {leaveRecords.length === 0 ? (
              <tr>
                <td colSpan="5">No leave applications yet.</td>
              </tr>
            ) : (
              leaveRecords.map((l, index) => (
                <tr key={index}>
                  <td>{l.name}</td> {/* ✅ added */}
                  <td>{l.date}</td>
                  <td>{l.reason}</td>
                  <td>{l.status}</td>
                  <td>
                    {l.status === "Pending" && (
                      <button onClick={() => handleApproveLeave(index)}>
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

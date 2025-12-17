import React, { useState, useEffect } from "react";
import "./Attendance.css";

export default function Attendance() {
  const [records, setRecords] = useState([]);
  const [startTime, setStartTime] = useState(null);

  const [leaves, setLeaves] = useState([]);
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveDate, setLeaveDate] = useState("");

  // 🔥 NEW: prevent overwrite on first load
  const [dataLoaded, setDataLoaded] = useState(false);

  // ✅ Logged employee
  const loggedEmployee = JSON.parse(
    localStorage.getItem("loggedEmployee")
  );
  const employeeName = loggedEmployee?.name;

  // ================= LOAD DATA =================
  useEffect(() => {
    const savedAttendance = localStorage.getItem("attendance_records");
    const savedLeaves = localStorage.getItem("leave_records");

    if (savedAttendance) {
      const parsed = JSON.parse(savedAttendance);
      setRecords(parsed);

      // restore active check-in
      if (parsed.length > 0 && parsed[0].checkOut === "--") {
        setStartTime(new Date());
      }
    }

    if (savedLeaves) setLeaves(JSON.parse(savedLeaves));

    setDataLoaded(true); // 🔥 mark load complete
  }, []);

  // ================= SAVE ATTENDANCE =================
  useEffect(() => {
    if (!dataLoaded) return; // 🔥 STOP first empty overwrite
    localStorage.setItem("attendance_records", JSON.stringify(records));
  }, [records, dataLoaded]);

  // ================= SYNC LEAVES =================
  useEffect(() => {
    const syncLeaves = () => {
      const updatedLeaves = localStorage.getItem("leave_records");
      if (updatedLeaves) {
        setLeaves(JSON.parse(updatedLeaves));
      }
    };

    window.addEventListener("storage", syncLeaves);
    window.addEventListener("focus", syncLeaves);

    return () => {
      window.removeEventListener("storage", syncLeaves);
      window.removeEventListener("focus", syncLeaves);
    };
  }, []);

  // ================= CHECK IN =================
  const handleCheckIn = () => {
    if (startTime) return;

    const now = new Date();
    setStartTime(now);

    const newRecord = {
      date: now.toLocaleDateString(),
      name:employeeName,
      checkIn: now.toLocaleTimeString(),
      checkOut: "--",
      hours: "--",
    };

    setRecords([newRecord, ...records]);
  };

  // ================= CHECK OUT =================
  const handleCheckOut = () => {
    if (!startTime) return;

    const endTime = new Date();
    const hours = ((endTime - startTime) / (1000 * 60 * 60)).toFixed(2);

    const updatedRecords = [...records];
    updatedRecords[0] = {
      ...updatedRecords[0],
      checkOut: endTime.toLocaleTimeString(),
      hours,
    };

    setRecords(updatedRecords);
    setStartTime(null);
  };

  // ================= APPLY LEAVE =================
  const handleLeaveSubmit = () => {
    if (!leaveDate || !leaveReason) {
      alert("Please enter date and reason for leave.");
      return;
    }

    const newLeave = {
      name: employeeName,
      date: leaveDate,
      reason: leaveReason,
      status: "Pending",
    };

    const updatedLeaves = [newLeave, ...leaves];
    setLeaves(updatedLeaves);
    localStorage.setItem("leave_records", JSON.stringify(updatedLeaves));

    setLeaveDate("");
    setLeaveReason("");
  };

  // show only this employee leaves
  const myLeaves = leaves.filter(
    (leave) => leave.name === employeeName
  );

  const isCheckedIn =
    records.length > 0 && records[0].checkOut === "--";

  return (
    <div className="attendance-container">
      <h1 className="attendance-title">
        Attendance & Leave Management
      </h1>

      {/* Attendance Buttons */}
      <div className="card">
        <h2>Mark Attendance</h2>

        <button
          className="btn btn-checkin"
          onClick={handleCheckIn}
          disabled={isCheckedIn}
        >
          Check In
        </button>

        <button
          className="btn btn-checkout"
          onClick={handleCheckOut}
          disabled={!isCheckedIn}
          style={{ marginLeft: "10px" }}
        >
          Check Out
        </button>
      </div>

      {/* Attendance Records */}
      <div className="card">
        <h2>Attendance Records</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Hours Worked</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No records yet.
                </td>
              </tr>
            ) : (
              records.map((r, index) => (
                <tr key={index}>
                  <td>{r.date}</td>
                  <td>{r.checkIn}</td>
                  <td>{r.checkOut}</td>
                  <td>{r.hours}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Apply Leave */}
      <div className="card">
        <h2>Apply for Leave</h2>

        <input
          type="date"
          className="input"
          value={leaveDate}
          onChange={(e) => setLeaveDate(e.target.value)}
        />

        <input
          type="text"
          className="input"
          placeholder="Reason for leave"
          value={leaveReason}
          onChange={(e) => setLeaveReason(e.target.value)}
        />

        <button className="btn btn-checkin" onClick={handleLeaveSubmit}>
          Apply Leave
        </button>
      </div>

      {/* Leave Records */}
      <div className="card">
        <h2>Leave Records</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {myLeaves.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No leave applications yet.
                </td>
              </tr>
            ) : (
              myLeaves.map((l, index) => (
                <tr key={index}>
                  <td>{l.name}</td>
                  <td>{l.date}</td>
                  <td>{l.reason}</td>
                  <td>{l.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

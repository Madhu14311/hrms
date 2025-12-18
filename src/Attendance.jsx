import React, { useState, useEffect } from "react";
import "./Attendance.css";

export default function Attendance() {
  const loggedEmployee = JSON.parse(localStorage.getItem("loggedEmployee"));
  const employeeName = loggedEmployee?.name;

  const [records, setRecords] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [leaveDate, setLeaveDate] = useState("");
  const [leaveReason, setLeaveReason] = useState("");

  /* =======================
     LOAD DATA
     ======================= */
  useEffect(() => {
    if (!employeeName) return;

    const allAttendance =
      JSON.parse(localStorage.getItem("all_attendance")) || {};

    setRecords(allAttendance[employeeName] || []);

    const savedLeaves =
      JSON.parse(localStorage.getItem("leave_records")) || [];
    setLeaves(savedLeaves);
  }, [employeeName]);

  /* =======================
     CHECK IN
     ======================= */
  const handleCheckIn = () => {
    const now = new Date();

    const allAttendance =
      JSON.parse(localStorage.getItem("all_attendance")) || {};

    if (!allAttendance[employeeName]) {
      allAttendance[employeeName] = [];
    }

    // Prevent double check-in
    if (allAttendance[employeeName][0]?.checkOut === "--") return;

    allAttendance[employeeName].unshift({
      date: now.toLocaleDateString("en-IN"),
      name: employeeName,
      checkIn: now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }),
      checkInTime: now.getTime(), // timestamp for calculation
      checkOut: "--",
      hours: "--", // HH:MM will be stored on checkout
    });

    localStorage.setItem("all_attendance", JSON.stringify(allAttendance));
    setRecords(allAttendance[employeeName]);
  };

  /* =======================
     CHECK OUT
     ======================= */
  const handleCheckOut = () => {
    const now = new Date();

    const allAttendance =
      JSON.parse(localStorage.getItem("all_attendance")) || {};

    const todayRecord = allAttendance[employeeName]?.[0];

    if (!todayRecord || todayRecord.checkOut !== "--") return;

    if (!todayRecord.checkInTime) {
      alert("Check-in time missing. Please check in again.");
      return;
    }

    // Calculate HH:MM
    const diffMs = now.getTime() - todayRecord.checkInTime;
    const totalMinutes = Math.floor(diffMs / (1000 * 60));

    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    const workedTime = `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
      2,
      "0"
    )}`;

    allAttendance[employeeName][0] = {
      ...todayRecord,
      checkOut: now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }),
      hours: workedTime, // ✅ STORED AS HH:MM
    };

    localStorage.setItem("all_attendance", JSON.stringify(allAttendance));
    setRecords(allAttendance[employeeName]);
  };

  /* =======================
     APPLY LEAVE
     ======================= */
  const handleLeaveSubmit = () => {
    if (!leaveDate || !leaveReason) {
      alert("Please enter leave date and reason");
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

  const myLeaves = leaves.filter((l) => l.name === employeeName);

  const isCheckedIn =
    records.length > 0 && records[0].checkOut === "--";

  /* =======================
     UI
     ======================= */
  return (
    <div className="attendance-container">
      <h1>Welcome, {employeeName} 👋</h1>

      <div className="card">
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

      <div className="card">
        <h2>Attendance Records</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Worked Time (HH:MM)</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan="4">No records</td>
              </tr>
            ) : (
              records.map((r, i) => (
                <tr key={i}>
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

      <div className="card">
        <h2>Apply Leave</h2>
        <input
          type="date"
          value={leaveDate}
          onChange={(e) => setLeaveDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Leave reason"
          value={leaveReason}
          onChange={(e) => setLeaveReason(e.target.value)}
        />
        <button className="btn" onClick={handleLeaveSubmit}>
          Apply
        </button>
      </div>

      <div className="card">
        <h2>My Leave Records</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {myLeaves.length === 0 ? (
              <tr>
                <td colSpan="3">No leaves</td>
              </tr>
            ) : (
              myLeaves.map((l, i) => (
                <tr key={i}>
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

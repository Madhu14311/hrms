import React, { useState, useEffect } from "react";
import "./Attendance.css";

export default function Attendance() {
  const loggedEmployee = JSON.parse(
    localStorage.getItem("loggedEmployee")
  );

  const employeeName = loggedEmployee?.name;

  const [records, setRecords] = useState([]);
  const [startTime, setStartTime] = useState(null);

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

    if (allAttendance[employeeName]) {
      setRecords(allAttendance[employeeName]);

      if (allAttendance[employeeName][0]?.checkOut === "--") {
        setStartTime(new Date());
      }
    }

    const savedLeaves =
      JSON.parse(localStorage.getItem("leave_records")) || [];
    setLeaves(savedLeaves);
  }, [employeeName]);

  /* =======================
     CHECK IN
     ======================= */
  const handleCheckIn = () => {
    if (startTime) return;

    const now = new Date();
    setStartTime(now);

    const allAttendance =
      JSON.parse(localStorage.getItem("all_attendance")) || {};

    if (!allAttendance[employeeName]) {
      allAttendance[employeeName] = [];
    }

    allAttendance[employeeName].unshift({
      date: now.toLocaleDateString(),
      name: employeeName,
      checkIn: now.toLocaleTimeString(),
      checkOut: "--",
      hours: "--",
    });

    localStorage.setItem(
      "all_attendance",
      JSON.stringify(allAttendance)
    );

    setRecords(allAttendance[employeeName]);
  };

  /* =======================
     CHECK OUT
     ======================= */
  const handleCheckOut = () => {
    if (!startTime) return;

    const endTime = new Date();
    const hours = (
      (endTime - startTime) /
      (1000 * 60 * 60)
    ).toFixed(2);

    const allAttendance =
      JSON.parse(localStorage.getItem("all_attendance")) || {};

    allAttendance[employeeName][0] = {
      ...allAttendance[employeeName][0],
      checkOut: endTime.toLocaleTimeString(),
      hours,
    };

    localStorage.setItem(
      "all_attendance",
      JSON.stringify(allAttendance)
    );

    setRecords(allAttendance[employeeName]);
    setStartTime(null);
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
    localStorage.setItem(
      "leave_records",
      JSON.stringify(updatedLeaves)
    );

    setLeaveDate("");
    setLeaveReason("");
  };

  const myLeaves = leaves.filter(
    (l) => l.name === employeeName
  );

  const isCheckedIn =
    records.length > 0 && records[0].checkOut === "--";

  /* =======================
     UI
     ======================= */
  return (
    <div className="attendance-container">
      <h1>Welcome, {employeeName} 👋</h1>

      {/* Attendance */}
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

      {/* Records */}
      <div className="card">
        <h2>Attendance Records</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Hours</th>
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

      {/* Apply Leave */}
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

      {/* Leave Records */}
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

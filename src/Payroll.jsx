import React, { useEffect, useState } from "react";
import "./Attendance.css";

const HOURLY_RATE = 16;

export default function AdminPayroll() {
  const [attendanceData, setAttendanceData] = useState({});
  const [payrollRows, setPayrollRows] = useState({});
  const [editingRow, setEditingRow] = useState(null);


useEffect(() => {
  const allAttendance =
    JSON.parse(localStorage.getItem("all_attendance")) || {
      "Madhu Seetalam": [
        { date: "2025-12-18", checkIn: "09:00", checkOut: "18:00", hours: "9" },
        { date: "2025-12-19", checkIn: "09:30", checkOut: "18:30", hours: "9" }
      ]
    };
  setAttendanceData(allAttendance);


    setAttendanceData(allAttendance);

    const payrollInit = {};

    Object.entries(allAttendance).forEach(
      ([employeeName, records]) => {
        const completed = records.filter(r => r.hours !== "--");
        const totalHours = completed.reduce(
          (sum, r) => sum + parseFloat(r.hours),
          0
        );

        payrollInit[employeeName] = [
          {
            period: "Monthly",
            type: "Hourly",
            salary: (totalHours * HOURLY_RATE).toFixed(2)
          }
        ];
      }
    );

    setPayrollRows(payrollInit);
  }, []);


  const getCompletedRecords = (records = []) =>
    records.filter((r) => r.hours !== "--");

  const calculateTotalHours = (records) =>
    records.reduce((sum, r) => sum + parseFloat(r.hours), 0);

 
 
  return (
    <div className="attendance-container">
      <h1>All Employees Payroll</h1>

      {Object.keys(attendanceData).length === 0 && (
        <p>No attendance data available</p>
      )}

      {Object.entries(attendanceData).map(
        ([employeeName, records], index) => {
          const completed = getCompletedRecords(records);
          const totalHours = calculateTotalHours(completed);
          const totalSalary = totalHours * HOURLY_RATE;

          return (
            <div className="card" key={index}>
              <h2>Employee: {employeeName}</h2>

             
              <h3>Attendance</h3>
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
                  {completed.length === 0 ? (
                    <tr>
                      <td colSpan="4">No records</td>
                    </tr>
                  ) : (
                    completed.map((r, i) => (
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

             
              <h3>Salary Summary</h3>
              <p><strong>Total Hours:</strong> {totalHours.toFixed(2)}</p>
              <p><strong>Hourly Rate:</strong> ₹{HOURLY_RATE}</p>
              <p><strong>Total Salary:</strong> ₹{totalSalary.toFixed(2)}</p>

            
              <h3>Payroll Details</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Pay Period</th>
                    <th>Salary Type</th>
                    <th>Salary (₹)</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payrollRows[employeeName]?.map((row, i) => {
                    const rowId = `${employeeName}-${i}`;
                    const isEditing = editingRow === rowId;

                    return (
                      <tr key={i}>
                        <td>{employeeName}</td>

                        <td>
                          {isEditing ? (
                            <input
                              value={row.period}
                              onChange={(e) => {
                                const updated = [...payrollRows[employeeName]];
                                updated[i].period = e.target.value;
                                setPayrollRows({
                                  ...payrollRows,
                                  [employeeName]: updated
                                });
                              }}
                            />
                          ) : (
                            row.period
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <select
                              value={row.type}
                              onChange={(e) => {
                                const updated = [...payrollRows[employeeName]];
                                updated[i].type = e.target.value;
                                setPayrollRows({
                                  ...payrollRows,
                                  [employeeName]: updated
                                });
                              }}
                            >
                              <option value="Hourly">Hourly</option>
                              <option value="Monthly">Monthly</option>
                            </select>
                          ) : (
                            row.type
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <input
                              type="number"
                              value={row.salary}
                              onChange={(e) => {
                                const updated = [...payrollRows[employeeName]];
                                updated[i].salary = e.target.value;
                                setPayrollRows({
                                  ...payrollRows,
                                  [employeeName]: updated
                                });
                              }}
                            />
                          ) : (
                            `₹${row.salary}`
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <button
                              onClick={() => setEditingRow(null)}
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              onClick={() => setEditingRow(rowId)}
                            >
                              Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        }
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import "./Employee.css";

export default function Employee() {
  const [showForm, setShowForm] = useState(false);
  const [showTable, setShowTable] = useState(true);

  const [editIndex, setEditIndex] = useState(null); // ✅ NEW

  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem("employees");
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ FIX: only set default employee if localStorage empty
  useEffect(() => {
    const saved = localStorage.getItem("employees");

    if (!saved) {
      const defaultEmployee = [
        {
          id: "Madhu",
          password: "Smadhu@2001",
          name: "Madhu",
          email: "seetalammadhu123@gmail.com",
          role: "developer",
        },
      ];
      setEmployees(defaultEmployee);
      localStorage.setItem("employees", JSON.stringify(defaultEmployee));
    }
  }, []);

  const [formData, setFormData] = useState({
    id: "",
    password: "",
    name: "",
    email: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ================= ADD / UPDATE =================
  const handleSaveEmployee = () => {
    if (
      !formData.id ||
      !formData.password ||
      !formData.name ||
      !formData.email ||
      !formData.role
    ) {
      alert("Please fill all fields!");
      return;
    }

    let updatedList = [...employees];

    if (editIndex !== null) {
      // ✏️ UPDATE
      updatedList[editIndex] = formData;
    } else {
      // ➕ ADD
      updatedList.push(formData);
    }

    setEmployees(updatedList);
    localStorage.setItem("employees", JSON.stringify(updatedList));

    setFormData({
      id: "",
      password: "",
      name: "",
      email: "",
      role: "",
    });

    setEditIndex(null);
    setShowForm(false);
    setShowTable(true);
  };

  // ================= EDIT =================
  const handleEdit = (index) => {
    setFormData(employees[index]);
    setEditIndex(index);
    setShowForm(true);
    setShowTable(false);
  };

  // ================= DELETE =================
  const handleDelete = (index) => {
    const updated = employees.filter((_, i) => i !== index);
    setEmployees(updated);
    localStorage.setItem("employees", JSON.stringify(updated));
  };

  return (
    <div className="sir">
      <div className="employee-container">
        <h1 className="employee-title">Employee Management</h1>

        <div className="employee-actions">
          <button
            className="btn add-btn"
            onClick={() => {
              setShowForm(true);
              setShowTable(false);
              setEditIndex(null);
              setFormData({
                id: "",
                password: "",
                name: "",
                email: "",
                role: "",
              });
            }}
          >
            + Add Employee
          </button>

          <button
            className="btn view-btn"
            onClick={() => {
              setShowForm(false);
              setShowTable(true);
            }}
          >
            View All Employees
          </button>
        </div>

        {showForm && (
          <div className="employee-card">
            <h3>{editIndex !== null ? "Edit Employee" : "Add New Employee"}</h3>

            <input name="id" placeholder="Employee ID" value={formData.id} onChange={handleChange} />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
            <input name="name" placeholder="Employee Name" value={formData.name} onChange={handleChange} />
            <input type="email" name="email" placeholder="Employee Email" value={formData.email} onChange={handleChange} />
            <input name="role" placeholder="Employee Role" value={formData.role} onChange={handleChange} />

            <button className="btn save-btn" onClick={handleSaveEmployee}>
              {editIndex !== null ? "Update Employee" : "Save Employee"}
            </button>
          </div>
        )}

        {showTable && (
          <div className="employee-card">
            <h3>Employee List</h3>

            {employees.length === 0 ? (
              <p>No employees added yet.</p>
            ) : (
              <table className="employee-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Employee ID</th>
                    <th>Password</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp, index) => (
                    <tr key={emp.id}>
                      <td>{index + 1}</td>
                      <td>{emp.id}</td>
                      <td>{emp.password}</td>
                      <td>{emp.name}</td>
                      <td>{emp.email}</td>
                      <td>{emp.role}</td>
                      <td>
                        <button className="btn edit-btn" onClick={() => handleEdit(index)}>
                          Edit
                        </button>
                        <button className="btn delete-btn" onClick={() => handleDelete(index)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

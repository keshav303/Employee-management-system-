import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/employees";

function App() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    salary: "",
  });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const fetchEmployees = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.log("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.department || !formData.salary) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (editId) {
        await fetch(`${API_URL}/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        setEditId(null);
      } else {
        await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      }

      setFormData({
        name: "",
        email: "",
        department: "",
        salary: "",
      });

      fetchEmployees();
    } catch (error) {
      console.log("Error saving employee:", error);
    }
  };

  const handleEdit = (employee) => {
    setEditId(employee._id);
    setFormData({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      salary: employee.salary,
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
    if (!confirmDelete) return;

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      fetchEmployees();
    } catch (error) {
      console.log("Error deleting employee:", error);
    }
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(search.toLowerCase()) ||
    employee.email.toLowerCase().includes(search.toLowerCase()) ||
    employee.department.toLowerCase().includes(search.toLowerCase())
  );

  const totalSalary = employees.reduce((sum, employee) => {
    return sum + Number(employee.salary);
  }, 0);

  const departments = new Set(employees.map((employee) => employee.department));

  return (
    <div className="app">
      <header className="hero">
        <div>
          <span className="badge">Assessment 4 Project</span>
          <h1>Employee Management System</h1>
          <p>
            A full-stack CRUD application built with React, Node.js, Express.js,
            MongoDB and MVC architecture.
          </p>
        </div>
      </header>

      <section className="stats">
        <div className="stat-card">
          <p>Total Employees</p>
          <h2>{employees.length}</h2>
        </div>

        <div className="stat-card">
          <p>Departments</p>
          <h2>{departments.size}</h2>
        </div>

        <div className="stat-card">
          <p>Total Salary</p>
          <h2>₹{totalSalary}</h2>
        </div>
      </section>

      <main className="container">
        <section className="form-card">
          <div className="card-title">
            <h2>{editId ? "Update Employee" : "Add New Employee"}</h2>
            <p>{editId ? "Modify employee details" : "Enter employee information"}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <label>Employee Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter employee name"
              value={formData.name}
              onChange={handleChange}
            />

            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter employee email"
              value={formData.email}
              onChange={handleChange}
            />

            <label>Department</label>
            <input
              type="text"
              name="department"
              placeholder="IT, HR, Marketing..."
              value={formData.department}
              onChange={handleChange}
            />

            <label>Salary</label>
            <input
              type="number"
              name="salary"
              placeholder="Enter salary"
              value={formData.salary}
              onChange={handleChange}
            />

            <button type="submit" className="primary-btn">
              {editId ? "Update Employee" : "Add Employee"}
            </button>

            {editId && (
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setEditId(null);
                  setFormData({
                    name: "",
                    email: "",
                    department: "",
                    salary: "",
                  });
                }}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </section>

        <section className="list-card">
          <div className="list-header">
            <div>
              <h2>Employee Records</h2>
              <p>View, search, update and delete employees</p>
            </div>

            <input
              type="text"
              placeholder="Search by name, email or department"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filteredEmployees.length === 0 ? (
            <div className="empty-box">
              <h3>No employees found</h3>
              <p>Add an employee using the form to see records here.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Salary</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr key={employee._id}>
                      <td>
                        <div className="employee-cell">
                          <div className="avatar">
                            {employee.name.charAt(0).toUpperCase()}
                          </div>
                          <span>{employee.name}</span>
                        </div>
                      </td>
                      <td>{employee.email}</td>
                      <td>
                        <span className="department-pill">
                          {employee.department}
                        </span>
                      </td>
                      <td className="salary">₹{employee.salary}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="edit-btn"
                            onClick={() => handleEdit(employee)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(employee._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;

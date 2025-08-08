"use client";

import { useEffect, useMemo, useState } from "react";

type Employee = {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: string;
  created_at?: string;
  updated_at?: string;
};

export default function EmployeeDirectory() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    role: "",
    status: "Active",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    loadEmployees();
  }, [debouncedSearch, department, status]);

  const loadEmployees = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        search: debouncedSearch,
        department,
        status,
      });

      const response = await fetch(`/api/employees?${params}`);
      if (response.ok) {
        const data = await response.json();
        setEmployees(data.employees || []);
      } else {
        console.error("Failed to load employees");
      }
    } catch (error) {
      console.error("Error loading employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      const matchesQuery = [e.name, e.email, e.department, e.role]
        .join(" ")
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());
      const matchesDept = !department || e.department === department;
      const matchesStatus = !status || e.status === status;
      return matchesQuery && matchesDept && matchesStatus;
    });
  }, [employees, debouncedSearch, department, status]);

  const departments = [
    "Engineering",
    "Finance",
    "Operations",
    "Sales",
    "HR",
    "Marketing",
    "Product",
    "Support",
    "Legal",
  ];
  const statuses = ["Active", "Inactive"];
  const roles = [
    "Manager",
    "Developer",
    "Analyst",
    "Coordinator",
    "Specialist",
    "Director",
    "Lead",
    "Associate",
    "Senior",
    "Junior",
  ];

  const handleCreate = () => {
    setEditingEmployee(null);
    setFormData({
      name: "",
      email: "",
      department: "",
      role: "",
      status: "Active",
    });
    setShowModal(true);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      role: employee.role,
      status: employee.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      try {
        const response = await fetch(`/api/employees/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setEmployees((prev) => prev.filter((emp) => emp.id !== id));
        } else {
          console.error("Failed to delete employee");
        }
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingEmployee) {
        const response = await fetch(`/api/employees/${editingEmployee.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const updatedEmployee = await response.json();
          setEmployees((prev) =>
            prev.map((emp) =>
              emp.id === editingEmployee.id ? updatedEmployee : emp
            )
          );
        }
      } else {
        const response = await fetch("/api/employees", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const newEmployee = await response.json();
          setEmployees((prev) => [newEmployee, ...prev]);
        }
      }

      setShowModal(false);
      setEditingEmployee(null);
    } catch (error) {
      console.error("Error saving employee:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (loading) {
    return (
      <div className="text-foreground">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading employees...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-foreground">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Employee Directory</h2>
        <button
          onClick={handleCreate}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded font-medium transition-colors"
        >
          Add Employee
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
        <input
          placeholder="Search by name, email, dept, role"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-theme rounded px-3 py-2 w-full bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
        />
        <select
          className="border border-theme rounded px-3 py-2 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select
          className="border border-theme rounded px-3 py-2 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-y-auto border border-theme rounded">
        <table className="w-full text-sm">
          <thead className="bg-muted sticky top-0">
            <tr>
              <th className="text-left p-3 text-muted-foreground font-medium">
                Name
              </th>
              <th className="text-left p-3 text-muted-foreground font-medium">
                Email
              </th>
              <th className="text-left p-3 text-muted-foreground font-medium">
                Department
              </th>
              <th className="text-left p-3 text-muted-foreground font-medium">
                Role
              </th>
              <th className="text-left p-3 text-muted-foreground font-medium">
                Status
              </th>
              <th className="text-left p-3 text-muted-foreground font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((emp) => (
              <tr
                key={emp.id}
                className="border-t border-theme hover:bg-muted/50 transition-colors"
              >
                <td className="p-3">{emp.name}</td>
                <td className="p-3">{emp.email}</td>
                <td className="p-3">{emp.department}</td>
                <td className="p-3">{emp.role}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      emp.status === "Active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}
                  >
                    {emp.status}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(emp)}
                      className="text-blue-600 hover:text-blue-800 text-sm transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(emp.id)}
                      className="text-red-600 hover:text-red-800 text-sm transition-colors"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card border border-theme rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingEmployee ? "Edit Employee" : "Add New Employee"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-muted mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-theme rounded px-3 py-2 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-theme rounded px-3 py-2 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full border border-theme rounded px-3 py-2 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full border border-theme rounded px-3 py-2 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                  required
                >
                  <option value="">Select Role</option>
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full border border-theme rounded px-3 py-2 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                  required
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded font-medium transition-colors"
                >
                  {editingEmployee ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-theme rounded text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

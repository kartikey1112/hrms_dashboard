"use client";

import { useEffect, useState } from "react";

type Leave = {
  id: string;
  employee_id: string;
  employee_name: string;
  type: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at?: string;
  updated_at?: string;
};

export default function LeaveRequests() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    loadLeaves();
  }, [debouncedSearch, filter]);

  const loadLeaves = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        search: debouncedSearch,
        status: filter,
      });

      const response = await fetch(`/api/leaves?${params}`);
      if (response.ok) {
        const data = await response.json();
        setLeaves(data.leaves || []);
      } else {
        console.error("Failed to load leaves");
      }
    } catch (error) {
      console.error("Error loading leaves:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter ? leaves.filter((l) => l.status === filter) : leaves;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="text-foreground">
      <h2 className="text-xl font-semibold mb-4">Leave Requests</h2>

      {/* Search & Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
        <input
          placeholder="Search by employee name or leave type"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-theme rounded px-3 py-2 w-full bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
        />
        <select
          className="border border-theme rounded px-3 py-2 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="border border-theme rounded overflow-x-auto">
        {loading ? (
          <div className="text-foreground">
            <div className="flex justify-center items-center h-64">
              <div className="text-lg">Loading leave requests...</div>
            </div>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted sticky top-0">
              <tr>
                <th className="text-left p-3 text-muted-foreground font-medium">
                  Employee
                </th>
                <th className="text-left p-3 text-muted-foreground font-medium">
                  Leave Type
                </th>
                <th className="text-left p-3 text-muted-foreground font-medium">
                  Start Date
                </th>
                <th className="text-left p-3 text-muted-foreground font-medium">
                  End Date
                </th>
                <th className="text-left p-3 text-muted-foreground font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((leave) => (
                <tr
                  key={leave.id}
                  className="border-t border-theme hover:bg-muted/50 transition-colors"
                >
                  <td className="p-3">{leave.employee_name}</td>
                  <td className="p-3">{leave.type}</td>
                  <td className="p-3">{formatDate(leave.start_date)}</td>
                  <td className="p-3">{formatDate(leave.end_date)}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        leave.status
                      )}`}
                    >
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

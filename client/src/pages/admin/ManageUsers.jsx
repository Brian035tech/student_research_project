import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminLayout from "../../components/AdminLayout";

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get("/admin/users");
            setUsers(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteUser = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`/admin/users/${id}`);
            alert("User deleted successfully.");
            fetchUsers();
        } catch (err) {
            console.log(err);
            alert("Failed to delete user.");
        }
    };

    const roleBadge = (role) => {
        let color = "#6c757d";

        if (role === "student") color = "#0d6efd";
        else if (role === "lecturer") color = "#198754";
        else if (role === "supervisor") color = "#6f42c1";
        else if (role === "admin") color = "#dc3545";

        return (
            <span
                style={{
                    backgroundColor: color,
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                }}
            >
                {role}
            </span>
        );
    };

    // Search filter
    const filteredUsers = users.filter((user) => {
        return (
            user.full_name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()) ||
            user.role.toLowerCase().includes(search.toLowerCase())
        );
    });

    return (
        <AdminLayout>

            <h2 className="mb-4">Manage Users</h2>

            <div className="mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="🔍 Search by name, email or role..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="table-responsive">

                <table
                    className="table table-hover table-bordered align-middle"
                >

                    <thead className="table-dark">

                        <tr>
                            <th>ID</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th width="150">Action</th>
                        </tr>

                    </thead>

                    <tbody>

                        {filteredUsers.length > 0 ? (

                            filteredUsers.map((user) => (

                                <tr key={user.id}>

                                    <td>{user.id}</td>

                                    <td>{user.full_name}</td>

                                    <td>{user.email}</td>

                                    <td>{roleBadge(user.role)}</td>

                                    <td>

                                        {user.role === "admin" ? (

                                            <span className="text-muted fw-bold">
                                                Protected
                                            </span>

                                        ) : (

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => deleteUser(user.id)}
                                            >
                                                Delete
                                            </button>

                                        )}

                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    colSpan="5"
                                    className="text-center py-4"
                                >
                                    No users found.
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </AdminLayout>
    );
}

export default ManageUsers;
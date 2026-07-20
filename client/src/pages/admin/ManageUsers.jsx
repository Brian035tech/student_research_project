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

        } catch(err) {

            console.log(err);

        }

    };


    const deleteUser = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );


        if(!confirmDelete) return;


        try {

            await api.delete(`/admin/users/${id}`);

            alert("User deleted successfully.");

            fetchUsers();

        } catch(err) {

            console.log(err);

            alert("Failed to delete user.");

        }

    };


    const roleBadge = (role) => {

        const roles = {

            student:{
                color:"#2563eb",
                icon:"🎓"
            },

            lecturer:{
                color:"#16a34a",
                icon:"👨‍🏫"
            },

            supervisor:{
                color:"#7c3aed",
                icon:"📚"
            },

            admin:{
                color:"#dc2626",
                icon:"🛡️"
            }

        };


        const current = roles[role] || {
            color:"#64748b",
            icon:"👤"
        };


        return (

            <span
                style={{
                    background:current.color,
                    color:"white",
                    padding:"7px 14px",
                    borderRadius:"30px",
                    fontSize:"13px",
                    fontWeight:"600",
                    display:"inline-flex",
                    gap:"6px",
                    alignItems:"center"
                }}
            >

                {current.icon}

                {role}

            </span>

        );

    };


    const filteredUsers = users.filter((user)=>

        user.full_name.toLowerCase()
        .includes(search.toLowerCase())

        ||

        user.email.toLowerCase()
        .includes(search.toLowerCase())

        ||

        user.role.toLowerCase()
        .includes(search.toLowerCase())

    );



    return (

        <AdminLayout>


            <div className="container-fluid">


                <div
                    className="card border-0 shadow-sm p-4"
                    style={{
                        borderRadius:"22px"
                    }}
                >


                    <div className="d-flex justify-content-between align-items-center mb-4">


                        <div>

                            <h2 className="fw-bold mb-1">
                                👥 Manage Users
                            </h2>

                            <p className="text-muted mb-0">
                                Manage system users and their roles
                            </p>

                        </div>


                        <div>

                            <span className="badge bg-primary px-3 py-2">
                                Total Users: {users.length}
                            </span>

                        </div>


                    </div>



                    <input

                        type="text"

                        className="form-control mb-4"

                        style={{
                            borderRadius:"15px",
                            padding:"12px"
                        }}

                        placeholder="🔍 Search users by name, email or role..."

                        value={search}

                        onChange={(e)=>setSearch(e.target.value)}

                    />




                    <div className="table-responsive">


                        <table className="table align-middle">


                            <thead>

                                <tr>

                                    <th>#</th>

                                    <th>User</th>

                                    <th>Email</th>

                                    <th>Role</th>

                                    <th>Status</th>

                                    <th>Action</th>

                                </tr>


                            </thead>



                            <tbody>


                            {

                            filteredUsers.length > 0 ?


                            filteredUsers.map((user)=>(


                                <tr key={user.id}>


                                    <td>
                                        {user.id}
                                    </td>


                                    <td className="fw-semibold">

                                        {user.full_name}

                                    </td>



                                    <td>

                                        {user.email}

                                    </td>



                                    <td>

                                        {roleBadge(user.role)}

                                    </td>



                                    <td>

                                        <span className="text-success fw-semibold">

                                            🟢 Active

                                        </span>

                                    </td>



                                    <td>


                                    {

                                    user.role === "admin" ?


                                    (

                                        <span className="text-muted fw-bold">

                                            Protected

                                        </span>

                                    )


                                    :

                                    (

                                        <button

                                        className="btn btn-danger btn-sm"

                                        onClick={()=>deleteUser(user.id)}

                                        >

                                            🗑 Delete

                                        </button>

                                    )


                                    }


                                    </td>


                                </tr>


                            ))


                            :


                            (

                                <tr>

                                    <td 
                                    colSpan="6"
                                    className="text-center py-5 text-muted"
                                    >

                                        No users found

                                    </td>

                                </tr>

                            )


                            }


                            </tbody>



                        </table>



                    </div>


                </div>


            </div>


        </AdminLayout>

    );

}


export default ManageUsers;
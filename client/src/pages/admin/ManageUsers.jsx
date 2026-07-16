import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminLayout from "../../components/AdminLayout";


function ManageUsers() {


    const [users, setUsers] = useState([]);



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


        if(role === "student"){
            color = "#0d6efd";
        }

        else if(role === "lecturer"){
            color = "#198754";
        }

        else if(role === "supervisor"){
            color = "#6f42c1";
        }

        else if(role === "admin"){
            color = "#dc3545";
        }



        return (

            <span

                style={{
                    backgroundColor: color,
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: "bold"
                }}

            >

                {role}

            </span>

        );


    };



    return (

        <AdminLayout>


            <h2>
                Manage Users
            </h2>



            <table

                width="100%"

                style={{
                    borderCollapse:"collapse",
                    marginTop:"20px",
                    background:"white"
                }}

            >


                <thead>


                    <tr

                    style={{
                        background:"#1f2937",
                        color:"white"
                    }}

                    >


                        <th style={thStyle}>
                            ID
                        </th>


                        <th style={thStyle}>
                            Full Name
                        </th>


                        <th style={thStyle}>
                            Email
                        </th>


                        <th style={thStyle}>
                            Role
                        </th>


                        <th style={thStyle}>
                            Action
                        </th>


                    </tr>


                </thead>



                <tbody>


                {users.length > 0 ? (

                    users.map((user)=>(


                        <tr key={user.id}>


                            <td style={tdStyle}>
                                {user.id}
                            </td>


                            <td style={tdStyle}>
                                {user.full_name}
                            </td>


                            <td style={tdStyle}>
                                {user.email}
                            </td>


                            <td style={tdStyle}>
                                {roleBadge(user.role)}
                            </td>



                            <td style={tdStyle}>


                                {user.role === "admin" ? (


                                    <span
                                    style={{
                                        color:"gray",
                                        fontWeight:"bold"
                                    }}
                                    >
                                        Protected
                                    </span>


                                ) : (


                                    <button

                                    onClick={() => deleteUser(user.id)}

                                    style={{
                                        background:"#dc3545",
                                        color:"white",
                                        border:"none",
                                        padding:"8px 15px",
                                        borderRadius:"5px",
                                        cursor:"pointer"
                                    }}

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
                        style={{
                            textAlign:"center",
                            padding:"20px"
                        }}
                        >

                            No users found.

                        </td>

                    </tr>


                )}



                </tbody>


            </table>



        </AdminLayout>

    );

}



const thStyle = {

    padding:"12px",
    textAlign:"left"

};


const tdStyle = {

    padding:"12px",
    borderBottom:"1px solid #ddd"

};


export default ManageUsers;
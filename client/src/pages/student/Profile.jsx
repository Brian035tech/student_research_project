import { useEffect, useState } from "react";
import api from "../../services/api";
import StudentLayout from "../../components/StudentLayout";

function Profile() {

    const [profile, setProfile] = useState({
        full_name: "",
        email: "",
        role: ""
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {

        try {

            const res = await api.get("/users/profile");

            setProfile(res.data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <StudentLayout>

                <h2>Loading profile...</h2>

            </StudentLayout>

        );

    }

    return (

        <StudentLayout>

            <h1>My Profile</h1>

            <div
                style={{
                    background: "#fff",
                    marginTop: "20px",
                    padding: "30px",
                    borderRadius: "10px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    maxWidth: "700px"
                }}
            >

                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "30px"
                    }}
                >

                    <div
                        style={{
                            width: "100px",
                            height: "100px",
                            background: "#1e3a8a",
                            color: "#fff",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "auto",
                            fontSize: "38px",
                            fontWeight: "bold"
                        }}
                    >
                        {profile.full_name.charAt(0).toUpperCase()}
                    </div>

                    <h2 style={{ marginTop: "15px" }}>
                        {profile.full_name}
                    </h2>

                    <p style={{ color: "#666" }}>
                        Student Research Management System
                    </p>

                </div>

                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse"
                    }}
                >

                    <tbody>

                        <tr>
                            <td style={label}>Full Name</td>
                            <td style={value}>{profile.full_name}</td>
                        </tr>

                        <tr>
                            <td style={label}>Email Address</td>
                            <td style={value}>{profile.email}</td>
                        </tr>

                        <tr>
                            <td style={label}>Role</td>
                            <td style={value}>
                                <span
                                    style={{
                                        background: "#198754",
                                        color: "#fff",
                                        padding: "5px 12px",
                                        borderRadius: "20px"
                                    }}
                                >
                                    {profile.role}
                                </span>
                            </td>
                        </tr>

                    </tbody>

                </table>

            </div>

        </StudentLayout>

    );

}

const label = {
    padding: "15px",
    fontWeight: "bold",
    width: "180px",
    borderBottom: "1px solid #ddd"
};

const value = {
    padding: "15px",
    borderBottom: "1px solid #ddd"
};

export default Profile;
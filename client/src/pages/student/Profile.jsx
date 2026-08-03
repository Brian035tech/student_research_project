import { useEffect, useState } from "react";
import api from "../../services/api";
import StudentLayout from "../../components/StudentLayout";

function Profile() {


const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    role: "",
    student_id: "",
    school: "",
    department: "",
    course: ""
});

const [loading, setLoading] = useState(true);
const [errorMessage, setErrorMessage] = useState("");

useEffect(() => {
    fetchProfile();
}, []);

const fetchProfile = async () => {

    try {

       const res = await api.get("/student/profile");
        setProfile(res.data);

    } catch (error) {

        console.log(error);

        setErrorMessage(
            error.response?.data?.message ||
            "Unable to load your profile."
        );

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

if (errorMessage) {

    return (

        <StudentLayout>

            <h2>My Profile</h2>

            <p
                style={{
                    color: "#dc3545",
                    marginTop: "20px"
                }}
            >
                {errorMessage}
            </p>

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
                boxShadow:
                    "0 2px 8px rgba(0,0,0,0.1)",
                maxWidth: "800px"
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
                    {profile.full_name
                        ? profile.full_name
                            .charAt(0)
                            .toUpperCase()
                        : "S"}
                </div>

                <h2
                    style={{
                        marginTop: "15px"
                    }}
                >
                    {profile.full_name}
                </h2>

                <p
                    style={{
                        color: "#666"
                    }}
                >
                    Student Research Management System
                </p>

            </div>

            <h3
                style={{
                    color: "#1e3a8a",
                    borderBottom:
                        "2px solid #1e3a8a",
                    paddingBottom:
                        "8px"
                }}
            >
                Personal Information
            </h3>

            <table
                style={{
                    width: "100%",
                    borderCollapse:
                        "collapse",
                    marginBottom:
                        "30px"
                }}
            >

                <tbody>

                    <tr>
                        <td style={label}>
                            Full Name
                        </td>

                        <td style={value}>
                            {profile.full_name}
                        </td>
                    </tr>

                    <tr>
                        <td style={label}>
                            Student ID
                        </td>

                        <td style={value}>
                            {profile.student_id}
                        </td>
                    </tr>

                    <tr>
                        <td style={label}>
                            Email Address
                        </td>

                        <td style={value}>
                            {profile.email}
                        </td>
                    </tr>

                    <tr>
                        <td style={label}>
                            Role
                        </td>

                        <td style={value}>

                            <span
                                style={{
                                    background:
                                        "#198754",

                                    color:
                                        "#fff",

                                    padding:
                                        "5px 12px",

                                    borderRadius:
                                        "20px",

                                    textTransform:
                                        "capitalize"
                                }}
                            >
                                {profile.role}
                            </span>

                        </td>
                    </tr>

                </tbody>

            </table>

            <h3
                style={{
                    color: "#1e3a8a",
                    borderBottom:
                        "2px solid #1e3a8a",
                    paddingBottom:
                        "8px"
                }}
            >
                Academic Information
            </h3>

            <table
                style={{
                    width: "100%",
                    borderCollapse:
                        "collapse"
                }}
            >

                <tbody>

                    <tr>
                        <td style={label}>
                            School
                        </td>

                        <td style={value}>
                            {profile.school}
                        </td>
                    </tr>

                    <tr>
                        <td style={label}>
                            Department
                        </td>

                        <td style={value}>
                            {profile.department}
                        </td>
                    </tr>

                    <tr>
                        <td style={label}>
                            Course
                        </td>

                        <td style={value}>
                            {profile.course}
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
width: "220px",
borderBottom: "1px solid #ddd",
background: "#f8f9fa"
};

const value = {
padding: "15px",
borderBottom: "1px solid #ddd"
};

export default Profile;

import { useEffect, useState } from "react";
import SupervisorLayout from "../../components/SupervisorLayout";
import api from "../../services/api";

function Profile() {

    const [profile, setProfile] = useState(null);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {

        try {

            const res = await api.get("/users/profile");

            setProfile(res.data);

        } catch (error) {

            console.log(error);

        }

    };

    if (!profile) {

        return (

            <SupervisorLayout>

                <h2>Loading Profile...</h2>

            </SupervisorLayout>

        );

    }

    return (

        <SupervisorLayout>

            <h1>My Profile</h1>

            <div
                style={{
                    background: "#fff",
                    padding: "30px",
                    borderRadius: "10px",
                    marginTop: "20px",
                    maxWidth: "700px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}
            >

                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "25px"
                    }}
                >

                    <div
                        style={{
                            width: "100px",
                            height: "100px",
                            borderRadius: "50%",
                            background: "#1e3a8a",
                            color: "#fff",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "36px",
                            fontWeight: "bold",
                            margin: "auto"
                        }}
                    >
                        {profile.full_name.charAt(0).toUpperCase()}
                    </div>

                    <h2 style={{ marginTop: "15px" }}>
                        {profile.full_name}
                    </h2>

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
                            <td style={label}>Email</td>
                            <td style={value}>{profile.email}</td>
                        </tr>

                        <tr>
                            <td style={label}>Role</td>
                            <td style={value}>{profile.role}</td>
                        </tr>

                    </tbody>

                </table>

            </div>

        </SupervisorLayout>

    );

}

const label = {
    padding: "12px",
    fontWeight: "bold",
    width: "180px",
    borderBottom: "1px solid #ddd"
};

const value = {
    padding: "12px",
    borderBottom: "1px solid #ddd"
};

export default Profile;
import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminLayout from "../../components/AdminLayout";

function Profile() {

    const [profile, setProfile] = useState({});

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {

        try {

            const res = await api.get("/admin/profile");

            setProfile(res.data);

        } catch (err) {

            console.log(err);

            alert("Failed to load profile.");

        }

    };

    return (

        <AdminLayout>

            <h2>My Profile</h2>

            <div
                style={{
                    background: "#fff",
                    padding: "20px",
                    borderRadius: "8px",
                    maxWidth: "500px",
                    marginTop: "20px"
                }}
            >

                <p><strong>Full Name:</strong> {profile.full_name}</p>

                <p><strong>Email:</strong> {profile.email}</p>

                <p><strong>Role:</strong> {profile.role}</p>

            </div>

        </AdminLayout>

    );

}

export default Profile;
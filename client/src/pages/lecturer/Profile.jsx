import { useEffect, useState } from "react";
import LecturerLayout from "../../components/LecturerLayout";
import api from "../../services/api";


function Profile() {

    const [user, setUser] = useState(null);


    useEffect(() => {

        fetchProfile();

    }, []);



    const fetchProfile = async () => {

        try {

            const response = await api.get("/users/profile");

            setUser(response.data);

        } catch (error) {

            console.log(error);

        }

    };



    return (

        <LecturerLayout>


            <div className="container-fluid">


                <div

                    className="card border-0 shadow-sm p-4"

                    style={{

                        borderRadius: "22px",

                        maxWidth: "700px"

                    }}

                >


                    <h2 className="fw-bold mb-3">

                        👤 My Profile

                    </h2>



                    {
                        user ? (

                            <>


                                <div

                                    className="text-center mb-4"

                                >

                                    <div

                                        style={{

                                            width:"100px",

                                            height:"100px",

                                            borderRadius:"50%",

                                            background:"#2563eb",

                                            color:"white",

                                            display:"flex",

                                            alignItems:"center",

                                            justifyContent:"center",

                                            margin:"auto",

                                            fontSize:"40px",

                                            fontWeight:"700"

                                        }}

                                    >

                                        {user.full_name
                                            .charAt(0)
                                            .toUpperCase()
                                        }

                                    </div>


                                    <h3 className="mt-3">

                                        {user.full_name}

                                    </h3>


                                </div>




                                <div className="card bg-light border-0 p-3">

                                    <p>

                                        <strong>Name:</strong>{" "}

                                        {user.full_name}

                                    </p>


                                    <p>

                                        <strong>Email:</strong>{" "}

                                        {user.email}

                                    </p>


                                    <p>

                                        <strong>Role:</strong>{" "}

                                        <span className="badge bg-success">

                                            {user.role}

                                        </span>

                                    </p>


                                </div>


                            </>


                        ) : (


                            <div className="text-center py-5">

                                Loading profile...

                            </div>


                        )

                    }



                </div>


            </div>


        </LecturerLayout>

    );

}


export default Profile;
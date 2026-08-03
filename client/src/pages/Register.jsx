import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
const navigate = useNavigate();

const [formData, setFormData] = useState({
student_id: "",
verification_password: "",
email: "",
password: "",
confirmPassword: "",
});

const [student, setStudent] = useState(null);
const [message, setMessage] = useState("");
const [messageType, setMessageType] = useState("");
const [loadingStudent, setLoadingStudent] = useState(false);

const handleChange = (e) => {
const { name, value } = e.target;


setFormData((previousData) => ({
  ...previousData,
  [name]: value,
}));

// Hide old messages when the user changes input
setMessage("");


};

// Look up student details using Student ID
const handleStudentLookup = async () => {
const studentId = formData.student_id.trim();


if (!studentId) {
  setStudent(null);
  setMessage("Please enter your Student ID.");
  setMessageType("error");
  return;
}

try {
  setLoadingStudent(true);
  setMessage("");

  const response = await api.get(
    `/auth/student/${encodeURIComponent(studentId)}`
  );

  setStudent(response.data.student);
  setMessage("Student details found.");
  setMessageType("success");

} catch (error) {
  setStudent(null);

  if (error.response) {
    setMessage(
      error.response.data.message ||
      "Student ID could not be verified."
    );
  } else {
    setMessage(
      "Unable to connect to the server."
    );
  }

  setMessageType("error");

} finally {
  setLoadingStudent(false);
}


};

const handleSubmit = async (e) => {
e.preventDefault();


// Student details must be verified first
if (!student) {
  setMessage(
    "Please verify your Student ID before registering."
  );
  setMessageType("error");
  return;
}

// Check that the new passwords match
if (
  formData.password !==
  formData.confirmPassword
) {
  setMessage(
    "The new passwords do not match."
  );
  setMessageType("error");
  return;
}

try {
  const response = await api.post(
    "/auth/register",
    {
      student_id:
        formData.student_id.trim(),

      verification_password:
        formData.verification_password,

      email:
        formData.email,

      password:
        formData.password,
    }
  );

  setMessage(response.data.message);
  setMessageType("success");

  // Redirect to login after registration
  setTimeout(() => {
    navigate("/");
  }, 2000);

} catch (error) {
  if (error.response) {
    setMessage(
      error.response.data.message ||
      "Registration failed."
    );
  } else {
    setMessage("Server error.");
  }

  setMessageType("error");
}


};

return (
<div
style={{
display: "flex",
justifyContent: "center",
alignItems: "center",
minHeight: "100vh",
padding: "20px",
backgroundColor: "#f4f6f9",
}}
>
<div
style={{
width: "500px",
maxWidth: "100%",
padding: "30px",
background: "#fff",
borderRadius: "10px",
boxShadow:
"0 0 10px rgba(0,0,0,.2)",
}}
>
<h2
style={{
textAlign: "center",
marginBottom: "8px",
}}
>
Student Research Management System </h2>


    <h3
      style={{
        textAlign: "center",
        marginBottom: "25px",
      }}
    >
      Student Registration
    </h3>

    {message && (
      <p
        style={{
          color:
            messageType === "error"
              ? "red"
              : "green",

          textAlign: "center",
          fontWeight: "500",
        }}
      >
        {message}
      </p>
    )}

    <form onSubmit={handleSubmit}>

      {/* Student ID */}
      <label>
        Student ID
      </label>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "5px",
          marginBottom: "15px",
        }}
      >
        <input
          type="text"
          name="student_id"
          placeholder="Enter Student ID"
          value={
            formData.student_id
          }
          onChange={handleChange}
          style={{
            flex: 1,
            padding: "10px",
          }}
        />

        <button
          type="button"
          onClick={
            handleStudentLookup
          }
          disabled={
            loadingStudent
          }
          style={{
            padding:
              "10px 15px",

            background:
              "#1976d2",

            color:
              "white",

            border:
              "none",

            borderRadius:
              "4px",

            cursor:
              "pointer",
          }}
        >
          {loadingStudent
            ? "Checking..."
            : "Verify"}
        </button>
      </div>

      {/* Student details */}
      {student && (
        <div
          style={{
            padding: "15px",
            marginBottom: "20px",
            background:
              "#eef7ee",

            border:
              "1px solid #b7d9b7",

            borderRadius:
              "6px",
          }}
        >
          <h4
            style={{
              marginTop: 0,
            }}
          >
            Student Details
          </h4>

          <p>
            <strong>
              Name:
            </strong>{" "}
            {
              student.student_name
            }
          </p>

          <p>
            <strong>
              School:
            </strong>{" "}
            {
              student.school
            }
          </p>

          <p>
            <strong>
              Department:
            </strong>{" "}
            {
              student.department
            }
          </p>

          <p
            style={{
              marginBottom: 0,
            }}
          >
            <strong>
              Course:
            </strong>{" "}
            {
              student.course
            }
          </p>
        </div>
      )}

      {/* Show registration fields only after ID verification */}
      {student && (
        <>
          <label>
            Preassigned Password
          </label>

          <input
            type="password"
            name="verification_password"
            placeholder="Enter preassigned password"
            value={
              formData.verification_password
            }
            onChange={
              handleChange
            }
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              marginBottom:
                "15px",
              boxSizing:
                "border-box",
            }}
          />

          <label>
            Email Address
          </label>

          <input
            type="email"
            name="email"
            placeholder="Enter email address"
            value={
              formData.email
            }
            onChange={
              handleChange
            }
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              marginBottom:
                "15px",
              boxSizing:
                "border-box",
            }}
          />

          <label>
            Create New Password
          </label>

          <input
            type="password"
            name="password"
            placeholder="Create SRMS password"
            value={
              formData.password
            }
            onChange={
              handleChange
            }
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              marginBottom:
                "15px",
              boxSizing:
                "border-box",
            }}
          />

          <label>
            Confirm New Password
          </label>

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm SRMS password"
            value={
              formData.confirmPassword
            }
            onChange={
              handleChange
            }
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              marginBottom:
                "20px",
              boxSizing:
                "border-box",
            }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background:
                "green",
              color:
                "white",
              border:
                "none",
              borderRadius:
                "4px",
              cursor:
                "pointer",
              fontSize:
                "16px",
            }}
          >
            Register Student
          </button>
        </>
      )}

    </form>

    <p
      style={{
        textAlign:
          "center",

        marginTop:
          "20px",
      }}
    >
      Already have an account?{" "}
      <Link to="/">
        Login Here
      </Link>
    </p>

  </div>
</div>


);
}

export default Register;

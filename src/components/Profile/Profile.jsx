import React, { useEffect, useState } from "react";
import { Button, Box, Typography, Avatar, TextField } from "@mui/material";
import { Edit, UploadFile, Delete, Remove } from "@mui/icons-material";
import axios, { Axios } from "axios";
import { jwtDecode } from "jwt-decode";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoding, setisLoding] = useState(false);
  const [user, setUser] = useState({
    confirmEmail: false,
    email: "",
    userName: "",
    role: "",
    cv: "",
  });
  let token = localStorage.getItem("token");

  const decodedToken = jwtDecode(token);

  let updatedData;
  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    let { data } = await axios.get(
      `http://localhost:4200/api/user/${decodedToken.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setUser(data.user);
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
    update();
  };

  async function update() {
    try {
      await axios.put(
        `http://localhost:4200/api/user/${decodedToken.id}`,
        user.name,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.log("error" + error.message);
    }
  }
  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleCVUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setUser({ ...user, cv: uploadedFile });
    }
  };

  const handleSubmit = async () => {
    if (!user.cv) {
      return;
    }

    const formData = new FormData();
    formData.append("cv", user.cv);

    try {
      setisLoding(true);
      const { data } = await axios.post(
        "http://localhost:4200/api/resume/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser({ ...user, cv: data.url });

      setisLoding(false);

      console.log("Upload Success:", data);
    } catch (error) {
      console.error("Upload Error:", error);
    }
  };

  async function deleteUser() {
    try {
      const { data } = await axios.delete(
        `http://localhost:4200/api/user/${decodedToken.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.message == "User deleted successfully") {
        console.log("go");
      }
      console.log(data);
    } catch (error) {
      console.log("error" + error.message);
    }
  }

  return (
    <Box maxWidth="lg" mx="auto" p={3}>
      <Box sx={{ p: 3, borderRadius: 3, boxShadow: 3, bgcolor: "white" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Avatar
            src={user.image}
            alt="User Profile"
            sx={{ width: 80, height: 80 }}
          />
          <Box sx={{ flexGrow: 1 }}>
            {isEditing ? (
              <TextField
                fullWidth
                name="userName"
                label="Full Name"
                value={user.userName || ""}
                onChange={handleInputChange}
                variant="outlined"
                size="small"
                sx={{ mt: 2 }}
              />
            ) : (
              <Typography variant="h5" fontWeight="bold" sx={{ mt: 2 }}>
                Name : {user.userName || "loading"}
              </Typography>
            )}

            {isEditing ? (
              <TextField
                fullWidth
                disabled
                name="email"
                label="Email"
                value={user.email || ""}
                onChange={handleInputChange}
                variant="outlined"
                size="small"
                sx={{ mt: 2 }}
              />
            ) : (
              <Typography variant="h5" sx={{ mt: 1 }}>
                Email : {user.email}
              </Typography>
            )}
            {!isEditing ? (
              <Typography variant="h5" fontWeight="bold" sx={{ mt: 2 }}>
                Confirm Email:{" "}
                {user?.confirmEmail ? "✔️ Confirmed" : "❌ Not Confirmed"}
              </Typography>
            ) : (
              "."
            )}
            {!isEditing ? (
              <Typography variant="h5" fontWeight="bold" sx={{ mt: 2 }}>
                Role : {user.role}
              </Typography>
            ) : (
              "."
            )}

            {isEditing ? (
              <Box sx={{ mt: 3 }}>
                <input
                  type="file"
                  id="cv-upload"
                  accept="application/pdf"
                  style={{ display: "none" }}
                  onChange={handleCVUpload}
                />
                <label htmlFor="cv-upload">
                  <Button
                    component="span"
                    variant="contained"
                    sx={{
                      backgroundColor: "#1A75E8",
                      color: "#fff",
                      mt: 3,
                      mr: 1,
                    }}
                    startIcon={<UploadFile />}
                  >
                    Choose CV
                  </Button>
                </label>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  sx={{ backgroundColor: "#28A745", color: "#fff", mt: 3 }}
                >
                  Upload CV
                </Button>
                {isLoding ? "loading..." : "."}
              </Box>
            ) : user.cv ? (
              <Box sx={{ mt: 2 }}>
                <Button
                  onClick={() => window.open(user?.cv, "_blank")}
                  sx={{ backgroundColor: "#1A75E8", color: "#fff" }}
                >
                  Show My Resume
                </Button>
              </Box>
            ) : (
              <Typography sx={{ mt: 2, color: "gray" }}>
                No CV uploaded
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="contained"
            onClick={handleEdit}
            sx={{ backgroundColor: "#1A75E8", color: "#fff", mt: 3 }}
            startIcon={<Edit />}
          >
            {isEditing ? "Save" : "Edit Profile"}
          </Button>
          <Button
            variant="contained"
            onClick={deleteUser}
            sx={{ backgroundColor: "red", color: "#fff", mt: 3 }}
            startIcon={<Delete />}
          >
            Remove My account
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;

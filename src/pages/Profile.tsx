import { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Button,
  TextField,
  Grid,
} from "@mui/material";
import { Edit as EditIcon, Save as SaveIcon } from "@mui/icons-material";
import api from "../services/api";

interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
  is_premium: boolean;
  phone: string;
  avatar: string | null;
}

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    first_name: "",
    last_name: "",
    email: "",
    user_type: "",
    is_premium: false,
    phone: "",
    avatar: null,
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await api.get("/auth/profile/");
        setProfileData(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfileData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAvatarFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
    }
  };

  const formData = new FormData();
  if (profileData.first_name)
    formData.append("first_name", profileData.first_name);
  if (profileData.last_name)
    formData.append("last_name", profileData.last_name);
  if (profileData.email) formData.append("email", profileData.email);
  if (profileData.user_type)
    formData.append("user_type", profileData.user_type);
  if (profileData.phone) formData.append("phone", profileData.phone);
  if (avatarFile) formData.append("avatar", avatarFile);

  const handleSave = async () => {
    setIsEditing(false);
    try {
      await api.patch("/auth/profile/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      console.error("Error saving profile data:", error);
    }
  };

  const handleChange =
    (field: keyof ProfileData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setProfileData({
        ...profileData,
        [field]: event.target.value,
      });
    };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Avatar
            sx={{
              width: 120,
              height: 120,
              mb: 2,
              cursor: isEditing ? "pointer" : "default",
            }}
            src={avatarPreview || profileData.avatar || undefined}
            alt={`${profileData.first_name} ${profileData.last_name}`}
            onClick={() => isEditing && fileInputRef.current?.click()}
          />
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleAvatarChange}
            />
          )}
          <Typography variant="h4" component="h1" gutterBottom>
            {`${profileData.first_name} ${profileData.last_name}`}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {profileData.user_type} {profileData.is_premium ? "(Premium)" : ""}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
              {isEditing ? (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                >
                  Edit Profile
                </Button>
              )}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="First Name"
              value={profileData.first_name || ""}
              onChange={handleChange("first_name")}
              disabled={!isEditing}
              margin="normal"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Last Name"
              value={profileData.last_name || ""}
              onChange={handleChange("last_name")}
              disabled={!isEditing}
              margin="normal"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Email"
              value={profileData.email || ""}
              onChange={handleChange("email")}
              disabled={!isEditing}
              margin="normal"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Phone"
              value={profileData.phone || ""}
              onChange={handleChange("phone")}
              disabled={!isEditing}
              margin="normal"
            />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;

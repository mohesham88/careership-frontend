import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Button,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid";
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

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await api.get("/auth/profile/");
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    fetchProfileData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsEditing(false);
    // TODO: Make API call to save the changes
    // Example:
    // try {
    //   await fetch('/api/profile', {
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(profileData),
    //   });
    // } catch (error) {
    //   console.error('Error saving profile data:', error);
    // }
  };

  const handleChange = (field: keyof ProfileData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [field]: event.target.value,
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
          <Avatar
            sx={{ width: 120, height: 120, mb: 2 }}
            src={profileData.avatar || undefined}
            alt={`${profileData.first_name} ${profileData.last_name}`}
          />
          <Typography variant="h4" component="h1" gutterBottom>
            {`${profileData.first_name} ${profileData.last_name}`}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {profileData.user_type} {profileData.is_premium ? "(Premium)" : ""}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
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

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="First Name"
              value={profileData.first_name}
              onChange={handleChange("first_name")}
              disabled={!isEditing}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Last Name"
              value={profileData.last_name}
              onChange={handleChange("last_name")}
              disabled={!isEditing}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              value={profileData.email}
              onChange={handleChange("email")}
              disabled={!isEditing}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone"
              value={profileData.phone}
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
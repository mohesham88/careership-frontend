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
import api from "../../services/api";
import { fetchSkills, fetchUserSkills, addUserSkill, removeUserSkill } from '../../services/api';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import type { Skill, UserSkill } from '../../types/skill';

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
  const [skills, setSkills] = useState<Skill[]>([]);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [addSkillsOpen, setAddSkillsOpen] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(false);

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

  useEffect(() => {
    setLoadingSkills(true);
    Promise.all([fetchSkills(), fetchUserSkills()])
      .then(([allSkillsRes, userSkillsRes]) => {
        setSkills(allSkillsRes.data);
        setUserSkills(userSkillsRes.data);
      })
      .finally(() => setLoadingSkills(false));
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

  const handleAddSkills = async () => {
    for (const skill of selectedSkills) {
      if (!userSkills.some(us => us.skill_id === skill.id)) {
        await addUserSkill(skill.id);
      }
    }
    // Refresh user skills
    const userSkillsRes = await fetchUserSkills();
    setUserSkills(userSkillsRes.data);
    setAddSkillsOpen(false);
    setSelectedSkills([]);
  };

  const handleRemoveSkill = async (skill_id: number) => {
    await removeUserSkill(skill_id);
    // Refresh user skills
    const userSkillsRes = await fetchUserSkills();
    setUserSkills(userSkillsRes.data);
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

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>Skills</Typography>
          {loadingSkills ? (
            <Typography variant="body2" color="text.secondary">Loading skills...</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
              {userSkills.map(skill => (
                <Chip
                  key={skill.skill_id}
                  label={skill.skill_name}
                  onDelete={() => handleRemoveSkill(skill.skill_id)}
                  color="primary"
                  variant="outlined"
                  sx={{ fontSize: 16 }}
                />
              ))}
              <Button size="small" variant="outlined" sx={{ ml: 1 }} onClick={() => setAddSkillsOpen(true)}>
                Add Skills
              </Button>
            </Box>
          )}
        </Box>

        {/* Add Skills Modal */}
        <Dialog open={addSkillsOpen} onClose={() => setAddSkillsOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Add Skills</DialogTitle>
          <DialogContent>
            <Autocomplete
              multiple
              options={skills}
              getOptionLabel={(option) => option.name}
              value={selectedSkills}
              onChange={(_, value) => setSelectedSkills(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Skills"
                  placeholder="Search and select skills"
                  margin="normal"
                  fullWidth
                />
              )}
              sx={{ mt: 2, mb: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddSkillsOpen(false)}>Cancel</Button>
            <Button onClick={handleAddSkills} variant="contained">Add</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default Profile;

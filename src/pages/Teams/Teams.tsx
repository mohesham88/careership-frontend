import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import TeamCard from "../../components/Teams/TeamCard";
import type { Team } from "../../types/team";
import { fetchTeams, createTeam } from "../../services/teams";
import CreateTeamDialog from "../../components/Teams/CreateTeamDialog";

export default function Teams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchTeams()
      .then((res) => {
        setTeams(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load teams");
        setLoading(false);
      });
  }, []);

  const handleViewDetails = (team: Team) => {
    navigate(`/teams/${team.uuid}`);
  };

  const handleCreateTeam = async () => {
    setCreating(true);
    setCreateError(null);
    try {
      await createTeam({ name: newTeamName });
      setCreateDialogOpen(false);
      setNewTeamName("");
      // Refresh teams
      setLoading(true);
      fetchTeams()
        .then((res) => {
          setTeams(res.data);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load teams");
          setLoading(false);
        });
    } catch (err: any) {
      setCreateError(err?.response?.data?.message || "Failed to create team");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Your Teams
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage your teams
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setCreateDialogOpen(true)}
        >
          Create Team
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Grid container spacing={3}>
          {teams.map((team) => (
            <TeamCard
              key={team.uuid}
              team={team}
              onViewDetails={handleViewDetails}
            />
          ))}
        </Grid>
      )}
      {teams.length === 0 && !loading && !error && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No teams available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You are not a member of any teams yet.
          </Typography>
        </Box>
      )}
      <CreateTeamDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onCreate={handleCreateTeam}
        loading={creating}
        error={createError}
        value={newTeamName}
        onChange={setNewTeamName}
      />
    </Container>
  );
}

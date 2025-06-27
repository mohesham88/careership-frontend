import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Avatar, Stack, CircularProgress, Alert, Button, Divider, Chip, Tooltip } from '@mui/material';
import { Group as GroupIcon, Person as PersonIcon, Email as EmailIcon } from '@mui/icons-material';
import type { Team, Invitation } from '../types/team';
import type { User } from '../types/user';
import api from '../services/api';

export default function TeamDetail() {
  const { id } = useParams<{ id: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/teams/${id}/`),
      api.get(`/teams/${id}/invitations/`),
    ])
      .then(([teamRes, invRes]) => {
        setTeam(teamRes.data);
        setInvitations(invRes.data.results || invRes.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load team details');
        setLoading(false);
      });
  }, [id]);

  // Placeholder for invite, join, leave actions
  const handleInvite = () => {};
  const handleJoin = () => {};
  const handleLeave = () => {};

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !team) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Alert severity="error">{error || 'Team not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
          {team.name.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight={700}>{team.name}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <PersonIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              Owner: {team.owner.first_name} {team.owner.last_name} ({team.owner.email})
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Created: {new Date(team.created_at).toLocaleDateString()}
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ my: 3 }} />
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>Members</Typography>
        <Stack direction="row" spacing={2}>
          {team.members.map((member: User, idx) => (
            <Tooltip key={idx} title={`${member.first_name} ${member.last_name} (${member.email})`}>
              <Avatar sx={{ width: 40, height: 40 }}>
                {member.first_name.charAt(0)}{member.last_name.charAt(0)}
              </Avatar>
            </Tooltip>
          ))}
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Total members: {team.members.length}
        </Typography>
      </Box>
      <Divider sx={{ my: 3 }} />
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <EmailIcon fontSize="small" color="action" />
          <Typography variant="h6">Invitations</Typography>
          <Button size="small" variant="outlined" sx={{ ml: 2 }} onClick={handleInvite}>Invite Member</Button>
        </Box>
        {invitations.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No invitations sent.</Typography>
        ) : (
          <Stack spacing={1}>
            {invitations.map((inv) => (
              <Chip
                key={inv.uuid}
                label={`Created: ${new Date(inv.created_at).toLocaleDateString()} | Expires in: ${inv.expires_in_days} days | Active: ${inv.is_active ? 'Yes' : 'No'}`}
                color={inv.is_active ? 'success' : 'default'}
                variant="outlined"
              />
            ))}
          </Stack>
        )}
      </Box>
      <Divider sx={{ my: 3 }} />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" color="primary" onClick={handleJoin}>Join Team</Button>
        <Button variant="outlined" color="secondary" onClick={handleLeave}>Leave Team</Button>
      </Box>
    </Container>
  );
} 
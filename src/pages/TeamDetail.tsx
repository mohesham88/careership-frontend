import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Avatar, Stack, CircularProgress, Alert, Button, Divider, Chip, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Group as GroupIcon, Person as PersonIcon, Email as EmailIcon } from '@mui/icons-material';
import type { Team, Invitation } from '../types/team';
import type { User } from '../types/user';
import { fetchTeam, fetchInvitations, createInvitation, leaveTeam, addMember, removeMember, enableInvitation, disableInvitation } from '../services/api';

export default function TeamDetail() {
  const { uuid } = useParams<{ uuid: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteDays, setInviteDays] = useState(3);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchTeam(uuid!),
      fetchInvitations(uuid!),
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
  }, [uuid]);

  const handleInvite = () => setInviteDialogOpen(true);
  const handleInviteClose = () => {
    setInviteDialogOpen(false);
    setInviteError(null);
    setInviteDays(3);
  };
  const handleInviteSubmit = async () => {
    setInviteLoading(true);
    setInviteError(null);
    try {
      await createInvitation(uuid!, { expires_in_days: inviteDays });
      const invRes = await fetchInvitations(uuid!);
      setInvitations(invRes.data.results || invRes.data);
      setInviteDialogOpen(false);
    } catch (e) {
      setInviteError('Failed to create invitation');
    } finally {
      setInviteLoading(false);
    }
  };
  const handleLeave = async () => {
    await leaveTeam(uuid!);
    navigate('/teams');
  };
  const handleEnable = async (inv: Invitation) => {
    await enableInvitation(uuid!, inv.uuid);
    const invRes = await fetchInvitations(uuid!);
    setInvitations(invRes.data.results || invRes.data);
  };
  const handleDisable = async (inv: Invitation) => {
    await disableInvitation(uuid!, inv.uuid);
    const invRes = await fetchInvitations(uuid!);
    setInvitations(invRes.data.results || invRes.data);
  };

  const getUserFacingInvitationLink = (inv: Invitation, team: Team) => {
    if (inv.invitation_url && inv.invitation_url.startsWith('http')) {
      return inv.invitation_url;
    }
    return `${window.location.origin}/teams/${team.uuid}/invitations/${inv.uuid}/accept`;
  };

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
              <Box key={inv.uuid} sx={{ mb: 1 }}>
                <Chip
                  label={`Created: ${new Date(inv.created_at).toLocaleDateString()} | Expires in: ${inv.expires_in_days} days | Active: ${inv.is_active ? 'Yes' : 'No'}`}
                  color={inv.is_active ? 'success' : 'default'}
                  variant="outlined"
                  onClick={() => inv.is_active ? handleDisable(inv) : handleEnable(inv)}
                  clickable
                />
                {inv.invitation_url && (
                  <Button
                    size="small"
                    sx={{ mt: 1, ml: 2 }}
                    variant="outlined"
                    onClick={() => {
                      const link = getUserFacingInvitationLink(inv, team);
                      navigator.clipboard.writeText(link);
                      setCopied(inv.uuid);
                      setTimeout(() => setCopied(null), 1500);
                    }}
                  >
                    {copied === inv.uuid ? "Copied!" : "Copy Invitation Link"}
                  </Button>
                )}
              </Box>
            ))}
          </Stack>
        )}
      </Box>
      <Divider sx={{ my: 3 }} />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" color="primary" onClick={handleLeave}>Leave Team</Button>
      </Box>
      {/* Invite Dialog */}
      <Dialog open={inviteDialogOpen} onClose={handleInviteClose}>
        <DialogTitle>Invite Member</DialogTitle>
        <DialogContent>
          <TextField
            label="Expires in days"
            type="number"
            value={inviteDays}
            onChange={e => setInviteDays(Number(e.target.value))}
            fullWidth
            sx={{ mt: 2 }}
          />
          {inviteError && <Alert severity="error" sx={{ mt: 2 }}>{inviteError}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleInviteClose}>Cancel</Button>
          <Button onClick={handleInviteSubmit} disabled={inviteLoading} variant="contained">Send Invite</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 
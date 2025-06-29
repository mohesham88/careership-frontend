import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Avatar, Stack, CircularProgress, Alert, Button, Divider, Chip, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, List, ListItem, ListItemAvatar, ListItemText, IconButton } from '@mui/material';
import { Group as GroupIcon, Person as PersonIcon, Email as EmailIcon } from '@mui/icons-material';
import type { Team, Invitation } from '../types/team';
import type { User } from '../types/user';
import { fetchTeam, fetchInvitations, createInvitation, leaveTeam, addMember, removeMember, enableInvitation, disableInvitation, deleteInvitation } from '../services/api';
import { useAuthStore } from '../store/authStore';

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
  const [confirmRemove, setConfirmRemove] = useState<{ open: boolean; email: string | null }>({ open: false, email: null });
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; uuid: string | null }>({ open: false, uuid: null });
  const [membersModalOpen, setMembersModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthStore();

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
  const handleRemoveMember = async (memberEmail: string) => {
    setConfirmRemove({ open: true, email: memberEmail });
  };
  const confirmRemoveMember = async () => {
    if (!team || !confirmRemove.email) return;
    await removeMember(team.uuid, confirmRemove.email);
    const teamRes = await fetchTeam(team.uuid);
    setTeam(teamRes.data);
    setConfirmRemove({ open: false, email: null });
  };
  const handleDeleteInvitation = async (invitationUuid: string) => {
    setConfirmDelete({ open: true, uuid: invitationUuid });
  };
  const confirmDeleteInvitation = async () => {
    if (!team || !confirmDelete.uuid) return;
    await deleteInvitation(team.uuid, confirmDelete.uuid);
    const invRes = await fetchInvitations(team.uuid);
    setInvitations(invRes.data.results || invRes.data);
    setConfirmDelete({ open: false, uuid: null });
  };

  const getUserFacingInvitationLink = (inv: Invitation, team: Team) => {
    if (inv.invitation_url && inv.invitation_url.startsWith('http')) {
      return inv.invitation_url;
    }
    return `${window.location.origin}/teams/${team.uuid}/invitations/${inv.uuid}/accept`;
  };
  const isOwner = user?.email?.toLowerCase().trim() === team?.owner?.email?.toLowerCase().trim();

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography variant="h6" gutterBottom>Members</Typography>
          <IconButton size="small" onClick={() => setMembersModalOpen(true)} aria-label="Show Members">
            <GroupIcon fontSize="small" />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
            Show all members
          </Typography>
          </IconButton>
        </Box>
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
                {/* Show delete button for invitations if current user is owner */}
                {isOwner && (
                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    sx={{ mt: 1, ml: 1 }}
                    onClick={() => handleDeleteInvitation(inv.uuid)}
                  >
                    Delete
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
      {/* Remove Member Confirmation Dialog */}
      <Dialog open={confirmRemove.open} onClose={() => setConfirmRemove({ open: false, email: null })}>
        <DialogTitle>Remove Member</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to remove this member from the team?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmRemove({ open: false, email: null })}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmRemoveMember}>Remove</Button>
        </DialogActions>
      </Dialog>
      {/* Delete Invitation Confirmation Dialog */}
      <Dialog open={confirmDelete.open} onClose={() => setConfirmDelete({ open: false, uuid: null })}>
        <DialogTitle>Delete Invitation</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this invitation?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete({ open: false, uuid: null })}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDeleteInvitation}>Delete</Button>
        </DialogActions>
      </Dialog>
      {/* Members Modal */}
      <Dialog open={membersModalOpen} onClose={() => setMembersModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Team Members</DialogTitle>
        <DialogContent>
          <List>
            {team.members.map((member: User) => (
              <ListItem key={member.email} secondaryAction={
                isOwner && member.email !== team.owner.email && (
                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    onClick={() => handleRemoveMember(member.email)}
                  >
                    Remove
                  </Button>
                )
              }>
                <ListItemAvatar>
                  <Avatar>
                    {member.first_name.charAt(0)}{member.last_name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${member.first_name} ${member.last_name}`}
                  secondary={member.email}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMembersModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 
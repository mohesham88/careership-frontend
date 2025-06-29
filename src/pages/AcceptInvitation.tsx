import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Alert, Button, Paper, Divider } from '@mui/material';
import { Email as EmailIcon, CheckCircle as CheckCircleIcon, Cancel as CancelIcon } from '@mui/icons-material';
import type { Invitation } from '../types/team';
import { fetchInvitation, acceptInvitation } from '../services/api';

export default function AcceptInvitation() {
  const { team_uuid, pk } = useParams<{ team_uuid: string; pk: string }>();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!team_uuid || !pk) {
      setError('Invalid invitation link');
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchInvitation(team_uuid, pk)
      .then(res => {
        setInvitation(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load invitation details');
        setLoading(false);
      });
  }, [team_uuid, pk]);

  const handleAccept = async () => {
    if (!team_uuid || !pk) return;
    setAccepting(true);
    setError(null);
    try {
      await acceptInvitation(team_uuid, pk);
      setSuccess('You have successfully joined the team!');
      setTimeout(() => {
        navigate('/teams');
      }, 2000);
    } catch (e) {
      setError('Failed to accept invitation. It may have expired or been disabled.');
    } finally {
      setAccepting(false);
    }
  };

  const handleDecline = () => {
    navigate('/teams');
  };

  const getUserFacingInvitationLink = (inv: Invitation) => {
    if (inv.invitation_url && inv.invitation_url.startsWith('http')) {
      return inv.invitation_url;
    }
    return `${window.location.origin}/teams/${team_uuid}/invitations/${inv.uuid}/accept`;
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

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/teams')}>
          Go to Teams
        </Button>
      </Container>
    );
  }

  if (success) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Redirecting to teams page...
        </Typography>
      </Container>
    );
  }

  if (!invitation) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Alert severity="error">Invitation not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            Team Invitation
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            You've been invited to join a team!
          </Typography>
        </Box>
        <Divider sx={{ my: 3 }} />
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
            <EmailIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              Invitation expires in: {invitation.expires_in_days} days
            </Typography>
          </Box>
          {!invitation.is_active && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              This invitation has been disabled by the team owner.
            </Alert>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<CheckCircleIcon />}
            onClick={handleAccept}
            disabled={accepting || !invitation.is_active}
          >
            {accepting ? 'Accepting...' : 'Accept Invitation'}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            startIcon={<CancelIcon />}
            onClick={handleDecline}
            disabled={accepting}
          >
            Decline
          </Button>
        </Box>
      </Paper>
    </Container>
  );
} 
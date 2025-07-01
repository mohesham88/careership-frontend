import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, CircularProgress, Alert, Link } from '@mui/material';
import { fetchProjectSubmissions } from '../../services/api';
import type { Submission } from '../../types/submission';

const statusColor = (status: string) => {
  switch (status) {
    case 'passed': return 'success';
    case 'failed': return 'error';
    case 'pending': return 'warning';
    default: return 'default';
  }
};

export default function ProjectSubmissions() {
  const { projectId, taskId } = useParams<{ projectId: string; taskId?: string }>();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchProjectSubmissions(projectId!, taskId)
      .then(res => {
        setSubmissions(res.data);
        console.log(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load submissions');
        setLoading(false);
      });
  }, [projectId, taskId]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Project Submissions</Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? theme.palette.grey[900]
                      : theme.palette.grey[200],
                }}
              >
                <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Team</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Task</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Passed Tests</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Failed Test Index</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Passed %</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Deployment</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>GitHub</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Created At</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Completed At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell><Chip label={sub.status} color={statusColor(sub.status)} size="small" /></TableCell>
                  <TableCell>{sub.team}</TableCell>
                  <TableCell>{sub.task}</TableCell>
                  <TableCell>{sub.passed_tests}</TableCell>
                  <TableCell>{sub.failed_test_index ?? '-'}</TableCell>
                  <TableCell>{sub.passed_percentage}%</TableCell>
                  <TableCell>{sub.deployment_url ? <Link href={sub.deployment_url} target="_blank">Link</Link> : '-'}</TableCell>
                  <TableCell>{sub.github_url ? <Link href={sub.github_url} target="_blank">Repo</Link> : '-'}</TableCell>
                  <TableCell>{new Date(sub.created_at).toLocaleString()}</TableCell>
                  <TableCell>{sub.completed_at ? new Date(sub.completed_at).toLocaleString() : '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
} 
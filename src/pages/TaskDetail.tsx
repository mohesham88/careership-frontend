import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { Task } from '../types/project';
import api from '../services/api';
import {
    Container,
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Grid,
    Alert,
    Skeleton,
    Paper,
    Breadcrumbs,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Schedule as ScheduleIcon,
    Assignment as AssignmentIcon,
    CheckCircle as CheckCircleIcon,
    FactCheck as FactCheckIcon,
    EventNote as EventNoteIcon,
} from '@mui/icons-material';

export default function TaskDetail() {
    const navigate = useNavigate();
    const { projectId, taskId } = useParams<{ projectId: string; taskId: string }>();
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTask = async () => {
            if (!projectId || !taskId) return;
            try {
                const response = await api.get(`/projects/${projectId}/tasks/${taskId}/`);
                setTask(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load task');
                setLoading(false);
            }
        };

        fetchTask();
    }, [projectId, taskId]);

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" width="100%" height={200} sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Skeleton variant="text" width="60%" height={48} sx={{ mb: 2 }} />
                        <Skeleton variant="text" width="100%" height={24} sx={{ mb: 1 }} />
                        <Skeleton variant="rectangular" width="100%" height={120} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Skeleton variant="rectangular" width="100%" height={120} />
                    </Grid>
                </Grid>
            </Container>
        );
    }

    if (error || !task) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error || 'Task not found'}
                </Alert>
                <Button
                    component={Link}
                    to={`/projects/${projectId}`}
                    startIcon={<ArrowBackIcon />}
                    variant="outlined"
                >
                    Back to Project
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate(`/projects/${projectId}/tasks/${taskId}/submissions`)}
                >
                    View Submissions
                </Button>
            </Box>
            {/* Breadcrumbs */}
            <Breadcrumbs sx={{ mb: 3, ml: 0 }}>
                <Link
                    to={`/projects/${projectId}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                >
                    <Typography color="text.secondary">Project</Typography>
                </Link>
                <Typography color="text.primary">{task.name}</Typography>
            </Breadcrumbs>

            <Paper elevation={4} sx={{ p: { xs: 3, md: 5 }, mb: 5, borderRadius: 4, boxShadow: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <AssignmentIcon color="action" sx={{ fontSize: 32 }} />
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                        {task.name}
                    </Typography>
                    <Chip
                        label={task.difficulty_level}
                        color={
                            task.difficulty_level === 'Easy'
                                ? 'success'
                                : task.difficulty_level === 'Medium'
                                ? 'warning'
                                : 'error'
                        }
                        size="small"
                        variant="outlined"
                        sx={{ ml: 2 }}
                    />
                </Box>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
                    Complete this task to progress in your project!
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 4, lineHeight: 1.7 }}
                >
                    {task.description || 'No description available'}
                </Typography>
                <Grid container spacing={0} alignItems="stretch">
                    <Grid size={{ xs: 12, md: 6 }} sx={{ pr: { md: 3 }, borderRight: { md: '1px solid #eee' } }}>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                            Task Details
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <ScheduleIcon color="action" sx={{ fontSize: 20 }} />
                            <Typography variant="body2" color="text.secondary">
                                Duration: {task.duration_in_days} day{task.duration_in_days !== 1 ? 's' : ''}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <CheckCircleIcon color="action" sx={{ fontSize: 20 }} />
                            <Typography variant="body2" color="text.secondary">
                                Created: {task.created_at}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }} sx={{ pl: { md: 3 }, mt: { xs: 3, md: 0 } }}>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                            Tests
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            <EventNoteIcon color="primary" sx={{ fontSize: 20 }} />
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: 18 }}>
                                {task.tests}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                    component={Link}
                    to={`/projects/${projectId}`}
                    startIcon={<ArrowBackIcon />}
                    variant="outlined"
                >
                    Back to Project
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                >
                    Submit
                </Button>
            </Box>
        </Container>
    );
} 
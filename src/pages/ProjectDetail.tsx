import { useParams, Link } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Skeleton,
  Alert,
  Button,
  Avatar,
  Paper,
  Breadcrumbs,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Star as StarIcon,
  Group as GroupIcon,
  TrendingUp as TrendingUpIcon,
  Category as CategoryIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import type { Project, Task } from "../types/project";
import { difficultyColors, categoryColors } from "../constants/projects";
import { taskStatusColors } from "../constants/tasks";
import { useProjectById } from "../hooks/useProject";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading, error } = useProjectById(id || "");

  const renderSkeleton = () => (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
      <Skeleton
        variant="rectangular"
        width="100%"
        height={400}
        sx={{ mb: 3 }}
      />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Skeleton variant="text" width="60%" height={48} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="100%" height={24} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="80%" height={24} sx={{ mb: 3 }} />
          <Skeleton variant="rectangular" width="100%" height={200} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Skeleton variant="rectangular" width="100%" height={300} />
        </Grid>
      </Grid>
    </Container>
  );

  if (isLoading) {
    return renderSkeleton();
  }

  if (error || !project) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load project
        </Alert>
      </Container>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          to="/projects"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Typography color="text.secondary">Projects</Typography>
        </Link>
        <Typography color="text.primary">{project.name}</Typography>
      </Breadcrumbs>

      {/* Project Header */}
      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: "primary.main",
                fontSize: "1.5rem",
              }}
            >
              {project.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {project.name}
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <CategoryIcon color="action" sx={{ fontSize: 20 }} />
                <Chip
                  label={project.category}
                  color={
                    categoryColors[
                      project.category as keyof typeof categoryColors
                    ] || "default"
                  }
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Box>
          </Box>
          {project.is_premium && (
            <Chip
              icon={<StarIcon />}
              label="Premium"
              color="warning"
              variant="filled"
              size="small"
            />
          )}
        </Box>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 3, lineHeight: 1.6 }}
        >
          {project.description || "No description available"}
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TrendingUpIcon color="action" />
              <Typography variant="body2" color="text.secondary">
                Difficulty:
              </Typography>
              <Chip
                label={project.difficulty_level}
                color={
                  difficultyColors[
                    project.difficulty_level as keyof typeof difficultyColors
                  ] || "default"
                }
                size="small"
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <GroupIcon color="action" />
              <Typography variant="body2" color="text.secondary">
                Team Size: {project.max_team_size}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AssignmentIcon color="action" />
              <Typography variant="body2" color="text.secondary">
                Tasks: {project.tasks?.length || 0}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ScheduleIcon color="action" />
              <Typography variant="body2" color="text.secondary">
                Created: {formatDate(project.created_at)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Tasks Section */}
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <AssignmentIcon />
          Project Tasks
        </Typography>

        {project.tasks && project.tasks.length > 0 ? (
          <Grid container spacing={2}>
            {project.tasks.map((task: Task) => (
              <Grid size={{ xs: 12 }} key={task.id}>
                <Card
                  sx={{
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 3,
                    },
                  }}
                  component={Link}
                  to={`/projects/${project.id}/tasks/${task.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="h6" component="h3" gutterBottom>
                          {task.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          {task.description || "No description available"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: 1,
                        }}
                      >
                        <Chip
                          label={task.difficulty_level}
                          color={
                            difficultyColors[
                              task.difficulty_level as keyof typeof difficultyColors
                            ] || "default"
                          }
                          size="small"
                        />
                        {/* {task.status && (
                          <Chip
                            label={task.status}
                            color={
                              taskStatusColors[
                                task.isFinished as keyof typeof taskStatusColors
                              ] || "default"
                            }
                            size="small"
                            variant="outlined"
                          />
                        )} */}
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Created: {formatDate(task.created_at)}
                      </Typography>
                      {/* {task.due_date && (
                        <Typography variant="caption" color="text.secondary">
                          Due: {formatDate(task.due_date)}
                        </Typography>
                      )} */}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No tasks available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tasks will appear here once they are added to the project
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Back Button */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button
          component={Link}
          to="/projects"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          size="large"
        >
          Back to Projects
        </Button>
      </Box>
    </Container>
  );
}

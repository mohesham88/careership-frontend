import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  Alert,
  Grid,
} from "@mui/material";

import type { Project } from "../../types/project";
import ProjectCard from "../../components/ProjectCard";
import { useProjects } from "../../hooks/useProjectHooks";

export default function Projects() {
  const { data: projects, isLoading, error } = useProjects();

  // will be displayed when the page is loading
  const renderSkeletonCards = () => (
    <Grid container spacing={3}>
      {[...Array(6)].map((_, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Skeleton variant="text" width="60%" height={32} />
              <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="80%" height={20} />
              <Box sx={{ mt: 2 }}>
                <Skeleton variant="rectangular" width="60%" height={24} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Projects
        </Typography>
        {renderSkeletonCards()}
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load projects
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Explore Projects
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover amazing projects and start your next adventure
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {projects?.map((project: Project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </Grid>

      {projects?.length === 0 && !isLoading && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No projects available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Check back later for new projects
          </Typography>
        </Box>
      )}
    </Container>
  );
}

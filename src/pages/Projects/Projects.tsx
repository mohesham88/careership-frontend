import { useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  Alert,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
} from "@mui/material";
import { SmartToy as AIIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import type { Project } from "../../types/project";
import ProjectCard from "../../components/ProjectCard";
import api from "../../services/api";

const PAGE_SIZE = 10;
const DIFFICULTY_OPTIONS = ["", "Easy", "Medium", "Hard"];
const CATEGORY_OPTIONS = ["", "Frontend", "Backend", "Fullstack"];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setPage(1); // Reset page when filters change
  }, [difficulty, category]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    params.append("page", page.toString());
    if (difficulty) params.append("difficulty_level", difficulty);
    if (category) params.append("category", category);

    api
      .get(`/projects/?${params.toString()}`)
      .then((res) => {
        setProjects(res.data.results);
        setCount(res.data.count);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load projects");
        setLoading(false);
      });
  }, [page, difficulty, category]);

  const totalPages = Math.ceil(count / PAGE_SIZE);

  // will be displayed when the page is loading
  const renderSkeletonCards = () => (
    <Grid container spacing={3}>
      {[...Array(PAGE_SIZE)].map((_, index) => (
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

  if (loading) {
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
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: "flex", gap: 2 }}>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Difficulty</InputLabel>
          <Select
            value={difficulty}
            label="Difficulty"
            onChange={(e) => setDifficulty(e.target.value)}
          >
            {DIFFICULTY_OPTIONS.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt || "All"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            label="Category"
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt || "All"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Explore Projects
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Discover amazing projects and start your next adventure
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AIIcon />}
            onClick={() => navigate("/projects/drafts")}
            sx={{
              bgcolor: "primary.main",
              "&:hover": {
                bgcolor: "primary.dark",
              },
              px: 3,
              py: 1,
            }}
          >
            AI Project Drafts
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {projects?.map((project: Project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </Grid>

      {projects?.length === 0 && !loading && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No projects available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Check back later for new projects
          </Typography>
        </Box>
      )}

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
}

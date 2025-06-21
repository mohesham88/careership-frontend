import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  Button,
  Avatar,
  CardHeader,
} from "@mui/material";

import Grid from "@mui/material/Grid";
import {
  Star as StarIcon,
  Group as GroupIcon,
  TrendingUp as TrendingUpIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";
import type { Project } from "../types/project";

import { difficultyColors, categoryColors } from "../constants/projects";

function ProjectCard({ project }: { project: Project }) {
  return (
    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project.id}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 4,
          },
        }}
        component={Link}
        to={`/projects/${project.id}`}
        style={{ textDecoration: "none" }}
      >
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "primary.main" }}>
              {project.name.charAt(0).toUpperCase()}
            </Avatar>
          }
          action={
            project.is_premium && (
              <Chip
                icon={<StarIcon />}
                label="Premium"
                color="warning"
                size="small"
                variant="filled"
              />
            )
          }
          title={
            <Typography variant="h6" component="div" noWrap>
              {project.name}
            </Typography>
          }
          subheader={
            <Typography variant="body2" color="text.secondary" noWrap>
              {project.category}
            </Typography>
          }
        />

        <CardContent sx={{ flexGrow: 1 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {project.description || "No description available"}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <TrendingUpIcon
              sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }}
            />
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
              sx={{ ml: 1 }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <GroupIcon
              sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }}
            />
            <Typography variant="body2" color="text.secondary">
              Team Size: {project.max_team_size}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CategoryIcon
              sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }}
            />
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
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button size="small" color="primary" sx={{ width: "100%" }}>
            View Details
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}

export default ProjectCard;

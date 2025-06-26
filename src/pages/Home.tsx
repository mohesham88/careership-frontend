import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  Container,
  Paper,
  Stack,
} from "@mui/material";
import {
  School,
  Work,
  Group,
  Star,
  ArrowForward,
  RocketLaunch,
  EmojiEvents,
  GitHub,
  LinkedIn,
} from "@mui/icons-material";

const stats = [
  { icon: <Work color="primary" />, label: "Real Projects", value: "120+" },
  {
    icon: <Group color="secondary" />,
    label: "Active Students",
    value: "800+",
  },
  { icon: <School color="success" />, label: "Universities", value: "15+" },
  { icon: <Star color="warning" />, label: "Companies", value: "30+" },
];

const howItWorks = [
  {
    icon: <RocketLaunch color="primary" />,
    title: "Sign Up",
    desc: "Create your free account and set up your profile.",
  },
  {
    icon: <Work color="secondary" />,
    title: "Join Projects",
    desc: "Browse and join real-world projects that match your interests.",
  },
  {
    icon: <EmojiEvents color="success" />,
    title: "Gain Experience",
    desc: "Work with teams, build your portfolio, and earn certificates.",
  },
];

const featuredProjects = [
  {
    name: "AI Resume Analyzer",
    desc: "Build an AI tool to help students improve their resumes.",
    difficulty: "Intermediate",
    team: 5,
    category: "AI/ML",
  },
  {
    name: "Job Board Platform",
    desc: "A web app connecting students with internships.",
    difficulty: "Beginner",
    team: 4,
    category: "Web Dev",
  },
  {
    name: "Open Source CRM",
    desc: "Contribute to a real CRM used by startups.",
    difficulty: "Advanced",
    team: 8,
    category: "Open Source",
  },
];

const testimonials = [
  {
    name: "Sara Ahmed",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    quote:
      "CareerShip gave me my first real project experience. Now I feel ready for the job market!",
    role: "CS Student, Cairo University",
  },
  {
    name: "Omar Khaled",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    quote:
      "I met amazing mentors and worked on projects that matter. Highly recommend!",
    role: "Intern, Tech Startup",
  },
  {
    name: "Dr. Mona Samir",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    quote:
      "Our students gained practical skills and confidence through CareerShip projects.",
    role: "Professor, Ain Shams University",
  },
];

const Footer = () => (
  <Box
    component="footer"
    sx={{
      bgcolor: "background.paper",
      py: 4,
      mt: 8,
      borderTop: 1,
      borderColor: "divider",
    }}
  >
    <Container maxWidth="lg">
      <Grid
        container
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            variant="h6"
            color="primary"
            fontWeight={700}
            gutterBottom
          >
            CareerShip
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Empowering CS students to gain real-world experience and launch
            their careers.
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack
            direction="row"
            spacing={2}
            justifyContent={{ xs: "flex-start", md: "flex-end" }}
          >
            <Button startIcon={<GitHub />} href="#" color="inherit">
              GitHub
            </Button>
            <Button startIcon={<LinkedIn />} href="#" color="inherit">
              LinkedIn
            </Button>
            <Button href="#" color="inherit">
              Contact
            </Button>
          </Stack>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Typography
        variant="caption"
        color="text.secondary"
        align="center"
        display="block"
      >
        © {new Date().getFullYear()} CareerShip. All rights reserved.
      </Typography>
    </Container>
  </Box>
);

const Home = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          py: { xs: 8, md: 12 },
          textAlign: "center",
          px: 2,
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight={800} gutterBottom>
            Welcome to CareerShip
          </Typography>
          <Typography variant="h5" sx={{ mb: 4 }}>
            The platform where CS students work on real-world projects, gain
            experience, and launch their careers—just like an intern!
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            endIcon={<ArrowForward />}
            href="/projects"
          >
            Explore Projects
          </Button>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4} justifyContent="center">
          {stats.map((stat) => (
            <Grid size={{ xs: 6, md: 3 }} key={stat.label}>
              <Paper
                elevation={3}
                sx={{ p: 3, textAlign: "center", borderRadius: 3 }}
              >
                <Avatar
                  sx={{
                    bgcolor: "background.default",
                    mx: "auto",
                    mb: 1,
                    width: 48,
                    height: 48,
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Typography variant="h4" fontWeight={700}>
                  {stat.value}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ bgcolor: "background.paper", py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h4" fontWeight={700} align="center" gutterBottom>
            How It Works
          </Typography>
          <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
            {howItWorks.map((step) => (
              <Grid size={{ xs: 12, md: 4 }} key={step.title}>
                <Paper
                  elevation={2}
                  sx={{ p: 4, textAlign: "center", borderRadius: 3 }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "background.default",
                      mx: "auto",
                      mb: 2,
                      width: 56,
                      height: 56,
                    }}
                  >
                    {step.icon}
                  </Avatar>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {step.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {step.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Projects Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" fontWeight={700} align="center" gutterBottom>
          Featured Projects
        </Typography>
        <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
          {featuredProjects.map((project) => (
            <Grid size={{ xs: 12, md: 4 }} key={project.name}>
              <Card
                sx={{
                  borderRadius: 3,
                  height: "100%",
                  transition: "0.3s",
                  "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {project.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {project.desc}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    <Typography variant="caption" color="primary">
                      {project.category}
                    </Typography>
                    <Typography variant="caption" color="secondary">
                      Team: {project.team}
                    </Typography>
                    <Typography variant="caption" color="success.main">
                      {project.difficulty}
                    </Typography>
                  </Stack>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    href="/projects"
                  >
                    View Projects
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: "background.paper", py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h4" fontWeight={700} align="center" gutterBottom>
            What Our Users Say
          </Typography>
          <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
            {testimonials.map((t) => (
              <Grid size={{ xs: 12, md: 4 }} key={t.name}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    textAlign: "center",
                    height: "100%",
                  }}
                >
                  <Avatar
                    src={t.avatar}
                    alt={t.name}
                    sx={{ width: 64, height: 64, mx: "auto", mb: 2 }}
                  />
                  <Typography variant="body1" fontStyle="italic" gutterBottom>
                    "{t.quote}"
                  </Typography>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {t.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t.role}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box
        sx={{
          bgcolor: "secondary.main",
          color: "secondary.contrastText",
          py: 8,
          textAlign: "center",
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Ready to launch your career?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>
            Join CareerShip and start working on real projects today.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            endIcon={<ArrowForward />}
            href="/signup"
          >
            Sign Up Now
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default Home;

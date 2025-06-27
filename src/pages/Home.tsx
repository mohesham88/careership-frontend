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
  useTheme,
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
import { motion } from "framer-motion";
import { Footer } from "../components/Footer";

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

const waveSVG = (
  <Box sx={{ width: "100%", lineHeight: 0, bgcolor: "transparent", mt: -1 }}>
    <svg
      viewBox="0 0 1440 120"
      width="100%"
      height="80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0,32L48,53.3C96,75,192,117,288,117.3C384,117,480,75,576,74.7C672,75,768,117,864,128C960,139,1056,117,1152,101.3C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
        fill="#267B8D"
        fillOpacity="0.15"
      />
    </svg>
  </Box>
);

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, type: "spring" as const },
  },
};

const Home = () => {
  const theme = useTheme();
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          bgcolor: "primary.main",
          color: "primary.contrastText",
          py: { xs: 10, md: 16 },
          textAlign: "center",
          px: 2,
          overflow: "hidden",
        }}
      >
        {/* Gradient background overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            background: `radial-gradient(circle at 60% 40%, ${theme.palette.secondary.main}33 0%, transparent 70%), linear-gradient(120deg, ${theme.palette.primary.main} 60%, ${theme.palette.secondary.main} 100%)`,
            opacity: 0.7,
          }}
        />
        {/* Floating shapes */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 0.15 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          style={{ position: "absolute", left: 40, top: 40, zIndex: 1 }}
        >
          <Star sx={{ fontSize: 80, color: theme.palette.secondary.light }} />
        </motion.div>
        <motion.div
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 0.12 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          style={{ position: "absolute", right: 60, top: 80, zIndex: 1 }}
        >
          <RocketLaunch
            sx={{ fontSize: 70, color: theme.palette.success.light }}
          />
        </motion.div>
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, type: "spring" }}
          >
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
              sx={{
                px: 5,
                py: 1.5,
                fontWeight: 700,
                fontSize: 20,
                boxShadow: 4,
                borderRadius: 3,
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "scale(1.06)",
                  boxShadow: 8,
                },
              }}
            >
              Explore Projects
            </Button>
          </motion.div>
        </Container>
        {/* SVG Wave Divider */}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: -1,
            zIndex: 2,
          }}
        >
          {waveSVG}
        </Box>
      </Box>

      {/* Stats Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        custom={1}
      >
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={4} justifyContent="center">
            {stats.map((stat, i) => (
              <Grid size={{ xs: 6, md: 3 }} key={stat.label}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.1 + i * 0.1,
                    duration: 0.7,
                    type: "spring",
                  }}
                >
                  <Paper
                    elevation={4}
                    sx={{
                      p: 3,
                      textAlign: "center",
                      borderRadius: 3,
                      boxShadow: 6,
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-6px) scale(1.04)",
                        boxShadow: 12,
                        background: theme.palette.action.hover,
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "background.default",
                        mx: "auto",
                        mb: 1,
                        width: 56,
                        height: 56,
                        boxShadow: 2,
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
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </motion.div>

      {/* How It Works Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        custom={2}
      >
        <Box sx={{ bgcolor: "background.paper", py: 8 }}>
          <Container maxWidth="md">
            <Typography
              variant="h4"
              fontWeight={700}
              align="center"
              gutterBottom
            >
              How It Works
            </Typography>
            <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
              {howItWorks.map((step, i) => (
                <Grid size={{ xs: 12, md: 4 }} key={step.title}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.1 + i * 0.1,
                      duration: 0.7,
                      type: "spring",
                    }}
                  >
                    <Paper
                      elevation={3}
                      sx={{
                        p: 4,
                        textAlign: "center",
                        borderRadius: 3,
                        boxShadow: 4,
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: "background.default",
                          mx: "auto",
                          mb: 2,
                          width: 64,
                          height: 64,
                          boxShadow: 2,
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
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </motion.div>

      {/* Featured Projects Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        custom={3}
      >
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h4" fontWeight={700} align="center" gutterBottom>
            Featured Projects
          </Typography>
          <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
            {featuredProjects.map((project, i) => (
              <Grid size={{ xs: 12, md: 4 }} key={project.name}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.1 + i * 0.1,
                    duration: 0.7,
                    type: "spring",
                  }}
                >
                  <Card
                    sx={{
                      borderRadius: 3,
                      height: "100%",
                      transition: "0.3s",
                      boxShadow: 6,
                      "&:hover": {
                        boxShadow: 12,
                        transform: "translateY(-8px) scale(1.03)",
                      },
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
                        sx={{ fontWeight: 600, borderRadius: 2 }}
                      >
                        View Projects
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </motion.div>

      {/* Testimonials Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        custom={4}
      >
        <Box sx={{ bgcolor: "background.paper", py: 8 }}>
          <Container maxWidth="md">
            <Typography
              variant="h4"
              fontWeight={700}
              align="center"
              gutterBottom
            >
              What Our Users Say
            </Typography>
            <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
              {testimonials.map((t, i) => (
                <Grid size={{ xs: 12, md: 4 }} key={t.name}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.1 + i * 0.1,
                      duration: 0.7,
                      type: "spring",
                    }}
                  >
                    <Paper
                      elevation={4}
                      sx={{
                        p: 4,
                        borderRadius: 3,
                        textAlign: "center",
                        height: "100%",
                        boxShadow: 6,
                        background:
                          theme.palette.mode === "dark" ? "#232a45" : "#f4f6fa",
                      }}
                    >
                      <Avatar
                        src={t.avatar}
                        alt={t.name}
                        sx={{
                          width: 64,
                          height: 64,
                          mx: "auto",
                          mb: 2,
                          boxShadow: 2,
                        }}
                      />
                      <Typography
                        variant="body1"
                        fontStyle="italic"
                        gutterBottom
                      >
                        "{t.quote}"
                      </Typography>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {t.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t.role}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </motion.div>

      {/* Call to Action Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <Box
          sx={{
            bgcolor: "secondary.main",
            color: "secondary.contrastText",
            py: 8,
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
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
              sx={{
                px: 5,
                py: 1.5,
                fontWeight: 700,
                fontSize: 20,
                borderRadius: 3,
                boxShadow: 4,
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": { transform: "scale(1.06)", boxShadow: 8 },
              }}
            >
              Sign Up Now
            </Button>
          </Container>
        </Box>
      </motion.div>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default Home;

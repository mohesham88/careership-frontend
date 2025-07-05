import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  useTheme,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Check,
  Star,
  Rocket,
  School,
  WorkspacePremium,
} from "@mui/icons-material";

const plans = [
  {
    title: "Free",
    price: "0",
    period: "forever",
    icon: <School sx={{ fontSize: 40 }} />,
    features: [
      "Access to 5 basic projects",
      "Basic team collaboration",
      "Community support",
      "Basic project templates",
      "Email support",
    ],
    buttonText: "Get Started",
    buttonVariant: "outlined",
    popular: false,
    color: "primary",
  },
  {
    title: "Pro",
    price: "19.99",
    period: "per month",
    icon: <Rocket sx={{ fontSize: 40 }} />,
    features: [
      "Access to all projects",
      "Advanced team features",
      "Priority support",
      "Custom project templates",
      "Video calls support",
      "AI project assistance",
      "Advanced analytics",
    ],
    buttonText: "Start Free Trial",
    buttonVariant: "contained",
    popular: true,
    color: "secondary",
  },
  {
    title: "Enterprise",
    price: "49.99",
    period: "per month",
    icon: <WorkspacePremium sx={{ fontSize: 40 }} />,
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "24/7 dedicated support",
      "Custom integrations",
      "Advanced security",
      "API access",
      "Custom branding",
      "Training sessions",
    ],
    buttonText: "Contact Sales",
    buttonVariant: "outlined",
    popular: false,
    color: "primary",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      type: "spring",
      stiffness: 100,
    },
  }),
};

const Pricing = () => {
  const theme = useTheme();

  return (
    <Box sx={{ py: 8, bgcolor: "background.default" }}>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={8}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h2"
              component="h1"
              fontWeight={700}
              gutterBottom
              sx={{ mb: 2 }}
            >
              Choose Your Plan
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: "auto" }}
            >
              Get started with CareerShip today and accelerate your career
              growth with real-world projects
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {plans.map((plan, i) => (
            <Grid key={plan.title} size={{ xs: 12, md: 4 }}>
              <motion.div
                variants={cardVariants as any}
                initial="hidden"
                animate="visible"
                custom={i}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    borderRadius: 4,
                    boxShadow: plan.popular ? 8 : 2,
                    border: plan.popular
                      ? `2px solid ${theme.palette.secondary.main}`
                      : "none",
                  }}
                >
                  {plan.popular && (
                    <Chip
                      icon={<Star />}
                      label="Most Popular"
                      color="secondary"
                      sx={{
                        position: "absolute",
                        top: -4,
                        right: -5,
                        px: 1,
                      }}
                    />
                  )}
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      flexGrow: 1,
                      p: 4,
                    }}
                  >
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2,
                        bgcolor: `${plan.color}.main`,
                        color: `${plan.color}.contrastText`,
                      }}
                    >
                      {plan.icon}
                    </Box>
                    <Typography variant="h4" component="h2" fontWeight={700}>
                      {plan.title}
                    </Typography>
                    <Box sx={{ my: 3, textAlign: "center" }}>
                      <Typography
                        variant="h3"
                        component="span"
                        fontWeight={700}
                      >
                        ${plan.price}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        component="span"
                        color="text.secondary"
                      >
                        /{plan.period}
                      </Typography>
                    </Box>
                    <List sx={{ mb: 4, width: "100%" }}>
                      {plan.features.map((feature) => (
                        <ListItem key={feature} sx={{ py: 1 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Check color={plan.color as any} />
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>
                    <Button
                      variant={plan.buttonVariant as "contained" | "outlined"}
                      color={plan.color as any}
                      size="large"
                      fullWidth
                      sx={{
                        py: 1.5,
                        fontWeight: 600,
                        borderRadius: 2,
                        fontSize: "1.1rem",
                        color: "text.secondary",
                        borderColor: "text.secondary",
                      }}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 8, textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Typography variant="subtitle1" color="text.secondary">
              All plans include a 14-day free trial. No credit card required.
            </Typography>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default Pricing;

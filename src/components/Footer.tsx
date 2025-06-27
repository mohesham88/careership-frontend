import { GitHub, LinkedIn } from "@mui/icons-material";
import { Box, Grid, Container, Typography, Stack, Button, Divider } from "@mui/material";

export const Footer = () => (
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

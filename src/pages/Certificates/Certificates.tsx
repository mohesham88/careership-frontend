import { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Skeleton,
  Alert,
  Box,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  School as SchoolIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import {
  useGetCertificates,
  useDownloadCertificate,
} from "../../hooks/useCertificateHooks";

export default function Certificates() {
  const { data: certificates, isLoading, error } = useGetCertificates();
  const downloadMutation = useDownloadCertificate();

  const handleDownload = async (certificateNo: string) => {
    try {
      await downloadMutation.mutateAsync(certificateNo);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          {[1, 2, 3].map((index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Skeleton variant="rectangular" height={200} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Failed to load certificates</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink component={Link} to="/" underline="hover" color="inherit">
          Home
        </MuiLink>
        <Typography color="text.primary">My Certificates</Typography>
      </Breadcrumbs>

      {/* Page Header */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <SchoolIcon sx={{ fontSize: 40, color: "primary.main" }} />
        <Typography variant="h4" component="h1">
          My Certificates
        </Typography>
      </Box>

      {certificates?.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          You haven't earned any certificates yet. Complete projects to earn
          certificates!
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {certificates?.map((certificate) => (
            <Grid size={{ xs: 12, md: 4 }} key={certificate.no}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box
                    sx={{
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <SchoolIcon color="primary" />
                    <Typography variant="h6" component="div">
                      Certificate #{certificate.no}
                    </Typography>
                  </Box>

                  <Typography color="text.secondary" gutterBottom>
                    Project ID: {certificate.project_id}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Issued on: {formatDate(certificate.created_at)}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    component={Link}
                    to={`/certificates/${certificate.no}`}
                    startIcon={<VisibilityIcon />}
                    size="small"
                  >
                    View
                  </Button>
                  <Button
                    onClick={() => handleDownload(certificate.no)}
                    startIcon={<DownloadIcon />}
                    size="small"
                    disabled={downloadMutation.isPending}
                  >
                    Download
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

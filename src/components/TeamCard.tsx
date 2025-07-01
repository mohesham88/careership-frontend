import { Card, CardContent, CardActions, Typography, Box, Button, Avatar, CardHeader, Stack, Tooltip } from "@mui/material";
import Grid from "@mui/material/Grid";
import { Group as GroupIcon, Person as PersonIcon } from "@mui/icons-material";
import type { Team } from "../types/team";
import { useTheme } from "@mui/material/styles";

function TeamCard({ team, onViewDetails }: { team: Team; onViewDetails?: (team: Team) => void }) {
  const theme = useTheme();
  return (
    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={team.uuid} component="div">
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
      >
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: theme.palette.mode === 'dark' ? theme.palette.secondary.main : 'primary.main' }}>
              {team.name.charAt(0).toUpperCase()}
            </Avatar>
          }
          title={
            <Typography
              variant="h6"
              component="h2"
              sx={{
                wordBreak: 'break-word',
                whiteSpace: 'normal',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                fontWeight: 600,
              }}
            >
              {team.name}
            </Typography>
          }
        />
        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button
            size="small"
            color="primary"
            variant={theme.palette.mode === 'dark' ? 'contained' : 'outlined'}
            sx={{ width: "100%", fontWeight: theme.palette.mode === 'dark' ? 700 : 400, boxShadow: theme.palette.mode === 'dark' ? 2 : undefined }}
            onClick={() => onViewDetails?.(team)}
          >
            View Details
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}

export default TeamCard; 
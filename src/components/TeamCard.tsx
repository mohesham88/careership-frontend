import { Card, CardContent, CardActions, Typography, Box, Button, Avatar, CardHeader, Stack, Tooltip } from "@mui/material";
import Grid from "@mui/material/Grid";
import { Group as GroupIcon, Person as PersonIcon } from "@mui/icons-material";
import type { Team } from "../types/team";

function TeamCard({ team, onViewDetails }: { team: Team; onViewDetails?: (team: Team) => void }) {
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
            <Avatar sx={{ bgcolor: "primary.main" }}>
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
          <Button size="small" color="primary" sx={{ width: "100%" }} onClick={() => onViewDetails?.(team)}>
            View Details
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}

export default TeamCard; 
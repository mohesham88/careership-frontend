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
          // subheader={
          //   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          //     <PersonIcon fontSize="small" color="action" />
          //     <Typography variant="body2" color="text.secondary" noWrap>
          //       Owner: {team.name}
          //     </Typography>
          //   </Box>
          // }
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            {/* <GroupIcon sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              Members: {team.members.length}test
            </Typography> */}
            {/* <Stack direction="row" spacing={-1} sx={{ ml: 2 }}>
              {team.members.slice(0, 4).map((member, idx) => (
                <Tooltip key={idx} title={`${member.first_name} ${member.last_name}`}>
                  <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                    {member.first_name.charAt(0)}{member.last_name.charAt(0)}
                  </Avatar>
                </Tooltip>
              ))}
              {team.members.length > 4 && (
                <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>+{team.members.length - 4}</Avatar>
              )}
            </Stack> */}
          </Box>
          {/* <Typography variant="body2" color="text.secondary">
            Created: {new Date(team.created_at).toLocaleDateString()}
            Created: test
          </Typography> */}
        </CardContent>
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
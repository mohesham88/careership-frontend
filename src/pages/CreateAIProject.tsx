import { useState } from "react";
import { useAIProjectStore } from "../store/aiProjectStore";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Paper,
  TextField,
  IconButton,
  InputAdornment,
  Tabs,
  Tab,
  Stack,
  Avatar,
  Button,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";

export default function CreateAIProject() {
  const [input, setInput] = useState("");
  const { chats, selectedChatId, selectChat, addChat, addMessage } =
    useAIProjectStore();
  const selectedChat = chats.find((c) => c.id === selectedChatId);
  const messages = selectedChat ? selectedChat.messages : [];

  return (
    <Box
      sx={{
        display: "flex",
        height: "calc(100vh - 64px)",
        bgcolor: "background.default",
      }}
    >
      {/* Sidebar */}
      <Paper
        elevation={3}
        sx={{
          width: 280,
          p: 0,
          borderRadius: 0,
          bgcolor: "background.paper",
          borderRight: 1,
          borderColor: "divider",
        }}
      >
        <Box sx={{ p: 3, pb: 2 }}>
          <Typography variant="h6" fontWeight={700} color="text.primary">
            AI Project Chats
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create and manage your AI-generated projects
          </Typography>
        </Box>
        <Divider />
        <List>
          {chats.map((chat) => (
            <ListItemButton
              key={chat.id}
              selected={selectedChatId === chat.id}
              onClick={() => selectChat(chat.id)}
            >
              <ListItemText primary={chat.title} />
            </ListItemButton>
          ))}
        </List>
        <Box sx={{ p: 2 }}>
          <Button fullWidth variant="contained" color="secondary">
            + New Chat
          </Button>
        </Box>
      </Paper>

      {/* Chat Area */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.default",
        }}
      >
        <Box
          sx={{
            flex: 1,
            p: { xs: 2, md: 4 },
            overflowY: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: messages.length === 0 ? "center" : "flex-start",
          }}
        >
          {messages.length === 0 ? (
            <Box sx={{ textAlign: "center", color: "text.secondary", mt: 4 }}>
              <SmartToyIcon sx={{ fontSize: 72, color: "text.main", mb: 2 }} />
              <Typography
                variant="h5"
                fontWeight={700}
                gutterBottom
                color="text.primary"
              >
                Create your customized AI project tailored to your needs!
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                No messages yet. Start a new chat and let AI help you build the
                perfect project for you.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={3} sx={{ width: "100%" }}>
              {messages.map((msg: any, idx: number) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                    flexDirection:
                      msg.sender === "user" ? "row-reverse" : "row",
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor:
                        msg.sender === "ai" ? "primary.main" : "secondary.main",
                    }}
                  >
                    {msg.sender === "ai" ? <SmartToyIcon /> : <PersonIcon />}
                  </Avatar>
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor:
                        msg.sender === "ai" ? "primary.50" : "secondary.50",
                      maxWidth: 500,
                    }}
                  >
                    <Typography color="text.primary">{msg.text}</Typography>
                  </Paper>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
        <Divider />
        <Box
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <TextField
            fullWidth
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton color="primary" disabled>
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ borderRadius: 2 }}
          />
        </Box>
      </Box>
    </Box>
  );
}

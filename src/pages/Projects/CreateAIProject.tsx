import { useState, useEffect } from "react";
import { useAIProjectStore } from "../../store/aiProjectStore";
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
  Stack,
  Avatar,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Chip,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

const getStatusColor = (status: string) => {
  switch (status) {
    case "generating":
      return "warning";
    case "completed":
      return "success";
    case "archived":
      return "error";
    default:
      return "default";
  }
};

export default function CreateAIProject() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [isNewDraftDialogOpen, setIsNewDraftDialogOpen] = useState(false);
  const [newDraftName, setNewDraftName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [isPublic, setIsPublic] = useState(false);

  const {
    drafts,
    selectedDraftId,
    isLoading,
    error,
    pendingDraft,
    fetchDrafts,
    selectDraft,
    setPendingDraft,
    initiateDraft,
    refineDraft,
    finalizeDraft,
    deleteDraft,
  } = useAIProjectStore();

  useEffect(() => {
    fetchDrafts();
  }, [fetchDrafts]);

  const selectedDraft = drafts.find((d) => d.id === selectedDraftId);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    if (pendingDraft) {
      // This is the first message for a new draft
      await initiateDraft(input);
    } else if (selectedDraftId) {
      // This is a refinement message for an existing draft
      await refineDraft(selectedDraftId, input);
    }
    setInput("");
  };

  const handleCreateNewDraft = () => {
    if (!newDraftName.trim()) return;

    // Save draft metadata to store
    setPendingDraft({
      name: newDraftName,
      categoryId: selectedCategory,
      isPublic,
    });

    // Close dialog and reset form
    setIsNewDraftDialogOpen(false);
    setNewDraftName("");
    setSelectedCategory(1);
    setIsPublic(false);
  };

  const handleFinalizeDraft = async () => {
    if (!selectedDraftId) return;

    try {
      await finalizeDraft(selectedDraftId);
      navigate("/projects");
    } catch (error) {
      console.error("Failed to finalize draft:", error);
    }
  };

  const handleDeleteDraft = async (draftId: number) => {
    if (!window.confirm("Are you sure you want to delete this draft?")) return;

    try {
      await deleteDraft(draftId);
    } catch (error) {
      console.error("Failed to delete draft:", error);
    }
  };

  const handleCancelPendingDraft = () => {
    setPendingDraft(null);
    selectDraft(null);
  };

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
            AI Project Drafts
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create and manage your AI-generated projects
          </Typography>
        </Box>
        <Divider />
        {isLoading ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mx: 2, my: 1 }}>
            {error}
          </Alert>
        ) : (
          <List>
            {drafts.map((draft) => (
              <ListItemButton
                key={draft.id}
                selected={selectedDraftId === draft.id}
                onClick={() => {
                  selectDraft(draft.id);
                  setPendingDraft(null); // Clear any pending draft when selecting an existing one
                }}
                disabled={draft.status === "archived"}
              >
                <ListItemText
                  primary={draft.name || "Untitled Draft"}
                  secondary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={draft.status}
                        size="small"
                        color={getStatusColor(draft.status)}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {draft.category}
                      </Typography>
                    </Stack>
                  }
                />
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteDraft(draft.id);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </ListItemButton>
            ))}
          </List>
        )}
        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={() => setIsNewDraftDialogOpen(true)}
            disabled={!!pendingDraft} // Disable while there's a pending draft
          >
            + New Draft
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
            justifyContent:
              !selectedDraft?.conversation_history?.length && !pendingDraft
                ? "center"
                : "flex-start",
          }}
        >
          {pendingDraft ? (
            <Box sx={{ width: "100%" }}>
              <Alert
                severity="info"
                action={
                  <Button
                    color="inherit"
                    size="small"
                    onClick={handleCancelPendingDraft}
                  >
                    Cancel
                  </Button>
                }
                sx={{ mb: 3 }}
              >
                Creating new draft: {pendingDraft.name}. Please enter your first
                prompt to begin.
              </Alert>
            </Box>
          ) : !selectedDraft ? (
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
                Select a draft from the sidebar or create a new one to get
                started.
              </Typography>
            </Box>
          ) : selectedDraft.status === "archived" ? (
            <Box sx={{ textAlign: "center", color: "text.secondary", mt: 4 }}>
              <Typography variant="h6" color="error">
                This draft has been archived and cannot be modified.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={3} sx={{ width: "100%" }}>
              {selectedDraft.conversation_history?.map((msg, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                    flexDirection: msg.role === "user" ? "row-reverse" : "row",
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor:
                        msg.role === "model"
                          ? "primary.main"
                          : "secondary.main",
                    }}
                  >
                    {msg.role === "model" ? <SmartToyIcon /> : <PersonIcon />}
                  </Avatar>
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor:
                        msg.role === "model" ? "primary.50" : "secondary.50",
                      maxWidth: "70%",
                    }}
                  >
                    <Typography color="text.primary">
                      {msg.parts.join(" ")}
                    </Typography>
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
          {selectedDraft?.status === "completed" ? (
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleFinalizeDraft}
            >
              Finalize Project
            </Button>
          ) : (
            <TextField
              fullWidth
              placeholder={
                pendingDraft
                  ? "Enter your first prompt to create the draft..."
                  : !selectedDraft
                  ? "Select a draft to start chatting"
                  : selectedDraft.status === "archived"
                  ? "This draft is archived"
                  : "Type your message..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={
                (!pendingDraft && !selectedDraft) ||
                selectedDraft?.status === "generating" ||
                selectedDraft?.status === "archived"
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      color="primary"
                      onClick={handleSendMessage}
                      disabled={
                        !input.trim() ||
                        (!pendingDraft && !selectedDraft) ||
                        selectedDraft?.status === "generating" ||
                        selectedDraft?.status === "archived"
                      }
                    >
                      {selectedDraft?.status === "generating" ? (
                        <CircularProgress size={24} />
                      ) : (
                        <SendIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ borderRadius: 2 }}
            />
          )}
        </Box>
      </Box>

      {/* New Draft Dialog */}
      <Dialog
        open={isNewDraftDialogOpen}
        onClose={() => setIsNewDraftDialogOpen(false)}
      >
        <DialogTitle>Create New Project Draft</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2, minWidth: 400 }}>
            <TextField
              fullWidth
              label="Draft Name"
              value={newDraftName}
              onChange={(e) => setNewDraftName(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={(e) => setSelectedCategory(Number(e.target.value))}
              >
                <MenuItem value={1}>Web Development</MenuItem>
                <MenuItem value={2}>Mobile Development</MenuItem>
                <MenuItem value={3}>Data Science</MenuItem>
                <MenuItem value={4}>Machine Learning</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
              }
              label="Make Public"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsNewDraftDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateNewDraft}
            variant="contained"
            disabled={!newDraftName.trim()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

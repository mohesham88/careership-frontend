import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import React from "react";

interface CreateTeamDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: () => void;
  loading: boolean;
  error?: string | null;
  value: string;
  onChange: (value: string) => void;
}

const CreateTeamDialog: React.FC<CreateTeamDialogProps> = ({
  open,
  onClose,
  onCreate,
  loading,
  error,
  value,
  onChange,
}) => (
  <Dialog open={open} onClose={onClose} closeAfterTransition={false}>
    <DialogTitle>Create a New Team</DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        label="Team Name"
        type="text"
        fullWidth
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
      />
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} disabled={loading}>
        Cancel
      </Button>
      <Button
        onClick={onCreate}
        variant="contained"
        disabled={loading || !value}
      >
        {loading ? "Creating..." : "Create"}
      </Button>
    </DialogActions>
  </Dialog>
);

export default CreateTeamDialog;

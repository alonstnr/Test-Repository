import { Box, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" py={6} color="text.secondary">
      <InboxIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
      <Typography variant="h6">{message}</Typography>
    </Box>
  );
}

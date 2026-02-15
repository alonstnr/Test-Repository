import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Paper, Box, List, ListItem, ListItemButton,
  ListItemText, Badge, Chip,
} from '@mui/material';
import { messageApi } from '../../api/message.api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function InboxPage() {
  const navigate = useNavigate();
  const [threads, setThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    messageApi.getThreads()
      .then(res => setThreads(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <Container maxWidth="md">
      <Typography variant="h5" gutterBottom fontWeight={600}>הודעות</Typography>

      {threads.length === 0 ? (
        <EmptyState message="אין הודעות" />
      ) : (
        <Paper>
          <List disablePadding>
            {threads.map((thread, index) => (
              <ListItem key={thread.threadId} disablePadding divider={index < threads.length - 1}>
                <ListItemButton onClick={() => navigate(`/messages/${thread.threadId}`)}>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography fontWeight={thread.unreadCount > 0 ? 700 : 400}>
                          {thread.subject}
                        </Typography>
                        {thread.unreadCount > 0 && (
                          <Chip label={thread.unreadCount} size="small" color="primary" />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          {thread.participantName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(thread.lastMessage.createdAt).toLocaleDateString('he-IL')}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Container>
  );
}

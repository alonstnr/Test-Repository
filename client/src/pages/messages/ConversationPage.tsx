import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Paper, Typography, Box, TextField, Button, Divider,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { messageApi } from '../../api/message.api';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function ConversationPage() {
  const { threadId } = useParams<{ threadId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchMessages = () => {
    if (threadId) {
      messageApi.getThread(threadId)
        .then(res => {
          setMessages(res.data.data);
          // Mark unread messages as read
          res.data.data.forEach((msg: any) => {
            if (msg.receiverId === user?.id && !msg.isRead) {
              messageApi.markRead(msg.id).catch(() => {});
            }
          });
        })
        .catch(() => navigate('/messages'))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => { fetchMessages(); }, [threadId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendReply = async () => {
    if (!reply.trim() || !threadId || !messages.length) return;
    setSending(true);
    const otherParticipant = messages[0].senderId === user?.id ? messages[0].receiverId : messages[0].senderId;
    try {
      await messageApi.send({
        receiverId: otherParticipant,
        subject: messages[0].subject,
        body: reply,
        threadId,
      });
      setReply('');
      fetchMessages();
    } catch {
    } finally {
      setSending(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container maxWidth="md">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={600}>
          {messages[0]?.subject || 'שיחה'}
        </Typography>
        <Button variant="text" onClick={() => navigate('/messages')}>חזרה</Button>
      </Box>

      <Paper sx={{ p: 2, maxHeight: '60vh', overflow: 'auto', mb: 2 }}>
        {messages.map((msg) => {
          const isMe = msg.senderId === user?.id;
          return (
            <Box key={msg.id} mb={2}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: isMe ? 'flex-start' : 'flex-end',
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    maxWidth: '70%',
                    bgcolor: isMe ? 'primary.light' : 'grey.100',
                    color: isMe ? 'primary.contrastText' : 'text.primary',
                  }}
                >
                  <Typography variant="caption" display="block" fontWeight={600}>
                    {msg.sender.firstName} {msg.sender.lastName}
                  </Typography>
                  <Typography variant="body1">{msg.body}</Typography>
                  <Typography variant="caption" display="block" textAlign="left" mt={0.5}>
                    {new Date(msg.createdAt).toLocaleString('he-IL')}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          );
        })}
        <div ref={bottomRef} />
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Box display="flex" gap={1}>
          <TextField
            fullWidth
            placeholder="כתוב תגובה..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendReply(); } }}
            multiline
            maxRows={3}
          />
          <Button
            variant="contained"
            onClick={handleSendReply}
            disabled={sending || !reply.trim()}
            sx={{ minWidth: 48 }}
          >
            <SendIcon />
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

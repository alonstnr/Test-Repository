import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container, Paper, Typography, TextField, Button, Box, Alert,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { messageApi } from '../../api/message.api';

export default function ComposeMessagePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toId = searchParams.get('to') || '';
  const toName = searchParams.get('name') || '';

  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toId) {
      setError('נמען לא צוין');
      return;
    }
    setError('');
    setSending(true);
    try {
      await messageApi.send({ receiverId: toId, subject, body });
      navigate('/messages');
    } catch (err: any) {
      setError(err.response?.data?.error || 'שגיאה בשליחת ההודעה');
    } finally {
      setSending(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom fontWeight={600}>הודעה חדשה</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="נמען"
            fullWidth
            value={toName || toId}
            disabled
            sx={{ mb: 2 }}
          />
          <TextField
            label="נושא"
            fullWidth
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="תוכן ההודעה"
            fullWidth
            required
            multiline
            rows={6}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Box display="flex" gap={2}>
            <Button type="submit" variant="contained" startIcon={<SendIcon />} disabled={sending}>
              {sending ? 'שולח...' : 'שלח הודעה'}
            </Button>
            <Button variant="text" onClick={() => navigate(-1)}>ביטול</Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

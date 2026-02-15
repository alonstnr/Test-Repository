import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container, Paper, Typography, TextField, Button, Box, Alert, Divider, Link,
} from '@mui/material';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'שגיאה בהתחברות');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" textAlign="center" gutterBottom fontWeight={600}>
          התחברות
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="אימייל"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="סיסמה"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Button type="submit" variant="contained" fullWidth disabled={loading}>
            {loading ? 'מתחבר...' : 'התחברות'}
          </Button>
        </Box>
        <Divider sx={{ my: 3 }}>או</Divider>
        <GoogleLoginButton />
        <Box textAlign="center" mt={2}>
          <Typography variant="body2">
            אין לך חשבון?{' '}
            <Link component={RouterLink} to="/register">הרשמה</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

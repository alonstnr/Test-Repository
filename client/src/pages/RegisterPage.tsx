import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container, Paper, Typography, TextField, Button, Box, Alert,
  FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Divider, Link,
} from '@mui/material';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'VOLUNTEER' as 'VOLUNTEER' | 'ORGANIZATION',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('הסיסמאות אינן תואמות');
      return;
    }

    if (formData.password.length < 6) {
      setError('סיסמה חייבת להכיל לפחות 6 תווים');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'שגיאה בהרשמה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" textAlign="center" gutterBottom fontWeight={600}>
          הרשמה
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <Box display="flex" gap={2} mb={2}>
            <TextField
              label="שם פרטי"
              fullWidth
              required
              value={formData.firstName}
              onChange={handleChange('firstName')}
            />
            <TextField
              label="שם משפחה"
              fullWidth
              required
              value={formData.lastName}
              onChange={handleChange('lastName')}
            />
          </Box>
          <TextField
            label="אימייל"
            type="email"
            fullWidth
            required
            value={formData.email}
            onChange={handleChange('email')}
            sx={{ mb: 2 }}
          />
          <TextField
            label="טלפון"
            fullWidth
            value={formData.phone}
            onChange={handleChange('phone')}
            sx={{ mb: 2 }}
          />
          <TextField
            label="סיסמה"
            type="password"
            fullWidth
            required
            value={formData.password}
            onChange={handleChange('password')}
            sx={{ mb: 2 }}
          />
          <TextField
            label="אימות סיסמה"
            type="password"
            fullWidth
            required
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            sx={{ mb: 2 }}
          />
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel>סוג משתמש</FormLabel>
            <RadioGroup
              row
              value={formData.role}
              onChange={handleChange('role')}
            >
              <FormControlLabel value="VOLUNTEER" control={<Radio />} label="מתנדב" />
              <FormControlLabel value="ORGANIZATION" control={<Radio />} label="ארגון" />
            </RadioGroup>
          </FormControl>
          <Button type="submit" variant="contained" fullWidth disabled={loading}>
            {loading ? 'נרשם...' : 'הרשמה'}
          </Button>
        </Box>
        <Divider sx={{ my: 3 }}>או</Divider>
        <GoogleLoginButton />
        <Box textAlign="center" mt={2}>
          <Typography variant="body2">
            יש לך חשבון?{' '}
            <Link component={RouterLink} to="/login">התחברות</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, Grid, Paper } from '@mui/material';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Box textAlign="center" py={8}>
        <VolunteerActivismIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          ניהול מתנדבים
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          הפלטפורמה שמחברת בין ארגונים למתנדבים
        </Typography>
        <Box mt={4} display="flex" justifyContent="center" gap={2}>
          <Button variant="contained" size="large" onClick={() => navigate('/register')}>
            הרשמה
          </Button>
          <Button variant="outlined" size="large" onClick={() => navigate('/login')}>
            התחברות
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4} mt={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, textAlign: 'center', height: '100%' }}>
            <BusinessIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>ארגונים</Typography>
            <Typography color="text.secondary">
              צרו פעילויות התנדבות, הגדירו דרישות ונהלו את המתנדבים שלכם
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, textAlign: 'center', height: '100%' }}>
            <VolunteerActivismIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>מתנדבים</Typography>
            <Typography color="text.secondary">
              הגדירו את הפרופיל שלכם, מצאו התנדבויות מתאימות והירשמו בקלות
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, textAlign: 'center', height: '100%' }}>
            <CalendarMonthIcon sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>לוח שנה</Typography>
            <Typography color="text.secondary">
              צפו בכל ההתנדבויות הזמינות בלוח שנה חודשי נוח ומסודר
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

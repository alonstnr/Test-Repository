import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Grid, Paper, Box, Button, Chip,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useAuth } from '../contexts/AuthContext';
import { registrationApi } from '../api/registration.api';
import { organizationApi } from '../api/organization.api';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ registrations: 0, hasOrg: false, orgName: '' });

  useEffect(() => {
    if (user) {
      registrationApi.getMine().then(res => {
        setStats(prev => ({ ...prev, registrations: res.data.data.length }));
      }).catch(() => {});

      if (user.role === 'ORGANIZATION') {
        organizationApi.getMine().then(res => {
          if (res.data.data) {
            setStats(prev => ({ ...prev, hasOrg: true, orgName: res.data.data.name }));
          }
        }).catch(() => {});
      }
    }
  }, [user]);

  if (!user) return null;

  const isOrg = user.role === 'ORGANIZATION';

  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Typography variant="h4" gutterBottom fontWeight={600}>
          {`${user.firstName} ${user.lastName}` + ', '}שלום
        </Typography>
        <Chip
          label={isOrg ? 'משתמש ארגוני' : 'מתנדב'}
          color={isOrg ? 'secondary' : 'primary'}
        />
      </Box>

      <Grid container spacing={3}>
        {isOrg && (
          <>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <BusinessIcon color="primary" fontSize="large" />
                  <Typography variant="h6">הארגון שלי</Typography>
                </Box>
                {stats.hasOrg ? (
                  <>
                    <Typography color="text.secondary" gutterBottom>{stats.orgName}</Typography>
                    <Button variant="outlined" onClick={() => navigate('/organization/profile')}>
                      ערוך פרופיל
                    </Button>
                  </>
                ) : (
                  <Button variant="contained" onClick={() => navigate('/organization/profile')}>
                    יצירת ארגון
                  </Button>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <AddCircleIcon color="success" fontSize="large" />
                  <Typography variant="h6">ניהול פעילויות</Typography>
                </Box>
                <Box display="flex" gap={1}>
                  <Button variant="contained" onClick={() => navigate('/organization/activities/new')}>
                    פעילות חדשה
                  </Button>
                  <Button variant="outlined" onClick={() => navigate('/organization/activities')}>
                    כל הפעילויות
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </>
        )}

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <CalendarMonthIcon color="warning" fontSize="large" />
              <Typography variant="h6">לוח התנדבויות</Typography>
            </Box>
            <Typography color="text.secondary" gutterBottom>
              צפה בהתנדבויות זמינות ברחבי הארץ
            </Typography>
            <Button variant="contained" onClick={() => navigate('/volunteer/calendar')}>
              לוח שנה
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <EventIcon color="info" fontSize="large" />
              <Typography variant="h6">ההרשמות שלי</Typography>
            </Box>
            <Typography color="text.secondary" gutterBottom>
              {stats.registrations} הרשמות פעילות
            </Typography>
            <Button variant="outlined" onClick={() => navigate('/volunteer/registrations')}>
              צפה בהרשמות
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <PersonIcon color="primary" fontSize="large" />
              <Typography variant="h6">פרופיל מתנדב</Typography>
            </Box>
            <Typography color="text.secondary" gutterBottom>
              הגדר את הפרופיל שלך למציאת התנדבויות מתאימות
            </Typography>
            <Button variant="outlined" onClick={() => navigate('/volunteer/profile')}>
              ערוך פרופיל
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

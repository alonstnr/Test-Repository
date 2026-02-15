import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Paper, Typography, Box, Button, Chip, Alert,
  Checkbox, FormControlLabel, Divider, LinearProgress,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import { activityApi } from '../../api/activity.api';
import { registrationApi } from '../../api/registration.api';
import { activityTypeLabels, israelAreaLabels, ActivityType, IsraelArea } from '@volunteer/shared';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function ActivityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activity, setActivity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (id) {
      activityApi.getById(id)
        .then(res => setActivity(res.data.data))
        .catch(() => navigate('/volunteer/calendar'))
        .finally(() => setLoading(false));
    }
  }, [id, navigate]);

  const handleSlotToggle = (slotId: string) => {
    if (activity?.commitmentType === 'ALL_SESSIONS') return;
    setSelectedSlots(prev =>
      prev.includes(slotId) ? prev.filter(s => s !== slotId) : [...prev, slotId]
    );
  };

  const handleSelectAll = () => {
    if (!activity) return;
    const allIds = activity.timeSlots.map((s: any) => s.id);
    setSelectedSlots(allIds);
  };

  const handleRegister = async () => {
    if (!id) return;
    setError('');
    setSuccess('');
    setRegistering(true);

    const slotsToRegister = activity.commitmentType === 'ALL_SESSIONS'
      ? activity.timeSlots.map((s: any) => s.id)
      : selectedSlots;

    try {
      await registrationApi.register({ activityId: id, timeSlotIds: slotsToRegister });
      setSuccess('נרשמת בהצלחה!');
      setSelectedSlots([]);
      // Refresh activity data
      const res = await activityApi.getById(id);
      setActivity(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'שגיאה בהרשמה');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!activity) return null;

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h5" fontWeight={600}>{activity.title}</Typography>
            <Typography color="text.secondary">{activity.organization?.name}</Typography>
          </Box>
          <Chip
            label={activityTypeLabels[activity.type as ActivityType]}
            color="primary"
          />
        </Box>

        <Typography paragraph>{activity.description}</Typography>

        <Box display="flex" gap={3} mb={3} flexWrap="wrap">
          <Box display="flex" alignItems="center" gap={0.5}>
            <LocationOnIcon fontSize="small" color="action" />
            <Typography variant="body2">
              {israelAreaLabels[activity.area as IsraelArea]} - {activity.address}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <GroupIcon fontSize="small" color="action" />
            <Typography variant="body2">
              {activity.minVolunteers} - {activity.maxVolunteers} מתנדבים
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="h6" gutterBottom>
          משבצות זמן
          {activity.commitmentType === 'ALL_SESSIONS' && (
            <Chip label="נדרשת התחייבות לכל המשבצות" size="small" color="warning" sx={{ mr: 1 }} />
          )}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {activity.timeSlots?.map((slot: any) => {
          const count = slot._count?.registrations || 0;
          const isFull = count >= activity.maxVolunteers;
          const progress = (count / activity.maxVolunteers) * 100;

          return (
            <Paper key={slot.id} variant="outlined" sx={{ p: 2, mb: 1 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={2}>
                  {activity.commitmentType !== 'ALL_SESSIONS' && (
                    <Checkbox
                      checked={selectedSlots.includes(slot.id)}
                      onChange={() => handleSlotToggle(slot.id)}
                      disabled={isFull}
                    />
                  )}
                  <Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <AccessTimeIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {new Date(slot.date).toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' })}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {slot.startTime} - {slot.endTime}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" color={isFull ? 'error.main' : 'text.secondary'}>
                    {count}/{activity.maxVolunteers}
                  </Typography>
                  <Box sx={{ width: 80 }}>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(progress, 100)}
                      color={isFull ? 'error' : count < activity.minVolunteers ? 'warning' : 'success'}
                    />
                  </Box>
                </Box>
              </Box>
            </Paper>
          );
        })}

        <Box mt={3} display="flex" gap={2}>
          {activity.commitmentType !== 'ALL_SESSIONS' && (
            <Button variant="outlined" onClick={handleSelectAll}>בחר הכל</Button>
          )}
          <Button
            variant="contained"
            onClick={handleRegister}
            disabled={
              registering ||
              (activity.commitmentType !== 'ALL_SESSIONS' && selectedSlots.length === 0)
            }
          >
            {registering ? 'נרשם...' : activity.commitmentType === 'ALL_SESSIONS' ? 'הרשמה לכל המשבצות' : 'הרשמה למשבצות שנבחרו'}
          </Button>
          <Button variant="text" onClick={() => navigate(-1)}>חזרה</Button>
        </Box>
      </Paper>
    </Container>
  );
}

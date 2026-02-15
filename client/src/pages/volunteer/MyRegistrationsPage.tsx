import { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, Box, Button, Chip, IconButton, Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { registrationApi } from '../../api/registration.api';
import { activityTypeLabels, israelAreaLabels, ActivityType, IsraelArea } from '@volunteer/shared';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export default function MyRegistrationsPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchRegistrations = () => {
    registrationApi.getMine()
      .then(res => setRegistrations(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRegistrations(); }, []);

  const handleCancel = async () => {
    if (!cancelId) return;
    try {
      await registrationApi.cancel(cancelId);
      setRegistrations(prev => prev.filter(r => r.id !== cancelId));
      setCancelId(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'שגיאה בביטול ההרשמה');
      setCancelId(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container maxWidth="md">
      <Typography variant="h5" gutterBottom fontWeight={600}>ההרשמות שלי</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      {registrations.length === 0 ? (
        <EmptyState message="אין הרשמות פעילות" />
      ) : (
        registrations.map((reg) => (
          <Paper key={reg.id} sx={{ p: 2, mb: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {reg.timeSlot?.activity?.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {reg.timeSlot?.activity?.organization?.name}
                </Typography>
                <Box display="flex" gap={2} mt={1} flexWrap="wrap">
                  <Chip
                    label={activityTypeLabels[reg.timeSlot?.activity?.type as ActivityType]}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <LocationOnIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {israelAreaLabels[reg.timeSlot?.activity?.area as IsraelArea]}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <AccessTimeIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {new Date(reg.timeSlot?.date).toLocaleDateString('he-IL')} | {reg.timeSlot?.startTime} - {reg.timeSlot?.endTime}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <IconButton color="error" onClick={() => setCancelId(reg.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Paper>
        ))
      )}

      <ConfirmDialog
        open={!!cancelId}
        title="ביטול הרשמה"
        message="האם אתה בטוח שברצונך לבטל את ההרשמה?"
        onConfirm={handleCancel}
        onCancel={() => setCancelId(null)}
      />
    </Container>
  );
}

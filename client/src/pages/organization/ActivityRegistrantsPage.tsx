import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Paper, Typography, Box, Button, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MailIcon from '@mui/icons-material/Mail';
import { activityApi } from '../../api/activity.api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function ActivityRegistrantsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      activityApi.getRegistrants(id)
        .then(res => setSlots(res.data.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <LoadingSpinner />;

  return (
    <Container maxWidth="md">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={600}>רשימת נרשמים</Typography>
        <Button variant="text" onClick={() => navigate(-1)}>חזרה</Button>
      </Box>

      {slots.map((slot: any) => (
        <Accordion key={slot.id} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography fontWeight={600}>
                {new Date(slot.date).toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' })}
              </Typography>
              <Typography color="text.secondary">
                {slot.startTime} - {slot.endTime}
              </Typography>
              <Chip label={`${slot.registrations.length} נרשמים`} size="small" color="primary" />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {slot.registrations.length === 0 ? (
              <Typography color="text.secondary">אין נרשמים עדיין</Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>שם</TableCell>
                      <TableCell>אימייל</TableCell>
                      <TableCell>טלפון</TableCell>
                      <TableCell>פעולות</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {slot.registrations.map((reg: any) => (
                      <TableRow key={reg.id}>
                        <TableCell>{reg.user.firstName} {reg.user.lastName}</TableCell>
                        <TableCell>{reg.user.email}</TableCell>
                        <TableCell>{reg.user.phone || '-'}</TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            startIcon={<MailIcon />}
                            onClick={() => navigate(`/messages/compose?to=${reg.user.id}&name=${reg.user.firstName} ${reg.user.lastName}`)}
                          >
                            שלח הודעה
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
}

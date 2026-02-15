import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Paper, Box, Button, Chip, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PeopleIcon from '@mui/icons-material/People';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { organizationApi } from '../../api/organization.api';
import { activityApi } from '../../api/activity.api';
import { activityTypeLabels, israelAreaLabels, ActivityType, IsraelArea } from '@volunteer/shared';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export default function ActivityManagementPage() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    organizationApi.getMine().then(res => {
      if (res.data.data?.activities) {
        setActivities(res.data.data.activities);
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await activityApi.deactivate(deleteId);
      setActivities(prev => prev.filter(a => a.id !== deleteId));
      setDeleteId(null);
    } catch {
      setDeleteId(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={600}>ניהול פעילויות</Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          onClick={() => navigate('/organization/activities/new')}
        >
          פעילות חדשה
        </Button>
      </Box>

      {activities.length === 0 ? (
        <EmptyState message="אין פעילויות עדיין" />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>כותרת</TableCell>
                <TableCell>סוג</TableCell>
                <TableCell>אזור</TableCell>
                <TableCell>מתנדבים</TableCell>
                <TableCell>פעולות</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>{activity.title}</TableCell>
                  <TableCell>
                    <Chip label={activityTypeLabels[activity.type as ActivityType]} size="small" />
                  </TableCell>
                  <TableCell>{israelAreaLabels[activity.area as IsraelArea]}</TableCell>
                  <TableCell>{activity.minVolunteers}-{activity.maxVolunteers}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => navigate(`/volunteer/activities/${activity.id}`)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => navigate(`/organization/activities/${activity.id}/registrants`)}>
                      <PeopleIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => setDeleteId(activity.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="השבתת פעילות"
        message="האם אתה בטוח שברצונך להשבית את הפעילות?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </Container>
  );
}

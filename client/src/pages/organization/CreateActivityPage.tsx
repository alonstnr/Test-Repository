import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Paper, Typography, TextField, Button, Box, Alert,
  FormControl, InputLabel, Select, MenuItem, IconButton,
  RadioGroup, FormControlLabel, Radio, FormLabel,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { activityApi } from '../../api/activity.api';
import { ActivityType, activityTypeLabels, IsraelArea, israelAreaLabels } from '@volunteer/shared';

interface TimeSlotInput {
  date: string;
  startTime: string;
  endTime: string;
}

export default function CreateActivityPage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '' as string,
    area: '' as string,
    address: '',
    minVolunteers: 1,
    maxVolunteers: 10,
    commitmentType: 'PICK_SPECIFIC' as 'ALL_SESSIONS' | 'PICK_SPECIFIC',
  });
  const [timeSlots, setTimeSlots] = useState<TimeSlotInput[]>([
    { date: '', startTime: '08:00', endTime: '12:00' },
  ]);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSlotChange = (index: number, field: keyof TimeSlotInput, value: string) => {
    setTimeSlots(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addTimeSlot = () => {
    setTimeSlots(prev => [...prev, { date: '', startTime: '08:00', endTime: '12:00' }]);
  };

  const removeTimeSlot = (index: number) => {
    setTimeSlots(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await activityApi.create({
        ...formData,
        minVolunteers: Number(formData.minVolunteers),
        maxVolunteers: Number(formData.maxVolunteers),
        timeSlots,
      });
      navigate('/organization/activities');
    } catch (err: any) {
      setError(err.response?.data?.error || 'שגיאה ביצירת הפעילות');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom fontWeight={600}>יצירת פעילות חדשה</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="כותרת"
            fullWidth required
            value={formData.title}
            onChange={handleChange('title')}
            sx={{ mb: 2 }}
          />
          <TextField
            label="תיאור"
            fullWidth required multiline rows={3}
            value={formData.description}
            onChange={handleChange('description')}
            sx={{ mb: 2 }}
          />
          <Box display="flex" gap={2} mb={2}>
            <FormControl fullWidth>
              <InputLabel>סוג פעילות</InputLabel>
              <Select
                value={formData.type}
                label="סוג פעילות"
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              >
                {Object.entries(activityTypeLabels).map(([k, v]) => (
                  <MenuItem key={k} value={k}>{v}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>אזור</InputLabel>
              <Select
                value={formData.area}
                label="אזור"
                onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
              >
                {Object.entries(israelAreaLabels).map(([k, v]) => (
                  <MenuItem key={k} value={k}>{v}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <TextField
            label="כתובת"
            fullWidth required
            value={formData.address}
            onChange={handleChange('address')}
            sx={{ mb: 2 }}
          />
          <Box display="flex" gap={2} mb={2}>
            <TextField
              label="מינימום מתנדבים"
              type="number" fullWidth
              value={formData.minVolunteers}
              onChange={handleChange('minVolunteers')}
              inputProps={{ min: 1 }}
            />
            <TextField
              label="מקסימום מתנדבים"
              type="number" fullWidth
              value={formData.maxVolunteers}
              onChange={handleChange('maxVolunteers')}
              inputProps={{ min: 1 }}
            />
          </Box>

          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel>סוג התחייבות</FormLabel>
            <RadioGroup
              row
              value={formData.commitmentType}
              onChange={handleChange('commitmentType')}
            >
              <FormControlLabel value="PICK_SPECIFIC" control={<Radio />} label="ניתן לבחור משבצות ספציפיות" />
              <FormControlLabel value="ALL_SESSIONS" control={<Radio />} label="חובה להתחייב לכל המשבצות" />
            </RadioGroup>
          </FormControl>

          <Typography variant="h6" gutterBottom>משבצות זמן</Typography>
          {timeSlots.map((slot, index) => (
            <Box key={index} display="flex" gap={2} mb={1} alignItems="center">
              <TextField
                label="תאריך"
                type="date"
                value={slot.date}
                onChange={(e) => handleSlotChange(index, 'date', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                label="שעת התחלה"
                type="time"
                value={slot.startTime}
                onChange={(e) => handleSlotChange(index, 'startTime', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                label="שעת סיום"
                type="time"
                value={slot.endTime}
                onChange={(e) => handleSlotChange(index, 'endTime', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
              <IconButton color="error" onClick={() => removeTimeSlot(index)} disabled={timeSlots.length === 1}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button startIcon={<AddCircleIcon />} onClick={addTimeSlot} sx={{ mb: 3 }}>
            הוסף משבצת זמן
          </Button>

          <Box display="flex" gap={2}>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? 'יוצר...' : 'צור פעילות'}
            </Button>
            <Button variant="text" onClick={() => navigate(-1)}>ביטול</Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

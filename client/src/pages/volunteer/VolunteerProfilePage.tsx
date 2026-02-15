import { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, TextField, Button, Box, Alert,
  FormControl, InputLabel, Select, MenuItem, Slider, Chip, OutlinedInput,
  Checkbox, ListItemText, SelectChangeEvent,
} from '@mui/material';
import { userApi } from '../../api/user.api';
import { IsraelArea, israelAreaLabels, ActivityType, activityTypeLabels, DayOfWeek, dayOfWeekLabels } from '@volunteer/shared';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function VolunteerProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    area: '' as string,
    radiusKm: 30,
    preferredTypes: [] as string[],
    availableDays: [] as string[],
    availableStartHour: 8,
    availableEndHour: 18,
    bio: '',
  });

  useEffect(() => {
    userApi.getVolunteerProfile().then(res => {
      if (res.data.data) {
        setFormData({
          area: res.data.data.area || '',
          radiusKm: res.data.data.radiusKm || 30,
          preferredTypes: res.data.data.preferredTypes || [],
          availableDays: res.data.data.availableDays || [],
          availableStartHour: res.data.data.availableStartHour ?? 8,
          availableEndHour: res.data.data.availableEndHour ?? 18,
          bio: res.data.data.bio || '',
        });
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      await userApi.upsertVolunteerProfile(formData);
      setSuccess('הפרופיל נשמר בהצלחה');
    } catch (err: any) {
      setError(err.response?.data?.error || 'שגיאה בשמירת הפרופיל');
    } finally {
      setSaving(false);
    }
  };

  const handleMultiSelect = (field: string) => (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: typeof value === 'string' ? value.split(',') : value }));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom fontWeight={600}>פרופיל מתנדב</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>אזור</InputLabel>
            <Select
              value={formData.area}
              label="אזור"
              onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
            >
              {Object.entries(israelAreaLabels).map(([key, label]) => (
                <MenuItem key={key} value={key}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box mb={3}>
            <Typography gutterBottom>רדיוס (ק"מ): {formData.radiusKm}</Typography>
            <Slider
              value={formData.radiusKm}
              onChange={(_, v) => setFormData(prev => ({ ...prev, radiusKm: v as number }))}
              min={5}
              max={200}
              step={5}
              valueLabelDisplay="auto"
            />
          </Box>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>סוגי התנדבות מועדפים</InputLabel>
            <Select
              multiple
              value={formData.preferredTypes}
              onChange={handleMultiSelect('preferredTypes')}
              input={<OutlinedInput label="סוגי התנדבות מועדפים" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={activityTypeLabels[value as ActivityType]} size="small" />
                  ))}
                </Box>
              )}
            >
              {Object.entries(activityTypeLabels).map(([key, label]) => (
                <MenuItem key={key} value={key}>
                  <Checkbox checked={formData.preferredTypes.includes(key)} />
                  <ListItemText primary={label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>ימים זמינים</InputLabel>
            <Select
              multiple
              value={formData.availableDays}
              onChange={handleMultiSelect('availableDays')}
              input={<OutlinedInput label="ימים זמינים" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={dayOfWeekLabels[value as DayOfWeek]} size="small" />
                  ))}
                </Box>
              )}
            >
              {Object.entries(dayOfWeekLabels).map(([key, label]) => (
                <MenuItem key={key} value={key}>
                  <Checkbox checked={formData.availableDays.includes(key)} />
                  <ListItemText primary={label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box display="flex" gap={2} mb={2}>
            <TextField
              label="שעת התחלה"
              type="number"
              fullWidth
              value={formData.availableStartHour}
              onChange={(e) => setFormData(prev => ({ ...prev, availableStartHour: parseInt(e.target.value) }))}
              inputProps={{ min: 0, max: 23 }}
            />
            <TextField
              label="שעת סיום"
              type="number"
              fullWidth
              value={formData.availableEndHour}
              onChange={(e) => setFormData(prev => ({ ...prev, availableEndHour: parseInt(e.target.value) }))}
              inputProps={{ min: 0, max: 23 }}
            />
          </Box>

          <TextField
            label="קצת על עצמי"
            fullWidth
            multiline
            rows={3}
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            sx={{ mb: 3 }}
          />

          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? 'שומר...' : 'שמור פרופיל'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

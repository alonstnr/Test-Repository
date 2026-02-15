import { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, TextField, Button, Box, Alert,
  FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import { organizationApi } from '../../api/organization.api';
import { IsraelArea, israelAreaLabels } from '@volunteer/shared';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function OrganizationProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [orgId, setOrgId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    area: '' as string,
    address: '',
  });

  useEffect(() => {
    organizationApi.getMine().then(res => {
      if (res.data.data) {
        const org = res.data.data;
        setOrgId(org.id);
        setFormData({
          name: org.name || '',
          description: org.description || '',
          contactEmail: org.contactEmail || '',
          contactPhone: org.contactPhone || '',
          website: org.website || '',
          area: org.area || '',
          address: org.address || '',
        });
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      if (orgId) {
        await organizationApi.update(orgId, formData);
      } else {
        const res = await organizationApi.create(formData);
        setOrgId(res.data.data.id);
      }
      setSuccess('הארגון נשמר בהצלחה');
    } catch (err: any) {
      setError(err.response?.data?.error || 'שגיאה בשמירה');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom fontWeight={600}>
          {orgId ? 'עריכת ארגון' : 'יצירת ארגון'}
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="שם הארגון"
            fullWidth required
            value={formData.name}
            onChange={handleChange('name')}
            sx={{ mb: 2 }}
          />
          <TextField
            label="תיאור הארגון"
            fullWidth required multiline rows={4}
            value={formData.description}
            onChange={handleChange('description')}
            sx={{ mb: 2 }}
          />
          <Box display="flex" gap={2} mb={2}>
            <TextField
              label="אימייל ליצירת קשר"
              type="email" fullWidth required
              value={formData.contactEmail}
              onChange={handleChange('contactEmail')}
            />
            <TextField
              label="טלפון"
              fullWidth
              value={formData.contactPhone}
              onChange={handleChange('contactPhone')}
            />
          </Box>
          <TextField
            label="אתר אינטרנט"
            fullWidth
            value={formData.website}
            onChange={handleChange('website')}
            sx={{ mb: 2 }}
          />
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
          <TextField
            label="כתובת"
            fullWidth
            value={formData.address}
            onChange={handleChange('address')}
            sx={{ mb: 3 }}
          />
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? 'שומר...' : 'שמור'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

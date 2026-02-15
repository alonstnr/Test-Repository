import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, IconButton, Paper, Chip, Grid,
  FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { activityApi } from '../../api/activity.api';
import { activityTypeLabels, israelAreaLabels, ActivityType, IsraelArea } from '@volunteer/shared';
import type { CalendarDay, CalendarEvent } from '@volunteer/shared';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const HEBREW_DAYS = ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", 'ש'];

function getMonthName(year: number, month: number) {
  return new Intl.DateTimeFormat('he-IL', { month: 'long', year: 'numeric' }).format(new Date(year, month - 1));
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month - 1, 1).getDay();
}

function getCapacityColor(status: string) {
  switch (status) {
    case 'full': return 'error';
    case 'low': return 'warning';
    default: return 'success';
  }
}

export default function VolunteerCalendarPage() {
  const navigate = useNavigate();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [calendarData, setCalendarData] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filterArea, setFilterArea] = useState('');

  useEffect(() => {
    setLoading(true);
    activityApi.getCalendar(month, year)
      .then(res => setCalendarData(res.data.data))
      .catch(() => setCalendarData([]))
      .finally(() => setLoading(false));
  }, [month, year]);

  const handlePrevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };

  const handleNextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const eventsByDate = new Map<string, CalendarEvent[]>();
  for (const day of calendarData) {
    let events = day.events;
    if (filterType) events = events.filter(e => e.activityType === filterType);
    if (filterArea) events = events.filter(e => e.area === filterArea);
    if (events.length > 0) eventsByDate.set(day.date, events);
  }

  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);
  while (calendarCells.length % 7 !== 0) calendarCells.push(null);

  return (
    <Container maxWidth="lg">
      <Typography variant="h5" gutterBottom fontWeight={600}>לוח התנדבויות</Typography>

      <Box display="flex" gap={2} mb={2} flexWrap="wrap">
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>סוג פעילות</InputLabel>
          <Select value={filterType} label="סוג פעילות" onChange={(e) => setFilterType(e.target.value)}>
            <MenuItem value="">הכל</MenuItem>
            {Object.entries(activityTypeLabels).map(([k, v]) => (
              <MenuItem key={k} value={k}>{v}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>אזור</InputLabel>
          <Select value={filterArea} label="אזור" onChange={(e) => setFilterArea(e.target.value)}>
            <MenuItem value="">הכל</MenuItem>
            {Object.entries(israelAreaLabels).map(([k, v]) => (
              <MenuItem key={k} value={k}>{v}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
          <IconButton onClick={handleNextMonth}><ChevronRightIcon /></IconButton>
          <Typography variant="h6" sx={{ mx: 2, minWidth: 180, textAlign: 'center' }}>
            {getMonthName(year, month)}
          </Typography>
          <IconButton onClick={handlePrevMonth}><ChevronLeftIcon /></IconButton>
        </Box>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <Grid container columns={7} sx={{ borderBottom: 1, borderColor: 'divider', mb: 1 }}>
              {HEBREW_DAYS.map((day) => (
                <Grid item xs={1} key={day}>
                  <Typography variant="subtitle2" textAlign="center" fontWeight={600} py={1}>
                    {day}
                  </Typography>
                </Grid>
              ))}
            </Grid>

            <Grid container columns={7}>
              {calendarCells.map((day, idx) => {
                const dateStr = day ? `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}` : '';
                const events = day ? (eventsByDate.get(dateStr) || []) : [];
                const isToday = day === now.getDate() && month === now.getMonth() + 1 && year === now.getFullYear();

                return (
                  <Grid
                    item
                    xs={1}
                    key={idx}
                    sx={{
                      minHeight: 100,
                      border: 1,
                      borderColor: 'divider',
                      p: 0.5,
                      bgcolor: isToday ? 'action.hover' : day ? 'background.paper' : 'grey.50',
                    }}
                  >
                    {day && (
                      <>
                        <Typography
                          variant="body2"
                          fontWeight={isToday ? 700 : 400}
                          color={isToday ? 'primary.main' : 'text.primary'}
                        >
                          {day}
                        </Typography>
                        <Box>
                          {events.slice(0, 3).map((event) => (
                            <Chip
                              key={event.timeSlotId}
                              label={
                                <Box display="flex" alignItems="center" gap={0.5}>
                                  {event.isUserRegistered && <CheckCircleIcon sx={{ fontSize: 12 }} />}
                                  <span>{event.activityTitle}</span>
                                </Box>
                              }
                              size="small"
                              color={getCapacityColor(event.capacityStatus) as any}
                              variant={event.isUserRegistered ? 'filled' : 'outlined'}
                              onClick={() => navigate(`/volunteer/activities/${event.activityId}`)}
                              sx={{
                                width: '100%',
                                justifyContent: 'flex-start',
                                mb: 0.25,
                                fontSize: '0.7rem',
                                height: 22,
                                cursor: 'pointer',
                              }}
                            />
                          ))}
                          {events.length > 3 && (
                            <Typography variant="caption" color="text.secondary">
                              +{events.length - 3} נוספים
                            </Typography>
                          )}
                        </Box>
                      </>
                    )}
                  </Grid>
                );
              })}
            </Grid>
          </>
        )}

        <Box display="flex" gap={2} mt={2} justifyContent="center">
          <Chip label="זמין" color="success" size="small" variant="outlined" />
          <Chip label="מתחת למינימום" color="warning" size="small" variant="outlined" />
          <Chip label="מלא" color="error" size="small" variant="outlined" />
          <Chip label="רשום" color="success" size="small" />
        </Box>
      </Paper>
    </Container>
  );
}

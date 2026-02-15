import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Toolbar, Divider, Box,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import EventIcon from '@mui/icons-material/Event';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import MailIcon from '@mui/icons-material/Mail';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useAuth } from '../../contexts/AuthContext';

const DRAWER_WIDTH = 240;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const isOrg = user.role === 'ORGANIZATION';

  const menuItems = [
    { label: 'לוח בקרה', icon: <DashboardIcon />, path: '/dashboard' },
    ...(isOrg
      ? [
          { label: 'פרופיל ארגון', icon: <BusinessIcon />, path: '/organization/profile' },
          { label: 'ניהול פעילויות', icon: <EventIcon />, path: '/organization/activities' },
          { label: 'יצירת פעילות', icon: <AddCircleIcon />, path: '/organization/activities/new' },
        ]
      : []),
    { label: 'פרופיל מתנדב', icon: <PersonIcon />, path: '/volunteer/profile' },
    { label: 'לוח התנדבויות', icon: <CalendarMonthIcon />, path: '/volunteer/calendar' },
    { label: 'ההרשמות שלי', icon: <HowToRegIcon />, path: '/volunteer/registrations' },
    { label: 'הודעות', icon: <MailIcon />, path: '/messages' },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      anchor="right"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

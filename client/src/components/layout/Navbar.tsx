import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, IconButton, Badge, Box, Menu, MenuItem,
  Avatar, Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MailIcon from '@mui/icons-material/Mail';
import { useAuth } from '../../contexts/AuthContext';
import { messageApi } from '../../api/message.api';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    if (user) {
      messageApi.getUnreadCount().then(res => setUnreadCount(res.data.data.count)).catch(() => {});
      const interval = setInterval(() => {
        messageApi.getUnreadCount().then(res => setUnreadCount(res.data.data.count)).catch(() => {});
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        {user && (
          <IconButton color="inherit" edge="start" onClick={onMenuClick} sx={{ ml: 1 }}>
            <MenuIcon />
          </IconButton>
        )}
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          ניהול מתנדבים
        </Typography>
        {user ? (
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton color="inherit" onClick={() => navigate('/messages')}>
              <Badge badgeContent={unreadCount} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                {user.firstName[0]}
              </Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
              <MenuItem disabled>
                <Typography variant="body2">{user.firstName} {user.lastName}</Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => { setAnchorEl(null); navigate('/dashboard'); }}>לוח בקרה</MenuItem>
              <MenuItem onClick={() => { setAnchorEl(null); handleLogout(); }}>התנתקות</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box display="flex" gap={1}>
            <Button color="inherit" onClick={() => navigate('/login')}>התחברות</Button>
            <Button color="inherit" variant="outlined" onClick={() => navigate('/register')}>הרשמה</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

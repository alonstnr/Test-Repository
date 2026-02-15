import { Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

export default function GoogleLoginButton() {
  const handleClick = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <Button
      variant="outlined"
      fullWidth
      startIcon={<GoogleIcon />}
      onClick={handleClick}
      sx={{ mt: 1 }}
    >
      התחברות עם Google
    </Button>
  );
}

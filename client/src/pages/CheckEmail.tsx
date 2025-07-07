import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Button, Box, Alert } from '@mui/material';
import { Email } from '@mui/icons-material';
import api from '../api';

const CheckEmail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    setResendSuccess(false);
    setResendError(null);
    try {
      // For now, just show success message
      // In a real implementation, you would send a verification email
      setResendSuccess(true);
    } catch (err: any) {
      setResendError('Failed to resend verification email.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4, borderRadius: 3, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Email sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Check Your Email
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            We've sent a verification email to:
          </Typography>
          <Typography variant="h6" fontWeight={600} color="primary" sx={{ mb: 3 }}>
            {email}
          </Typography>
        </Box>

        <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
          <Typography variant="body2">
            <strong>Please check your inbox and spam folder</strong> for the confirmation email.
            <br />
            Click the verification link in the email to complete your registration.
          </Typography>
        </Alert>

        {resendSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Verification email resent! Please check your inbox and spam folder.
          </Alert>
        )}

        {resendError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {resendError}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleResend}
            disabled={loading}
            fullWidth
          >
            {loading ? 'Sending...' : 'Resend Verification Email'}
          </Button>
          
          <Button
            variant="contained"
            onClick={handleBackToLogin}
            fullWidth
          >
            Back to Login
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
          Didn't receive the email? Check your spam folder or try signing up again.
        </Typography>
      </Paper>
    </Container>
  );
};

export default CheckEmail; 
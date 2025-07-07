import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, IconButton, Chip } from '@mui/material';
import { Close as CloseIcon, Campaign as CampaignIcon } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { useAd } from '../contexts/AdContext';

interface AdBannerProps {
  onClose?: () => void;
}

const AdBanner: React.FC<AdBannerProps> = ({ onClose }) => {
  const [currentAd, setCurrentAd] = useState(0);
  const location = useLocation();
  const { isAdVisible, setIsAdVisible } = useAd();

  // English ads data
  const ads = [
    {
      id: 1,
      title: "🍕 Italian Pizza Restaurant",
      description: "Get 20% off on all authentic Italian pizzas!",
      cta: "Order Now",
      color: "#ff6b6b",
      bgColor: "#fff5f5"
    },
    {
      id: 2,
      title: "🍔 Tasty Burger",
      description: "Fresh burger with fries & drink - Only 15 SAR!",
      cta: "Order Now",
      color: "#4ecdc4",
      bgColor: "#f0fffd"
    },
    {
      id: 3,
      title: "🥗 Healthy Salad",
      description: "Fresh salad with grilled chicken - Perfect for your diet!",
      cta: "Order Now",
      color: "#45b7d1",
      bgColor: "#f0f8ff"
    },
    {
      id: 4,
      title: "🍰 Homemade Desserts",
      description: "Fresh homemade desserts - Pre-order now!",
      cta: "Order Now",
      color: "#96ceb4",
      bgColor: "#f0fff4"
    },
    {
      id: 5,
      title: "☕ Arabic Coffee",
      description: "Authentic Arabic coffee with dates - A unique experience!",
      cta: "Order Now",
      color: "#d4a574",
      bgColor: "#fffaf0"
    }
  ];

  useEffect(() => {
    // Don't show ads on login page
    if (location.pathname === '/login') {
      return;
    }

    // Show ad after 5 seconds
    const timer = setTimeout(() => {
      setIsAdVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [location.pathname, setIsAdVisible]);

  useEffect(() => {
    if (!isAdVisible) return;

    // Rotate ads every 8 seconds
    const adTimer = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ads.length);
    }, 8000);

    return () => clearInterval(adTimer);
  }, [isAdVisible, ads.length]);

  const handleClose = () => {
    setIsAdVisible(false);
    onClose?.();
    // Show ad again after 30 seconds
    setTimeout(() => {
      if (location.pathname !== '/login') {
        setIsAdVisible(true);
      }
    }, 30000);
  };

  const handleAdClick = () => {
    // Example: Open a new window with the ad URL
    // window.open('https://example.com', '_blank');
    // For now, just show a success message
    alert(`Ad clicked: ${ads[currentAd].title}`);
  };

  if (!isAdVisible || location.pathname === '/login') {
    return null;
  }

  const currentAdData = ads[currentAd];

  return (
    <Box
      sx={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        width: '280px',
        zIndex: 1000,
        animation: 'slideInLeft 0.5s ease-out',
        '@keyframes slideInLeft': {
          '0%': {
            transform: 'translateX(-100%)',
          },
          '100%': {
            transform: 'translateX(0)',
          },
        },
      }}
    >
      <Paper
        elevation={8}
        sx={{
          height: '100%',
          borderRadius: 0,
          borderRight: '3px solid',
          borderColor: currentAdData.color,
          background: `linear-gradient(135deg, ${currentAdData.bgColor} 0%, #ffffff 100%)`,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Close button */}
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
            bgcolor: 'rgba(255,255,255,0.8)',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.9)',
            },
          }}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        {/* Ad content */}
        <Box
          sx={{
            p: 3,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          {/* Ad indicator */}
          <Chip
            icon={<CampaignIcon />}
            label="Ad"
            size="small"
            sx={{
              mb: 2,
              bgcolor: currentAdData.color,
              color: 'white',
              fontWeight: 'bold',
            }}
          />

          {/* Ad title */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: currentAdData.color,
              fontSize: '1.1rem',
            }}
          >
            {currentAdData.title}
          </Typography>

          {/* Ad description */}
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: 'text.secondary',
              lineHeight: 1.6,
              fontSize: '0.9rem',
            }}
          >
            {currentAdData.description}
          </Typography>

          {/* Call to action button */}
          <Box
            onClick={handleAdClick}
            sx={{
              bgcolor: currentAdData.color,
              color: 'white',
              px: 3,
              py: 1.5,
              borderRadius: 2,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 3,
              },
              userSelect: 'none',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                transition: 'left 0.5s',
              },
              '&:hover::before': {
                left: '100%',
              },
            }}
          >
            {currentAdData.cta}
          </Box>
        </Box>

        {/* Ad counter */}
        <Box
          sx={{
            p: 2,
            textAlign: 'center',
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Ad {currentAd + 1} of {ads.length}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdBanner; 
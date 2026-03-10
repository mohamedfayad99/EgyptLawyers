import { Fab, Zoom, useScrollTrigger } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function ScrollToTop() {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Zoom in={trigger}>
      <Fab
        onClick={handleClick}
        size="medium"
        aria-label="scroll back to top"
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          bgcolor: 'var(--color-primary)',
          color: 'white',
          '&:hover': {
            bgcolor: 'var(--color-primary-dark, var(--color-primary))',
            transform: 'translateY(-4px)',
          },
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          zIndex: 1000,
        }}
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </Zoom>
  );
}

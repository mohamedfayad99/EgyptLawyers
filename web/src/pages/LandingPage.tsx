import { Box, Button, Container, Stack, Typography } from '@mui/material'

export default function LandingPage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
      <Container maxWidth="md" sx={{ py: 10 }}>
        <Stack spacing={3} alignItems="flex-start">
          <Typography variant="h3" fontWeight={800}>
            Egyptian Lawyers Network
          </Typography>
          <Typography variant="h6" color="text.secondary">
            A verified network for fast lawyer-to-lawyer assistance across Egypt — matched by city and court.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button variant="contained" size="large" href="#download">
              Download the app
            </Button>
            <Button variant="outlined" size="large" href="/admin">
              Admin dashboard
            </Button>
          </Stack>

          <Box sx={{ pt: 6, width: '100%' }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              How it works (MVP)
            </Typography>
            <Stack spacing={1.2}>
              <Typography>1) Lawyer registers with syndicate card + WhatsApp</Typography>
              <Typography>2) Admin verifies and approves the account</Typography>
              <Typography>3) Lawyer posts a request selecting a court</Typography>
              <Typography>4) Lawyers in the same city get notified</Typography>
              <Typography>5) Replies + attachments → contact via WhatsApp</Typography>
            </Stack>
          </Box>

          <Box id="download" sx={{ pt: 6, width: '100%' }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Download
            </Typography>
            <Typography color="text.secondary">
              iOS/Android store links will be added when the mobile app is published.
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}


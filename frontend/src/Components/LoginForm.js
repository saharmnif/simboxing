import React, { useState } from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Checkbox from '@mui/joy/Checkbox';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/auth/login', { email, password });
      const token = response.data.token;
      localStorage.setItem('token', token);

      // si les données de l'utilisateur sont présentes dans la réponse
      if (response.data.user) {
        // Obtenir le rôle de l'utilisateur depuis la réponse
        const role = response.data.user.role;

        // Effectuer le routage en fonction du rôle de l'utilisateur
        switch (role) {
          case 'Admin':
            navigate('/dashboardadmin');
            break;
          case 'Analyste operationnel':
            navigate('/dashboardoperationnel');
            break;
          case 'Analyste business':
            navigate('/dashboardbusiness');
            break;
          default:
            // Redirection par défaut si le rôle de l'utilisateur ne correspond à aucun cas
            navigate('/');
            break;
        }
      } else {
        // Si les données de l'utilisateur ne sont pas présentes, affichez une erreur
        setError('Données utilisateur manquantes');
      }
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl required>
        <FormLabel>Email</FormLabel>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      </FormControl>
      <FormControl required>
        <FormLabel>Password</FormLabel>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      </FormControl>
      <Stack gap={4} sx={{ mt: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Checkbox size="sm" label="Remember me" />
          <Link variant="subtitle2" href="#replace-with-a-link">
            Forgot your password?
          </Link>
        </Box>
        <Button type="submit" fullWidth>
          Sign in
        </Button>
      </Stack>
    </form>
  );
}

export default function MyTemplate() {
  const imageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSK4tMLGOq0iqmggvQWfmLncAu1kA_M836uKzXppbYsxA&s';

  return (
    <CssVarsProvider>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ':root': {
            '--Collapsed-breakpoint': '769px',
            '--Cover-width': '50vw',
            '--Form-maxWidth': '800px',
          },
        }}
      />
      <Box
        sx={(theme) => ({
          width:
            'clamp(100vw - var(--Cover-width), (var(--Collapsed-breakpoint) - 100vw) * 999, 100vw)',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255 255 255 / 0.2)',
        })}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100dvh',
            width:
              'clamp(var(--Form-maxWidth), (var(--Collapsed-breakpoint) - 100vw) * 999, 100%)',
            maxWidth: '100%',
            px: 2,
          }}
        >
          <Box
            component="header"
            sx={{
              py: 3,
              display: 'flex',
              alignItems: 'left',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
              <img src={imageUrl} sx={{ width: '5%', height: '10%' }} />
            </Box>
            {/* MyFunction */}
          </Box>
          <Box
            component="main"
            sx={{
              my: 'auto',
              py: 2,
              pb: 5,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: 400,
              maxWidth: '100%',
              mx: 'auto',
              borderRadius: 'sm',
              '& form': {
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              },
            }}
          >
            <Stack gap={4} sx={{ mt: 0.5 }}>
              <LoginForm />
            </Stack>
          </Box>
          <Box component="footer" sx={{ py: 3 }}>
            <Typography level="body-xs" textAlign="center">
              © Direction Revenue Assurance et Fraude {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={(theme) => ({
          height: '100%',
          width: '50%',
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          left: 'clamp(0px, (100vw - var(--Collapsed-breakpoint)) * 999, 100vw - var(--Cover-width))',
          backgroundColor: 'background.level1',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage:
            'url(https://images.pexels.com/photos/5935791/pexels-photo-5935791.jpeg?fbclid=IwAR1p90v7FRq9lF4-L2zHVHRsxnyZpg7giDG8yUMi0o25p5Tzn6Hrc0_34es)',
        })}
      />
    </CssVarsProvider>
  );
}



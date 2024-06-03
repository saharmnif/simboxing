import React, { useContext } from "react";
import { Box, IconButton, Button, useTheme } from "@mui/material";
import { ColorModeContext, tokens } from "../../Theme";
import { useNavigate } from "react-router-dom";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const greenColor = colors.greenAccent[500];

  const handleLogout = async () => {
    try {
      const response = await fetch('/auth/logout', {
        method: 'POST',
        credentials: 'include', // inclure les cookies 
      });
      if (response.status === 200) {
        // Supprimer le token JWT côté client
        localStorage.removeItem('token');
        // Rediriger vers la page de connexion ou une autre page après la déconnexion
        navigate('/'); // Rediriger vers la page de connexion
      } else {
        // Gérer l'erreur de déconnexion
        console.error('Erreur lors de la déconnexion');
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion : ', error);
    }
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
      </Box>

      {/* Logout Button */}
      <Button variant="contained" style={{ backgroundColor: greenColor }} onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
};

export default Topbar;

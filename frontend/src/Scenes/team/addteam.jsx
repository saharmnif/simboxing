import React, { useState } from 'react';
import axios from 'axios';
import { Box, useTheme, Button, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { tokens } from "../../Theme";
import Header from "../../Components/Header";
import { useNavigate } from 'react-router-dom';

function Addteam() {
  const [newUser, setNewUser] = useState({
    firstname: '',
    lastname: '',
    email: '',
    post: '',
    password: ''
  });

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/users/postuser', newUser);
      console.log('Nouvel utilisateur ajouté:', response.data);
      // Réinitialiser le formulaire après l'ajout d'utilisateur réussi
      setNewUser({
        firstname: '',
        lastname: '',
        email: '',
        role: ''
      });
      // Redirection vers la liste team 
      navigate('/dashboardadmin/team');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
    }
  };

  return (
    <Box m="20px">
      <Header title="Add Member" subtitle="Add a new member to the team" />
      <Box mt="20px">
        {/* Formulaire pour saisir les informations de l'utilisateur */}
        <TextField
          name="firstname"
          label="First Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={newUser.firstname}
          onChange={handleChange}
        />
        <TextField
          name="lastname"
          label="Last Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={newUser.lastname}
          onChange={handleChange}
        />
        <TextField
          name="email"
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={newUser.email}
          onChange={handleChange}
        />
        {/* Utilisation de Select pour afficher une liste déroulante */}
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel id="post-label">Post</InputLabel>
          <Select
            labelId="post-label"
            id="post"
            name="post"
            value={newUser.post}
            onChange={handleChange}
            label="Post"
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Analyste business">Analyste business</MenuItem>
            <MenuItem value="Analyste operationnel">Analyste opérationnel</MenuItem>
          </Select>
        </FormControl>
        
        {/* Bouton pour soumettre le formulaire */}
        <Button variant="contained" color="primary" onClick={handleSubmit} >
          Add Member
        </Button>
      </Box>
    </Box>
  );
}

export default Addteam;

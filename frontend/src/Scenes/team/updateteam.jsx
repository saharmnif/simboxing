import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, TextField, Button } from "@mui/material";
import Header from "../../Components/Header";

function Updateteam() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstname: '',
    lastname: '',
    email: '',
    post: '',
    password:''
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/users/getuser/${userId}`);
        setUser(response.data); 
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`/users/postuser/${userId}`, user); 
      console.log('Utilisateur mis à jour avec succès');
      // redirection vers la liste team 
      navigate('/dashboardadmin/team');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    
    }
  };

  return (
    <Box m="20px">
      <Header title="Update User" />
      <Box mt="20px">
        <TextField
          name="firstname"
          label="First Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={user.firstname}
          onChange={handleChange}
        />
        <TextField
          name="lastname"
          label="Last Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={user.lastname}
          onChange={handleChange}
        />
        <TextField
          name="email"
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={user.email}
          onChange={handleChange}
        />
        <TextField
          name="post"
          label="Post"
          variant="outlined"
          fullWidth
          margin="normal"
          value={user.role}
          onChange={handleChange}
        />
         
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Update
        </Button>
      </Box>
    </Box>
  );
}

export default Updateteam;

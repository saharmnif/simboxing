import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../Theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import Header from "../../Components/Header";

function Team() {
  const [users, setUsers] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/users/getuser');
        console.log('Response:', response);
        
        const usersWithIds = response.data.reverse().map((user, index) => ({
          ...user,
          id: index + 1 
        }));
        setUsers(usersWithIds);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      }
    };
    

    fetchUsers(); 

  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`/users/deleteuser/${userId}`);
      console.log('Utilisateur supprimé avec succès:', userId);
      // Mettre à jour la liste des utilisateurs après la suppression
      setUsers(users.filter(user => user.id_user !== userId));
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    }
  };
  const columns = [
    { field: 'id_user', headerName: 'ID', width: 100 },
    { field: 'firstname', headerName: 'First Name', width: 150 },
    { field: 'lastname', headerName: 'Last Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'post', headerName: 'Post', width: 150 },
    {
      field: 'operations',
      headerName: 'Operations',
      width: 200,
      renderCell: (params) => (
        <div>
         <Link to={`updateteam/${params.row.id_user}`}>
        <Button 
        variant="contained" 
        color="primary" 
        startIcon={<LockOpenOutlinedIcon />}
  >
    Update
  </Button>
</Link>
          <Button 
            variant="contained" 
            color="error" 
            startIcon={<AdminPanelSettingsOutlinedIcon />}
            onClick={() => handleDeleteUser(params.row.id_user)}
          >
            Delete
          </Button>
        </div>
      ),
    }
  ];

  const handleAddUser = () => {
    console.log('Ajouter un utilisateur');
  };

  return (
    <Box m="20px">
      <Header title="TEAM" subtitle="Managing the Team Members" />
      <Box mb="20px">
      
      <Button 
      variant="contained" 
      color="primary" 
      onClick={handleAddUser}  
      component={Link} 
      to="addteam"
    >
      Add Member 
    </Button>
      
      </Box>
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid checkboxSelection rows={users} columns={columns} />
      </Box>
    </Box>
  );
}

export default Team;

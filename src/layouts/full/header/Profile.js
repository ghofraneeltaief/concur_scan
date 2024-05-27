import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton
} from '@mui/material';


import ProfileImg from 'src/assets/images/profile/user-1.jpg';

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };
  const handleLogout = () => {
    // Effacez les informations d'identification stockées dans le local storage ou les cookies
    localStorage.removeItem('token'); // Supprimer le jeton d'accès du local storage
    // Redirigez l'utilisateur vers la page de connexion ou la page d'accueil
    window.location.href = '/login'; // Redirection vers la page de connexion
  };
  
  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === 'object' && {
            color: 'primary.main',
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={ProfileImg}
          alt={ProfileImg}
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '200px',
          },
        }}
      >
        <Box mt={1} py={1} px={2}>
          <Button onClick={handleLogout} variant="outlined" color="primary" component={Link} fullWidth>
            Déconnexion 
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;

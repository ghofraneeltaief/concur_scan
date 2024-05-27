import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import DashboardCard from 'src/components/shared/DashboardCard';
import { BASE_URL, api_version } from '../../authentication/config';
import Swal from 'sweetalert2';

function Charts() {
  
  return (
    <Box sx={{ width: 1 }}>
          <DashboardCard title="Classement Créa" subtitle="Page 1">
            <Box display="grid" gridTemplateColumns="repeat(16, 1fr)" gap={2}>
              <Box gridColumn="span 3">
              <DashboardCard title="Radiateur Éco Hiver // Voir le prix" subtitle="Fabriqués en France">
                <Typography>Découvrez les nouveaux radiateurs hiver 2024 ! Ces nouveaux radiateurs diffusent la chaleur de manière efficace...</Typography>
                <Box mt={2}>
                <Button variant="contained">Voir détail</Button></Box>
                <img></img>
                </DashboardCard>
              </Box>
              <Box gridColumn="span 3">
              <DashboardCard title="Radiateur Éco Hiver // Voir le prix" subtitle="Fabriqués en France">
                <Typography>Découvrez les nouveaux radiateurs hiver 2024 ! Ces nouveaux radiateurs diffusent la chaleur de manière efficace...</Typography>
                <Box mt={2}>
                <Button variant="contained">Voir détail</Button></Box>
                <img></img>
                </DashboardCard>
              </Box>
              <Box gridColumn="span 3">
              <DashboardCard title="Radiateur Éco Hiver // Voir le prix" subtitle="Fabriqués en France">
                <Typography>Découvrez les nouveaux radiateurs hiver 2024 ! Ces nouveaux radiateurs diffusent la chaleur de manière efficace...</Typography>
                <Box mt={2}>
                <Button variant="contained">Voir détail</Button></Box>
                <img></img>
                </DashboardCard>
              </Box>
              <Box gridColumn="span 3">
              <DashboardCard title="Radiateur Éco Hiver // Voir le prix" subtitle="Fabriqués en France">
                <Typography>Découvrez les nouveaux radiateurs hiver 2024 ! Ces nouveaux radiateurs diffusent la chaleur de manière efficace...</Typography>
                <Box mt={2}>
                <Button variant="contained">Voir détail</Button></Box>
                <img></img>
                </DashboardCard>
              </Box>
              <Box gridColumn="span 3">
              <DashboardCard title="Radiateur Éco Hiver // Voir le prix" subtitle="Fabriqués en France">
                <Typography>Découvrez les nouveaux radiateurs hiver 2024 ! Ces nouveaux radiateurs diffusent la chaleur de manière efficace...</Typography>
                <Box mt={2}>
                <Button variant="contained">Voir détail</Button></Box>
                <img></img>
                </DashboardCard>
              </Box>
            </Box>
          </DashboardCard>
    </Box>
  );
}

export default Charts;

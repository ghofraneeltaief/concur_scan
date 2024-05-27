import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import DashboardCard from 'src/components/shared/DashboardCard';
import { BASE_URL, api_version } from '../../authentication/config';
import Swal from 'sweetalert2';
import Cible from './charts/Cible'; 
import Repartition from './charts/Repartition'; 

function Charts() {
  return (
    <Box sx={{ width: 1 }}>
      <DashboardCard title="Information Créa" subtitle="Créa 1">
        <Box display="grid" gridTemplateColumns="repeat(16, 1fr)" gap={2}>
          <Box gridColumn="span 8">
            <DashboardCard>
              <Typography variant="h7">
                ID : <Typography variant="subtitle1">1091559795400255</Typography>
              </Typography>
              <Typography variant="h7">
                Statut : <Typography variant="subtitle1">Actif</Typography>
              </Typography>
              <Typography variant="h7">
                1ère diffusion : <Typography variant="subtitle1"> 08/04/2024</Typography>
              </Typography>
              <Typography variant="h7">
                Placement : <Typography variant="subtitle1">ID :</Typography>
              </Typography>
              <Typography variant="h7">
                NB couverture : <Typography variant="subtitle1">200</Typography>
              </Typography>
              <Typography variant="h7">
                Page de redirection :{' '}
                <Typography variant="subtitle1">https://clubfibre.com/Promo_Box_Fibre/</Typography>
              </Typography>
            </DashboardCard>
          </Box>
          <Box gridColumn="span 8">
            <DashboardCard
              title="Radiateur Éco Hiver // Voir le prix"
              subtitle="Fabriqués en France"
            >
              <Typography>
                Découvrez les nouveaux radiateurs hiver 2024 !Ces nouveaux radiateurs diffusent la
                chaleur de manière efficace, vous permettant de profiter d’un chauffage prolongé
                sans pour autant augmenter vos factures.Vous pouvez réaliser jusqu’à 45% d’économies
                sur vos factures par rapport à des radiateurs anciens. Ils existent en 2 coloris,
                noir mat et blanc nacré et sont 100% fabriqués en France !Cliquez dès maintenant
                pour voir le prix des radiateurs{' '}
              </Typography>
              <Box mt={2}>
                <Button variant="contained">Voir détail</Button>
              </Box>
              <img></img>
            </DashboardCard>
          </Box>
          <Box gridColumn="span 8">
            <DashboardCard
              title="Radiateur Éco Hiver // Voir le prix"
              subtitle="Fabriqués en France"
            >
              <Typography>
              Découvrez les nouveaux radiateurs hiver 2024 !Ces nouveaux radiateurs diffusent la
                chaleur de manière efficace, vous permettant de profiter d’un chauffage prolongé
                sans pour autant augmenter vos factures.Vous pouvez réaliser jusqu’à 45% d’économies
                sur vos factures par rapport à des radiateurs anciens. Ils existent en 2 coloris,
                noir mat et blanc nacré et sont 100% fabriqués en France !Cliquez dès maintenant
                pour voir le prix des radiateurs{' '}
              </Typography>
              <img></img>
            </DashboardCard>
          </Box>
          <Box gridColumn="span 4">
            <DashboardCard
              title="Répartition Géolocalisation"
            >
              <Repartition/>
            </DashboardCard>
          </Box>
          <Box gridColumn="span 4">
            <DashboardCard
              title="Cible"
            >
              <Cible/>
            </DashboardCard>
          </Box>
        </Box>
      </DashboardCard>
    </Box>
  );
}

export default Charts;

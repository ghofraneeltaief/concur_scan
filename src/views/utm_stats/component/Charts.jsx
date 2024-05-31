import React from 'react';
import { Box,Typography } from '@mui/material';
import DashboardCard from 'src/components/shared/DashboardCard';
import Media from './charts/media';
import Placement from './charts/Placement';
import Cible from './charts/Cible';
import Tendance from './charts/Tendance';
import Repartition from './charts/Repartition';
function Charts({ selectedVerticalId, selectedDateFrom, selectedDateTo, selectedPage }) {
  return (
    <Box sx={{ width: 1 }}>
      <Box display="grid" gridTemplateColumns="repeat(16, 1fr)" gap={2}>
        <Box gridColumn="span 4">
          <DashboardCard title="Répartition placement" subtitle="Page 1">
            <Placement />
          </DashboardCard>
        </Box>
        <Box gridColumn="span 4">
          <DashboardCard title="Répartition média" >
            <Media
              selectedVerticalId={selectedVerticalId}
              selectedDateFrom={selectedDateFrom}
              selectedDateTo={selectedDateTo}
              selectedPage={selectedPage}
            />
            <Typography variant="h6" component="h2" mt={4} mb={2}>
            Répartition Géolocalisation
                </Typography>
            <Repartition
              selectedVerticalId={selectedVerticalId}
              selectedDateFrom={selectedDateFrom}
              selectedDateTo={selectedDateTo}
              selectedPage={selectedPage}
            />
          </DashboardCard>
        </Box>
        <Box gridColumn="span 4">
          <DashboardCard title="Cible" subtitle="Page 1">
            <Cible
              selectedVerticalId={selectedVerticalId}
              selectedDateFrom={selectedDateFrom}
              selectedDateTo={selectedDateTo}
              selectedPage={selectedPage}
            />
          </DashboardCard>
        </Box>
        <Box gridColumn="span 4">
          <DashboardCard title="Tendance Angle" subtitle="Page 1">
            <Tendance />
          </DashboardCard>
        </Box>
      </Box>
    </Box>
  );
}

export default Charts;

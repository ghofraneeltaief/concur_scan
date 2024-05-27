import React from 'react';
import { Box } from '@mui/material';
import DashboardCard from 'src/components/shared/DashboardCard';
import Media from './charts/media'; 
import Placement from './charts/Placement';
import Cible from './charts/Cible'; 
import Tendance from './charts/Tendance'; 

function Charts() {
  return (
    <Box sx={{ width: 1 }}>
      <Box display="grid" gridTemplateColumns="repeat(16, 1fr)" gap={2}>
        <Box gridColumn="span 4">
          <DashboardCard title="Répartition placement" subtitle="Page 1">
                <Placement />
          </DashboardCard>
        </Box>
        <Box gridColumn="span 4">
          <DashboardCard title="Répartition média" subtitle="Page 1">
                <Media />
          </DashboardCard>
        </Box>
        <Box gridColumn="span 4">
          <DashboardCard title="Cible" subtitle="Page 1">
            <Cible />
          </DashboardCard>
        </Box>
        <Box gridColumn="span 4">
          <DashboardCard title="Tendance Angle" subtitle="Page 1">
            <Tendance/>
          </DashboardCard>
        </Box>
      </Box>
    </Box>
  );
}

export default Charts;

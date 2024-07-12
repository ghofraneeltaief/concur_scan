import React, { useState } from 'react';
import { Box } from '@mui/material';
import DashboardCard from 'src/components/shared/DashboardCard';
import Media from './charts/Media';
import Placement from './charts/Placement';
import Cible from './charts/Cible';
import Tendance from './charts/Tendance';
import Repartition from './charts/Repartition';
import TendanceDetail from './charts/TendanceDetail';

function Charts({ selectedVerticalId, selectedDateFrom, selectedDateTo, selectedPage }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAngleId, setSelectedAngleId] = useState(null);

  const handleBarClick = (category, angleId) => {
    setSelectedCategory(category);
    setSelectedAngleId(angleId);
  };
console.log(selectedAngleId)
  return (
    <Box sx={{ width: 1 }}>
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
        <Box gridColumn="span 8">
          <DashboardCard title="Répartition de placement">
            <Placement
              selectedVerticalId={selectedVerticalId}
              selectedDateFrom={selectedDateFrom}
              selectedDateTo={selectedDateTo}
              selectedPage={selectedPage}
            />
          </DashboardCard>
        </Box>
        <Box gridColumn="span 4">
          <DashboardCard title="Répartition de média" height="470px">
            <Media
              selectedVerticalId={selectedVerticalId}
              selectedDateFrom={selectedDateFrom}
              selectedDateTo={selectedDateTo}
              selectedPage={selectedPage}
            />
          </DashboardCard>
        </Box>
        <Box gridColumn="span 4">
          <DashboardCard title="Répartition de géolocalisation" height="500px">
            <Repartition
              selectedVerticalId={selectedVerticalId}
              selectedDateFrom={selectedDateFrom}
              selectedDateTo={selectedDateTo}
              selectedPage={selectedPage}
            />
          </DashboardCard>
        </Box>
        <Box gridColumn="span 4">
          <DashboardCard title="Cible" height="500px">
            <Cible
              selectedVerticalId={selectedVerticalId}
              selectedDateFrom={selectedDateFrom}
              selectedDateTo={selectedDateTo}
              selectedPage={selectedPage}
            />
          </DashboardCard>
        </Box>
        <Box gridColumn="span 4">
          <DashboardCard title="Tendance d'angle" height="500px">
            <Tendance
              selectedVerticalId={selectedVerticalId}
              selectedDateFrom={selectedDateFrom}
              selectedDateTo={selectedDateTo}
              selectedPage={selectedPage}
              onBarClick={handleBarClick}  // Updated line
            />
          </DashboardCard>
        </Box>
        {selectedCategory && (
          <Box gridColumn="span 12">
            <DashboardCard title="Tendance Keyword">
              <TendanceDetail
                selectedAngleId={selectedAngleId}
                selectedCategory={selectedCategory}
                selectedVerticalId={selectedVerticalId}
                selectedDateFrom={selectedDateFrom}
                selectedDateTo={selectedDateTo}
                selectedPage={selectedPage}
              />
            </DashboardCard>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Charts;

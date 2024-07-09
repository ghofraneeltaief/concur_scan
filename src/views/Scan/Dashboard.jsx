import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Component from './Component';
import Classement from './component/Classement';
import Charts from './component/Charts';
import Crea from './component/Crea';
import Information from './component/Information';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';

// Import logos
import facebook from '../../assets/images/logos/facebook.png';
import google from '../../assets/images/logos/google.png';

function Dashboard() {
  const [selectedOptions, setSelectedOptions] = useState(null);
  const [value, setValue] = useState('1');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const platforms = [
    { icon: facebook, label: 'Facebook', value: '1' },
    { icon: google, label: 'Google', value: '2' },
  ];

  const selectOptions = platforms.map((platform) => ({
    label: platform.label,
    value: platform.value,
  }));

  const selectedPlatforms = platforms.filter((platform) =>
    selectedOptions ? selectedOptions.some((option) => option.value === platform.value) : true,
  );

  const [selectedVerticalId, setSelectedVerticalId] = useState('');
  const handleVerticalSelect = (verticalId) => {
    setSelectedVerticalId(verticalId);
  };

  const [selectedDateFrom, setSelectedDateFrom] = useState(null);
  const handleDateFromSelect = (dateFrom) => {
    setSelectedDateFrom(dateFrom);
  };

  const [selectedDateTo, setSelectedDateTo] = useState(null);
  const handleDateToSelect = (dateTo) => {
    setSelectedDateTo(dateTo);
  };

  const [selectedPage, setSelectedPage] = useState(null);
  const handlePageSelect = (page) => {
    setSelectedPage(page);
  };

  const [selectedDetail, setSelectedDetail] = useState(null);
  const handleDetailSelect = (detail) => {
    setSelectedDetail(detail);
  };

  // Reset selectedDetail when selectedPage changes
  useEffect(() => {
    setSelectedDetail(null);
  }, [selectedPage]);

  return (
    <Box sx={{ width: 1 }}>
      <TabContext value={value}>
        <Box sx={{ marginBottom: '20px' }} display="flex" justifyContent="center">
          <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
            <Box gridColumn="span 9">
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                {selectedPlatforms.map((platform) => (
                  <Tab
                    key={platform.value}
                    icon={
                      <img
                        src={platform.icon}
                        alt={platform.label}
                        style={{ width: '24px', height: '24px' }}
                      />
                    }
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: '4px',
                      padding: '8px',
                      marginRight: '14px',
                    }}
                    label={platform.label}
                    value={platform.value}
                  />
                ))}
              </TabList>
            </Box>
          </Box>
        </Box>
      </TabContext>
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
        <Box gridColumn="span 12">
          <Component
            onVerticalSelect={handleVerticalSelect}
            onDateFromSelect={handleDateFromSelect}
            onDateToSelect={handleDateToSelect}
          />
        </Box>
        <Box gridColumn="span 12">
          <Classement selectedVerticalId={selectedVerticalId} onSelectedPage={handlePageSelect} selectedDetail={selectedDetail} setSelectedDetail={setSelectedDetail} />
          {selectedVerticalId && selectedDateFrom && selectedDateTo && selectedPage > 0 && (
            <>
              <Box gridColumn="span 12" sx={{ paddingTop: '40px' }}>
                <Charts
                  selectedVerticalId={selectedVerticalId}
                  selectedDateFrom={selectedDateFrom}
                  selectedDateTo={selectedDateTo}
                  selectedPage={selectedPage}
                />
              </Box>
              <Box gridColumn="span 12" sx={{ paddingTop: '40px' }}>
                <Crea
                  selectedVerticalId={selectedVerticalId}
                  selectedDateFrom={selectedDateFrom}
                  selectedDateTo={selectedDateTo}
                  selectedPage={selectedPage}
                  onDetail={handleDetailSelect}
                />
              </Box>
              {selectedDetail && (
                <Box gridColumn="span 12" sx={{ paddingTop: '40px' }}>
                  <Information
                    selectedDetail={selectedDetail}
                    selectedVerticalId={selectedVerticalId}
                    selectedDateFrom={selectedDateFrom}
                    selectedDateTo={selectedDateTo}
                    selectedPage={selectedPage}
                  />
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;

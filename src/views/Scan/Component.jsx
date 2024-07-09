import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import Select from 'react-select';
import './selection.css';
import { BASE_URL, api_version } from '../authentication/config';

function Component({ onVerticalSelect, onDateFromSelect, onDateToSelect }) {
  const [selectedOptions, setSelectedOptions] = useState(null);
  const [verticals, setVerticals] = useState([]);
  const [selectedVertical, setSelectedVertical] = useState(null);
  const [selectedDateFrom, setSelectedDateFrom] = useState(new Date().toISOString().substr(0, 10));
  const [selectedDateTo, setSelectedDateTo] = useState(new Date().toISOString().substr(0, 10));

  const getToken = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      return token;
    } else {
      throw new Error('No token available');
    }
  };

  const fetchVerticals = async () => {
    try {
      const token = await getToken();
      const responseObject = JSON.parse(token);
      const accessToken = responseObject.access_token;
      const requestOptions = {
        method: 'GET',
      };
      const response = await fetch(`${BASE_URL}/${api_version}/verticals?hp_cs_authorization=${accessToken}`, requestOptions);
      const data = await response.json();
      setVerticals(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchVerticals();
    onDateFromSelect(selectedDateFrom);
    onDateToSelect(selectedDateTo);
  }, []);

  const handleVerticalSelect = (selectedOption) => {
    setSelectedVertical(selectedOption); // Update state with the new selected option
    onVerticalSelect(selectedOption.value); // Call the callback function with the vertical ID
  };

  const handleDateFromChange = (dateFrom) => {
    setSelectedDateFrom(dateFrom);
    onDateFromSelect(dateFrom); // Call the callback function with the selected date from
  };

  const handleDateToChange = (dateTo) => {
    setSelectedDateTo(dateTo);
    onDateToSelect(dateTo); // Call the callback function with the selected date to
  };

  // Calculate the maximum allowed date (30 days from the current date)
  const currentDate = new Date();
  const minDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());

  // Begin: Style select
  const ITEM_HEIGHT = 30;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 270,
      },
    },
  };
  // End: Style select

  return (
    <>
      <Typography variant="h6" mb={3}>
        Benchmark Concurrentiel - Facebook
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={4.4}>
          <Typography variant="h6" mb={1}>
            Verticales
          </Typography>
          <Select
            defaultValue={selectedOptions}
            onChange={handleVerticalSelect}
            options={verticals.map((vertical) => ({
              value: vertical.vertical_id,
              label: vertical.codified_name,
            }))}
            isSearchable={true}
            name="Verticale"
            placeholder="Verticales"
            MenuProps={MenuProps}
            className="basic-single"
            classNamePrefix="select"
            menuPortalTarget={document.body}
            menuPosition={'fixed'}
          />
        </Grid>
        <Grid item xs={3.6}>
          <Typography variant="h6" sx={{ fontWeight: '600' }}>
            Période
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <input
                type="date"
                className="form-control"
                value={selectedDateFrom}
                onChange={(e) => handleDateFromChange(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </Grid>
            <Grid item xs={6}>
              <input
                type="date"
                className="form-control"
                value={selectedDateTo}
                onChange={(e) => handleDateToChange(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default Component;

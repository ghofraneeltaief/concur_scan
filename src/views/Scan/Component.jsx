import React, { useState, useEffect } from 'react';
import { Grid, Typography, Button } from '@mui/material';
import Select from 'react-select';
import './selection.css';
import { BASE_URL, api_version } from '../authentication/config';
import { FaFileExport } from 'react-icons/fa';
import { ImLoop2 } from 'react-icons/im';

function Component({
  onVerticalSelect,
  onVerticalSelectName,
  onDateFromSelect,
  onDateToSelect,
  onRecalculateClick,
}) {
  const [selectedOptions, setSelectedOptions] = useState(null);
  const today = new Date().toISOString().substr(0, 10);
  async function getToken() {
    const token = localStorage.getItem('token');
    if (token) {
      return token;
    } else {
      throw new Error('No token available');
    }
  }
  const fetchVerticals = async () => {
    try {
      const token = await getToken();
      const responseObject = JSON.parse(token);
      const accessToken = responseObject.access_token;
      const requestOptions = {
        method: 'GET',
      };
      const response = await fetch(
        `${BASE_URL}/${api_version}/verticals?hp_cs_authorization=${accessToken}`,
        requestOptions,
      );
      const data = await response.json();
      setVerticals(data);
    } catch (error) {
      console.error(error);
    }
    onDateFromSelect(today);
    onDateToSelect(today);
  };
  useEffect(() => {
    fetchVerticals();
  }, [onDateFromSelect, onDateToSelect]);

  const [verticals, setVerticals] = useState([]);
  const [selectedVertical, setSelectedVertical] = useState([]);
  const [selectedDateFrom, setSelectedDateFrom] = useState(today);
  const [selectedDateTo, setSelectedDateTo] = useState(today);

  const handleVerticalSelect = (selectedOption) => {
    setSelectedVertical(selectedOption); // Mettre à jour l'état avec la nouvelle option sélectionnée
    onVerticalSelect(selectedOption.value); // Appeler la fonction de rappel avec l'ID de la verticale
  };

  const handleDateFromChange = (dateFrom) => {
    setSelectedDateFrom(dateFrom);
    onDateFromSelect(dateFrom);
  };

  const handleDateToChange = (dateTo) => {
    setSelectedDateTo(dateTo);
    onDateToSelect(dateTo);
  };

  // Calculer la date maximale autorisée (30 jours à partir de la date actuelle)
  const currentDate = new Date();
  const minDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    currentDate.getDate(),
  );
  /* Begin: Style select */
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
  /* End: Style select */
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
          <Typography variant="h6" sx={{ fontWeight: '400' }}>
            Période
          </Typography>
          <Grid container>
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

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { BASE_URL, api_version } from '../../../authentication/config';
import { Grid, Typography } from '@mui/material';

const generateFullHourRange = () => {
  const hours = [];
  for (let i = 0; i <= 23; i++) {
    hours.push(i);
  }
  return hours;
};

const formatData = (data) => {
  const fullHours = generateFullHourRange();
  const formattedData = fullHours.map((hour) => {
    const found = data[hour];
    return {
      hour,
      status: found ? 'Active' : 'Inactive',
    };
  });
  return formattedData;
};

const Periode = ({ selectedDetail, reset }) => {
  const [chartData, setChartData] = useState([]);
  const [selectedDateFrom, setSelectedDateFrom] = useState(new Date().toISOString().substr(0, 10));
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedDateFrom && selectedDetail) {
        const token = localStorage.getItem('token');
        const responseObject = JSON.parse(token);
        const accessToken = responseObject.access_token;
        const apiUrl = `${BASE_URL}/${api_version}/reports/ad_status?hp_cs_authorization=${accessToken}&date=${selectedDateFrom}&ad_id=${selectedDetail}`;

        try {
          const response = await axios.get(apiUrl);
          if (response.status === 404) {
            setNoData(true);
            setChartData([]);
            return;
          }

          if (response.status !== 200) {
            throw new Error('Network response was not ok');
          }

          const formattedData = formatData(response.data);
          setChartData(formattedData);
          setNoData(false);
        } catch (error) {
          console.error('Error fetching data', error);
          setNoData(true);
          setChartData([]);
        }
      }
    };

    fetchData();
  }, [selectedDateFrom, selectedDetail]);

  useEffect(() => {
    if (reset) {
      setChartData([]);
      setNoData(false);
      setSelectedDateFrom(new Date().toISOString().substr(0, 10));
    }
  }, [reset]);

  const handleDateFromChange = (e) => {
    setSelectedDateFrom(e.target.value);
  };

  return selectedDetail ? (
    <>
      <Grid container spacing={3} mb={2}>
        <Grid item xs={3}>
          <input
            type="date"
            className="form-control"
            value={selectedDateFrom}
            onChange={handleDateFromChange}
            max={new Date().toISOString().split('T')[0]}
          />
        </Grid>
      </Grid>
      {noData ? (
        <Typography variant="h6" color="textSecondary">
          Aucune période trouvée !
        </Typography>
      ) : (
        <ResponsiveContainer width="100%" height={100}>
          <LineChart data={chartData}>
            <XAxis dataKey="hour" domain={[0, 23]} ticks={generateFullHourRange()} />
            <YAxis type="category" dataKey="status" />
            <Tooltip />
            <Line type="monotone" dataKey="status" stroke="#0F9D58" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </>
  ) : null;
};

export default Periode;

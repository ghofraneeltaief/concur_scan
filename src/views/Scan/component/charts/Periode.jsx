import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BASE_URL, api_version } from '../../../authentication/config';
import { Grid } from '@mui/material';
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
    const found = data.find((item) => parseInt(item.hour) === hour);
    return {
      hour,
      status: found ? 'Active' : 'Inactive',
    };
  });
  return formattedData;
};

const handleError = (error) => {
  Swal.fire({
    icon: 'info',
    text: error,
    width: '30%',
    confirmButtonText: "Ok, j'ai compris!",
    confirmButtonColor: '#0095E8',
  });
};

const Periode = ({ selectedDetail }) => {
  const [chartData, setChartData] = useState([]);
  const today = new Date().toISOString().substr(0, 10);
  const [selectedDateFrom, setSelectedDateFrom] = useState(today);
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
            handleError('Aucune période trouvée !');
            return;
          }

          if (response.status !== 200) {
            throw new Error('Network response was not ok');
          }

          const formattedData = formatData(response.data);
          setChartData(formattedData);
        } catch (error) {
          console.error('Error fetching data', error);
          handleError('Aucune période trouvée !');
        }
      }
    };

    fetchData();
  }, [selectedDateFrom, selectedDetail]);
  const handleDateFromChange = (dateFrom) => {
    setSelectedDateFrom(dateFrom);
  };
  return (
    <>
      <Grid container spacing={3} mb={2}>
        <Grid item xs={3}>
          <input
            type="date"
            className="form-control"
            value={selectedDateFrom}
            onChange={(e) => handleDateFromChange(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </Grid>
      </Grid>
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={chartData}>
          <XAxis
            dataKey="hour"
            domain={[0, 23]}
            ticks={[0,1,2,3 ,4 ,5,6,7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,21 ,22  ,23]}
          />
          <YAxis type="category" dataKey="status" />
          <Tooltip />
          <Line type="monotone" dataKey="status" stroke="#0F9D58" strokeWidth={2}/>
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default Periode;

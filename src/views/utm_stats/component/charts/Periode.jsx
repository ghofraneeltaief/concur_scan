import React, { useState } from 'react';
import './react-datepicker.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Grid, Typography } from '@mui/material';

const ActivationPeriod = () => {
  const [startDate, setStartDate] = useState(new Date());

  const data = [
    { time: '07h', status: 'Inactive' },
    { time: '08h', status: 'Active' },
    { time: '09h', status: 'Active' },
    { time: '10h', status: 'Inactive' },
    { time: '11h', status: 'Inactive' },
    { time: '12h', status: 'Inactive' },
    { time: '13h', status: 'Active' },
    { time: '14h', status: 'Inactive' },
    { time: '15h', status: 'Active' },
    { time: '16h', status: 'Inactive' },
    { time: '17h', status: 'Active' },
    { time: '18h', status: 'Inactive' },
    { time: '19h', status: 'Active' },
    { time: '20h', status: 'Inactive' },
    { time: '21h', status: 'Inactive' },
    { time: '22h', status: 'Inactive' },
    { time: '23h', status: 'Inactive' },
  ];

  return (
    <div>
      <Grid container spacing={1}>
        <Grid item xs={4} mr={5}>
        <Typography variant="p" sx={{ fontWeight: '400' }} mb={1}>
            Période :
          </Typography>
          <input
            type="date"
            className="form-control"
            max={new Date().toISOString().split('T')[0]}
          />
        </Grid>
        <Grid item xs={3}>
          <Typography variant="p" sx={{ fontWeight: '400' }} mb={1}>
            De :
          </Typography>
          <input type="time" className="form-control" />
        </Grid>
        <Grid item xs={3}>
          <Typography variant="p" sx={{ fontWeight: '400' }} mb={1}>
            à :
          </Typography>
          <input type="time" className="form-control" />
        </Grid>
      </Grid>
      <ResponsiveContainer width="100%" height={100}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="status" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivationPeriod;

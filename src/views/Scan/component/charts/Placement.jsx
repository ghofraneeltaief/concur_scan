import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BASE_URL, api_version } from '../../../authentication/config';
import { Box } from '@mui/material';
import './placement.css';

Chart.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

const Placement = ({ selectedVerticalId, selectedDateFrom, selectedDateTo, selectedPage }) => {
  const [autoCount, setAutoCount] = useState(0);
  const [manualCount, setManualCount] = useState(0);
  const [manualDetails, setManualDetails] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedVerticalId && selectedDateFrom && selectedDateTo && selectedPage) {
        const token = localStorage.getItem('token');
        const responseObject = JSON.parse(token);
        const accessToken = responseObject.access_token;
        const apiUrl = `${BASE_URL}/${api_version}/reports/ads_stats_by_publisher_plateforme?hp_cs_authorization=${accessToken}&date_begin=${selectedDateFrom}&date_end=${selectedDateTo}&vertical_id=${selectedVerticalId}&page_id=${selectedPage}`;

        try {
          const response = await axios.get(apiUrl);
          const data = response.data;

          if (response.status === 404) {
            console.log('vide');
            return;
          }

          if (response.status !== 200) {
            throw new Error('Network response was not ok');
          }

          console.log('API Response Data:', data); // Debugging line

          setAutoCount(data.auto.count);
          setManualCount(data.manual.count);
          setManualDetails(data.manual.details);
        } catch (error) {
          console.error('There was an error fetching the data!', error);
        }
      }
    };

    fetchData();
  }, [selectedVerticalId, selectedDateFrom, selectedDateTo, selectedPage]);

  const totalChartData = {
    labels: ['Auto', 'Manuel'],
    datasets: [
      {
        data: [autoCount, manualCount],
        backgroundColor: ['#6DD5B3', '#9D81E2'],
        hoverBackgroundColor: ['#57C99D', '#8362E3'],
      },
    ],
  };

  const manualDetailsCounts = manualDetails.map((detail) => parseInt(detail.count));
  const manualLabels = manualDetails.map((detail) => detail.publisher_plateforme_label);

  const manualChartData = {
    labels: manualLabels,
    datasets: [
      {
        data: manualDetailsCounts,
        backgroundColor: ['#55A9FF', '#3282CD', '#205F9E'],
        hoverBackgroundColor: ['#3B94E8', '#2768AB', '#164883'],
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: '50%',
    rotation: -90,
    circumference: 180,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
      datalabels: {
        formatter: (value, ctx) => {
          let sum = 0;
          let dataArr = ctx.chart.data.datasets[0].data;
          dataArr.map((data) => {
            sum += data;
          });
          let percentage = ((value * 100) / sum).toFixed(2) + '%';
          return percentage;
        },
        color: '#fff',
      },
    },
  };

  if (autoCount === 0 && manualCount === 0) {
    return <div>Aucune Répartition placement fondée</div>;
  }

  if (manualDetails.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-item">
          <h2>Total Count</h2>
          <div className="doughnut-container">
            <Doughnut data={totalChartData} options={options} />
          </div>
        </div>
        <div className="chart-item">
        <h2>Détails Manuel</h2>
        <div className="doughnut-container">vide</div>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <div className="chart-item">
        <h2>Total Count</h2>
        <div className="doughnut-container">
          <Doughnut data={totalChartData} options={options} />
        </div>
      </div>
      <div className="chart-item">
        <h2>Détails Manuel</h2>
        <div className="doughnut-container">
          <Doughnut data={manualChartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Placement;

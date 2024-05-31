import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BASE_URL, api_version } from '../../../authentication/config';
import { Box } from '@mui/material';
import "./placement.css";

Chart.register(ArcElement, Tooltip, Legend, Title);

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
            Swal.fire({
              icon: 'info',
              text: 'Aucune donnée trouvée !',
              width: '30%',
              confirmButtonText: "Ok, j'ai compris!",
              confirmButtonColor: '#0095E8',
            });
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
          console.error("There was an error fetching the data!", error);
          Swal.fire({
            icon: 'error',
            text: 'Erreur lors de la récupération des données !',
            width: '30%',
            confirmButtonText: "Ok, j'ai compris!",
            confirmButtonColor: '#0095E8',
          });
        }
      }
    };

    fetchData();
  }, [selectedVerticalId, selectedDateFrom, selectedDateTo, selectedPage]);

  if (manualDetails.length === 0) {
    return <div>Loading...</div>; // Show a loading state while data is being fetched
  }

  // Premier graphique: Total des comptes en pourcentage pour "auto" et "manual"
  const totalChartData = {
    labels: ['Auto', 'Manual'],
    datasets: [{
      data: [autoCount, manualCount],
      backgroundColor: ['#6DD5B3', '#9D81E2'],
      hoverBackgroundColor: ['#57C99D', '#8362E3']
    }]
  };

  // Deuxième graphique: Différents "publisher_plateforme_label" pour "manual"
  const manualDetailsCounts = manualDetails.map(detail => parseInt(detail.count));
  const manualLabels = manualDetails.map(detail => detail.publisher_plateforme_label);

  const manualChartData = {
    labels: manualLabels,
    datasets: [{
      data: manualDetailsCounts,
      backgroundColor: ['#55A9FF', '#3282CD', '#205F9E'],
      hoverBackgroundColor: ['#3B94E8', '#2768AB', '#164883']
    }]
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
          label: function(tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          }
        }
      }
    }
  };

  return (
    <div className="chart-container">
      <div className="chart-item">
        <h2>Total Count</h2>
        <Doughnut data={totalChartData} options={options} />
      </div>
      <div className="chart-item">
        <h2>Manual Publisher Platform Labels</h2>
        <Doughnut data={manualChartData} options={options} />
      </div>
    </div>
  );
};

export default Placement;
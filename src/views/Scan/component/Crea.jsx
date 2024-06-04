import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import DashboardCard from 'src/components/shared/DashboardCard';
import { BASE_URL, api_version } from '../../authentication/config';
import Swal from 'sweetalert2';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

function Crea({ selectedVerticalId, selectedDateFrom, selectedDateTo, selectedPage, onDetail }) {
  const [ADS, setADS] = useState([]);
  const [error, setError] = useState(null);
  async function getToken() {
    const token = localStorage.getItem('token');
    if (token) {
      return token;
    } else {
      throw new Error('No token available');
    }
  }

  useEffect(() => {
    if (selectedVerticalId && selectedDateFrom && selectedDateTo && selectedPage) {
      const fetchADS = async () => {
        try {
          const token = await getToken();
          const responseObject = JSON.parse(token);
          const accessToken = responseObject.access_token;
          const requestOptions = {
            method: 'GET',
          };
          const response = await fetch(
            `${BASE_URL}/${api_version}/reports/global_ads_stats?hp_cs_authorization=${accessToken}&date_begin=${selectedDateFrom}&date_end=${selectedDateTo}&vertical_id=${selectedVerticalId}&page_id=${selectedPage}`,
            requestOptions,
          );
          if (!response.ok) {
            if (response.status === 404) {
              handleError('Aucune ADS fondée !');
            }
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setADS(data);
        } catch (error) {
          console.error(error);
        }
      };

      fetchADS();
    }
  }, [selectedVerticalId, selectedDateFrom, selectedDateTo, selectedPage]);

  const chunkArray = (array, chunkSize) => {
    const results = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      results.push(array.slice(i, i + chunkSize));
    }
    return results;
  };

  const truncateText = (text, wordLimit, charLimit) => {
    const words = text.split(' ');
    let truncatedText = '';
    let charCount = 0;

    for (let word of words) {
      if (truncatedText.split(' ').length >= wordLimit || charCount + word.length + 1 > charLimit) {
        break;
      }
      truncatedText += word + ' ';
      charCount += word.length + 1; // Adding 1 for the space
    }

    return truncatedText.trim() + (truncatedText.split(' ').length < words.length ? '...' : '');
  };

  const ADSChunks = chunkArray(ADS, 4);
  const handleViewDetail = (id) => {
    onDetail(id);
  };

  const handleError = (error) => {
    Swal.fire({
      icon: 'info',
      text: error,
      width: '30%',
      confirmButtonText: "Ok, j'ai compris!",
      confirmButtonColor: '#0095E8',
    });
    setError(error);
  };
  useEffect(() => {
    if (selectedPage === null) {
      onDetail(null);
    }
  }, [selectedPage, onDetail]);
  return (
    <Box sx={{ width: 1 }}>
      <DashboardCard title="Classement Créa"  pb={4}>
        <Carousel showThumbs={false} showIndicators={false}>
          {ADSChunks.map((ad, adIndex) => (
            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2} key={adIndex}>
              {ad.map((row, index) => (
                <Box gridColumn="span 3" key={index}>
                  <DashboardCard title={row.page_name} height="400px">
                    <Typography>{truncateText(row.ad_creative_bodies, 20, 100)}</Typography> {/* 20 words or 100 characters limit */}
                    <Box mt={2} mb={2}>
                      <Button variant="contained" onClick={() => handleViewDetail(row.ad_id)}>Voir détail</Button>
                    </Box>
                    <img src={row.image_preview}></img>
                  </DashboardCard>
                </Box>
              ))}
            </Box>
          ))}
        </Carousel>
      </DashboardCard>
    </Box>
  );
}

export default Crea;

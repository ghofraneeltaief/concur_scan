import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import DashboardCard from 'src/components/shared/DashboardCard';
import { BASE_URL, api_version } from '../../authentication/config';
import Swal from 'sweetalert2';
import Cible_byAd from './charts/Cible_byAd';

import Periode from './charts/Periode';

function Information({
  selectedVerticalId,
  selectedDateFrom,
  selectedDateTo,
  selectedPage,
  selectedDetail,
}) {
  const [ADS, setADS] = useState([]);
  const [adDetail, setAdDetail] = useState(null);

  async function getToken() {
    const token = localStorage.getItem('token');
    if (token) {
      return token;
    } else {
      throw new Error('No token available');
    }
  }

  useEffect(() => {
    if (
      selectedVerticalId &&
      selectedDateFrom &&
      selectedDateTo &&
      selectedPage &&
      selectedDetail
    ) {
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
          const data = await response.json();

          setADS(data);
        } catch (error) {
          console.error(error);
        }
      };

      fetchADS();
    }
  }, [selectedVerticalId, selectedDateFrom, selectedDateTo, selectedPage, selectedDetail]);

  useEffect(() => {
    if (ADS.length > 0 && selectedDetail) {
      const ad = ADS.find((ad) => ad.ad_id === selectedDetail);
      setAdDetail(ad);
    }
  }, [ADS, selectedDetail]);

  console.log('test', adDetail);
  return (
    <Box sx={{ width: 1 }}>
      <DashboardCard title="Information Créa">
        <Box display="grid" gridTemplateColumns="repeat(16, 1fr)" gap={2}>
          <Box gridColumn="span 8">
          {adDetail && (
              <DashboardCard>
                 <div className="iframe-container">
                  <iframe 
                    src={adDetail.url}
                    width="100%" 
                    height="400" 
                    title="Iframe"
                    className="custom-iframe"
                  />
                </div>
              </DashboardCard>
            )}
          </Box>
          <Box gridColumn="span 8">
            <DashboardCard title="Période activation">
              <Periode selectedDetail={selectedDetail} selectedDateFrom={selectedDateFrom}/>
            </DashboardCard>
          </Box>
          <Box gridColumn="span 8">
            <DashboardCard title="Cible">
              <Cible_byAd
                selectedDetail={selectedDetail}
              />
            </DashboardCard>
          </Box>
        </Box>
      </DashboardCard>
    </Box>
  );
}

export default Information;

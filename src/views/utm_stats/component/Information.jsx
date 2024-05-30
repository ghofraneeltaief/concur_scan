import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import DashboardCard from 'src/components/shared/DashboardCard';
import { BASE_URL, api_version } from '../../authentication/config';
import Swal from 'sweetalert2';
import Cible_byAd from './charts/Cible_byAd';
import Repartition from './charts/Repartition';
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
                <Typography variant="h7" component="div">
                  ID : <Typography variant="subtitle1" component="span">{adDetail.ad_external_id}</Typography>
                </Typography>
                <Typography variant="h7" component="div">
                  Statut : <Typography variant="subtitle1" component="span"></Typography>
                </Typography>
                <Typography variant="h7" component="div">
                  1ère diffusion :{' '}
                  <Typography variant="subtitle1" component="span">{adDetail.ad_creation_time}</Typography>
                </Typography>
                <Typography variant="h7" component="div">
                  Placement : <Typography variant="subtitle1" component="span"></Typography>
                </Typography>
                <Typography variant="h7" component="div">
                  NB couverture : <Typography variant="subtitle1" component="span"></Typography>
                </Typography>
                <Typography variant="h7" component="div">
                  Page de redirection :  
                </Typography> <Typography variant="subtitle1" component="span"><a href={adDetail.url}>{adDetail.url}</a></Typography>
              </DashboardCard>
            )}
          </Box>

          <Box gridColumn="span 4">
            <DashboardCard title="Répartition Géolocalisation">
              <Repartition
                selectedVerticalId={selectedVerticalId}
                selectedDateFrom={selectedDateFrom}
                selectedDateTo={selectedDateTo}
                selectedPage={selectedPage}
              />
            </DashboardCard>
          </Box>
          <Box gridColumn="span 4">
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

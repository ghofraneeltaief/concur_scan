import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import DashboardCard from 'src/components/shared/DashboardCard';
import { BASE_URL, api_version } from '../../authentication/config';
import Swal from 'sweetalert2';
import Cible_byAd from './charts/Cible_byAd';
import Periode from './charts/Periode';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

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

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    if (selectedDetail === null || selectedPage === null) {
      setAdDetail(null);
    }
  }, [selectedDetail, selectedPage]);
  console.log(selectedDetail, selectedPage);
  return (
    <Box sx={{ width: 1 }}>
      <DashboardCard title="Information Créa">
        <Box display="grid" gridTemplateColumns="repeat(16, 1fr)" gap={2}>
          <Box gridColumn="span 7">
            {adDetail && (
              <DashboardCard mb="2" height="745px">
                <Box display="flex" justifyContent="end">
                  <IconButton onClick={() => handleCopy(adDetail.ad_creative_link_titles)}>
                    <ContentCopyIcon />
                    <Typography sx={{ paddingLeft: '7px' }}>Copie titre</Typography>
                  </IconButton>
                  <IconButton onClick={() => handleCopy(adDetail.ad_creative_bodies)}>
                    <ContentCopyIcon />
                    <Typography sx={{ paddingLeft: '7px' }}>Copie paragraphe</Typography>
                  </IconButton>
                </Box>
                <Typography variant="h6" component="div">
                  ID:{' '}
                  <Typography variant="body1" component="span">
                    {adDetail.ad_external_id}
                  </Typography>
                </Typography>
                <Typography variant="h6" component="div" mt={2}>
                  1ère diffusion:{' '}
                  <Typography variant="body1" component="span">
                    {adDetail.ad_creation_time}
                  </Typography>
                </Typography>
                <Typography variant="h6" component="div" mt={2}>
                  Page de redirection:
                  <a style={{ wordBreak: 'break-all', display: 'block' }} href={adDetail.url}>
                    {adDetail.url}
                  </a>
                </Typography>
                <Typography variant="h4" mt={2}>
                  {adDetail.ad_creative_link_titles}
                </Typography>
                <Typography variant="body1" mt={2}>
                  {adDetail.ad_creative_bodies}
                </Typography>
                <img width={600} src={adDetail.image_preview} alt="Ad preview" />
              </DashboardCard>
            )}
          </Box>
          <Box gridColumn="span 9">
            {selectedDetail && (
              <>
                <Box gridColumn="span 8" mb={2}>
                  <DashboardCard title="Période activation" height="300px">
                    <Periode selectedDetail={selectedDetail} selectedDateFrom={selectedDateFrom} />
                  </DashboardCard>
                </Box>
                <Box gridColumn="span 8">
                  <DashboardCard title="Cible">
                    <Cible_byAd selectedDetail={selectedDetail} />
                  </DashboardCard>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </DashboardCard>
    </Box>
  );
}

export default Information;

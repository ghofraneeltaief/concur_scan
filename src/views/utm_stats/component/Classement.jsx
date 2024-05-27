import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts';
import DashboardCard from 'src/components/shared/DashboardCard';
import { BASE_URL, api_version } from '../../authentication/config';
import Swal from 'sweetalert2';
import logo from '../../../assets/images/logos/image.png';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Visibility } from '@mui/icons-material';
import axios from 'axios';

function Classement() {
  const [concurrentList, setConcurrentList] = useState([]);
  const [pageList, setPageList] = useState([]);
  const [selectedConcurrent, setSelectedConcurrent] = useState(null);
  const [selectedPage, setSelectedPage] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const hp_cs_authorization = localStorage.getItem('access_token');
        const [concurrentsResponse, pagesResponse] = await Promise.all([
          axios.get(
            `${BASE_URL}/${api_version}/competitors?hp_cs_authorization=${hp_cs_authorization}`,
          ),
          axios.get(`${BASE_URL}/${api_version}/pages?hp_cs_authorization=${hp_cs_authorization}`),
        ]);
        const concurrents = concurrentsResponse.data.map((concurrent) => ({
          competitor_id: concurrent.competitor_id,
          competitor_name: concurrent.competitor_name,
          coverage: concurrent.coverage,
          couver: concurrent.couver,
        }));
        setConcurrentList(concurrents);
        const pages = pagesResponse.data.map((page) => ({
          page_id: page.page_id,
          page_name: page.page_name,
          fk_competitor_id: page.fk_competitor_id,
          page_data: page.page_data,
          coverage: page.coverage,
          nbr_ads: page.nbr_ads,
          couver: page.couver,
        }));
        setPageList(pages);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);
  const handleConcurrentClick = (concurrent) => {
    if (selectedConcurrent && selectedConcurrent.competitor_id === concurrent.competitor_id) {
      setSelectedConcurrent(null);
    } else {
      setSelectedConcurrent(concurrent);
    }
    setSelectedPage(null);
  };
  const handlePageClick = (page) => {
    setSelectedPage(page);
  };
  const countPagesByCompetitor = () => {
    const pageCounts = {};
    pageList.forEach((page) => {
      const competitorId = page.fk_competitor_id;
      if (pageCounts[competitorId]) {
        pageCounts[competitorId]++;
      } else {
        pageCounts[competitorId] = 1;
      }
    });
    return pageCounts;
  };
  const pagesByCompetitor = countPagesByCompetitor();
  const filteredPageList = selectedConcurrent
    ? pageList.filter((page) => page.fk_competitor_id === selectedConcurrent.competitor_id)
    : pageList;
  return (
    <Box sx={{ width: 1 }}>
      <Box display="grid" gridTemplateColumns="repeat(16, 1fr)" gap={2}>
        <Box gridColumn="span 6">
          <DashboardCard title="Classement concurrent" subtitle="par nombre d’ouverture">
            <TableContainer
              component={Paper}
              sx={{ boxShadow: 'none', maxHeight: '300px', overflowY: 'auto' }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#F7F9FC' }}>
                    <TableCell>CONCURRENT</TableCell>
                    <TableCell>PAGE</TableCell>
                    <TableCell>COUVERTURE</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow
                    onClick={() => handleConcurrentClick(1)}
                    sx={{
                      cursor: 'pointer',
                      backgroundColor: '#E0F7FA',
                      '&:hover': { backgroundColor: '#F1F1F1' },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton sx={{ padding: '4px', marginRight: '8px' }}>
                          <Visibility sx={{ fontSize: '16px', color: '#0095E8' }} />
                        </IconButton>
                        <Typography color={'#0095E8'}>5</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>1</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </DashboardCard>
        </Box>
        <Box gridColumn="span 6">
          <DashboardCard title="Classement page" subtitle="pour le concurrent sélectionné">
            <TableContainer
              component={Paper}
              sx={{ boxShadow: 'none', maxHeight: '300px', overflowY: 'auto' }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#F7F9FC' }}>
                    <TableCell>PAGE</TableCell>
                    <TableCell>NOMBRE DE PUBLICATIONS</TableCell>
                    <TableCell>COUVERTURE</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow
                    onClick={() => handlePageClick(1)}
                    sx={{
                      cursor: 'pointer',
                      backgroundColor: '#E0F7FA',
                      '&:hover': { backgroundColor: '#F1F1F1' },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton sx={{ padding: '4px', marginRight: '8px' }}>
                          <Visibility sx={{ fontSize: '16px', color: '#0095E8' }} />
                        </IconButton>
                        <Typography color={'#0095E8'}>5</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>3</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </DashboardCard>
        </Box>
        <Box gridColumn="span 4">
          <DashboardCard title="Logo" subtitle="Page 1">
            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={7.4}>
              <Box gridColumn="span 8">
                <img src={logo} style={{ width: '180px', height: '150px' }} />
              </Box>
            </Box>
          </DashboardCard>
        </Box>
      </Box>
    </Box>
  );
}

export default Classement;

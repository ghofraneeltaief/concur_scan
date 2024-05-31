import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Typography,
  Modal,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import DashboardCard from 'src/components/shared/DashboardCard';
import EditIcon from '@mui/icons-material/Edit';
import { FaPlus } from 'react-icons/fa';
import { MdModeEdit } from 'react-icons/md';
import axios from 'axios';
import { BASE_URL, api_version } from '../authentication/config';

const Concurrent = () => {
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [newRowData, setNewRowData] = useState({ name: '', country_id: '' });
  const [selectedRowData, setSelectedRowData] = useState({
    competitor_id: '',
    competitor_name: '',
    fk_country_id: '',
  });

  const getToken = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      return token;
    } else {
      throw new Error('No token available');
    }
  };

  const fetchCompetitors = async (token) => {
    try {
      const responseObject = JSON.parse(token);
      const accessToken = responseObject.access_token;
      const response = await axios.get(
        `${BASE_URL}/${api_version}/competitors?hp_cs_authorization=${accessToken}`,
      );
      const competitors = response.data.map((competitor) => ({
        id: competitor.competitor_id,
        name: competitor.competitor_name,
        country_id: competitor.fk_country_id,
      }));
      setRows(competitors);
    } catch (error) {
      console.error('Error fetching competitors:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        await fetchCompetitors(token);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleAddRow = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    resetForm();
    setOpenDialog(false);
  };

  const handleSaveNewRow = async () => {
    try {
      const token = await getToken();
      const responseObject = JSON.parse(token);
      const accessToken = responseObject.access_token;
      const response = await axios.get(
        `${BASE_URL}/${api_version}/competitors?hp_cs_authorization=${accessToken}`,
      );
      const existingCompetitors = response.data.map((competitor) =>
        competitor.competitor_name.toLowerCase(),
      );
      const newCompetitorName = newRowData.name.toLowerCase();
      if (existingCompetitors.includes(newCompetitorName)) {
        alert('Competitor already exists');
      } else {
        await axios.post(
          `${BASE_URL}/${api_version}/competitors?hp_cs_authorization=${accessToken}`,
          {
            name: newRowData.name,
            country_id: newRowData.country_id,
          },
        );
        setRows([
          ...rows,
          { id: rows.length + 1, name: newRowData.name, country_id: newRowData.country_id },
        ]);
        resetForm();
        setOpenDialog(false);
      }
    } catch (error) {
      console.error('Error adding competitor:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRowData({ ...newRowData, [name]: value });
  };

  const resetForm = () => {
    setNewRowData({ name: '', country_id: '' });
  };

  const handleEditRow = async (row) => {
    try {
      const token = await getToken();
      const responseObject = JSON.parse(token);
      const accessToken = responseObject.access_token;
      const response = await axios.get(
        `${BASE_URL}/${api_version}/competitors/${row.id}?hp_cs_authorization=${accessToken}`,
      );
      const competitorData = response.data;
      setSelectedRowData({
        competitor_id: competitorData.competitor_id,
        competitor_name: competitorData.competitor_name,
        fk_country_id: competitorData.fk_country_id,
      });
      setOpenEditDialog(true);
    } catch (error) {
      console.error('Error loading competitor data for editing:', error);
    }
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedRowData({ ...selectedRowData, [name]: value });
  };

  const handleSaveEditedRow = async () => {
    try {
      const token = await getToken();
      const responseObject = JSON.parse(token);
      const accessToken = responseObject.access_token;
      await axios.put(
        `${BASE_URL}/${api_version}/competitors/${selectedRowData.competitor_id}?hp_cs_authorization=${accessToken}`,
        selectedRowData,
      );
      setRows(
        rows.map((row) =>
          row.id === selectedRowData.competitor_id
            ? {
                ...row,
                name: selectedRowData.competitor_name,
                country_id: selectedRowData.fk_country_id,
              }
            : row,
        ),
      );
      setOpenEditDialog(false);
    } catch (error) {
      console.error('Error saving edited competitor:', error);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 250, align: 'center', headerAlign: 'center' },
    {
      field: 'name',
      headerName: 'Nom',
      editable: true,
      width: 250,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 250,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
        >
          <IconButton size="small" color="primary" onClick={() => handleEditRow(params.row)}>
            <MdModeEdit />
          </IconButton>
        </Box>
      ),
    },
  ];

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Box sx={{ width: 1 }}>
      <DashboardCard title="Gestion Concurrents">
        <Box mb={2} display={'flex'} justifyContent="end">
          <Button variant="contained" onClick={handleAddRow}>
            <FaPlus />
            <Typography sx={{ paddingLeft: '7px' }}>Ajouter</Typography>
          </Button>
        </Box>
        <Modal
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2" mb={5}>
              Ajouter Concurrent
            </Typography>
            <Box mb={2}>
              <TextField
                name="name"
                label="Nom"
                fullWidth
                onChange={handleInputChange}
                sx={{ marginTop: '10px', marginBottom: '10px' }}
              />
            </Box>
            <Box mt={5} display={'flex'} justifyContent="end">
              <Button
                variant="contained"
                color="error"
                style={{ marginRight: '10px' }}
                onClick={handleCloseDialog}
              >
                <Typography>Annuler</Typography>
              </Button>
              <Button variant="contained" color="success" onClick={handleSaveNewRow}>
                <Typography>Valider</Typography>
              </Button>
            </Box>
          </Box>
        </Modal>
        <Modal
          open={openEditDialog}
          onClose={handleCloseEditDialog}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2" mb={5}>
              Modifier Concurrent
            </Typography>
            <Box mb={2}>
              <TextField
                name="competitor_id"
                label="Competitor ID"
                fullWidth
                value={selectedRowData.competitor_id}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ marginTop: '10px', marginBottom: '10px' }}
              />
            </Box>
            <Box mb={2}>
              <TextField
                name="competitor_name"
                label="Nom du concurrent"
                fullWidth
                value={selectedRowData.competitor_name}
                onChange={handleEditInputChange}
                sx={{ marginTop: '10px', marginBottom: '10px' }}
              />
            </Box>
            <Box mb={2}>
              <TextField
                name="fk_country_id"
                label="Country ID"
                fullWidth
                value={selectedRowData.fk_country_id}
                disabled
                sx={{ marginTop: '10px', marginBottom: '10px' }}
              />
            </Box>
            <Box mt={5} display={'flex'} justifyContent="end">
              <Button
                variant="contained"
                color="error"
                style={{ marginRight: '10px' }}
                onClick={handleCloseEditDialog}
              >
                <Typography>Annuler</Typography>
              </Button>
              <Button variant="contained" color="success" onClick={handleSaveEditedRow}>
                <Typography>Valider</Typography>
              </Button>
            </Box>
          </Box>
        </Modal>
        <DataGrid
          slots={{
            toolbar: GridToolbar,
          }}
          rows={rows}
          columns={columns}
          components={{
            Toolbar: () => null,
          }}
        />
      </DashboardCard>
    </Box>
  );
};

export default Concurrent;

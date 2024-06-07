import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Modal,
  FormControl,
  InputLabel,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import { FaPlus } from 'react-icons/fa';
import { BASE_URL, api_version } from '../authentication/config';
import DashboardCard from 'src/components/shared/DashboardCard';
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

function Pages() {
  const [rows, setRows] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [verticals, setVerticals] = useState([]);
  const [competitors, setCompetitors] = useState([]);
  const [errorDialog, setErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [newRowData, setNewRowData] = useState({
    name: '',
    external_id: '',
    vertical: '',
    competitor: '',
  });
  const [selectedRowData, setSelectedRowData] = useState({
    id: '',
    name: '',
    external_id: '',
    vertical: '',
    competitor: '',
    added_by: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const getToken = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      return token;
    } else {
      throw new Error('No token available');
    }
  };

  const fetchVerticals = async (token) => {
    try {
      const token = await getToken();
      const responseObject = JSON.parse(token);
      const accessToken = responseObject.access_token;
      const response = await fetch(
        `${BASE_URL}/${api_version}/verticals?hp_cs_authorization=${accessToken}`,
      );
      const data = await response.json();
      setVerticals(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCompetitors = async (token) => {
    try {
      const token = await getToken();
      const responseObject = JSON.parse(token);
      const accessToken = responseObject.access_token;
      const response = await fetch(
        `${BASE_URL}/${api_version}/competitors?hp_cs_authorization=${accessToken}`,
      );
      const data = await response.json();
      setCompetitors(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPages = async (token, verticals, competitors) => {
    try {
      const token = await getToken();
      const responseObject = JSON.parse(token);
      const accessToken = responseObject.access_token;
      const response = await fetch(
        `${BASE_URL}/${api_version}/pages?hp_cs_authorization=${accessToken}`,
      );
      const data = await response.json();

      const competitorMap = {};
      competitors.forEach((competitor) => {
        competitorMap[competitor.competitor_id] = competitor.competitor_name;
      });

      const verticalMap = {};
      verticals.forEach((vertical) => {
        verticalMap[vertical.vertical_id] = vertical.codified_name;
      });

      const updatedRows = data.map((page) => ({
        id: page.page_id,
        name: page.page_name,
        vertical: verticalMap[page.fk_vertical_id] || '',
        competitor: competitorMap[page.fk_competitor_id] || '',
      }));

      setRows(updatedRows);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    try {
      const token = await getToken();
      const fetchedVerticals = await fetchVerticals(token);
      const fetchedCompetitors = await fetchCompetitors(token);
      await fetchPages(token, fetchedVerticals, fetchedCompetitors);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveNewRow = async () => {
    try {
      const pageExists = rows.some((row) => row.external_id === newRowData.external_id);
      if (pageExists) {
        setErrorMessage('Page already exists');
        setErrorDialog(true);
        return;
      }

      const token = await getToken();
      const responseObject = JSON.parse(token);
      const accessToken = responseObject.access_token;

      const userResponse = await fetch(
        `${BASE_URL}/${api_version}/debug?hp_cs_authorization=${accessToken}`,
      );
      const userData = await userResponse.json();
      const userId = userData.data.user_id;

      const newPageData = {
        name: newRowData.name,
        external_id: newRowData.external_id,
        vertical_id: newRowData.vertical,
        competitor_id: newRowData.competitor,
        added_by: userId,
      };

      const response = await fetch(
        `${BASE_URL}/${api_version}/pages?hp_cs_authorization=${accessToken}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPageData),
        },
      );

      if (response.ok) {
        const data = await response.json();
        const newRow = {
          id: data.page_id,
          name: data.page_name,
          external_id: newPageData.external_id,
          vertical: verticals.find((v) => v.vertical_id === data.vertical_id).codified_name,
          competitor: competitors.find((c) => c.competitor_id === data.competitor_id)
            .competitor_name,
        };
        setRows([...rows, newRow]);
        resetForm();
        setOpen(false);
      } else {
        const errorData = await response.json();
        console.error('Error adding new page:', errorData);
        throw new Error(`Error adding new page: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error adding new page:', error);
    }
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
    resetForm();
  };
  const handleClose = () => setOpen(false);

  const handleCloseErrorDialog = () => {
    setErrorDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRowData({ ...newRowData, [name]: value });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setNewRowData({ ...newRowData, [name]: value });
  };

  const resetForm = () => {
    setNewRowData({ name: '', external_id: '', vertical: '', competitor: '' });
  };

  const handleEditRow = async (row) => {
    try {
      const token = await getToken();
      const responseObject = JSON.parse(token);
      const accessToken = responseObject.access_token;
      const response = await fetch(
        `${BASE_URL}/${api_version}/pages/${row.id}?hp_cs_authorization=${accessToken}`,
      );
      const data = await response.json();
      setSelectedRowData({
        id: data.page_id,
        name: data.page_name,
        external_id: data.page_external_id, // Corrected key to match response
        vertical: data.fk_vertical_id,
        competitor: data.fk_competitor_id,
        added_by: data.added_by,
      });
      setOpenEditDialog(true);
    } catch (error) {
      console.error('Error fetching page data:', error);
    }
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedRowData({ ...selectedRowData, [name]: value });
  };

  const handleEditSelectChange = (e) => {
    const { name, value } = e.target;
    setSelectedRowData({ ...selectedRowData, [name]: value });
  };

  const handleSaveEditedRow = async () => {
    try {
      const token = await getToken();
      const responseObject = JSON.parse(token);
      const accessToken = responseObject.access_token;

      const updatedPageData = {
        name: selectedRowData.name,
        external_id: selectedRowData.external_id,
        vertical_id: selectedRowData.vertical,
        competitor_id: selectedRowData.competitor,
        added_by: selectedRowData.added_by,
      };

      const response = await fetch(
        `${BASE_URL}/${api_version}/pages/${selectedRowData.id}?hp_cs_authorization=${accessToken}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedPageData),
        },
      );

      if (response.ok) {
        setRows(
          rows.map((row) =>
            row.id === selectedRowData.id
              ? {
                  ...selectedRowData,
                  vertical: verticals.find((v) => v.vertical_id === selectedRowData.vertical)
                    .codified_name,
                  competitor: competitors.find(
                    (c) => c.competitor_id === selectedRowData.competitor,
                  ).competitor_name,
                }
              : row,
          ),
        );
        setOpenEditDialog(false);
      } else {
        const errorData = await response.json();
        console.error('Error updating page:', errorData);
        throw new Error(`Error updating page: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating page:', error);
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
      field: 'vertical',
      headerName: 'Verticale',
      editable: true,
      width: 250,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'competitor',
      headerName: 'Competitor',
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
            <EditIcon />
          </IconButton>
        </Box>
      ),
    },
  ];
  /* Begin: Style select */
  const ITEM_HEIGHT = 30;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 270,
      },
    },
  };
  /* End: Style select */
  return (
    <Box sx={{ width: 1 }}>
      <DashboardCard title="Gestion des Pages">
        <Box mb={2} display={'flex'} justifyContent="end">
          <Button color='success' variant="contained" onClick={handleOpen}>
            <FaPlus />
            <Typography sx={{ paddingLeft: '7px' }}>Ajouter</Typography>
          </Button>
        </Box>
        <DataGrid
        slots={{
          toolbar: GridToolbar,
        }}
          autoHeight
          rows={rows}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          disableSelectionOnClick
        />
      </DashboardCard>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" mb={5}>
            Ajouter Page
          </Typography>
          <Box mb={2}>
            <TextField
              id="outlined-basic"
              label="Nom"
              name="name"
              value={newRowData.name}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
            />
          </Box>
          <Box mb={2}>
            <TextField
              id="outlined-basic"
              label="External Id"
              name="external_id"
              value={newRowData.external_id}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
            />
          </Box>
          <Box mb={2}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Verticale</InputLabel>
              <Select
                name="vertical"
                value={newRowData.vertical}
                onChange={handleSelectChange}
                fullWidth
                MenuProps={MenuProps}
              >
                {verticals.map((vertical) => (
                  <MenuItem key={vertical.vertical_id} value={vertical.vertical_id}>
                    {vertical.codified_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box mb={2}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Concurrent</InputLabel>
              <Select
                name="competitor"
                value={newRowData.competitor}
                onChange={handleSelectChange}
                fullWidth
                MenuProps={MenuProps}
              >
                {competitors.map((competitor) => (
                  <MenuItem key={competitor.competitor_id} value={competitor.competitor_id}>
                    {competitor.competitor_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box mt={5} display={'flex'} justifyContent="end">
            <Button
              variant="contained"
              color="error"
              style={{ marginRight: '10px' }}
              onClick={handleClose}
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
            Modifier Page
          </Typography>
          <Box mb={2}>
            <TextField
              id="outlined-basic"
              label="Nom"
              name="name"
              value={selectedRowData.name}
            onChange={handleEditInputChange}
              variant="outlined"
              fullWidth
            />
          </Box>
          <Box mb={2}>
            <TextField
              id="outlined-basic"
              label="External Id"
              name="external_id"
              value={selectedRowData.external_id}
            disabled
              variant="outlined"
              fullWidth
            />
          </Box>
          <Box mb={2}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Verticale</InputLabel>
              <Select
              name="vertical"
              value={selectedRowData.vertical}
             disabled
              fullWidth
            >
              {verticals.map((vertical) => (
                <MenuItem key={vertical.vertical_id} value={vertical.vertical_id}>
                  {vertical.codified_name}
                </MenuItem>
              ))}
            </Select>
            </FormControl>
          </Box>
          <Box mb={2}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Concurrent</InputLabel>
              <Select
              name="competitor"
              value={selectedRowData.competitor}
              disabled
              fullWidth
            >
              {competitors.map((competitor) => (
                <MenuItem key={competitor.competitor_id} value={competitor.competitor_id}>
                  {competitor.competitor_name}
                </MenuItem>
              ))}
            </Select>
            </FormControl>
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
      <Modal open={errorDialog} onClose={handleCloseErrorDialog}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          bgcolor="background.paper"
          border="2px solid #000"
          boxShadow={24}
          p={4}
        >
          <Typography variant="h6" component="h2">
            Error
          </Typography>
          <Typography sx={{ mt: 2 }}>{errorMessage}</Typography>
        </Box>
      </Modal>
    </Box>
  );
}

export default Pages;

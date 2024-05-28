import React, { useState, useEffect } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, IconButton, Typography, Modal, FormControl, InputLabel } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import { FaPlus } from 'react-icons/fa';
import { BASE_URL, api_version } from '../authentication/config';
import DashboardCard from 'src/components/shared/DashboardCard';

const Pages = () => {
    const [rows, setRows] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [verticals, setVerticals] = useState([]);
    const [competitors, setCompetitors] = useState([]);
    const [errorDialog, setErrorDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [newRowData, setNewRowData] = useState({ name: '', external_id: '', vertical: '', competitor: '' });
    const [selectedRowData, setSelectedRowData] = useState({ id: '', name: '', external_id: '', vertical: '', competitor: '', added_by: '' });

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

    const fetchVerticals = async () => {
        try {
            const token = await getToken();
            const responseObject = JSON.parse(token);
            const accessToken = responseObject.access_token;
            const requestOptions = {
                method: 'GET',
            };
            const response = await fetch(
                `${BASE_URL}/${api_version}/verticals?hp_cs_authorization=${accessToken}`,
                requestOptions,
            );
            const data = await response.json();
            setVerticals(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCompetitors = async () => {
        try {
            const token = await getToken();
            const responseObject = JSON.parse(token);
            const accessToken = responseObject.access_token;
            const requestOptions = {
                method: 'GET',
            };
            const response = await fetch(
                `${BASE_URL}/${api_version}/competitors?hp_cs_authorization=${accessToken}`,
                requestOptions,
            );
            const data = await response.json();
            setCompetitors(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchPages = async () => {
        try {
            const token = await getToken();
            const responseObject = JSON.parse(token);
            const accessToken = responseObject.access_token;
            const requestOptions = {
                method: 'GET',
            };
            const response = await fetch(
                `${BASE_URL}/${api_version}/pages?hp_cs_authorization=${accessToken}`,
                requestOptions,
            );
            const data = await response.json();

            const competitorMap = {};
            competitors.forEach(competitor => {
                competitorMap[competitor.competitor_id] = competitor.competitor_name;
            });

            const verticalMap = {};
            verticals.forEach(vertical => {
                verticalMap[vertical.vertical_id] = vertical.codified_name;
            });

            const updatedRows = data.map(page => ({
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
        await fetchVerticals();
        await fetchCompetitors();
        await fetchPages();
    };

    const handleSaveNewRow = async () => {
        try {
            const pageExists = rows.some(row => row.external_id === newRowData.external_id);
            if (pageExists) {
                setErrorMessage('Page already exists');
                setErrorDialog(true);
                return;
            }

            const token = await getToken();
            const responseObject = JSON.parse(token);
            const accessToken = responseObject.access_token;

            const userResponse = await fetch(`${BASE_URL}/${api_version}/debug?hp_cs_authorization=${accessToken}`);
            const userData = await userResponse.json();
            const userId = userData.data.user_id;

            const newPageData = {
                name: newRowData.name,
                external_id: newRowData.external_id,
                vertical_id: newRowData.vertical,
                competitor_id: newRowData.competitor,
                added_by: userId,
            };

            const response = await fetch(`${BASE_URL}/${api_version}/pages?hp_cs_authorization=${accessToken}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPageData),
            });

            if (response.ok) {
                const data = await response.json();
                const newRow = {
                    id: data.page_id,
                    name: data.page_name,
                    external_id: newPageData.external_id,
                    vertical: verticals.find(v => v.vertical_id === data.vertical_id).codified_name,
                    competitor: competitors.find(c => c.competitor_id === data.competitor_id).competitor_name,
                };
                setRows([...rows, newRow]);
                resetForm();
                setOpenDialog(false);
            } else {
                const errorData = await response.json();
                console.error('Error adding new page:', errorData);
                throw new Error(`Error adding new page: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error adding new page:', error);
        }
    };

    const handleAddRow = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        resetForm();
        setOpenDialog(false);
    };

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

    const handleEditRow = (row) => {
        setSelectedRowData(row);
        setOpenEditDialog(true);
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

    const handleSaveEditedRow = () => {
        setRows(rows.map(row => (row.id === selectedRowData.id ? selectedRowData : row)));
        setOpenEditDialog(false);
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 250, align: "center", headerAlign: "center" },
        { field: 'name', headerName: 'Name', editable: true, width: 250, align: "center", headerAlign: "center" },
        { field: 'vertical', headerName: 'Vertical', editable: true, width: 250, align: "center", headerAlign: "center" },
        { field: 'competitor', headerName: 'Competitor', editable: true, width: 250, align: "center", headerAlign: "center" },
        {
            field: 'action',
            headerName: 'Action',
            width: 250,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <IconButton size="small" color="primary" onClick={() => handleEditRow(params.row)}>
                        <EditIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <Box sx={{ width: 1 }}>
            <DashboardCard title="Gestion Pages">
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
                    <Box sx={{ ...style, width: 400 }}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" mb={5}>
                            Ajouter Page
                        </Typography>
                        <Box mb={2}>
                            <TextField name="name" label="Name" fullWidth value={newRowData.name} onChange={handleInputChange} sx={{ marginTop: '10px', marginBottom: '10px' }} />
                        </Box>
                        <Box mb={2}>
                            <TextField name="external_id" label="External ID" fullWidth value={newRowData.external_id} onChange={handleInputChange} sx={{ marginTop: '10px', marginBottom: '10px' }} />
                        </Box>
                        <Box mb={2}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Verticale</InputLabel>
                                <Select name="vertical" value={newRowData.vertical} fullWidth onChange={handleSelectChange} sx={{ marginTop: '10px', marginBottom: '10px' }}>
                                    {verticals.map(vertical => (
                                        <MenuItem key={vertical.vertical_id} value={vertical.vertical_id}>
                                            {vertical.codified_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box mb={2}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Concurrents</InputLabel>
                                <Select name="competitor" value={newRowData.competitor} fullWidth onChange={handleSelectChange} sx={{ marginTop: '10px', marginBottom: '10px' }}>
                                    {competitors.map(competitor => (
                                        <MenuItem key={competitor.competitor_id} value={competitor.competitor_id}>
                                            {competitor.competitor_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>Annuler</Button>
                            <Button onClick={handleSaveNewRow}>Enregistrer</Button>
                        </DialogActions>
                    </Box>
                </Modal>
                <Modal
                    open={openEditDialog}
                    onClose={handleCloseEditDialog}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={{ ...style, width: 400 }}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" mb={5}>
                            Modifier Page
                        </Typography>
                        <Box mb={2}>
                            <TextField name="name" label="Name" fullWidth value={selectedRowData.name} onChange={handleEditInputChange} sx={{ marginTop: '10px', marginBottom: '10px' }} />
                        </Box>
                        <Box mb={2}>
                            <TextField name="external_id" label="External ID" fullWidth value={selectedRowData.external_id} onChange={handleEditInputChange} sx={{ marginTop: '10px', marginBottom: '10px' }} />
                        </Box>
                        <Box mb={2}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Verticale</InputLabel>
                                <Select name="vertical" value={selectedRowData.vertical} fullWidth onChange={handleEditSelectChange} sx={{ marginTop: '10px', marginBottom: '10px' }}>
                                    {verticals.map(vertical => (
                                        <MenuItem key={vertical.vertical_id} value={vertical.vertical_id}>
                                            {vertical.codified_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box mb={2}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Concurrents</InputLabel>
                                <Select name="competitor" value={selectedRowData.competitor} fullWidth onChange={handleEditSelectChange} sx={{ marginTop: '10px', marginBottom: '10px' }}>
                                    {competitors.map(competitor => (
                                        <MenuItem key={competitor.competitor_id} value={competitor.competitor_id}>
                                            {competitor.competitor_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <DialogActions>
                            <Button onClick={handleCloseEditDialog}>Annuler</Button>
                            <Button onClick={handleSaveEditedRow}>Enregistrer</Button>
                        </DialogActions>
                    </Box>
                </Modal>
                <Box sx={{ width: '100%', marginTop: '10px' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={5}
                        autoHeight
                        disableSelectionOnClick
                        components={{
                            Toolbar: GridToolbar,
                        }}
                    />
                </Box>
                <Dialog open={errorDialog} onClose={handleCloseErrorDialog}>
                    <DialogTitle>Erreur</DialogTitle>
                    <DialogContent>
                        <Typography>{errorMessage}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseErrorDialog}>Fermer</Button>
                    </DialogActions>
                </Dialog>
            </DashboardCard>
        </Box>
    );
};

export default Pages;

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

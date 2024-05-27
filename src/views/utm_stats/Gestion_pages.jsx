import React, { useState } from 'react';
import { Box } from '@mui/material';
import DashboardCard from 'src/components/shared/DashboardCard';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// Importez logos
import facebook from '../../assets/images/logos/facebook.png';
import google from '../../assets/images/logos/google.png';
import Button from '@mui/material/Button';
import { FaPlus } from 'react-icons/fa';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

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
  const [selectedOptions, setSelectedOptions] = useState(null);
  const [value, setValue] = useState('1');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const platforms = [
    { icon: facebook, label: 'Facebook', value: '1' },
    { icon: google, label: 'Google', value: '2' },
  ];

  // Options pour le Select avec des cases à cocher
  const selectOptions = platforms.map((platform) => ({
    label: platform.label,
    value: platform.value,
  }));
  // Filtrer les plateformes sélectionnées
  const selectedPlatforms = platforms.filter((platform) =>
    selectedOptions ? selectedOptions.some((option) => option.value === platform.value) : true,
  );
  const columns = [
    { field: 'id', headerName: 'ID', width:250, },
    {
      field: 'Name',
      headerName: 'Name',
      editable: true,
      width:250,
    },
    {
      field: 'Vertical',
      headerName: 'Vertical',
      editable: true,
      width:250,
    },
    {
      field: 'Competitor',
      headerName: 'Competitor',
      editable: true,
      width:250,
    },
    {
      field: 'Action',
      headerName: 'Action',
      editable: true,
      width:250,
    },
  ];

  const rows = [{ id: 1, Vertical: 'Snow', Action: 14 }];
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
          <DashboardCard title="Gestion Pages">
            <Box mb={2} display={'flex'} justifyContent="end">
              <Button variant="contained" onClick={handleOpen}>
                <FaPlus />
                <Typography sx={{ paddingLeft: '7px' }}>Ajouter</Typography>
              </Button>
            </Box>
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
                <TextField id="outlined-basic" label="Name" variant="outlined" fullWidth /></Box>
                <Box mb={2}><TextField id="outlined-basic" label="External Id" variant="outlined" fullWidth /></Box>
                <Box mb={2}>
                <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Verticale</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Verticale"
          onChange={handleChange}
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl></Box>
              <Box mb={2}>
              <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Concurrent</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Concurrent"
          onChange={handleChange}
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl></Box>
              <Box>
                <TextField id="outlined-basic" label="Ajouter par" variant="outlined" fullWidth /></Box>
                <Box mt={5} display={'flex'} justifyContent="end">
                  <Button variant="contained" color='error' style={{marginRight:'10px'}} onClick={handleClose}>
                    <Typography>Annuler</Typography>
                  </Button>
                  <Button variant="contained" color='success'>
                    <Typography>Valider</Typography>
                  </Button>
                </Box>
              </Box>
            </Modal>
            <Box sx={{ width: '100%' }}>
              <DataGrid
                slots={{
                  toolbar: GridToolbar,
                }}
                rows={rows}
                columns={columns}
                components={{
                  Toolbar: () => null,
                }}
                fullWidth
              /></Box>
          </DashboardCard>
        </Box>
  );
}
export default Pages;

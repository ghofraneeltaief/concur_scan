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
import Select from 'react-select';

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
function Dashboard() {
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
    { field: 'id', headerName: 'ID', width: 220 },
    {
      field: 'Keywords',
      headerName: 'Keywords',
      width: 220,
      editable: true,
    },
    {
      field: 'Action',
      headerName: 'Action',
      width: 220,
      editable: true,
    },
  ];

  const rows = [{ id: 1, Keywords: 'Snow', Action: 14 }];
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
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
        <Box gridColumn="span 7">
          <DashboardCard title="Gestion Keywords">
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
                  Ajouter Keywords
                </Typography>
                <TextField id="outlined-basic" label="Keyword" variant="outlined" fullWidth />
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
            <Box>
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
            </Box>
          </DashboardCard>
        </Box>
        <Box gridColumn="span 5">
          <DashboardCard title="Ajouter keywords aux verticales">
            <Box>
              <Select
                name="Verticale"
                placeholder="Verticales"
                isSearchable={true}
                MenuProps={MenuProps}
                className="basic-single"
                classNamePrefix="select"
                menuPortalTarget={document.body}
                menuPosition={'fixed'}
              />
            </Box>
            <Box>
              <Typography mt={5} variant="h6">
                Selected Keywords
              </Typography>
            </Box>
          </DashboardCard>
        </Box>
      </Box>
    </Box>
  );
}
export default Dashboard;

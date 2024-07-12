import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  IconButton,
  TableContainer,
  TableHead,
  TableBody,
  Table,
  TableRow,
  TableCell,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { BASE_URL, api_version } from '../authentication/config';
import DashboardCard from 'src/components/shared/DashboardCard';
import { FaPlus } from 'react-icons/fa';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Gestionkeywords from './gestion_keywords';
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

function Angles() {
  const [selectedOptions, setSelectedOptions] = useState(null);
  const [verticals, setVerticals] = useState([]);
  const [Angles, setAngles] = useState([]);
  const [open, setOpen] = useState(false);
  const [newAngle, setNewAngle] = useState('');
  const [selectedVertical, setSelectedVertical] = useState('');
  const [assignedAngles, setAssignedAngles] = useState([]);
  const [selectedAngles, setSelectedAngles] = useState([]);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [currentAngle, setCurrentAngle] = useState({ angle_id: '', label: '' });

  async function getToken() {
    const token = localStorage.getItem('token');
    if (token) {
      return token;
    } else {
      throw new Error('No token available');
    }
  }

  const fetchVerticals = async () => {
    try {
      const token = await getToken();
      const responseObject = JSON.parse(token);
      const accessToken = responseObject.access_token;
      const response = await fetch(
        `${BASE_URL}/${api_version}/verticals?hp_cs_authorization=${accessToken}`,
      );
      const data = await response.json();
      setVerticals(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllAngles = async () => {
    try {
      const token = await getToken();
      const responseObject = JSON.parse(token);
      const accessToken = responseObject.access_token;
      const response = await fetch(
        `${BASE_URL}/${api_version}/Angles?hp_cs_authorization=${accessToken}`,
      );
      const data = await response.json();
      setAngles(data);
    } catch (error) {
      console.error('Error fetching Angles:', error);
      if (error.message === 'Unauthorized') {
        Swal.fire({
          icon: 'error',
          text: 'Votre session a expiré. Veuillez vous reconnecter.',
          confirmButtonColor: '#d33',
        }).then(() => {
          // Redirect to login or clear token
        });
      }
    }
  };

  const fetchAssignedAngles = async () => {
    if (selectedVertical) {
      try {
        const token = await getToken();
        const responseObject = JSON.parse(token);
        const accessToken = responseObject.access_token;
        const response = await fetch(
          `${BASE_URL}/${api_version}/verticals/angle/${selectedVertical}?hp_cs_authorization=${accessToken}`,
        );
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setAssignedAngles(data);
        } else {
          setAssignedAngles([]);
        }
      } catch (error) {
        console.error('Error fetching assigned Angles:', error);
        if (error.message === 'Unauthorized') {
          Swal.fire({
            icon: 'error',
            text: 'Votre session a expiré. Veuillez vous reconnecter.',
            confirmButtonColor: '#d33',
          }).then(() => {
            // Redirect to login or clear token
          });
        }
      }
    } else {
      setAssignedAngles([]);
    }
  };

  useEffect(() => {
    fetchVerticals();
    fetchAllAngles();
  }, []);

  useEffect(() => {
    fetchAssignedAngles();
  }, [selectedVertical]);

  const handleAddAngleToVertical = async (Angle) => {
    try {
      const token = await getToken();
      const responseObject = JSON.parse(token);
      const accessToken = responseObject.access_token;
      const response = await fetch(
        `${BASE_URL}/${api_version}/verticals/angle/${selectedVertical}?hp_cs_authorization=${accessToken}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ angle_id: Angle.angle_id }),
        },
      );

      if (response.ok) {
        setAssignedAngles((prevAngles) => [...prevAngles, Angle]);
        Swal.fire({
          icon: 'success',
          text: `Angel "${Angle.angle_label}" ajouté avec succés!`,
          confirmButtonColor: '	#008000',
        });
      } else {
        throw new Error('Impossible d`ajouter l`angle à la verticale.');
      }
    } catch (error) {
      console.error('L`angle est déjà existe');
      Swal.fire({
        icon: 'error',
        text: 'L`angle est déjà existe',
        confirmButtonColor: '#d33',
      });
    }
  };

  const handleRemoveAngleFromVertical = async (Angle) => {
    try {
      const token = await getToken();
      const responseObject = JSON.parse(token);
      const accessToken = responseObject.access_token;
      const response = await fetch(
        `${BASE_URL}/${api_version}/verticals/angle/${selectedVertical}?hp_cs_authorization=${accessToken}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ angle_id: Angle.angle_id }),
        },
      );

      if (response.ok) {
        setAssignedAngles(assignedAngles.filter((kw) => kw.angle_id !== Angle.angle_id));
        Swal.fire({
          icon: 'success',
          text: `Angel "${Angle.angle_label}" supprimé avec succés`,
          confirmButtonColor: '	#008000',
        });
      } else {
        throw new Error('Impossible de supprimer l`angle de la verticale.');
      }
    } catch (error) {
      console.error('Error removing Angle from vertical:', error);
      Swal.fire({
        icon: 'error',
        text: `Erreur de suppression l'angle de la verticale: ${error.message}`,
        confirmButtonColor: '#d33',
      });
    }
  };
  const handleOpenUpdateModal = (angle) => {
    setCurrentAngle(angle);
    setOpenUpdateModal(true);
  };

  const handleUpdateAngleLabelChange = (e) => {
    setCurrentAngle({ ...currentAngle, label: e.target.value });
  };

  const handleAddNewAngle = async () => {
    if (newAngle.trim()) {
      try {
        const token = await getToken();
        const responseObject = JSON.parse(token);
        const accessToken = responseObject.access_token;
        const response = await fetch(
          `${BASE_URL}/${api_version}/Angles?hp_cs_authorization=${accessToken}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ label: newAngle.trim() }),
          },
        );
        if (response.ok) {
          const responseMessage = await response.json();
          console.log('API Response:', responseMessage); // Affiche le message de réponse
          // Si le message de réponse est "Angle created", faites une requête supplémentaire
          if (responseMessage[0] === 'Angle created') {
            await fetchAllAngles(); // Rafraîchir la liste des mots-clés
            setNewAngle('');
            setOpen(false);
            Swal.fire({
              icon: 'success',
              text: `Angle "${newAngle.trim()}" ajouté avec succès!`,
              confirmButtonColor: '	#008000',
            });
          } else {
            throw new Error('Réponse inattendue du serveur.');
          }
        } else {
          throw new Error('Échec de l`ajout du nouveau angle.');
        }
      } catch (error) {
        console.error('Erreur l`ajout du nouveau angle:', error);
        Swal.fire({
          icon: 'error',
          text: `Erreur lors de l'ajout du nouveau angle: ${error.message}`,
          confirmButtonColor: '#d33',
        });
      }
    }
  };
  const handleAddAngleToAllVerticals = async (Angle) => {
    try {
      const token = await getToken();
      const responseObject = JSON.parse(token);
      const accessToken = responseObject.access_token;

      for (const vertical of verticals) {
        const response = await fetch(
          `${BASE_URL}/${api_version}/verticals/angle/${vertical.vertical_id}?hp_cs_authorization=${accessToken}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ angle_id: Angle.angle_id }),
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to add Angle to vertical ${vertical.vertical_id}`);
        }
      }
      fetchAssignedAngles();
      Swal.fire({
        icon: 'success',
        text: `Angle "${Angle.angle_label}" ajouté à tous les verticales avec succès !`,
        confirmButtonColor: '	#008000',
      });
    } catch (error) {
      console.error('Erreur d`ajout l`angle à toutes les verticales:', error);
      Swal.fire({
        icon: 'error',
        text: `Erreur d'ajout l'angle à toutes les verticales: ${error.message}`,
        confirmButtonColor: '#d33',
      });
    }
  };
  const handleUpdateAngle = async (angle_id, updatedLabel) => {
    try {
      const token = await getToken();
      const responseObject = JSON.parse(token);
      const accessToken = responseObject.access_token;
      const response = await fetch(
        `${BASE_URL}/${api_version}/Angles/${angle_id}?hp_cs_authorization=${accessToken}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ label: updatedLabel }),
        },
      );

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          text: `Angle "${updatedLabel}" mis à jour avec succès!`,
          confirmButtonColor: '#008000',
        });
        fetchAllAngles(); // Refresh the angles list
        setOpenUpdateModal(false);
      } else {
        throw new Error('Échec de la mise à jour de l`angle.');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l`angle:', error);
      Swal.fire({
        icon: 'error',
        text: `Erreur lors de la mise à jour de l'angle: ${error.message}`,
        confirmButtonColor: '#d33',
      });
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    {
      field: 'Angles',
      headerName: 'Angles',
      width: 220,
      editable: true,
    },
    {
      field: 'Edit',
      headerName: 'Edit',
      width: 100,
      renderCell: (params) => (
        <IconButton color="primary" onClick={() => handleOpenUpdateModal(params.row)}>
          <EditIcon />
        </IconButton>
      ),
    },
    {
      field: 'Add',
      headerName: 'Add',
      width: 100,
      renderCell: (params) => (
        <IconButton color="success" onClick={() => handleAddAngleToVertical(params.row)}>
          <AddIcon />
        </IconButton>
      ),
    },
    {
      field: ' Add to All',
      headerName: 'Add to All',
      width: 120,
      renderCell: (params) => (
        <Button
          onClick={() => handleAddAngleToAllVerticals(params.row)}
          variant="contained"
          color="success"
        >
          Add to all
        </Button>
      ),
    },
  ];

  const rows = Angles.map((Angle, index) => ({
    id: Angle.angle_id || index.toString(),
    Angles: Angle.angle_label,
    angle_id: Angle.angle_id, // Including angle_id for easy access
    label: Angle.angle_label,
  }));

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
  console.log(assignedAngles);
  return (
    <Box sx={{ width: 1 }}>
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
        <Box gridColumn="span 7">
          <DashboardCard title="Gestion des Angles">
            <Box mb={2} display={'flex'} justifyContent="end">
              <Button color="success" variant="contained" onClick={() => setOpen(true)}>
                <FaPlus />
                <Typography sx={{ paddingLeft: '7px' }}>Ajouter</Typography>
              </Button>
            </Box>
            <Modal
              open={open}
              onClose={() => setOpen(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2" mb={5}>
                  Ajouter Angle
                </Typography>
                <TextField
                  id="outlined-basic"
                  label="Angle"
                  variant="outlined"
                  fullWidth
                  value={newAngle}
                  onChange={(e) => setNewAngle(e.target.value)}
                />
                <Box mt={5} display={'flex'} justifyContent="end">
                  <Button
                    variant="contained"
                    color="error"
                    style={{ marginRight: '10px' }}
                    onClick={() => setOpen(false)}
                  >
                    <Typography>Annuler</Typography>
                  </Button>
                  <Button color="success" variant="contained" onClick={handleAddNewAngle}>
                    <Typography>Ajouter</Typography>
                  </Button>
                </Box>
              </Box>
            </Modal>
            <Box sx={{ height: 600, width: '100%' }}>
              <DataGrid
                slots={{
                  toolbar: GridToolbar,
                }}
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 20]}
                components={{ Toolbar: GridToolbar }}
              />
            </Box>
          </DashboardCard>
        </Box>
        <Box gridColumn="span 5">
          <DashboardCard title="Verticals">
            <Select
              defaultValue={selectedOptions}
              onChange={(option) => {
                setSelectedVertical(option.value);
                setSelectedOptions(option); // Ensure selectedOptions is updated
              }}
              options={verticals.map((vertical) => ({
                value: vertical.vertical_id,
                label: vertical.codified_name,
              }))}
              isSearchable={true}
              name="Verticale"
              placeholder="Verticales"
              MenuProps={MenuProps}
              className="basic-single"
              classNamePrefix="select"
              menuPortalTarget={document.body}
              menuPosition={'fixed'}
            />
            {selectedVertical && (
              <Box mt={2}>
                <Typography variant="h6">Angle attribués pour {selectedOptions?.label}</Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Angle</TableCell>
                        <TableCell align="right">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {assignedAngles.length === 1 && assignedAngles[0] === 'No Angles founded' ? (
                        <TableRow>
                          <TableCell colSpan={2}>
                            <Typography align="center">
                              Aucun Angle attribué à ce vertical.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        assignedAngles
                          .filter((Angle) => Angle.angle_id && Angle.angle_label)
                          .map((Angle) => (
                            <TableRow key={Angle.angle_id}>
                              <TableCell>{Angle.angle_label}</TableCell>
                              <TableCell align="right">
                                <IconButton
                                  color="error"
                                  onClick={() => handleRemoveAngleFromVertical(Angle)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </DashboardCard>
          <Modal
            open={openUpdateModal}
            onClose={() => setOpenUpdateModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2" mb={5}>
                Mettre à jour l'angle
              </Typography>
              <TextField
                id="outlined-basic"
                label="Angle"
                variant="outlined"
                fullWidth
                value={currentAngle.label} 
                onChange={handleUpdateAngleLabelChange} 
              />
              <Box mt={5} display={'flex'} justifyContent="end">
                <Button
                  variant="contained"
                  color="error"
                  style={{ marginRight: '10px' }}
                  onClick={() => setOpenUpdateModal(false)}
                >
                  <Typography>Annuler</Typography>
                </Button>
                <Button
                  color="success"
                  variant="contained"
                  onClick={() => handleUpdateAngle(currentAngle.angle_id, currentAngle.label)}
                >
                  <Typography>Mettre à jour</Typography>
                </Button>
              </Box>
            </Box>
          </Modal>
        </Box>
        <Box gridColumn="span 7">
<Gestionkeywords />
        </Box>
      </Box>
    </Box>
    
  );
}

export default Angles;

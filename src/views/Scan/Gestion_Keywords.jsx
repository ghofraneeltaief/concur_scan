import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  IconButton,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { BASE_URL, api_version } from '../authentication/config';
import DashboardCard from 'src/components/shared/DashboardCard';
import { FaPlus } from 'react-icons/fa';
import EditIcon from '@mui/icons-material/Edit';

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

function Keywords() {
  const [selectedOptions, setSelectedOptions] = useState(null);
  const [verticals, setVerticals] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [angles, setAngles] = useState([]); // Nouvel état pour les angles
  const [open, setOpen] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  const [selectedVertical, setSelectedVertical] = useState('');
  const [selectedAngle, setSelectedAngle] = useState(''); // Nouvel état pour l'angle sélectionné
  const [assignedKeywords, setAssignedKeywords] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [currentKeyword, setCurrentKeyword] = useState({ keyword_id: '', label: '', angle_id: '' });
console.log(currentKeyword)

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

  const fetchAllKeywords = async () => {
    try {
      const token = await getToken();
      const responseObject = JSON.parse(token);
      const accessToken = responseObject.access_token;
  
      // Fetch angles first
      const angleResponse = await fetch(
        `${BASE_URL}/${api_version}/angles?hp_cs_authorization=${accessToken}`,
      );
      const angleData = await angleResponse.json();
  
      // Fetch keywords
      const keywordResponse = await fetch(
        `${BASE_URL}/${api_version}/keywords?hp_cs_authorization=${accessToken}`,
      );
      const keywordData = await keywordResponse.json();
      
      // Join keywords with angles to include angle_label
      const updatedKeywords = keywordData.map((keyword) => {
        const angle = angleData.find(angle => angle.angle_id === keyword.fk_angle_id);
        return {
          ...keyword,
          angle_label: angle ? angle.angle_label : 'Unknown', // Handle case where angle might not be found
        };
      });
  
      setKeywords(updatedKeywords);
    } catch (error) {
      console.error('Error fetching keywords:', error);
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
  
  

  const fetchAssignedKeywords = async () => {
    if (selectedVertical) {
      try {
        const token = await getToken();
        const responseObject = JSON.parse(token);
        const accessToken = responseObject.access_token;
        const response = await fetch(
          `${BASE_URL}/${api_version}/verticals/keyword/${selectedVertical}?hp_cs_authorization=${accessToken}`,
        );
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setAssignedKeywords(data);
        } else {
          setAssignedKeywords([]);
        }
      } catch (error) {
        console.error('Error fetching assigned keywords:', error);
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
      setAssignedKeywords([]);
    }
  };

  const fetchAngles = async () => {
    try {
      const token = await getToken();
      const responseObject = JSON.parse(token);
      const accessToken = responseObject.access_token;
      const response = await fetch(
        `${BASE_URL}/${api_version}/angles?hp_cs_authorization=${accessToken}`,
      );
      const data = await response.json();
      setAngles(data);
    } catch (error) {
      console.error('Error fetching angles:', error);
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

  useEffect(() => {
    fetchVerticals();
    fetchAllKeywords();
    fetchAngles(); // Appel à fetchAngles pour récupérer les angles existants
  }, []);

  useEffect(() => {
    fetchAssignedKeywords();
  }, [selectedVertical]);
  
  const handleOpenUpdateModal = (keyword) => {
    setCurrentKeyword({
      keyword_id: keyword.keyword_id,
      label: keyword.label,
      angle_id: keyword.fk_angle_id // Assurez-vous que angle_id est bien défini ici
    });
    setOpenUpdateModal(true);
  };
  
  const handleUpdateKeywordLabelChange = (e) => {
    setCurrentKeyword({ ...currentKeyword, label: e.target.value });
  };

  const handleAddNewKeyword = async () => {
    if (newKeyword.trim() && selectedAngle) {
      try {
        const token = await getToken();
        const responseObject = JSON.parse(token);
        const accessToken = responseObject.access_token;
        const response = await fetch(
          `${BASE_URL}/${api_version}/keywords?hp_cs_authorization=${accessToken}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ label: newKeyword.trim(), angle_id: selectedAngle }),
          },
        );
        if (response.ok) {
          const responseMessage = await response.json();
          console.log('API Response:', responseMessage); // Affiche le message de réponse
          // Si le message de réponse est "Keyword created", faites une requête supplémentaire
          if (responseMessage[0] === 'Keyword created') {
            await fetchAllKeywords(); // Rafraîchir la liste des mots-clés
            setNewKeyword('');
            setSelectedAngle(''); // Réinitialiser l'angle sélectionné
            setOpen(false);
            Swal.fire({
              icon: 'success',
              text: `Keyword "${newKeyword.trim()}" ajouté avec succès!`,
              confirmButtonColor: '	#008000',
            });
          } else {
            throw new Error('Réponse inattendue du serveur.');
          }
        } else {
          throw new Error('Échec de l`ajout du nouveau keyword.');
        }
      } catch (error) {
        console.error('Erreur l`ajout du nouveau keyword:', error);
        Swal.fire({
          icon: 'error',
          text: `Erreur lors de l'ajout du nouveau keyword: ${error.message}`,
          confirmButtonColor: '#d33',
        });
      }
    }
  };

  const handleUpdateKeyword = async () => {
    try {
      const token = await getToken();
      const responseObject = JSON.parse(token);
      const accessToken = responseObject.access_token;

      const response = await fetch(
        `${BASE_URL}/${api_version}/keywords/${currentKeyword.keyword_id}?hp_cs_authorization=${accessToken}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ label: currentKeyword.label, angle_id: currentKeyword.angle_id }),
        },
      );

      if (response.ok) {
        await fetchAllKeywords();
        setOpenUpdateModal(false);
        Swal.fire({
          icon: 'success',
          text: `Keyword "${currentKeyword.label}" mis à jour avec succès!`,
          confirmButtonColor: '#008000',
        });
      } else {
        const errorResponse = await response.json(); // Parser la réponse pour un message d'erreur plus détaillé
        throw new Error(`Failed to update keyword: ${errorResponse.message}`);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du keyword:', error);
      Swal.fire({
        icon: 'error',
        text: `Erreur lors de la mise à jour du keyword: ${error.message}`,
        confirmButtonColor: '#d33',
      });
    }
  };

  const handleDeleteKeyword = async (keyword) => {
    const confirmed = await Swal.fire({
      title: 'Êtes-vous sûr?',
      text: `Êtes-vous sûr de vouloir supprimer le keyword "${keyword.label}" ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler',
    });

    if (confirmed.isConfirmed) {
      try {
        const token = await getToken();
        const responseObject = JSON.parse(token);
        const accessToken = responseObject.access_token;
        const response = await fetch(
          `${BASE_URL}/${api_version}/keywords/${keyword.keyword_id}?hp_cs_authorization=${accessToken}`,
          {
            method: 'DELETE',
          },
        );
        if (response.ok) {
          await fetchAllKeywords();
          Swal.fire({
            icon: 'success',
            text: `Keyword "${keyword.label}" supprimé avec succès!`,
            confirmButtonColor: '	#008000',
          });
        } else {
          throw new Error('Échec de la suppression du keyword.');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression du keyword:', error);
        Swal.fire({
          icon: 'error',
          text: `Erreur lors de la suppression du keyword: ${error.message}`,
          confirmButtonColor: '#d33',
        });
      }
    }
  };

  const handleVerticalChange = (event) => {
    setSelectedVertical(event.target.value);
  };

  const handleKeywordChange = (selected) => {
    setSelectedKeywords(selected);
  };

  const handleAssignKeywords = async () => {
    try {
      const token = await getToken();
      const responseObject = JSON.parse(token);
      const accessToken = responseObject.access_token;

      const keywordIds = selectedKeywords.map((keyword) => keyword.value);
      const response = await fetch(
        `${BASE_URL}/${api_version}/verticals/keyword/${selectedVertical}?hp_cs_authorization=${accessToken}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ keyword_ids: keywordIds }),
        },
      );

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          text: `Keywords assignés à la verticale "${selectedVertical}" avec succès!`,
          confirmButtonColor: '	#008000',
        });
        fetchAssignedKeywords();
      } else {
        throw new Error('Échec de l`assignation des keywords.');
      }
    } catch (error) {
      console.error('Erreur d`assignation des keywords:', error);
      Swal.fire({
        icon: 'error',
        text: `Erreur d'assignation des keywords: ${error.message}`,
        confirmButtonColor: '#d33',
      });
    }
  };

  const verticalOptions = verticals.map((vertical) => ({
    value: vertical.vertical_id,
    label: vertical.name,
  }));

  const keywordOptions = keywords.map((keyword) => ({
    value: keyword.keyword_id,
    label: keyword.keyword_label,
  }));

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'Keywords', headerName: 'Keywords', width: 300 },
    { field: 'Angle', headerName: 'Angle', width: 300 },
    {
      field: 'Actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleOpenUpdateModal(params.row)}
          color="primary"
          aria-label="edit"
        >
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  const rows = keywords.map((keyword, index) => ({
    id: keyword.keyword_id || index.toString(),
    Keywords: keyword.keyword_label,
    Angle: keyword.angle_label,
    keyword_id: keyword.keyword_id, // Including keyword_id for easy access
    label: keyword.keyword_label,
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
  const handleUpdateAngleChange = (selectedOption) => {
    setCurrentKeyword({
      ...currentKeyword,
      angle_id: selectedOption ? selectedOption.value : ''
    });
  };
  return (
    <>
      <DashboardCard title="Gestion des Keywords">
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
              Ajouter Keyword
            </Typography>
            <TextField
              id="outlined-basic"
              label="Keyword"
              variant="outlined"
              fullWidth
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
            />
            <Select
              options={angles.map((angle) => ({
                value: angle.angle_id,
                label: angle.angle_label,
              }))}
              placeholder="Sélectionnez un angle"
              value={selectedAngle ? { value: selectedAngle, label: angles.find(angle => angle.angle_id === selectedAngle).angle_label } : null}
              onChange={(selectedOption) => setSelectedAngle(selectedOption ? selectedOption.value : null)}
              styles={{
                control: (provided) => ({
                  ...provided,
                  marginTop: 20,
                }),
              }}
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
              <Button color="success" variant="contained" onClick={handleAddNewKeyword}>
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
      <Modal
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" mb={5}>
            Mettre à jour le keyword
          </Typography>
          <TextField
            id="outlined-basic"
            label="Keyword"
            variant="outlined"
            fullWidth
            value={currentKeyword.label}
            onChange={(e) => setCurrentKeyword({ ...currentKeyword, label: e.target.value })}
          />
           <Select
            options={angles.map((angle) => ({ value: angle.angle_id, label: angle.angle_label }))}
            value={
              angles.find((angle) => angle.angle_id === currentKeyword.angle_id)
                ? { value: currentKeyword.angle_id, label: angles.find((angle) => angle.angle_id === currentKeyword.angle_id).angle_label }
                : null
            }
            onChange={handleUpdateAngleChange}
            placeholder="Select Angle"
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
            <Button color="success" variant="contained" onClick={handleUpdateKeyword}>
              <Typography>Mettre à jour</Typography>
            </Button>
          </Box>
        </Box>
      </Modal>

    </>
  );
}

export default Keywords;

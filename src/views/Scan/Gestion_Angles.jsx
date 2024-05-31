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
  const [keywords, setKeywords] = useState([]);
  const [open, setOpen] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  const [selectedVertical, setSelectedVertical] = useState('');
  const [assignedKeywords, setAssignedKeywords] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);

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
      const response = await fetch(
        `${BASE_URL}/${api_version}/keywords?hp_cs_authorization=${accessToken}`,
      );
      const data = await response.json();
      setKeywords(data);
    } catch (error) {
      console.error('Error fetching keywords:', error);
      if (error.message === 'Unauthorized') {
        Swal.fire({
          icon: 'error',
          text: 'Your session has expired. Please log in again.',
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
            text: 'Your session has expired. Please log in again.',
          }).then(() => {
            // Redirect to login or clear token
          });
        }
      }
    } else {
      setAssignedKeywords([]);
    }
  };

  useEffect(() => {
    fetchVerticals();
    fetchAllKeywords();
  }, []);

  useEffect(() => {
    fetchAssignedKeywords();
  }, [selectedVertical]);

  const handleAddKeywordToVertical = async (keyword) => {
    try {
      const token = await getToken();
      const responseObject = JSON.parse(token);
      const accessToken = responseObject.access_token;
      const response = await fetch(
        `${BASE_URL}/${api_version}/verticals/keyword/${selectedVertical}?hp_cs_authorization=${accessToken}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ keyword_id: keyword.keyword_id }),
        },
      );

      if (response.ok) {
        setAssignedKeywords((prevKeywords) => [...prevKeywords, keyword]);
        Swal.fire({
          icon: 'success',
          text: `Angel "${keyword.keyword_label}" ajouté avec success!`,
        });
      } else {
        throw new Error('Failed to add keyword to vertical');
      }
    } catch (error) {
      console.error('Error adding keyword to vertical:', error);
      Swal.fire({
        icon: 'error',
        text: `Error adding keyword: ${error.message}`,
      });
    }
  };

  const handleRemoveKeywordFromVertical = async (keyword) => {
    try {
      const token = await getToken();
      const responseObject = JSON.parse(token);
      const accessToken = responseObject.access_token;
      const response = await fetch(
        `${BASE_URL}/${api_version}/verticals/keyword/${selectedVertical}?hp_cs_authorization=${accessToken}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ keyword_id: keyword.keyword_id }),
        },
      );

      if (response.ok) {
        setAssignedKeywords(assignedKeywords.filter((kw) => kw.keyword_id !== keyword.keyword_id));
        Swal.fire({
          icon: 'success',
          text: `Angel "${keyword.keyword_label}" supprimé avec success`,
        });
      } else {
        throw new Error('Failed to remove keyword from vertical');
      }
    } catch (error) {
      console.error('Error removing keyword from vertical:', error);
      Swal.fire({
        icon: 'error',
        text: `Error removing keyword: ${error.message}`,
      });
    }
  };

  const handleAddNewKeyword = async () => {
    if (newKeyword.trim()) {
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
            body: JSON.stringify({ label: newKeyword.trim() }),
          }
        );
        if (response.ok) {
          const responseMessage = await response.json();
          console.log('API Response:', responseMessage); // Affiche le message de réponse
          // Si le message de réponse est "Keyword created", faites une requête supplémentaire
          if (responseMessage[0] === "Keyword created") {
            await fetchAllKeywords(); // Rafraîchir la liste des mots-clés
            setNewKeyword('');
            setOpen(false);
            Swal.fire({
              icon: 'success',
              text: `Keyword "${newKeyword.trim()}" added successfully!`,
            });
          } else {
            throw new Error('Unexpected response from the server');
          }
        } else {
          throw new Error('Failed to add new keyword');
        }
      } catch (error) {
        console.error('Error adding new keyword:', error);
        Swal.fire({
          icon: 'error',
          text: `Error adding new keyword: ${error.message}`,
        });
      }
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 220 },
    {
      field: 'Keywords',
      headerName: 'Angles',
      width: 220,
      editable: true,
    },
    {
      field: 'Add',
      headerName: 'Add',
      width: 100,
      renderCell: (params) => (
        <IconButton color="primary" onClick={() => handleAddKeywordToVertical(params.row)}>
          <AddIcon />
        </IconButton>
      ),
    },
  ];

  const rows = keywords.map((keyword, index) => ({
    id: keyword.keyword_id || index.toString(),
    Keywords: keyword.keyword_label,
    keyword_id: keyword.keyword_id, // Including keyword_id for easy access
    keyword_label: keyword.keyword_label,
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
  console.log(assignedKeywords);
  return (
    <Box sx={{ width: 1 }}>
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
        <Box gridColumn="span 7">
          <DashboardCard title="Gestion Angles">
            <Box mb={2} display={'flex'} justifyContent="end">
              <Button variant="contained" onClick={() => setOpen(true)}>
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
                  Ajouter Angles
                </Typography>
                <TextField
                  id="outlined-basic"
                  label="Keyword"
                  variant="outlined"
                  fullWidth
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
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
                  <Button variant="contained" onClick={handleAddNewKeyword}>
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
                      {assignedKeywords.length === 1 &&
                      assignedKeywords[0] === 'No Keywords founded' ? (
                        <TableRow>
                          <TableCell colSpan={2}>
                            <Typography align="center">
                              Aucun Angle attribué à ce vertical.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        assignedKeywords
                          .filter((keyword) => keyword.keyword_id && keyword.keyword_label)
                          .map((keyword) => (
                            <TableRow key={keyword.keyword_id}>
                              <TableCell>{keyword.keyword_label}</TableCell>
                              <TableCell align="right">
                                <IconButton
                                  color="error"
                                  onClick={() => handleRemoveKeywordFromVertical(keyword)}
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
        </Box>
      </Box>
    </Box>
  );
}

export default Angles;

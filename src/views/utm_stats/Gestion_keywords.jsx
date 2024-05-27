import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, TextField } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { BASE_URL, api_version } from '../authentication/config'; // Importer les constantes
import DashboardCard from 'src/components/shared/DashboardCard'; // Assurez-vous que le chemin est correct
import { FaPlus } from 'react-icons/fa';

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
  const [value, setValue] = useState('1');
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
  useEffect(() => {
    fetchVerticals();
  }, []);

  useEffect(() => {
    const fetchAllKeywords = async () => {
      try {
        const token = await getToken();
        const responseObject = JSON.parse(token);
        const accessToken = responseObject.access_token;
        const response = await fetch(
          `${BASE_URL}/${api_version}/keywords?hp_cs_authorization=${accessToken}`,
        );
        if (response.status === 401) {
          throw new Error('Unauthorized');
        }
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

    fetchAllKeywords();
  }, []);

  useEffect(() => {
    if (selectedVertical) {
      const fetchAssignedKeywords = async () => {
        try {
          const token = await getToken();
          const responseObject = JSON.parse(token);
          const accessToken = responseObject.access_token;
          const response = await fetch(
            `${BASE_URL}/${api_version}/verticals/keyword/${selectedVertical}?hp_cs_authorization=${accessToken}`,
          );
          if (response.status === 401) {
            throw new Error('Unauthorized');
          }
          const data = await response.json();
          setAssignedKeywords(data.length > 0 ? data : []);
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
      };

      fetchAssignedKeywords();
    } else {
      setAssignedKeywords([]);
    }
  }, [selectedVertical]);

  const toggleKeyword = (keyword) => {
    if (selectedKeywords.includes(keyword)) {
      setSelectedKeywords(selectedKeywords.filter((kw) => kw !== keyword));
    } else {
      setSelectedKeywords([...selectedKeywords, keyword]);
    }
  };

  const handleAddKeyword = async () => {
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
          },
        );

        if (response.ok) {
          const data = await response.json();
          const newKeywordId = data.keyword_id;
          const newKeywordWithId = { ...data, id: newKeywordId.toString() };
          setKeywords([...keywords, newKeywordWithId]);
          setNewKeyword('');
          setOpen(false);
          Swal.fire({
            icon: 'success',
            text: `Keyword "${data.label}" added successfully!`,
          });
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
      headerName: 'Keywords',
      width: 220,
      editable: true,
    },
    {
      field: 'Action',
      headerName: 'Action',
      width: 220,
      editable: true,
      renderCell: (params) => (
        <Button variant="contained" color="primary" onClick={() => toggleKeyword(params.row)}>
          {selectedKeywords.includes(params.row) ? 'Remove' : 'Add'}
        </Button>
      ),
    },
  ];

  const rows = keywords.map((keyword, index) => ({
    id: keyword.keyword_id || index.toString(),
    Keywords: keyword.keyword_label,
    Action: 'N/A',
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
  return (
    <Box sx={{ width: 1 }}>
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
        <Box gridColumn="span 7">
          <DashboardCard title="Gestion Keywords">
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
                  Ajouter Keywords
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
                  <Button variant="contained" onClick={handleAddKeyword}>
                    <Typography>Ajouter</Typography>
                  </Button>
                </Box>
              </Box>
            </Modal>
            <Box sx={{ height: 700, width: '100%' }}>
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
          <DashboardCard title="Assign Keywords to Vertical">
            <Box mb={2} sx={{ width: '300px' }}>
              <Select
                defaultValue={selectedOptions}
                onChange={(option) => setSelectedVertical(option.value)}
                options={verticals.map((vertical) => ({
                  value: vertical.id,
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
            </Box>
          </DashboardCard>
        </Box>
      </Box>
    </Box>
  );
}

export default Keywords;

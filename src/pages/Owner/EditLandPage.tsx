import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Grid, 
  Paper,
  Chip,
  IconButton
} from '@mui/material';
import { CloudUpload, Delete, Save, ArrowBack } from '@mui/icons-material';
import OwnerNavbar from '../../components/OwnerNavbar';

import { getAllLands, updateLand } from '../../api/landownerApi';
import { uploadLandDocument } from '../../api/propertyCreateApi';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';



interface LandForm {
  name: string;
  location: string;
  price: string;
  description: string;
  area: string;
}

const EditLandPage: React.FC = () => {
  const { landId } = useParams<{ landId: string }>();
  const navigate = useNavigate();


  const [form, setForm] = useState<LandForm>({
    name: '',
    location: '',
    price: '',
    description: '',
    area: ''
  });
  const [documents, setDocuments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingLand, setLoadingLand] = useState(true);

  useEffect(() => {
    const loadLand = async () => {
      try {
        const response = await getAllLands();
        console.log('API Response:', response);
        
        // Handle different response structures
        const lands = response?.data || response || [];
        console.log('Lands array:', lands);
        
        const land = lands.find((l: any) => l.LandId === parseInt(landId || '0'));
        console.log('Found land:', land);
        
        if (land) {
          setForm({
            name: land.LandName || '',
            location: land.LandLocation || '',
            price: (land.LandPrice || land.LandPriceInitial)?.toString() || '',
            description: land.LandDescription || '',
            area: land.LandArea?.toString() || ''
          });
        } else {
          console.log('Land not found with ID:', landId);
          toast.error('Land not found');
        }
      } catch (error) {
        console.error('Error loading land:', error);
        toast.error('Failed to load land details');
      } finally {
        setLoadingLand(false);
      }
    };

    if (landId) {
      loadLand();
    }
  }, [landId, navigate]);

  const handleInputChange = (field: keyof LandForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setDocuments(prev => [...prev, ...files]);
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.location || !form.price) {
      toast.error('Please fill required fields');
      return;
    }

    if (!landId) {
      toast.error('Land ID not found');
      return;
    }

    setLoading(true);
    try {
      const landData = {
        LandName: form.name,
        LandId: parseInt(landId),
        LandDescription: form.description,
        LandAddress: form.location,
        LandPriceInitial: parseFloat(form.price),
        Status: true
      };

      await updateLand(landData);
      
      if (documents.length > 0) {
        for (const doc of documents) {
          await uploadLandDocument({
            landId: parseInt(landId),
            file: doc,
            type: doc.type.includes('image') ? 'Image' : 'Document'
          });
        }
      }

      toast.success('Land updated successfully');
      navigate('/owner/lands');
    } catch (error) {
      toast.error('Failed to update land');
    } finally {
      setLoading(false);
    }
  };

  if (loadingLand) {
    return (
      <>
        <OwnerNavbar />
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography>Loading land details...</Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <OwnerNavbar />
      <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <Paper sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconButton onClick={() => navigate('/owner/lands')} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" sx={{ flexGrow: 1 }}>
              Edit Land
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Land Name *"
                value={form.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Location *"
                value={form.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Price (₹) *"
                type="number"
                value={form.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Area (sq ft)"
                type="number"
                value={form.area}
                onChange={(e) => handleInputChange('area', e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={form.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Add New Documents
              </Typography>
              
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
                sx={{ mb: 2 }}
              >
                Upload Documents
                <input
                  type="file"
                  hidden
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                />
              </Button>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {documents.map((doc, index) => (
                  <Chip
                    key={index}
                    label={doc.name}
                    onDelete={() => removeDocument(index)}
                    deleteIcon={<Delete />}
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/owner/lands')}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Land'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </>
  );
};

export default EditLandPage;
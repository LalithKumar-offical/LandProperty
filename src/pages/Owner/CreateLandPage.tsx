import React, { useState } from 'react';
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
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../slice/store';
import { createLand } from '../../api/propertyCreateApi';
import { uploadLandDocument } from '../../api/propertyCreateApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface CreateLandData {
  LandName: string;
  LandLocation: string;
  LandDescription: string;
  LandPrice: number;
  LandArea: number;
  UserId: string;
}

interface LandForm {
  name: string;
  location: string;
  price: string;
  description: string;
  area: string;
}

const CreateLandPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [form, setForm] = useState<LandForm>({
    name: '',
    location: '',
    price: '',
    description: '',
    area: ''
  });
  const [documents, setDocuments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

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

    if (!user?.UserId) {
      toast.error('User not authenticated');
      return;
    }

    setLoading(true);
    try {
      const landData: CreateLandData = {
        LandName: form.name,
        LandLocation: form.location,
        LandDescription: form.description,
        LandPrice: parseFloat(form.price),
        LandArea: parseFloat(form.area) || 0,
        UserId: user.UserId
      };

      const result = await createLand(landData);
      
      if (documents.length > 0 && result.LandId) {
        for (const doc of documents) {
          await uploadLandDocument({
            landId: result.LandId,
            file: doc,
            type: doc.type.includes('image') ? 'Image' : 'Document'
          });
        }
      }

      toast.success('Land created successfully');
      navigate('/owner/lands');
    } catch (error) {
      toast.error('Failed to create land');
    } finally {
      setLoading(false);
    }
  };

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
              Create New Land
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
                Upload Documents
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
                  {loading ? 'Creating...' : 'Create Land'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </>
  );
};

export default CreateLandPage;
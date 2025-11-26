import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Grid, 
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton
} from '@mui/material';
import { CloudUpload, Delete, Save, ArrowBack } from '@mui/icons-material';
import OwnerNavbar from '../../components/OwnerNavbar';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../slice/store';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { uploadHomeDocument } from '../../api/homeownerApi';
import { useFullDetails } from '../../hooks/useFullDetails';
import { editHome } from '../../slice/homesSlice';
import { useCrossTabSync } from '../../hooks/useCrossTabSync';

interface PropertyForm {
  name: string;
  type: 'home' | 'land';
  city: string;
  state: string;
  pincode: string;
  price: string;
  description: string;
  area: string;
  bedrooms: string;
  bathrooms: string;
  address: string;
}

const EditPropertyPage: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { homes, fetchData } = useFullDetails();
  const { notifyOtherTabs } = useCrossTabSync();
  const [form, setForm] = useState<PropertyForm>({
    name: '',
    type: 'home',
    city: '',
    state: '',
    pincode: '',
    price: '',
    description: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    address: ''
  });
  const [documents, setDocuments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProperty, setLoadingProperty] = useState(true);

  useEffect(() => {
    const loadProperty = async () => {
      try {
        if (homes.length === 0) {
          fetchData();
        }
        
        const property = homes.find((home: any) => home.HomeId === parseInt(propertyId || '0'));
        
        if (property) {
          setForm({
            name: property.HomeName || '',
            type: 'home',
            city: property.HomeCity || '',
            state: property.HomeState || '',
            pincode: property.HomePincode || '',
            price: property.HomePriceInital?.toString() || '',
            description: property.HomeDescription || property.HomeDiscription || '',
            area: property.AreaInSqFt?.toString() || '',
            bedrooms: '',
            bathrooms: '',
            address: property.HomeAddress || ''
          });
        }
      } catch (error) {
        toast.error('Failed to load property details');
      } finally {
        setLoadingProperty(false);
      }
    };

    if (propertyId) {
      loadProperty();
    }
  }, [propertyId, homes, fetchData]);

  const handleInputChange = (field: keyof PropertyForm, value: string) => {
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
    if (!form.name || !form.price || !form.description || !form.address) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      await dispatch(editHome({
        HomeId: parseInt(propertyId || '0'),
        HomeName: form.name,
        HomeDescription: form.description,
        HomeAddress: form.address,
        HomePriceInital: parseInt(form.price),
        Status: true
      })).unwrap();

      // Upload new documents if any
      if (documents.length > 0) {
        for (let i = 0; i < documents.length; i++) {
          await uploadHomeDocument({
            homeId: parseInt(propertyId || '0'),
            file: documents[i],
            type: '1'
          });
        }
      }
      
      toast.success('Property updated successfully');
      notifyOtherTabs(); // Notify other tabs about the update
      navigate('/owner/homes');
    } catch (error) {
      toast.error('Failed to update property');
    } finally {
      setLoading(false);
    }
  };

  if (loadingProperty) {
    return (
      <>
        <OwnerNavbar />
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography>Loading property details...</Typography>
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
            <IconButton onClick={() => navigate('/owner/homes')} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" sx={{ flexGrow: 1 }}>
              Edit Property
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Property Name *"
                value={form.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="State *"
                value={form.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="City *"
                value={form.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Price (₹) *"
                type="number"
                value={form.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Pincode *"
                value={form.pincode}
                onChange={(e) => handleInputChange('pincode', e.target.value)}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Area (sq ft) *"
                type="number"
                value={form.area}
                onChange={(e) => handleInputChange('area', e.target.value)}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Address *"
                multiline
                rows={2}
                value={form.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                required
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Description *"
                multiline
                rows={3}
                value={form.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
              />
            </Grid>

            <Grid size={12}>
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

            <Grid size={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/owner/homes')}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Property'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </>
  );
};

export default EditPropertyPage;
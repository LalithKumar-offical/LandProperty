import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Grid, 
  Paper,
  Chip,
} from '@mui/material';
import { CloudUpload, Delete } from '@mui/icons-material';
import OwnerNavbar from '../../components/OwnerNavbar';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../slice/store';
import { fetchAllProperties } from '../../slice/propertiesSlice';
import { toast } from 'react-toastify';
import { addHome, uploadHomeDocument } from '../../api/homeownerApi';

interface PropertyForm {
  name: string;
  city: string;
  state: string;
  pincode: string;
  price: string;
  description: string;
  area: string;
  address: string;
}

const CreatePropertyPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [form, setForm] = useState<PropertyForm>({
    name: '',
    city: '',
    state: '',
    pincode: '',
    price: '',
    description: '',
    area: '',
    address: ''
  });
  const [documents, setDocuments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

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
    if (!form.name || !form.city || !form.price || !form.state || !form.pincode || !form.area) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const homeData = {
        homeDiscription: form.description,
        homeAddress: form.address,
        homeCity: form.city,
        homeState: form.state,
        homePincode: form.pincode,
        areaInSqFt: parseInt(form.area),
        homePriceInital: parseInt(form.price),
        userId: user?.userId || user?.UserId || ''
      };
      
      const homeResponse = await addHome(homeData);

      // Upload documents if any
      if (documents.length > 0 && homeResponse?.data?.HomeId) {
        for (let i = 0; i < documents.length; i++) {
          await uploadHomeDocument({
            homeId: homeResponse.data.HomeId,
            file: documents[i],
            type: '1'
          });
        }
      }
      
      toast.success('Property submitted for admin approval');
      
      // Refresh properties data in Redux
      dispatch(fetchAllProperties());
      
      // Reset form
      setForm({
        name: '',
        city: '',
        state: '',
        pincode: '',
        price: '',
        description: '',
        area: '',
        address: ''
      });
      setDocuments([]);
    } catch (error) {
      toast.error('Failed to submit property');
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
            <Typography variant="h4" sx={{ flexGrow: 1 }}>
              Create New Property
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Property Name *"
                value={form.name}
                onChange={(e) => handleInputChange('name', e.target.value)}

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

            <Grid size={{ xs: 12, sm: 6 }}>
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
                label="Address"
                multiline
                rows={2}
                value={form.address}
                onChange={(e) => handleInputChange('address', e.target.value)}

              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={form.description}
                onChange={(e) => handleInputChange('description', e.target.value)}

              />
            </Grid>

            <Grid size={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Documents
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
                  onClick={() => {
                    setForm({
                      name: '',
                      city: '',
                      state: '',
                      pincode: '',
                      price: '',
                      description: '',
                      area: '',
                      address: ''
                    });
                    setDocuments([]);
                  }}
                >
                  Reset
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit for Approval'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </>
  );
};

export default CreatePropertyPage;
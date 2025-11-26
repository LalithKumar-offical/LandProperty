import React, { useEffect, useState } from 'react';
import OwnerNavbar from '../../components/OwnerNavbar';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../slice/store';
import { fetchAllProperties } from '../../slice/propertiesSlice';
import { useCrossTabSync } from '../../hooks/useCrossTabSync';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Button, IconButton } from '@mui/material';
import { Add, Edit } from '@mui/icons-material';

const OwnerHomesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { homes, loading, initialized } = useSelector((state: RootState) => state.properties);
  const navigate = useNavigate();
  useCrossTabSync(); // Enable cross-tab sync
  const [filteredHomes, setFilteredHomes] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!initialized && !loading) {
      dispatch(fetchAllProperties());
    }
  }, [dispatch, initialized, loading]);

  useEffect(() => {
    const userId = user?.userId || user?.UserId || user?.id || user?.Id;
    const ownerHomes = homes.filter(home => home.OwnerId === userId);
    
    let filtered = ownerHomes;
    if (statusFilter === 'approved') {
      filtered = ownerHomes.filter(home => home.HomeStatusApproved === true);
    } else if (statusFilter === 'pending') {
      filtered = ownerHomes.filter(home => home.HomeStatusApproved === false && !home.HomeStatusRejected);
    } else if (statusFilter === 'declined') {
      filtered = ownerHomes.filter(home => home.HomeStatusRejected === true);
    }
    setFilteredHomes(filtered);
  }, [homes, statusFilter, user]);

  return (
    <>
      <OwnerNavbar />
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ color: '#333', margin: 0 }}>My Homes</h1>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/owner/create-property')}
            sx={{ borderRadius: 2 }}
          >
            Create New Property
          </Button>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px'
            }}
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
          <span style={{ marginLeft: '10px', color: '#666' }}>
            Showing {filteredHomes.length} of {homes.filter(home => home.OwnerId === (user?.userId || user?.UserId || user?.id || user?.Id)).length} homes
          </span>
        </div>
        
        {loading && <div>Loading homes...</div>}
        
        {filteredHomes.length === 0 && !loading && (
          <p style={{ color: '#666', fontSize: '16px' }}>No homes found for selected status.</p>
        )}
        
        <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {filteredHomes.map((home) => (
            <div key={home.HomeId} style={{
              background: '#f9f9f9',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #e0e0e0'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                {home.HomeName || `Home ${home.HomeId}`}
              </h3>
              
              <div style={{ marginBottom: '8px' }}>
                <strong>City:</strong> {home.HomeCity || 'N/A'}
              </div>
              
              <div style={{ marginBottom: '8px' }}>
                <strong>Price:</strong> ₹{home.HomePriceInital || 'N/A'}
              </div>
              
              <div style={{ marginBottom: '8px' }}>
                <strong>Status:</strong> 
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  marginLeft: '8px',
                  background: home.HomeStatusApproved ? '#4CAF50' : (home.HomeStatusRejected ? '#f44336' : '#ff9800'),
                  color: 'white'
                }}>
                  {home.HomeStatusApproved ? 'Approved' : (home.HomeStatusRejected ? 'Declined' : 'Pending')}
                </span>
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <strong>Description:</strong> {home.HomeDescription || 'N/A'}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <IconButton
                  onClick={() => navigate(`/owner/edit-property/${home.HomeId}`)}
                  sx={{ 
                    color: 'primary.main',
                    '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)' }
                  }}
                >
                  <Edit />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default OwnerHomesPage;

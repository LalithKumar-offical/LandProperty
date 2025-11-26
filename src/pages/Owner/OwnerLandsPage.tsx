import React, { useEffect, useState } from 'react';
import OwnerNavbar from '../../components/OwnerNavbar';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../slice/store';
import { getLandsWithOwnerAndDocs } from '../../api/landownerApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Button, IconButton } from '@mui/material';
import { Add, Edit } from '@mui/icons-material';

const OwnerLandsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [lands, setLands] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [filteredLands, setFilteredLands] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchLands = async () => {
      setLoading(true);
      try {
        const response = await getLandsWithOwnerAndDocs();
        setLands(response.data || []);
      } catch (error) {
        console.error('Failed to fetch lands:', error);
        setLands([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLands();
  }, []);

  useEffect(() => {
    const userId = user?.userId || user?.UserId || user?.id || user?.Id;
    const ownerLands = lands.filter(land => land.OwnerId === userId);
    
    let filtered = ownerLands;
    if (statusFilter === 'approved') {
      filtered = ownerLands.filter(land => land.LandStatusApproved === true);
    } else if (statusFilter === 'pending') {
      filtered = ownerLands.filter(land => land.LandStatusApproved === false && !land.LandStatusRejected);
    } else if (statusFilter === 'declined') {
      filtered = ownerLands.filter(land => land.LandStatusApproved === false && land.IsActive === false);
    }
    setFilteredLands(filtered);
  }, [lands, statusFilter, user]);

  return (
    <>
      <OwnerNavbar />
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ color: 'white', margin: 0 }}>My Lands</h1>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/owner/create-land')}
            sx={{ borderRadius: 2 }}
          >
            Create New Land
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
          <span style={{ marginLeft: '10px', color: 'white' }}>
            Showing {filteredLands.length} of {lands.filter(land => land.OwnerId === (user?.userId || user?.UserId || user?.id || user?.Id)).length} lands
          </span>
        </div>
        
        {loading && <div style={{ color: 'white' }}>Loading lands...</div>}
        
        {filteredLands.length === 0 && !loading && (
          <p style={{ color: 'white', fontSize: '16px' }}>No lands found for selected status.</p>
        )}
        
        <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {filteredLands.map((land) => (
            <div key={land.LandId} style={{
              background: '#f9f9f9',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #e0e0e0'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                {land.LandName || `Land ${land.LandId}`}
              </h3>
              
              <div style={{ marginBottom: '8px' }}>
                <strong>City:</strong> {land.LandCity || 'N/A'}
              </div>
              
              <div style={{ marginBottom: '8px' }}>
                <strong>Price:</strong> ₹{land.LandPriceInitial || 'N/A'}
              </div>
              
              <div style={{ marginBottom: '8px' }}>
                <strong>Status:</strong> 
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  marginLeft: '8px',
                  background: land.LandStatusApproved ? '#4CAF50' : (land.LandStatusRejected ? '#f44336' : '#ff9800'),
                  color: 'white'
                }}>
                  {land.LandStatusApproved ? 'Approved' : (land.LandStatusRejected ? 'Declined' : 'Pending')}
                </span>
              </div>
              
              {land.LandAddress && (
                <div style={{ marginBottom: '8px' }}>
                  <strong>Address:</strong> {land.LandAddress}
                </div>
              )}
              
              <div style={{ marginBottom: '12px' }}>
                <strong>Description:</strong> {land.LandDescription || 'N/A'}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <IconButton
                  onClick={() => navigate(`/owner/edit-land/${land.LandId}`)}
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

export default OwnerLandsPage;

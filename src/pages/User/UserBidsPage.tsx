import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getBidsByUser, updateBidByUser } from '../../api/bidsApi';
import { setBids } from '../../slice/user/userBidsSlice';
import { formatCurrencyWithText } from '../../utils/currencyFormatter';
import { toast } from 'react-toastify';
import type { BidResponse } from '../../types/bidsType';

import UserNavbar from '../../components/UserNavbar';

import type { RootState } from '../../slice/store';

const UserBidsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  // const { bids } = useSelector((state: RootState) => state.userBids);
  const [localBids, setLocalBids] = useState<BidResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterProperty, setFilterProperty] = useState('');
  const [counterAmounts, setCounterAmounts] = useState<{ [key: number]: string }>({});


  useEffect(() => {
    let cancelled = false;
    
    const fetchBids = async () => {
      const userId = user?.UserId || user?.userId;
      if (!userId || cancelled) {
        setLoading(false);
        return;
      }
      
      try {
        const userBids = await getBidsByUser(userId);
        if (!cancelled) {
          dispatch(setBids(userBids));
          setLocalBids(userBids);
        }
      } catch (error: any) {
        if (!cancelled) {
          if (error.code === 'ERR_CONNECTION_REFUSED') {
            toast.error('Server is not running');
          } else {
            toast.error('Failed to load bids');
          }
          setLocalBids([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (user) fetchBids();
    
    return () => {
      cancelled = true;
    };
  }, [user, dispatch]);

  const handleCounterOffer = async (bidId: number) => {
    const newAmount = counterAmounts[bidId]?.trim();
    if (!newAmount || parseFloat(newAmount) <= 0) {
      toast.error('Please enter a valid bid amount');
      return;
    }
    
    try {
      await updateBidByUser({
        BidId: bidId,
        BidAmountByUser: parseFloat(newAmount)
      });
      toast.success('Bid updated successfully!');
      setCounterAmounts(prev => ({...prev, [bidId]: ''}));
      
      const userId = user?.UserId || user?.userId;
      if (userId) {
        const userBids = await getBidsByUser(userId);
        dispatch(setBids(userBids));
        setLocalBids(userBids);
      }
    } catch (error) {
      toast.error('Failed to update bid');
    }
  };


  const filteredBids = localBids.filter((bid: any) => {
    const matchesStatus = !filterStatus || 
      (filterStatus === 'purchase' && bid.PurchaseRequest) ||
      (filterStatus === 'pending' && !bid.PurchaseRequest) ||
      (filterStatus === 'counter' && bid.BidAmountByOwner > 0);
    const matchesProperty = !filterProperty || 
      (filterProperty === 'home' && bid.PropertyType === 0) ||
      (filterProperty === 'land' && bid.PropertyType === 1);
    return matchesStatus && matchesProperty;
  });

  if (loading) return (
    <>
      <UserNavbar />
      <div style={{ padding: '20px' }}>Loading bids...</div>
    </>
  );

  return (
    <div style={{ background: '#E3F2FD', height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <UserNavbar />
      <div className="user-bids-page" style={{ padding: '20px', width: '100%', flex: 1, overflow: 'auto', boxSizing: 'border-box' }}>
      <h1 style={{ color: '#333', marginBottom: '20px', fontSize: '2rem', textAlign: 'center', margin: '0 0 20px 0' }}>My Bids</h1>
      
      {/* Filter Section */}
      <div style={{ background: '#BBDEFB', padding: '15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'center', border: '1px solid #90CAF9', flexWrap: 'wrap' }}>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '14px'
          }}
        >
          <option value="">All Status</option>
          <option value="purchase">Purchase Request</option>
          <option value="pending">Pending</option>
          <option value="counter">Counter Offer</option>
        </select>
        
        <select
          value={filterProperty}
          onChange={(e) => setFilterProperty(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '14px'
          }}
        >
          <option value="">All Properties</option>
          <option value="home">Home</option>
          <option value="land">Land</option>
        </select>
        
        <div style={{ marginLeft: 'auto', color: '#666', fontSize: '14px', minWidth: 'fit-content' }}>
          Showing {filteredBids.length} of {localBids.length} bids
        </div>
      </div>
      
      {filteredBids.length === 0 ? (
        <p style={{ color: '#666', fontSize: '16px' }}>No bids found. Start bidding on properties!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', alignItems: 'start' }}>
          {filteredBids.map((bid) => (
            <div key={bid.BidId} style={{
              background: '#BBDEFB',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              border: '1px solid #90CAF9',
              position: 'relative',
              height: 'fit-content',
              display: 'flex',
              flexDirection: 'column'
            }}>

              
              <div style={{ marginBottom: '15px', textAlign: 'center' }}>
                <h3 style={{ margin: 0, color: '#333', fontSize: '1.2rem' }}>Bid #{bid.BidId}</h3>
              </div>
              
              <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>Your Bid Amount:</strong> 
                <span style={{ color: '#8b5cf6', fontWeight: 'bold' }}>{formatCurrencyWithText(bid.BidAmountByUser)}</span>
              </div>
              
              <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>Owner Counter Offer:</strong> 
                <span style={{ color: bid.BidAmountByOwner > 0 ? '#ff9800' : '#666' }}>{bid.BidAmountByOwner > 0 ? formatCurrencyWithText(bid.BidAmountByOwner) : 'No counter offer'}</span>
              </div>
              
              <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>Property Name:</strong> 
                <span>{bid.PropertyType === 0 ? (bid.HomeName || 'Home') : (bid.LandName || 'Land')}</span>
              </div>
              
              <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>Property Type:</strong> 
                <span style={{ color: bid.PropertyType === 0 ? '#4CAF50' : '#2196F3' }}>{bid.PropertyType === 0 ? 'Home' : 'Land'}</span>
              </div>
              
              <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>Owner Contact:</strong> 
                <span>{(bid as any).OwnerPhoneNo || 'Not available'}</span>
              </div>
              
              {bid.PurchaseRequest && (
                <div style={{ 
                  background: '#4CAF50', 
                  color: 'white', 
                  padding: '15px', 
                  borderRadius: '5px', 
                  marginBottom: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                    🎉 Congratulations! Your bid has been accepted!
                  </div>
                  <div style={{ fontSize: '14px' }}>
                    Contact Owner: <strong>{(bid as any).OwnerPhoneNo}</strong>
                  </div>
                  <div style={{ fontSize: '12px', marginTop: '5px', opacity: 0.9 }}>
                    Please call to proceed with the purchase
                  </div>
                </div>
              )}
              
              {!bid.PurchaseRequest && (
                <div style={{ marginTop: '12px' }}>
                  <input
                    type="number"
                    placeholder="Update bid amount"
                    value={counterAmounts[bid.BidId] || ''}
                    onChange={(e) => setCounterAmounts(prev => ({
                      ...prev,
                      [bid.BidId]: e.target.value
                    }))}
                    style={{
                      width: '97%',
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      marginBottom: '8px',
                      fontSize: '14px'
                    }}
                  />
                  <button
                    onClick={() => handleCounterOffer(bid.BidId)}
                    onBlur={(e) => e.target.blur()}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      background: '#ff9800',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    Update Bid
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default UserBidsPage;

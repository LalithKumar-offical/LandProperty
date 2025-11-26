import React, { useEffect, useState } from 'react';
import OwnerNavbar from '../../components/OwnerNavbar';
import { getBidsByOwner, updateBidByOwner } from '../../api/bidsApi';
import { useSelector } from 'react-redux';
import type { RootState } from '../../slice/store';
import { toast } from 'react-toastify';

const OwnerBidsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [counterAmounts, setCounterAmounts] = useState<{[key: number]: string}>({});
  const [processing, setProcessing] = useState<{[key: number]: boolean}>({});

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const userId = user?.userId || user?.UserId || user?.id;
        if (!userId) return;
        
        const ownerBids = await getBidsByOwner(userId);
        setBids(ownerBids);
      } catch (error) {
        toast.error('Failed to load bids');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBids();
  }, [user]);

  const handleCounterOffer = async (bidId: number) => {
    if (processing[bidId]) return;
    
    const counterAmount = counterAmounts[bidId];
    if (!counterAmount || parseFloat(counterAmount) <= 0) {
      toast.error('Please enter a valid counter amount');
      return;
    }

    setProcessing(prev => ({...prev, [bidId]: true}));
    try {
      await updateBidByOwner({ 
        BidId: bidId, 
        BidAmountByOwner: parseFloat(counterAmount) 
      });
      toast.success('Counter offer sent successfully');
      setCounterAmounts(prev => ({...prev, [bidId]: ''}));
      
      // Refresh bids
      const userId = user?.userId || user?.UserId || user?.id;
      if (userId) {
        const updatedBids = await getBidsByOwner(userId);
        setBids(updatedBids);
      }
    } catch (error) {
      toast.error('Failed to send counter offer');
    } finally {
      setProcessing(prev => ({...prev, [bidId]: false}));
    }
  };

  const handleAcceptBid = async (bidId: number) => {
    if (processing[bidId]) return;
    
    setProcessing(prev => ({...prev, [bidId]: true}));
    try {
      await updateBidByOwner({ 
        BidId: bidId, 
        BidAmountByOwner: 0, 
        PurchaseRequest: true 
      });
      toast.success('Bid accepted successfully');
      
      // Refresh bids
      const userId = user?.userId || user?.UserId || user?.id;
      if (userId) {
        const updatedBids = await getBidsByOwner(userId);
        setBids(updatedBids);
      }
    } catch (error) {
      toast.error('Failed to accept bid');
    } finally {
      setProcessing(prev => ({...prev, [bidId]: false}));
    }
  };

  if (loading) {
    return (
      <>
        <OwnerNavbar />
        <div style={{ padding: '20px' }}>Loading bids...</div>
      </>
    );
  }

  return (
    <>
      <OwnerNavbar />
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Bids Received</h1>
        
        {bids.length === 0 ? (
          <p style={{ color: '#666', fontSize: '16px' }}>No bids received yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {bids.map((bid) => (
              <div key={bid.BidId} style={{
                background: '#f9f9f9',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid #e0e0e0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{ margin: 0, color: '#333' }}>Bid #{bid.BidId}</h3>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    background: bid.PropertyType === 0 ? '#2196F3' : '#FF9800',
                    color: 'white'
                  }}>
                    {bid.PropertyType === 0 ? 'Home' : 'Land'}
                  </span>
                </div>
                
                <div style={{ marginBottom: '10px' }}>
                  <strong>Bidder:</strong> {bid.BidderName}
                </div>
                
                <div style={{ marginBottom: '10px' }}>
                  <strong>Property Name:</strong> {bid.PropertyType === 0 ? bid.HomeName : bid.LandName}
                </div>
                
                <div style={{ marginBottom: '10px' }}>
                  <strong>Address:</strong> {bid.PropertyType === 0 ? bid.HomeAddress : bid.LandLocation}
                </div>
                
                <div style={{ marginBottom: '10px' }}>
                  <strong>User Bid:</strong> ₹{bid.BidAmountByUser?.toLocaleString()}
                </div>
                
                {bid.BidAmountByOwner && (
                  <div style={{ marginBottom: '10px' }}>
                    <strong>Your Counter Offer:</strong> ₹{bid.BidAmountByOwner?.toLocaleString()}
                  </div>
                )}
                
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '15px' }}>
                  <input
                    type="number"
                    placeholder="Enter counter offer"
                    value={counterAmounts[bid.BidId] || ''}
                    onChange={(e) => setCounterAmounts(prev => ({...prev, [bid.BidId]: e.target.value}))}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      flex: 1
                    }}
                  />
                  <button
                    onClick={() => handleCounterOffer(bid.BidId)}
                    disabled={processing[bid.BidId]}
                    style={{
                      padding: '8px 16px',
                      background: processing[bid.BidId] ? '#ccc' : '#ff9800',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: processing[bid.BidId] ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {processing[bid.BidId] ? 'Sending...' : 'Counter Offer'}
                  </button>
                </div>
                
                <button
                  onClick={() => handleAcceptBid(bid.BidId)}
                  disabled={bid.PurchaseRequest || processing[bid.BidId]}
                  style={{
                    padding: '10px 20px',
                    background: (bid.PurchaseRequest || processing[bid.BidId]) ? '#ccc' : '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: (bid.PurchaseRequest || processing[bid.BidId]) ? 'not-allowed' : 'pointer',
                    width: '100%',
                    marginTop: '10px'
                  }}
                >
                  {processing[bid.BidId] ? 'Processing...' : (bid.PurchaseRequest ? 'Bid Accepted' : 'Accept Bid')}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default OwnerBidsPage;

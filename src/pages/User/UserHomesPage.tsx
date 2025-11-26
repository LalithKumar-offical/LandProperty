import React, { useEffect, useState } from 'react';
import UserNavbar from '../../components/UserNavbar';
import { getFileFromPath } from '../../api/homeownerApi';
import { addBid } from '../../api/bidsApi';
import { useSelector, useDispatch } from 'react-redux';  
import type { RootState, AppDispatch } from '../../slice/store';
import { fetchAllProperties } from '../../slice/propertiesSlice';
import PropertyDetailsModal from '../../components/PropertyDetailsModal';
import { toast } from 'react-toastify';

const ImageCarousel: React.FC<{ images: any[], getImageUrl: (doc: any) => string }> = ({ images, getImageUrl }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  if (images.length === 0) {
    return (
      <div style={{ height: "200px", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "#999" }}>No Image</span>
      </div>
    );
  }
  
  if (images.length === 1) {
    return (
      <div style={{ height: "200px", overflow: "hidden", position: "relative", background: "#f5f5f5" }}>
        <img
          src={getImageUrl(images[0])}
          alt="Property"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement!.innerHTML = '<div style="height: 200px; background: #f5f5f5; display: flex; align-items: center; justify-content: center; color: #999;">No Image Available</div>';
          }}
        />
      </div>
    );
  }
  
  return (
    <div style={{ height: "200px", overflow: "hidden", position: "relative", background: "#f5f5f5" }}>
      <img
        src={getImageUrl(images[currentIndex])}
        alt="Property"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          target.parentElement!.innerHTML = '<div style="height: 200px; background: #f5f5f5; display: flex; align-items: center; justify-content: center; color: #999;">Image Not Found</div>';
        }}
      />
      
      <button
        onClick={() => setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : images.length - 1)}
        style={{
          position: "absolute",
          left: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.5)",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "30px",
          height: "30px",
          cursor: "pointer",
          fontSize: "16px"
        }}
      >
        ‹
      </button>
      
      <button
        onClick={() => setCurrentIndex(currentIndex < images.length - 1 ? currentIndex + 1 : 0)}
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.5)",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "30px",
          height: "30px",
          cursor: "pointer",
          fontSize: "16px"
        }}
      >
        ›
      </button>
      
      <div style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        background: "rgba(0,0,0,0.7)",
        color: "white",
        padding: "4px 8px",
        borderRadius: "12px",
        fontSize: "12px"
      }}>
        {currentIndex + 1}/{images.length}
      </div>
    </div>
  );
};

const UserHomesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { homes, loading, initialized } = useSelector((state: RootState) => state.properties);
  const [page, setPage] = useState(0);
  const [bidAmount, setBidAmount] = useState<{[key: number]: string}>({});
  const [selectedHome, setSelectedHome] = useState<any>(null);
  const [cityFilter, setCityFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const itemsPerPage = 3;

  let approvedHomes = homes.filter(home => home.HomeStatusApproved === true);
  
  // Apply filters
  if (cityFilter) {
    approvedHomes = approvedHomes.filter(home => 
      home.HomeCity?.toLowerCase().includes(cityFilter.toLowerCase())
    );
  }
  
  if (priceFilter) {
    const maxPrice = parseFloat(priceFilter);
    if (!isNaN(maxPrice)) {
      approvedHomes = approvedHomes.filter(home => 
        (home.HomePriceInital || 0) <= maxPrice
      );
    }
  }
  
  // Apply sorting
  if (sortBy === 'price-low') {
    approvedHomes.sort((a, b) => (a.HomePriceInital || 0) - (b.HomePriceInital || 0));
  } else if (sortBy === 'price-high') {
    approvedHomes.sort((a, b) => (b.HomePriceInital || 0) - (a.HomePriceInital || 0));
  } else if (sortBy === 'name') {
    approvedHomes.sort((a, b) => (a.HomeName || '').localeCompare(b.HomeName || ''));
  }

  const handleBid = async (homeId: number) => {

    const userId = user?.userId || user?.UserId || user?.id || user?.Id;
    if (!user || !userId) {
      toast.error('Please login to place a bid');
      return;
    }
    const amount = bidAmount[homeId]?.trim();
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid bid amount');
      return;
    }

    try {
      const bidData = {
        UserId: String(userId),
        HomeId: homeId,
        LandId: null, // Use null instead of 0 for better database handling
        BidAmountByUser: parseFloat(bidAmount[homeId]),
        PropertyType: 0 // 0 = Home, 1 = Land
      };

      console.log('Placing bid with data:', bidData); // Debug log
      await addBid(bidData);
      toast.success('Bid placed successfully!');
      setBidAmount(prev => ({...prev, [homeId]: ''}));
    } catch (err: any) {
      console.error('Bid error:', err); // Debug log
      const errorMsg = err.response?.data?.errors ? 
        Object.values(err.response.data.errors).flat().join(', ') : 
        (err.response?.data?.message || err.message);
      toast.error('Failed to place bid: ' + errorMsg);
    }
  };

  useEffect(() => {
    if (!initialized && !loading) {
      dispatch(fetchAllProperties());
    }
  }, [dispatch, initialized, loading]);

  return (
    <>
      <UserNavbar />
      <div style={{ padding: 24, background: "#E3F2FD", minHeight: "100vh" }}>
        <h1>Browse Homes</h1>
        
        {/* Filter Section */}
        <div style={{ 
          background: '#BBDEFB', 
          padding: '20px', 
          borderRadius: '10px', 
          marginBottom: '20px',
          border: '1px solid #90CAF9'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>Filter & Sort</h3>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>City:</label>
              <input
                type="text"
                placeholder="Search by city"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px',
                  width: '150px'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Max Price:</label>
              <input
                type="number"
                placeholder="Max price"
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px',
                  width: '150px'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Sort By:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px',
                  width: '150px'
                }}
              >
                <option value="">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
            
            <div style={{ marginLeft: 'auto', color: '#666', fontSize: '14px' }}>
              Showing {approvedHomes.length} homes
            </div>
          </div>
        </div>
        
        {loading && <div>Loading...</div>}

        {approvedHomes.length === 0 && !loading && <div>No approved homes available</div>}
        <div style={{ textAlign: "left" }}>
          {approvedHomes.slice(page * itemsPerPage, (page + 1) * itemsPerPage).map((h: any) => (
            <div key={h.HomeId} style={{
              background: "#BBDEFB",
              borderRadius: "15px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              overflow: "hidden",
              border: "1px solid #90CAF9",
              display: "inline-block",
              width: "calc(33.333% - 20px)",
              margin: "10px 5px",
              verticalAlign: "top"
            }}>
              <ImageCarousel
                images={(h.Documents || []).filter((doc: any) => doc.DocumentType === 1 && doc.DocumentPath && !doc.DocumentPath.includes('Screenshot'))}
                getImageUrl={(doc) => getFileFromPath(doc.DocumentPath)}
              />
              
              <div style={{ padding: "16px" }}>
                <h4 style={{ margin: "0 0 8px 0", color: "#333" }}>
                  {h.HomeName || `Home ${h.HomeId}`}
                </h4>
                
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ color: "#666", fontSize: "14px", marginBottom: "4px" }}>
                    <strong>City:</strong> {h.HomeCity || 'N/A'}
                  </div>
                  <div style={{ color: "#666", fontSize: "14px", marginBottom: "4px" }}>
                    <strong>Price:</strong> ₹{h.HomePriceInital || 'N/A'}
                  </div>
                  <div style={{ color: "#666", fontSize: "14px", marginBottom: "4px" }}>
                    <strong>Description:</strong> {h.HomeDescription || 'N/A'}
                  </div>
                  {h.HomeAddress && (
                    <div style={{ color: "#666", fontSize: "14px", marginBottom: "4px" }}>
                      <strong>Address:</strong> {h.HomeAddress}
                    </div>
                  )}
                  {h.OwnerName && (
                    <div style={{ color: "#666", fontSize: "14px", marginBottom: "4px" }}>
                      <strong>Owner:</strong> {h.OwnerName}
                    </div>
                  )}
                </div>
                
                <div style={{ marginTop: "12px" }}>
                  <input
                    type="number"
                    placeholder="Enter bid amount"
                    value={bidAmount[h.HomeId] || ''}
                    onChange={(e) => setBidAmount(prev => ({...prev, [h.HomeId]: e.target.value}))}
                    style={{
                      width: "100%",
                      padding: "8px",
                      marginBottom: "8px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      fontSize: "14px"
                    }}
                  />
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleBid(h.HomeId)}
                      style={{
                        flex: 1,
                        padding: "10px",
                        background: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600"
                      }}
                    >
                      Place Bid
                    </button>
                    <button
                      onClick={() => setSelectedHome(h)}
                      style={{
                        flex: 1,
                        padding: "10px",
                        background: "#b78a62",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600"
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {approvedHomes.length > 0 && (
          <div style={{ textAlign: "center", marginTop: "20px", padding: "20px", background: "#f0e6ff", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", border: "1px solid #d6c7f7" }}>
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
              style={{
                padding: "8px 16px",
                margin: "0 5px",
                background: page === 0 ? "#ccc" : "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: page === 0 ? "not-allowed" : "pointer"
              }}
            >
              Previous
            </button>
            
            <span style={{ margin: "0 10px" }}>
              Page {page + 1} of {Math.ceil(approvedHomes.length / itemsPerPage)}
            </span>
            
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= Math.ceil(approvedHomes.length / itemsPerPage) - 1}
              style={{
                padding: "8px 16px",
                margin: "0 5px",
                background: page >= Math.ceil(approvedHomes.length / itemsPerPage) - 1 ? "#ccc" : "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: page >= Math.ceil(approvedHomes.length / itemsPerPage) - 1 ? "not-allowed" : "pointer"
              }}
            >
              Next
            </button>
          </div>
        )}
        
        {selectedHome && (
          <PropertyDetailsModal
            property={selectedHome}
            type="home"
            onClose={() => setSelectedHome(null)}
          />
        )}
      </div>
    </>
  );
};

export default UserHomesPage;

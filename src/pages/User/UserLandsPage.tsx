import React, { useEffect, useState } from 'react';
import UserNavbar from '../../components/UserNavbar';
import { getLandFileFromPath } from '../../api/landownerApi';
import { addBid } from '../../api/bidsApi';
import { useSelector } from 'react-redux';
import type { RootState } from '../../slice/store';
import { getLandsWithOwnerAndDocs } from '../../api/landownerApi';
import PropertyDetailsModal from '../../components/PropertyDetailsModal';
import { useCrossTabSync } from '../../hooks/useCrossTabSync';
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

const UserLandsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [lands, setLands] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  useCrossTabSync(); // Enable cross-tab sync
  const [page, setPage] = useState(0);
  const [bidAmount, setBidAmount] = useState<{[key: number]: string}>({});
  const [selectedLand, setSelectedLand] = useState<any>(null);
  const itemsPerPage = 3;

  const approvedLands = lands.filter(land => land.LandStatusApproved === true);

  const handleBid = async (landId: number) => {

    const userId = user?.userId || user?.UserId || user?.id || user?.Id;
    if (!user || !userId) {
      toast.error('Please login to place a bid');
      return;
    }
    const amount = bidAmount[landId]?.trim();
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid bid amount');
      return;
    }

    try {
      const bidData = {
        UserId: userId,
        HomeId: 0,
        LandId: landId,
        BidAmountByUser: parseFloat(bidAmount[landId]),
        PropertyType: 1 // 0 = Home, 1 = Land
      };

      await addBid(bidData);
      toast.success('Bid placed successfully!');
      setBidAmount(prev => ({...prev, [landId]: ''}));
    } catch (err: any) {
      toast.error('Failed to place bid: ' + (err.response?.data?.message || err.message));
    }
  };

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

  return (
    <>
      <UserNavbar />
      <div style={{ padding: 24, background: "#E3F2FD", minHeight: "100vh" }}>
        <h1>Browse Lands</h1>
        {loading && <div>Loading...</div>}

        {approvedLands.length === 0 && !loading && <div>No approved lands available</div>}
        <div style={{ textAlign: "left" }}>
          {approvedLands.slice(page * itemsPerPage, (page + 1) * itemsPerPage).map((l: any) => (
            <div key={l.LandId} style={{
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
                images={(l.Documents || []).filter((doc: any) => doc.DocumentType === 1 && doc.DocumentPath && !doc.DocumentPath.includes('Screenshot'))}
                getImageUrl={(doc) => getLandFileFromPath(doc.DocumentPath)}
              />
              
              <div style={{ padding: "16px" }}>
                <h4 style={{ margin: "0 0 8px 0", color: "#333" }}>
                  {l.LandName || `Land ${l.LandId}`}
                </h4>
                
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ color: "#666", fontSize: "14px", marginBottom: "4px" }}>
                    <strong>City:</strong> {l.LandCity || 'N/A'}
                  </div>
                  <div style={{ color: "#666", fontSize: "14px", marginBottom: "4px" }}>
                    <strong>Price:</strong> ₹{l.LandPriceInitial || 'N/A'}
                  </div>
                  {l.LandAreaInSqFt && (
                    <div style={{ color: "#666", fontSize: "14px", marginBottom: "4px" }}>
                      <strong>Area:</strong> {l.LandAreaInSqFt} sq ft
                    </div>
                  )}
                  <div style={{ color: "#666", fontSize: "14px", marginBottom: "4px" }}>
                    <strong>Description:</strong> {l.LandDescription || 'N/A'}
                  </div>
                  {l.LandAddress && (
                    <div style={{ color: "#666", fontSize: "14px", marginBottom: "4px" }}>
                      <strong>Address:</strong> {l.LandAddress}
                    </div>
                  )}
                  {l.OwnerName && (
                    <div style={{ color: "#666", fontSize: "14px", marginBottom: "4px" }}>
                      <strong>Owner:</strong> {l.OwnerName}
                    </div>
                  )}
                </div>
                
                <div style={{ marginTop: "12px" }}>
                  <input
                    type="number"
                    placeholder="Enter bid amount"
                    value={bidAmount[l.LandId] || ''}
                    onChange={(e) => setBidAmount(prev => ({...prev, [l.LandId]: e.target.value}))}
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
                      onClick={() => handleBid(l.LandId)}
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
                      onClick={() => setSelectedLand(l)}
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
        
        {approvedLands.length > 0 && (
          <div style={{ textAlign: "center", marginTop: "20px", padding: "20px", background: "#BBDEFB", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", border: "1px solid #90CAF9" }}>
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
              Page {page + 1} of {Math.ceil(approvedLands.length / itemsPerPage)}
            </span>
            
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= Math.ceil(approvedLands.length / itemsPerPage) - 1}
              style={{
                padding: "8px 16px",
                margin: "0 5px",
                background: page >= Math.ceil(approvedLands.length / itemsPerPage) - 1 ? "#ccc" : "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: page >= Math.ceil(approvedLands.length / itemsPerPage) - 1 ? "not-allowed" : "pointer"
              }}
            >
              Next
            </button>
          </div>
        )}
        
        {selectedLand && (
          <PropertyDetailsModal
            property={selectedLand}
            type="land"
            onClose={() => setSelectedLand(null)}
          />
        )}
      </div>
    </>
  );
};

// Export default component
export default UserLandsPage;

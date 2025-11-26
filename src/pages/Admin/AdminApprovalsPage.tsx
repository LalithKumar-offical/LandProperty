import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import { getFileFromPath, approveHome, rejectHome } from "../../api/homeownerApi";
import { getLandFileFromPath, approveLand, rejectLand } from "../../api/landownerApi";
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../slice/store';
import { fetchAllProperties } from '../../slice/propertiesSlice';
import { invalidateCache } from '../../slice/dashboardSlice';
import { invalidateCache as invalidateOwnerCache } from '../../slice/owner/ownerDashboardSlice';
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
            (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='16' fill='%23999' text-anchor='middle' dy='.3em'%3EImage%3C/text%3E%3C/svg%3E";
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
          (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='16' fill='%23999' text-anchor='middle' dy='.3em'%3EImage%3C/text%3E%3C/svg%3E";
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

const AdminApprovalsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { homes, lands, loading, initialized } = useSelector((state: RootState) => state.properties);
  const { notifyOtherTabs } = useCrossTabSync();
  const [showDetails, setShowDetails] = useState<{id: number, docs: any[]} | null>(null);
  const [homePage, setHomePage] = useState(0);
  const [landPage, setLandPage] = useState(0);
  const [homeFilter, setHomeFilter] = useState('');
  const [landFilter, setLandFilter] = useState('');
  const [homeSortBy, setHomeSortBy] = useState('');
  const [landSortBy, setLandSortBy] = useState('');
  const itemsPerPage = 3;

  let pendingHomes = homes.filter((home: any) => 
    home.HomeStatusApproved === false && 
    (!home.RejectedReason || home.RejectedReason.trim() === '') &&
    (!home.RejectionReason || home.RejectionReason.trim() === '')
  );
  let pendingLands = lands.filter((land: any) => 
    land.LandStatusApproved === false && 
    (!land.RejectedReason || land.RejectedReason.trim() === '') &&
    (!land.RejectionReason || land.RejectionReason.trim() === '')
  );
  
  // Apply home filters
  if (homeFilter) {
    pendingHomes = pendingHomes.filter((home: any) => 
      home.HomeName?.toLowerCase().includes(homeFilter.toLowerCase()) ||
      home.HomeCity?.toLowerCase().includes(homeFilter.toLowerCase()) ||
      home.OwnerName?.toLowerCase().includes(homeFilter.toLowerCase())
    );
  }
  
  // Apply land filters
  if (landFilter) {
    pendingLands = pendingLands.filter((land: any) => 
      land.LandName?.toLowerCase().includes(landFilter.toLowerCase()) ||
      land.LandCity?.toLowerCase().includes(landFilter.toLowerCase()) ||
      land.OwnerName?.toLowerCase().includes(landFilter.toLowerCase())
    );
  }
  
  // Apply home sorting
  if (homeSortBy === 'price-low') {
    pendingHomes.sort((a: any, b: any) => (a.HomePriceInital || 0) - (b.HomePriceInital || 0));
  } else if (homeSortBy === 'price-high') {
    pendingHomes.sort((a: any, b: any) => (b.HomePriceInital || 0) - (a.HomePriceInital || 0));
  } else if (homeSortBy === 'name') {
    pendingHomes.sort((a: any, b: any) => (a.HomeName || '').localeCompare(b.HomeName || ''));
  }
  
  // Apply land sorting
  if (landSortBy === 'price-low') {
    pendingLands.sort((a: any, b: any) => (a.LandPriceInitial || 0) - (b.LandPriceInitial || 0));
  } else if (landSortBy === 'price-high') {
    pendingLands.sort((a: any, b: any) => (b.LandPriceInitial || 0) - (a.LandPriceInitial || 0));
  } else if (landSortBy === 'name') {
    pendingLands.sort((a: any, b: any) => (a.LandName || '').localeCompare(b.LandName || ''));
  }

  useEffect(() => {
    if (!initialized && !loading) {
      dispatch(fetchAllProperties());
    }
  }, [dispatch, initialized, loading]);

  const refreshHomes = () => {
    dispatch(fetchAllProperties());
    dispatch(invalidateCache()); // Invalidate admin dashboard cache
    dispatch(invalidateOwnerCache()); // Invalidate owner dashboard cache
    notifyOtherTabs(); // Notify other tabs about the update
  };

  const handleApprove = async (type: "home" | "land", id: number) => {
    try {
      if (type === "home") {
        await approveHome(id);
        toast.success('Home approved successfully');
      } else {
        await approveLand(id);
        toast.success('Land approved successfully');
      }
      refreshHomes();
    } catch (err) { 
      toast.error(`Failed to approve ${type}`);
    }
  };

  const handleReject = async (type: "home" | "land", id: number) => {
    const reason = prompt('Enter reason for rejection:');
    
    if (reason === null) return; // User cancelled
    
    try {
      if (type === "home") {
        await rejectHome(id, reason || "Rejected by admin");
        toast.success('Home rejected successfully');
      } else {
        await rejectLand(id, reason || "Rejected by admin");
        toast.success('Land rejected successfully');
      }
      refreshHomes();
    } catch (err) {
      toast.error(`Failed to reject ${type}`);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div style={{ padding: 24, background: "#faf7f2", minHeight: "100vh" }}>
        <h1>Approvals</h1>
        {loading && <div>Loading...</div>}

        <section style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0 }}>Pending Homes</h3>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Search homes..."
                value={homeFilter}
                onChange={(e) => setHomeFilter(e.target.value)}
                style={{
                  padding: '6px 10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
              <select
                value={homeSortBy}
                onChange={(e) => setHomeSortBy(e.target.value)}
                style={{
                  padding: '6px 10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="">Sort by</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name A-Z</option>
              </select>
              <span style={{ fontSize: '14px', color: '#666' }}>({pendingHomes.length} homes)</span>
            </div>
          </div>
          {pendingHomes.length === 0 && <div>No pending homes</div>}
          <div style={{ textAlign: "left" }}>
            {pendingHomes.slice(homePage * itemsPerPage, (homePage + 1) * itemsPerPage).map((h: any) => (
              <div key={h.HomeId || h.homeId} style={{
                background: "#f8f6f0",
                borderRadius: "15px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                overflow: "hidden",
                border: "1px solid #e0e0e0",
                display: "inline-block",
                width: "calc(33.333% - 20px)",
                margin: "10px 5px",
                verticalAlign: "top"
              }}>

                <ImageCarousel
                  images={(h.Documents || []).filter((doc: any) => doc.DocumentType === 1)}
                  getImageUrl={(doc: any) => getFileFromPath(doc.DocumentPath)}
                />
                

                <div style={{ padding: "16px" }}>
                  <h4 style={{ margin: "0 0 8px 0", color: "#333" }}>
                    {h.HomeName ?? `Home ${h.HomeId}`}
                  </h4>
                  
                  <div style={{ marginBottom: "12px" }}>
                    <div style={{ color: "#666", fontSize: "14px", marginBottom: "4px" }}>
                      <strong>Owner:</strong> {h.OwnerName ?? 'N/A'}
                    </div>
                    <div style={{ color: "#666", fontSize: "14px", marginBottom: "4px" }}>
                      <strong>City:</strong> {h.HomeCity ?? 'N/A'}
                    </div>
                    <div style={{ color: "#666", fontSize: "14px", marginBottom: "4px" }}>
                      <strong>Price:</strong> ₹{h.HomePriceInital ?? 'N/A'}
                    </div>
                    <div style={{ color: "#666", fontSize: "14px", marginBottom: "4px" }}>
                      <strong>Description:</strong> {h.HomeDescription ?? 'N/A'}
                    </div>
                    {h.HomeAddress && (
                      <div style={{ color: "#666", fontSize: "14px", marginBottom: "4px" }}>
                        <strong>Address:</strong> {h.HomeAddress}
                      </div>
                    )}
                    {h.HomeState && (
                      <div style={{ color: "#666", fontSize: "14px", marginBottom: "4px" }}>
                        <strong>State:</strong> {h.HomeState}
                      </div>
                    )}
                    {h.HomePincode && (
                      <div style={{ color: "#666", fontSize: "14px", marginBottom: "4px" }}>
                        <strong>Pincode:</strong> {h.HomePincode}
                      </div>
                    )}
                    {h.OwnerEmail && (
                      <div style={{ color: "#666", fontSize: "14px", marginBottom: "4px" }}>
                        <strong>Owner Email:</strong> {h.OwnerEmail}
                      </div>
                    )}
                    {h.OwnerPhoneNo && (
                      <div style={{ color: "#666", fontSize: "14px", marginBottom: "4px" }}>
                        <strong>Owner Phone:</strong> {h.OwnerPhoneNo}
                      </div>
                    )}
                  </div>
                  
                  <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                    <button
                      onClick={() => handleApprove("home", h.HomeId)}
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
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject("home", h.HomeId)}
                      style={{
                        flex: 1,
                        padding: "10px",
                        background: "#e57373",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600"
                      }}
                    >
                      Reject
                    </button>
                  </div>
                  
                  <button
                    onClick={() => setShowDetails({id: h.HomeId, docs: h.Documents || []})}
                    style={{
                      width: "100%",
                      padding: "8px",
                      marginTop: "8px",
                      background: "#b78a62",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "14px"
                    }}
                  >
                    View All Documents
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {pendingHomes.length > 0 && (
            <div style={{ textAlign: "center", marginTop: "20px", padding: "20px", background: "#f8f6f0", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <button
                onClick={() => setHomePage(homePage - 1)}
                disabled={homePage === 0}
                style={{
                  padding: "8px 16px",
                  margin: "0 5px",
                  background: homePage === 0 ? "#ccc" : "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: homePage === 0 ? "not-allowed" : "pointer"
                }}
              >
                Previous
              </button>
              
              <span style={{ margin: "0 10px" }}>
                Page {homePage + 1} of {Math.ceil(pendingHomes.length / itemsPerPage)}
              </span>
              
              <button
                onClick={() => setHomePage(homePage + 1)}
                disabled={homePage >= Math.ceil(pendingHomes.length / itemsPerPage) - 1}
                style={{
                  padding: "8px 16px",
                  margin: "0 5px",
                  background: homePage >= Math.ceil(pendingHomes.length / itemsPerPage) - 1 ? "#ccc" : "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: homePage >= Math.ceil(pendingHomes.length / itemsPerPage) - 1 ? "not-allowed" : "pointer"
                }}
              >
                Next
              </button>
            </div>
          )}
        </section>

        <section style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0 }}>Pending Lands</h3>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Search lands..."
                value={landFilter}
                onChange={(e) => setLandFilter(e.target.value)}
                style={{
                  padding: '6px 10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
              <select
                value={landSortBy}
                onChange={(e) => setLandSortBy(e.target.value)}
                style={{
                  padding: '6px 10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="">Sort by</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name A-Z</option>
              </select>
              <span style={{ fontSize: '14px', color: '#666' }}>({pendingLands.length} lands)</span>
            </div>
          </div>
          {pendingLands.length === 0 && <div>No pending lands</div>}
          <div style={{ textAlign: "left" }}>
            {pendingLands.slice(landPage * itemsPerPage, (landPage + 1) * itemsPerPage).map((l: any) => (
              <div key={l.LandId} style={{
                background: "#f8f6f0",
                borderRadius: "15px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                overflow: "hidden",
                border: "1px solid #e0e0e0",
                display: "inline-block",
                width: "calc(33.333% - 20px)",
                margin: "10px 5px",
                verticalAlign: "top"
              }}>
                <ImageCarousel
                  images={(l.Documents || []).filter((doc: any) => doc.DocumentType === 1)}
                  getImageUrl={(doc: any) => getLandFileFromPath(doc.DocumentPath)}
                />
                
                <div style={{ padding: "16px" }}>
                  <h4 style={{ margin: "0 0 8px 0", color: "#333" }}>
                    {l.LandName ?? `Land ${l.LandId}`}
                  </h4>
                  
                  <div style={{ marginBottom: "12px" }}>
                    <div style={{ color: "#666", fontSize: "14px", marginBottom: "4px" }}>
                      <strong>Owner:</strong> {l.OwnerName ?? 'N/A'}
                    </div>
                    <div style={{ color: "#666", fontSize: "14px", marginBottom: "4px" }}>
                      <strong>City:</strong> {l.LandCity ?? 'N/A'}
                    </div>
                    <div style={{ color: "#666", fontSize: "14px", marginBottom: "4px" }}>
                      <strong>Price:</strong> ₹{l.LandPriceInitial ?? 'N/A'}
                    </div>
                    <div style={{ color: "#666", fontSize: "14px", marginBottom: "4px" }}>
                      <strong>Description:</strong> {l.LandDescription ?? 'N/A'}
                    </div>
                    {l.LandAddress && (
                      <div style={{ color: "#666", fontSize: "14px", marginBottom: "4px" }}>
                        <strong>Address:</strong> {l.LandAddress}
                      </div>
                    )}
                    {l.LandState && (
                      <div style={{ color: "#666", fontSize: "14px", marginBottom: "4px" }}>
                        <strong>State:</strong> {l.LandState}
                      </div>
                    )}
                    {l.LandPincode && (
                      <div style={{ color: "#666", fontSize: "14px", marginBottom: "4px" }}>
                        <strong>Pincode:</strong> {l.LandPincode}
                      </div>
                    )}
                    {l.OwnerEmail && (
                      <div style={{ color: "#666", fontSize: "14px", marginBottom: "4px" }}>
                        <strong>Owner Email:</strong> {l.OwnerEmail}
                      </div>
                    )}
                    {l.OwnerPhoneNo && (
                      <div style={{ color: "#666", fontSize: "14px", marginBottom: "4px" }}>
                        <strong>Owner Phone:</strong> {l.OwnerPhoneNo}
                      </div>
                    )}
                  </div>
                  
                  <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                    <button
                      onClick={() => handleApprove("land", l.LandId)}
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
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject("land", l.LandId)}
                      style={{
                        flex: 1,
                        padding: "10px",
                        background: "#e57373",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600"
                      }}
                    >
                      Reject
                    </button>
                  </div>
                  
                  <button
                    onClick={() => setShowDetails({id: l.LandId, docs: l.Documents || []})}
                    style={{
                      width: "100%",
                      padding: "8px",
                      marginTop: "8px",
                      background: "#b78a62",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "14px"
                    }}
                  >
                    View All Documents
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {pendingLands.length > 0 && (
            <div style={{ textAlign: "center", marginTop: "20px", padding: "20px", background: "#f8f6f0", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <button
                onClick={() => setLandPage(landPage - 1)}
                disabled={landPage === 0}
                style={{
                  padding: "8px 16px",
                  margin: "0 5px",
                  background: landPage === 0 ? "#ccc" : "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: landPage === 0 ? "not-allowed" : "pointer"
                }}
              >
                Previous
              </button>
              
              <span style={{ margin: "0 10px" }}>
                Page {landPage + 1} of {Math.ceil(pendingLands.length / itemsPerPage)}
              </span>
              
              <button
                onClick={() => setLandPage(landPage + 1)}
                disabled={landPage >= Math.ceil(pendingLands.length / itemsPerPage) - 1}
                style={{
                  padding: "8px 16px",
                  margin: "0 5px",
                  background: landPage >= Math.ceil(pendingLands.length / itemsPerPage) - 1 ? "#ccc" : "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: landPage >= Math.ceil(pendingLands.length / itemsPerPage) - 1 ? "not-allowed" : "pointer"
                }}
              >
                Next
              </button>
            </div>
          )}
        </section>
        

        {showDetails && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}>
            <div style={{
              background: "#f8f6f0",
              padding: "20px",
              borderRadius: "10px",
              maxWidth: "80%",
              maxHeight: "80%",
              overflow: "auto",
              position: "relative"
            }}>
              <button
                onClick={() => setShowDetails(null)}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  cursor: "pointer"
                }}
              >
                ×
              </button>
              
              <h3>All Documents</h3>
              
              {showDetails.docs.length > 0 ? (
                showDetails.docs.map((doc, index) => (
                  <div key={index} style={{ marginBottom: "20px", border: "1px solid #ddd", borderRadius: "8px", padding: "15px" }}>
                    <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>
                      {doc.DocumentType === 1 ? "📷 Image Document" : "📄 Text Document"}
                    </h4>
                    
                    {doc.DocumentType === 1 ? (
                      <div style={{ textAlign: "center" }}>
                        <img
                          src={getFileFromPath(doc.DocumentPath)}
                          alt="Document"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "400px",
                            objectFit: "contain",
                            border: "1px solid #ddd",
                            borderRadius: "4px"
                          }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = '<p style="color: #999; font-style: italic;">Image could not be loaded</p>';
                          }}
                        />
                      </div>
                    ) : (
                      <pre style={{ 
                        background: "#f0ede5", 
                        padding: "10px", 
                        borderRadius: "5px", 
                        whiteSpace: "pre-wrap",
                        fontSize: "12px",
                        maxHeight: "300px",
                        overflow: "auto",
                        margin: 0
                      }}>
                        {doc.DocumentDetailsExtracted || "[No extracted text available]"}
                      </pre>
                    )}
                  </div>
                ))
              ) : (
                <p>No documents available.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminApprovalsPage;

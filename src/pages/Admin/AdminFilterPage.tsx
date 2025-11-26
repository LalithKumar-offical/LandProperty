import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../slice/store';
import { fetchAllProperties } from '../../slice/propertiesSlice';
import AdminNavbar from "../../components/AdminNavbar";

const AdminFilterPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { homes, loading, initialized } = useSelector((state: RootState) => state.properties);
  const [approved, setApproved] = useState<string>("any");
  const [active, setActive] = useState<string>("any");

  // Filter homes based on selected criteria
  const filteredResults = homes.filter((home: any) => {
    let matchesApproval = true;
    let matchesActive = true;
    
    if (approved !== "any") {
      matchesApproval = home.HomeStatusApproved === (approved === "true");
    }
    
    if (active !== "any") {
      matchesActive = home.Status === (active === "true");
    }
    
    return matchesApproval && matchesActive;
  });

  useEffect(() => {
    if (!initialized && !loading) {
      dispatch(fetchAllProperties());
    }
  }, [dispatch, initialized, loading]);

  return (
    <>
      <AdminNavbar />
      <div style={{ padding: 24, background: "#faf7f2", minHeight: "100vh" }}>
        <h1>Filter Properties</h1>

        <div style={{ display: "flex", gap: 12, marginTop: 12, alignItems: 'center' }}>
          <select value={approved} onChange={(e) => setApproved(e.target.value)}>
            <option value="any">Any Approval</option>
            <option value="true">Approved</option>
            <option value="false">Rejected</option>
          </select>

          <select value={active} onChange={(e) => setActive(e.target.value)}>
            <option value="any">Any Active</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          
          <span style={{ marginLeft: '20px', color: '#666', fontSize: '14px' }}>
            Showing {filteredResults.length} properties
          </span>
        </div>

        <div style={{ marginTop: 18 }}>
          {loading && <div>Loading properties...</div>}
          {!loading && filteredResults.length === 0 && <div>No results found</div>}
          {filteredResults.map((home: any) => (
            <div key={home.HomeId} style={{ background: "#fff", padding: 16, borderRadius: 10, marginBottom: 12, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 18 }}>Home ID: {home.HomeId}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: 4, 
                    fontSize: 12, 
                    backgroundColor: home.HomeStatusApproved ? '#d4edda' : '#f8d7da',
                    color: home.HomeStatusApproved ? '#155724' : '#721c24'
                  }}>
                    {home.HomeStatusApproved ? 'Approved' : 'Not Approved'}
                  </span>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: 4, 
                    fontSize: 12, 
                    backgroundColor: home.Status ? '#d1ecf1' : '#f5c6cb',
                    color: home.Status ? '#0c5460' : '#721c24'
                  }}>
                    {home.Status ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div style={{ color: "#666", marginBottom: 8 }}>{home.HomeDiscription}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div><strong>City:</strong> {home.HomeCity}</div>
                <div><strong>Price:</strong> ₹{home.HomePriceInital?.toLocaleString() || '0'}</div>
              </div>
              {home.RejectedReason && (
                <div style={{ marginTop: 8, padding: 8, backgroundColor: '#f8d7da', borderRadius: 4, color: '#721c24' }}>
                  <strong>Rejection Reason:</strong> {home.RejectedReason}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminFilterPage;

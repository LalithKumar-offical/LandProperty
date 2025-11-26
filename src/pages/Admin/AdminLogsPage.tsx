import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../slice/store';
import { fetchAllLogs } from '../../slice/admin/adminLogsSlice';
import AdminNavbar from '../../components/AdminNavbar';
import type { LogEntry } from '../../types/loggerType';

const AdminLogsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { logs, loading, initialized } = useSelector((state: RootState) => state.adminLogs);

  const parseDescription = (description: string) => {
    const userMatch = description.match(/User ([a-f0-9-]+)/);
    const amountMatch = description.match(/₹([\d,]+(?:\.\d{2})?)|\$([\d,]+(?:\.\d{2})?)|([\d,]+(?:\.\d{2})?) rupees/);
    const homeMatch = description.match(/Home ID (\d+)/);
    
    return {
      userId: userMatch ? userMatch[1] : '',
      amount: amountMatch ? (amountMatch[1] || amountMatch[2] || amountMatch[3] || '') : '',
      homeId: homeMatch ? homeMatch[1] : '',
      action: description.includes('placed') ? 'Placed Bid' : 'Updated Bid'
    };
  };

  useEffect(() => {
    if (!initialized && !loading) {
      dispatch(fetchAllLogs());
    }
  }, [dispatch, initialized, loading]);

  return (
    <>
      <AdminNavbar />
      <div style={{padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto'}}>
        <h1 style={{color: '#2c3e50', marginBottom: '20px', fontSize: '28px'}}>System Logs</h1>
        
        {loading ? (
          <div style={{textAlign: 'center', padding: '40px', fontSize: '18px'}}>Loading logs...</div>
        ) : (
          <div>
            <div style={{backgroundColor: '#b78a62', color: 'white', padding: '15px', borderRadius: '8px', marginBottom: '20px'}}>
              <h3 style={{margin: 0}}>Total Logs: {logs.length}</h3>
            </div>
            
            <div style={{display: 'grid', gap: '15px'}}>
              {logs.map((log, index) => (
                <div key={index} style={{
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  padding: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '1px solid #e0e0e0'
                }}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                    <span style={{
                      backgroundColor: '#e74c3c',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      {log.Action}
                    </span>
                    <span style={{color: '#7f8c8d', fontSize: '14px'}}>
                      {new Date(log.ActionDate).toLocaleString()}
                    </span>
                  </div>
                  
                  <div style={{marginBottom: '15px'}}>
                    {(() => {
                      const parsed = parseDescription(log.Description);
                      return (
                        <div style={{backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #dee2e6'}}>
                          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px'}}>
                            <div>
                              <strong style={{color: '#495057', fontSize: '12px'}}>USER NAME</strong>
                              <div style={{color: '#6c757d', fontSize: '14px', fontWeight: 'bold'}}>{log.UserName || 'Unknown User'}</div>
                            </div>
                            <div>
                              <strong style={{color: '#495057', fontSize: '12px'}}>ACTION TYPE</strong>
                              <div style={{color: '#28a745', fontSize: '14px', fontWeight: 'bold'}}>{parsed.action}</div>
                            </div>
                          </div>
                          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                            <div>
                              <strong style={{color: '#495057', fontSize: '12px'}}>BID AMOUNT</strong>
                              <div style={{color: '#dc3545', fontSize: '18px', fontWeight: 'bold'}}>₹{parsed.amount}</div>
                            </div>
                            <div>
                              <strong style={{color: '#495057', fontSize: '12px'}}>HOME ID</strong>
                              <div style={{color: '#007bff', fontSize: '16px', fontWeight: 'bold'}}>#{parsed.homeId}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })()} 
                  </div>
                  
                  <div style={{display: 'flex', gap: '20px', fontSize: '14px'}}>
                    <span style={{color: '#27ae60'}}>
                      <strong>Entity:</strong> {log.EntityType}
                    </span>
                    <span style={{color: '#8e44ad'}}>
                      <strong>ID:</strong> {log.EntityId}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default AdminLogsPage;

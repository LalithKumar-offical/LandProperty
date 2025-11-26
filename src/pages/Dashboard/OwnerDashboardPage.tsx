import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import OwnerNavbar from '../../components/OwnerNavbar';
import { fetchOwnerDashboard, checkUserChange } from '../../slice/owner/ownerDashboardSlice';
import { useCrossTabSync } from '../../hooks/useCrossTabSync';
import type { RootState, AppDispatch } from '../../slice/store';

const OwnerDashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const { homes, lands, loading, initialized } = useSelector((state: RootState) => state.ownerDashboard);
  useCrossTabSync(); // Enable cross-tab sync

  useEffect(() => {
    const userId = user?.UserId;
    if (userId) {
      dispatch(checkUserChange(userId));
      if (!initialized && !loading) {
        dispatch(fetchOwnerDashboard(userId));
      }
    }
  }, [dispatch, user, initialized, loading]);

  if (loading) {
    return (
      <>
        <OwnerNavbar />
        <div style={containerStyle}>
          <div style={loadingStyle}>Loading dashboard...</div>
        </div>
      </>
    );
  }

  if (!initialized && !loading) {
    return (
      <>
        <OwnerNavbar />
        <div style={containerStyle}>
          <div style={loadingStyle}>No data available</div>
        </div>
      </>
    );
  }
  
  const totalHomes = homes.length;
  const totalLands = lands.length;
  const approvedHomes = homes.filter((h: any) => h.HomeStatusApproved === true).length;
  const pendingHomes = homes.filter((h: any) => h.HomeStatusApproved === false).length;
  const approvedLands = lands.filter((l: any) => l.LandStatusApproved === true).length;
  const pendingLands = lands.filter((l: any) => l.LandStatusApproved === false).length;

  return (
    <>
      <OwnerNavbar />
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Property Management Hub 🏢</h1>
          <p style={subtitleStyle}>Manage your properties and track performance</p>
        </div>

        <div style={statsGridStyle}>
            <MetricCard 
              icon="🏠" 
              title="Total Homes" 
              value={totalHomes} 
              color="#5d8a72"
              trend={`${approvedHomes} approved, ${pendingHomes} pending`}
            />
            <MetricCard 
              icon="🌾" 
              title="Total Lands" 
              value={totalLands} 
              color="#b78a62"
              trend={`${approvedLands} approved, ${pendingLands} pending`}
            />
            <MetricCard 
              icon="✅" 
              title="Approved Properties" 
              value={approvedHomes + approvedLands} 
              color="#4CAF50"
              trend="Ready for listing"
            />
            <MetricCard 
              icon="⏳" 
              title="Pending Approval" 
              value={pendingHomes + pendingLands} 
              color="#ff9800"
              trend="Awaiting review"
            />
          </div>

          <div style={sectionsStyle}>
            <PropertyOverview homes={homes} />
            <LandOverview lands={lands} />
          </div>

          <div style={chartsStyle}>
            <PropertyStatus homes={homes} lands={lands} />
          </div>
      </div>
    </>
  );
};

const MetricCard: React.FC<{
  icon: string;
  title: string;
  value: number | string;
  color: string;
  trend: string;
}> = ({ icon, title, value, color, trend }) => (
  <div style={{...metricCardStyle, borderTop: `4px solid ${color}`}}>
    <div style={metricHeaderStyle}>
      <div style={{...metricIconStyle, background: `${color}20`}}>
        <span style={{color}}>{icon}</span>
      </div>
      <div>
        <h3 style={metricTitleStyle}>{title}</h3>
        <div style={{...metricValueStyle, color}}>{value}</div>
      </div>
    </div>
    <div style={trendStyle}>{trend}</div>
  </div>
);

const PropertyOverview: React.FC<{ homes: any[] }> = ({ homes }) => (
  <div style={sectionCardStyle}>
    <h3 style={sectionTitleStyle}>My Homes ({homes.length})</h3>
    <div style={propertyListStyle}>
      {homes.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#7f8c8d', padding: '20px' }}>No homes added yet</div>
      ) : (
        homes.slice(0, 5).map((home, index) => (
          <PropertyItem 
            key={index}
            name={home.HomeName || home.HomeDiscription?.substring(0, 30) || `Home ${home.HomeId}`}
            status={home.HomeStatusApproved ? 'Approved' : 'Pending'}
            price={`₹${home.HomePriceInital?.toLocaleString() || 'N/A'}`}
            location={home.HomeCity || 'N/A'}
          />
        ))
      )}
    </div>
  </div>
);

const LandOverview: React.FC<{ lands: any[] }> = ({ lands }) => (
  <div style={sectionCardStyle}>
    <h3 style={sectionTitleStyle}>My Lands ({lands.length})</h3>
    <div style={propertyListStyle}>
      {lands.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#7f8c8d', padding: '20px' }}>No lands added yet</div>
      ) : (
        lands.slice(0, 5).map((land, index) => (
          <PropertyItem 
            key={index}
            name={land.LandName || land.LandDiscription?.substring(0, 30) || `Land ${land.LandId}`}
            status={land.LandStatusApproved ? 'Approved' : 'Pending'}
            price={`₹${land.LandPriceInital?.toLocaleString() || 'N/A'}`}
            location={land.LandCity || 'N/A'}
          />
        ))
      )}
    </div>
  </div>
);

const PropertyItem: React.FC<{ name: string; status: string; price: string; location: string }> = ({ name, status, price, location }) => (
  <div style={propertyItemStyle}>
    <div>
      <div style={propertyNameStyle}>{name}</div>
      <div style={propertyPriceStyle}>{price} • {location}</div>
    </div>
    <span style={{
      ...statusBadgeStyle,
      background: status === 'Approved' ? '#5d8a72' : status === 'Rejected' ? '#e57373' : '#ff9800'
    }}>
      {status}
    </span>
  </div>
);







const PropertyStatus: React.FC<{ homes: any[]; lands: any[] }> = ({ homes, lands }) => {
  const approvedHomes = homes.filter(h => h.HomeStatusApproved === true).length;
  const pendingHomes = homes.filter((h: any) => h.HomeStatusApproved === false).length;
  const approvedLands = lands.filter(l => l.LandStatusApproved === true).length;
  const pendingLands = lands.filter(l => l.LandStatusApproved === false).length;
  
  return (
    <div style={chartCardStyle}>
      <h3 style={sectionTitleStyle}>Property Status Overview</h3>
      <div style={statusGridStyle}>
        <StatusItem label="Approved Homes" count={approvedHomes} color="#5d8a72" />
        <StatusItem label="Pending Homes" count={pendingHomes} color="#e57373" />
        <StatusItem label="Approved Lands" count={approvedLands} color="#b78a62" />
        <StatusItem label="Pending Lands" count={pendingLands} color="#ff9800" />
      </div>
    </div>
  );
};

const StatusItem: React.FC<{ label: string; count: number; color: string }> = ({ label, count, color }) => (
  <div style={statusItemStyle}>
    <div style={{...statusDotStyle, background: color}}></div>
    <span style={statusLabelStyle}>{label}</span>
    <span style={{...statusCountStyle, color}}>{count}</span>
  </div>
);

// Styles
const containerStyle: React.CSSProperties = {
  padding: '24px',
  background: '#f0f8f0',
  minHeight: '100vh',
  color: '#2c3e50',
};

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '32px',
};

const titleStyle: React.CSSProperties = {
  fontSize: '2.5rem',
  fontWeight: 700,
  color: '#6b4f2a',
  margin: 0,
  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const subtitleStyle: React.CSSProperties = {
  fontSize: '1.1rem',
  color: '#bdc3c7',
  margin: '8px 0 0 0',
};

const loadingStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '40px',
  fontSize: '1.2rem',
  color: '#bdc3c7',
};

const statsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '20px',
  marginBottom: '32px',
};

const metricCardStyle: React.CSSProperties = {
  background: '#e8f5e8',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  color: '#2c3e50',
  border: '1px solid #c8e6c8',
};

const metricHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  marginBottom: '12px',
};

const metricIconStyle: React.CSSProperties = {
  fontSize: '1.5rem',
  borderRadius: '12px',
  padding: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const metricTitleStyle: React.CSSProperties = {
  fontSize: '0.9rem',
  fontWeight: 600,
  color: '#7f8c8d',
  margin: 0,
};

const metricValueStyle: React.CSSProperties = {
  fontSize: '2rem',
  fontWeight: 700,
  margin: '4px 0 0 0',
};

const trendStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  color: '#27ae60',
  fontWeight: 500,
};

const sectionsStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
  gap: '24px',
  marginBottom: '24px',
};

const sectionCardStyle: React.CSSProperties = {
  background: '#e8f5e8',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  color: '#2c3e50',
  border: '1px solid #c8e6c8',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '1.3rem',
  fontWeight: 600,
  marginBottom: '20px',
  color: '#2c3e50',
};

const propertyListStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const propertyItemStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px',
  background: '#d4edda',
  borderRadius: '12px',
};

const propertyNameStyle: React.CSSProperties = {
  fontWeight: 600,
  color: '#2c3e50',
};

const propertyPriceStyle: React.CSSProperties = {
  fontSize: '0.9rem',
  color: '#7f8c8d',
  marginTop: '4px',
};

const statusBadgeStyle: React.CSSProperties = {
  padding: '4px 12px',
  borderRadius: '20px',
  color: 'white',
  fontSize: '0.8rem',
  fontWeight: 600,
};

const chartsStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
  gap: '24px',
};

const chartCardStyle: React.CSSProperties = {
  background: '#e8f5e8',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  color: '#2c3e50',
  border: '1px solid #c8e6c8',
};

const statusGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '16px',
};

const statusItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px',
  background: '#d4edda',
  borderRadius: '8px',
};

const statusDotStyle: React.CSSProperties = {
  width: '12px',
  height: '12px',
  borderRadius: '50%',
};

const statusLabelStyle: React.CSSProperties = {
  flex: 1,
  fontWeight: 500,
};

const statusCountStyle: React.CSSProperties = {
  fontWeight: 700,
  fontSize: '1.1rem',
};

export default OwnerDashboardPage;

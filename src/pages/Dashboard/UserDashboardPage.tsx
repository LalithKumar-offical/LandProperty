import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserNavbar from '../../components/UserNavbar';
import type { RootState, AppDispatch } from '../../slice/store';

const UserDashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { properties, bids, applications, loading } = useSelector((state: RootState) => state.userDashboard);

  useEffect(() => {
  }, [dispatch]);

  return (
    <>
      <UserNavbar />
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Welcome Back! 👋</h1>
          <p style={subtitleStyle}>Discover your dream property today</p>
        </div>

        {loading ? (
          <div style={loadingStyle}>Loading your dashboard...</div>
        ) : (
          <>
            <div style={statsGridStyle}>
              <StatCard 
                icon="🏠" 
                title="Saved Properties" 
                value={properties.length} 
                color="#667eea"
                description="Properties you're interested in"
              />
              <StatCard 
                icon="💰" 
                title="Active Bids" 
                value={bids.length} 
                color="#764ba2"
                description="Your current bids"
              />
              <StatCard 
                icon="📋" 
                title="Applications" 
                value={applications.length} 
                color="#f093fb"
                description="Submitted applications"
              />
              <StatCard 
                icon="⭐" 
                title="Favorites" 
                value={12} 
                color="#4facfe"
                description="Your favorite listings"
              />
            </div>

            <div style={sectionsStyle}>
              <QuickActions />
              <RecentActivity />
            </div>
          </>
        )}
      </div>
    </>
  );
};

const StatCard: React.FC<{
  icon: string;
  title: string;
  value: number;
  color: string;
  description: string;
}> = ({ icon, title, value, color, description }) => (
  <div style={{...cardStyle, borderLeft: `4px solid ${color}`}}>
    <div style={cardHeaderStyle}>
      <span style={iconStyle}>{icon}</span>
      <div>
        <h3 style={cardTitleStyle}>{title}</h3>
        <p style={cardDescStyle}>{description}</p>
      </div>
    </div>
    <div style={{...valueStyle, color}}>{value}</div>
  </div>
);

const QuickActions: React.FC = () => (
  <div style={sectionStyle}>
    <h3 style={sectionTitleStyle}>Quick Actions</h3>
    <div style={actionsGridStyle}>
      <ActionButton icon="🔍" text="Browse Properties" color="#667eea" />
      <ActionButton icon="💼" text="My Applications" color="#764ba2" />
      <ActionButton icon="📊" text="Bid History" color="#f093fb" />
      <ActionButton icon="⚙️" text="Settings" color="#4facfe" />
    </div>
  </div>
);

const ActionButton: React.FC<{ icon: string; text: string; color: string }> = ({ icon, text, color }) => (
  <button style={{...actionBtnStyle, background: `linear-gradient(135deg, ${color}, ${color}dd)`}}>
    <span style={actionIconStyle}>{icon}</span>
    <span>{text}</span>
  </button>
);

const RecentActivity: React.FC = () => (
  <div style={sectionStyle}>
    <h3 style={sectionTitleStyle}>Recent Activity</h3>
    <div style={activityListStyle}>
      <ActivityItem icon="🏠" text="Viewed luxury apartment in Downtown" time="2 hours ago" />
      <ActivityItem icon="💰" text="Placed bid on modern villa" time="1 day ago" />
      <ActivityItem icon="📋" text="Application approved for townhouse" time="3 days ago" />
    </div>
  </div>
);

const ActivityItem: React.FC<{ icon: string; text: string; time: string }> = ({ icon, text, time }) => (
  <div style={activityItemStyle}>
    <span style={activityIconStyle}>{icon}</span>
    <div style={activityContentStyle}>
      <p style={activityTextStyle}>{text}</p>
      <span style={activityTimeStyle}>{time}</span>
    </div>
  </div>
);

const containerStyle: React.CSSProperties = {
  padding: '24px',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  minHeight: '100vh',
};

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '32px',
};

const titleStyle: React.CSSProperties = {
  fontSize: '2.5rem',
  fontWeight: 700,
  color: '#2c3e50',
  margin: 0,
  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const subtitleStyle: React.CSSProperties = {
  fontSize: '1.1rem',
  color: '#7f8c8d',
  margin: '8px 0 0 0',
};

const loadingStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '40px',
  fontSize: '1.2rem',
  color: '#7f8c8d',
};

const statsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '20px',
  marginBottom: '32px',
};

const cardStyle: React.CSSProperties = {
  background: 'white',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease',
};

const cardHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  marginBottom: '16px',
};

const iconStyle: React.CSSProperties = {
  fontSize: '2rem',
  background: 'rgba(102, 126, 234, 0.1)',
  borderRadius: '12px',
  padding: '12px',
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: '1.1rem',
  fontWeight: 600,
  color: '#2c3e50',
  margin: 0,
};

const cardDescStyle: React.CSSProperties = {
  fontSize: '0.9rem',
  color: '#7f8c8d',
  margin: '4px 0 0 0',
};

const valueStyle: React.CSSProperties = {
  fontSize: '2.5rem',
  fontWeight: 700,
  textAlign: 'right',
};

const sectionsStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
  gap: '24px',
};

const sectionStyle: React.CSSProperties = {
  background: 'white',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '1.3rem',
  fontWeight: 600,
  color: '#2c3e50',
  marginBottom: '20px',
};

const actionsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: '12px',
};

const actionBtnStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  padding: '20px',
  border: 'none',
  borderRadius: '12px',
  color: 'white',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'transform 0.2s ease',
};

const actionIconStyle: React.CSSProperties = {
  fontSize: '1.5rem',
};

const activityListStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const activityItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '12px',
  background: '#f8f9fa',
  borderRadius: '12px',
};

const activityIconStyle: React.CSSProperties = {
  fontSize: '1.5rem',
  background: 'white',
  borderRadius: '8px',
  padding: '8px',
};

const activityContentStyle: React.CSSProperties = {
  flex: 1,
};

const activityTextStyle: React.CSSProperties = {
  margin: 0,
  color: '#2c3e50',
  fontWeight: 500,
};

const activityTimeStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  color: '#7f8c8d',
};

export default UserDashboardPage;

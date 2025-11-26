import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminNavbar from "../../components/AdminNavbar";
import { fetchDashboardSummary } from "../../slice/dashboardSlice";
import type { RootState, AppDispatch } from "../../slice/store";

const AdminDashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, homes, lands, loading, initialized } = useSelector((state: RootState) => state.dashboard);

  // ⭐ FIX: Blur previously focused button to stop Chrome aria-hidden warning
  useEffect(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    if (!initialized && !loading) {
      dispatch(fetchDashboardSummary());
    }
  }, [dispatch, initialized, loading]);

  const totalUsers = users.length;
  const propertyOwners = users.filter((u: any) => u.RoleName === "PropertyOwner").length;
  const normalUsers = users.filter((u: any) => u.RoleName === "User").length;
  const admins = users.filter((u: any) => u.RoleName === "Admin").length;

  const approvedHomes = homes.filter((h: any) => h.HomeStatusApproved === true).length;
  const pendingHomes = homes.filter((h: any) => h.HomeStatusApproved === false).length;
  const approvedLands = lands.filter((l: any) => l.LandStatusApproved === true).length;
  const pendingLands = lands.filter((l: any) => l.LandStatusApproved === false).length;

  return (
    <>
      <AdminNavbar />
      <div style={{ padding: 28, background: "#faf7f2", minHeight: "100vh" }}>
        <h1 style={{ color: "#4a4a4a" }}>Admin Dashboard</h1>

        {loading ? (
          <div>Loading dashboard data...</div>
        ) : (
          <div>
            <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginTop: 18 }}>
              <StatCard title="Total Users" value={totalUsers} color="#5d8a72" />
              <StatCard title="Property Owners" value={propertyOwners} color="#b78a62" />
              <StatCard title="Normal Users" value={normalUsers} color="#8c6b42" />
              <StatCard title="Admins" value={admins} color="#6b4f2a" />
            </div>

            <div style={{ display: "flex", gap: 20, marginTop: 28, flexWrap: "wrap" }}>
              <PieChart
                title="User Distribution"
                data={[
                  { label: "Property Owners", value: propertyOwners, color: "#1d4ed8" },
                  { label: "Normal Users", value: normalUsers, color: "#d97706" },
                  { label: "Admins", value: admins, color: "#7f1d1d" }
                ]}
              />

              <BarChart
                title="Property Status"
                data={[
                  { label: "Approved Homes", value: approvedHomes, color: "#5d8a72" },
                  { label: "Pending Homes", value: pendingHomes, color: "#e57373" },
                  { label: "Approved Lands", value: approvedLands, color: "#4CAF50" },
                  { label: "Pending Lands", value: pendingLands, color: "#ff9800" }
                ]}
              />
            </div>

            <div style={{ marginTop: 28 }}>
              <h3>Recent Users</h3>
              <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                {users.slice(0, 5).map((user, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "12px 0",
                      borderBottom: index < 4 ? "1px solid #eee" : "none",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <div>
                      <strong style={{ color: "#333" }}>{user.UserName}</strong>
                      <div style={{ color: "#666", fontSize: "14px" }}>{user.UserEmail}</div>
                    </div>
                    <span
                      style={{
                        backgroundColor:
                          user.RoleName === "Admin"
                            ? "#6b4f2a"
                            : user.RoleName === "PropertyOwner"
                            ? "#b78a62"
                            : "#8c6b42",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "12px"
                      }}
                    >
                      {user.RoleName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const StatCard: React.FC<{ title: string; value: any; color: string }> = ({
  title,
  value,
  color
}) => (
  <div
    style={{
      width: 220,
      padding: 18,
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
      border: `2px solid ${color}20`
    }}
  >
    <div style={{ color: "#6b6b6b", fontWeight: 700, fontSize: 14 }}>{title}</div>
    <div style={{ marginTop: 8, color: color, fontSize: 24, fontWeight: 700 }}>{value}</div>
  </div>
);

const PieChart: React.FC<{
  title: string;
  data: Array<{ label: string; value: number; color: string }>;
}> = ({ title, data }) => {
  const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
  let currentAngle = 0;

  if (total === 0) {
    return (
      <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 6px 20px rgba(0,0,0,0.06)", width: 300 }}>
        <h4 style={{ margin: "0 0 20px 0", color: "#333" }}>{title}</h4>
        <div style={{ textAlign: "center", color: "#666", padding: 20 }}>
          No data available
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 6px 20px rgba(0,0,0,0.06)", width: 300 }}>
      <h4 style={{ margin: "0 0 20px 0", color: "#333" }}>{title}</h4>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
          {data
            .filter((item) => item.value > 0)
            .map((item, index) => {
              const percentage = (item.value / total) * 100;
              const angle = (percentage / 100) * 360;
              const x1 = 60 + 50 * Math.cos((currentAngle * Math.PI) / 180);
              const y1 = 60 + 50 * Math.sin((currentAngle * Math.PI) / 180);
              const x2 = 60 + 50 * Math.cos(((currentAngle + angle) * Math.PI) / 180);
              const y2 = 60 + 50 * Math.sin(((currentAngle + angle) * Math.PI) / 180);
              const largeArc = angle > 180 ? 1 : 0;
              const path = `M 60 60 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`;
              currentAngle += angle;
              return <path key={index} d={path} fill={item.color} />;
            })}
        </svg>
        <div>
          {data.map((item, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: item.color,
                  borderRadius: 2,
                  marginRight: 8
                }}
              ></div>
              <span style={{ fontSize: 12, color: "#666" }}>
                {item.label}: {item.value || 0}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BarChart: React.FC<{
  title: string;
  data: Array<{ label: string; value: number; color: string }>;
}> = ({ title, data }) => {
  const maxValue = Math.max(...data.map((item) => item.value || 0), 1);

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 6px 20px rgba(0,0,0,0.06)", width: 400 }}>
      <h4 style={{ margin: "0 0 20px 0", color: "#333" }}>{title}</h4>
      <div style={{ display: "flex", alignItems: "end", gap: 10, height: 150 }}>
        {data.map((item, index) => {
          const value = item.value || 0;
          const height = (value / maxValue) * 120;
          return (
            <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: "bold", color: item.color, marginBottom: 5 }}>
                {value}
              </div>
              <div
                style={{
                  width: "100%",
                  height: height || 2,
                  backgroundColor: item.color,
                  borderRadius: "4px 4px 0 0",
                  minHeight: 2
                }}
              ></div>
              <div style={{ fontSize: 10, color: "#666", marginTop: 8, textAlign: "center", lineHeight: 1.2 }}>
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboardPage;

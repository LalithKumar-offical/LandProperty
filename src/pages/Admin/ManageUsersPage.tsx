import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../slice/store";
import { fetchAllUsers, deleteUser, updateUser } from "../../slice/admin/adminUsersSlice";
import AdminNavbar from "../../components/AdminNavbar";
import { toast } from 'react-toastify';
import { formatCurrencyWithText } from '../../utils/currencyFormatter';

const ManageUsersPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, initialized } = useSelector((s: RootState) => s.adminUsers);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({ userName: "", userEmail: "", role: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    if (!initialized && !loading) {
      dispatch(fetchAllUsers());
    }
  }, [dispatch, initialized, loading]);

  const filteredUsers = users.filter((user: any) => {
    const matchesSearch = (user.UserName || user.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.UserEmail || user.userEmail || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || (user.Role || user.RoleName || user.role) === filterRole;
    return matchesSearch && matchesRole;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return '#8b5a3c';
      case 'PropertyOwner': return '#b8860b';
      case 'User': return '#4682b4';
      default: return '#708090';
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = () => {
      toast.dismiss();
      performDelete(id);
    };
    
    const cancelDelete = () => {
      toast.dismiss();
    };
    
    toast(
      <div>
        <p>Are you sure you want to delete this user?</p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button 
            onClick={confirmDelete}
            style={{ padding: '5px 10px', background: '#e57373', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Delete
          </button>
          <button 
            onClick={cancelDelete}
            style={{ padding: '5px 10px', background: '#b78a62', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };
  
  const performDelete = async (id: string) => {
    try {
      await dispatch(deleteUser(id)).unwrap();
      toast.success("User deleted successfully");
    } catch (error) {

      toast.error("Failed to delete user. This user may have associated data.");
    }
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setEditForm({
      userName: user.UserName ?? user.userName,
      userEmail: user.UserEmail ?? user.userEmail,
      role: user.Role ?? user.role
    });
  };

  const handleSaveEdit = async () => {
    try {
      const userId = editingUser.UserId ?? editingUser.userId;
      await dispatch(updateUser({
        userId,
        userName: editForm.userName,
        userEmail: editForm.userEmail,
        role: editForm.role
      })).unwrap();
      setEditingUser(null);
      toast.success("User updated successfully");
    } catch (error) {

      toast.error("Failed to update user");
    }
  };

  return (
    <>
      <AdminNavbar />
      <div style={{ padding: '20px', background: '#f0f4f8', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '30px' }}>
            <h1 style={{ color: '#2c3e50', fontSize: '32px', marginBottom: '10px' }}>Manage Users</h1>
            <p style={{ color: '#7f8c8d', fontSize: '16px' }}>Manage all registered users in the system</p>
          </div>

          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <div style={{ background: '#e8f0f5', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #d1dce5' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#3498db', fontSize: '24px' }}>{users.length}</h3>
              <p style={{ margin: 0, color: '#7f8c8d' }}>Total Users</p>
            </div>
            <div style={{ background: '#e8f0f5', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #d1dce5' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#8b5a3c', fontSize: '24px' }}>{users.filter(u => (u.Role || u.RoleName) === 'Admin').length}</h3>
              <p style={{ margin: 0, color: '#7f8c8d' }}>Admins</p>
            </div>
            <div style={{ background: '#e8f0f5', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #d1dce5' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#b8860b', fontSize: '24px' }}>{users.filter(u => (u.Role || u.RoleName) === 'PropertyOwner').length}</h3>
              <p style={{ margin: 0, color: '#7f8c8d' }}>Property Owners</p>
            </div>
            <div style={{ background: '#e8f0f5', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #d1dce5' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#27ae60', fontSize: '24px' }}>{users.filter(u => (u.Role || u.RoleName) === 'User').length}</h3>
              <p style={{ margin: 0, color: '#7f8c8d' }}>Regular Users</p>
            </div>
          </div>

          {/* Search and Filter */}
          <div style={{ background: '#e8f0f5', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '20px', border: '1px solid #d1dce5' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '15px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                style={{
                  padding: '12px 16px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.3s'
                }}
              />
              <select
                value={filterRole}
                onChange={(e) => { setFilterRole(e.target.value); setCurrentPage(1); }}
                style={{
                  padding: '12px 16px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  minWidth: '150px'
                }}
              >
                <option value="">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="PropertyOwner">Property Owner</option>
                <option value="User">User</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', background: '#e8f0f5', borderRadius: '12px', border: '1px solid #d1dce5' }}>
              <div style={{ fontSize: '18px', color: '#7f8c8d' }}>Loading users...</div>
            </div>
          ) : (
            <div style={{ background: '#e8f0f5', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden', border: '1px solid #d1dce5' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#d1dce5' }}>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#2c3e50', borderBottom: '2px solid #e0e0e0' }}>User</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#2c3e50', borderBottom: '2px solid #e0e0e0' }}>Contact</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#2c3e50', borderBottom: '2px solid #e0e0e0' }}>Role</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#2c3e50', borderBottom: '2px solid #e0e0e0' }}>Balance</th>
                      <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#2c3e50', borderBottom: '2px solid #e0e0e0' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map((u: any) => {
                      const role = u.Role || u.RoleName || u.role;
                      return (
                        <tr key={u.UserId ?? u.userId} style={{ borderBottom: '1px solid #f0f0f0', transition: 'background-color 0.2s' }}>
                          <td style={{ padding: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: `linear-gradient(135deg, ${getRoleColor(role)}, ${getRoleColor(role)}88)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '16px'
                              }}>
                                {(u.UserName || u.userName || 'U').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontWeight: '600', color: '#2c3e50', fontSize: '16px' }}>
                                  {u.UserName || u.userName || 'N/A'}
                                </div>
                                <div style={{ color: '#7f8c8d', fontSize: '12px' }}>
                                  ID: {(u.UserId || u.userId || '').substring(0, 8)}...
                                </div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '16px' }}>
                            <div style={{ color: '#2c3e50', marginBottom: '4px' }}>{u.UserEmail || u.userEmail || u.email || 'N/A'}</div>
                            <div style={{ color: '#7f8c8d', fontSize: '14px' }}>{u.UserPhoneNo || u.userPhoneNo || 'No phone'}</div>
                          </td>
                          <td style={{ padding: '16px' }}>
                            <span style={{
                              padding: '6px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              color: 'white',
                              background: getRoleColor(role)
                            }}>
                              {role || 'N/A'}
                            </span>
                          </td>
                          <td style={{ padding: '16px' }}>
                            <div style={{ color: '#27ae60', fontWeight: '600', fontSize: '16px' }}>
                              {formatCurrencyWithText(u.UserBalance || u.userBalance || 0)}
                            </div>
                          </td>
                          <td style={{ padding: '16px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              <button
                                onClick={() => handleEdit(u)}
                                style={{
                                  padding: '8px 16px',
                                  background: '#5d8a72',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                  fontWeight: '500',
                                  transition: 'background-color 0.2s'
                                }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(u.UserId ?? u.userId)}
                                style={{
                                  padding: '8px 16px',
                                  background: '#c0392b',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                  fontWeight: '500',
                                  transition: 'background-color 0.2s'
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ padding: '20px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #e0e0e0',
                      background: currentPage === 1 ? '#f8f9fa' : '#fff',
                      color: currentPage === 1 ? '#ccc' : '#2c3e50',
                      borderRadius: '6px',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Previous
                  </button>
                  
                  <span style={{ color: '#7f8c8d', fontSize: '14px' }}>
                    Page {currentPage} of {totalPages} ({filteredUsers.length} users)
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #e0e0e0',
                      background: currentPage === totalPages ? '#f8f9fa' : '#fff',
                      color: currentPage === totalPages ? '#ccc' : '#2c3e50',
                      borderRadius: '6px',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Edit User Modal */}
        {editingUser && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
          }}>
            <div style={{
              background: 'white',
              padding: '30px',
              borderRadius: '16px',
              width: '500px',
              maxWidth: '90%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3498db, #2980b9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  marginRight: '15px'
                }}>
                  {(editForm.userName || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ margin: 0, color: '#2c3e50', fontSize: '24px' }}>Edit User</h3>
                  <p style={{ margin: 0, color: '#7f8c8d', fontSize: '14px' }}>Update user information</p>
                </div>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>Full Name</label>
                <input
                  type="text"
                  value={editForm.userName}
                  onChange={(e) => setEditForm({...editForm, userName: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.3s',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Enter full name"
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>Email Address</label>
                <input
                  type="email"
                  value={editForm.userEmail}
                  onChange={(e) => setEditForm({...editForm, userEmail: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.3s',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Enter email address"
                />
              </div>
              
              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>User Role</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.3s',
                    boxSizing: 'border-box',
                    background: 'white'
                  }}
                >
                  <option value="User">Regular User</option>
                  <option value="PropertyOwner">Property Owner</option>
                  <option value="Admin">Administrator</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setEditingUser(null)}
                  style={{
                    padding: '12px 24px',
                    background: '#95a5a6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '500',
                    transition: 'background-color 0.3s'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #27ae60, #2ecc71)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '500',
                    transition: 'background-color 0.3s',
                    boxShadow: '0 4px 12px rgba(39, 174, 96, 0.3)'
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default ManageUsersPage;

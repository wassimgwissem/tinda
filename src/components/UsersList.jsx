import { useState, useEffect } from 'react';
import { Table, Form, Button, Container, Image, Alert, Badge, Dropdown } from 'react-bootstrap';
import { getUser, logout, getUsers, updateUser, deleteUser } from '../utils/api';
import { useNavigate } from 'react-router-dom';

function UsersList({ isAdmin = true }) {
    const API = 'http://localhost:5000';
    const [userData, setUserData] = useState(null);
    const [users, setUsers] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [editData, setEditData] = useState({});
    const [imageFile, setImageFile] = useState(null);
    const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Show alert message
    const showAlert = (message, variant = 'success') => {
        setAlert({ show: true, message, variant });
        setTimeout(() => setAlert({ ...alert, show: false }), 3000);
    };

    // Fetch current user and all users
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Get current logged-in user
                const currentUser = await getUser();
                setUserData(currentUser);
                
                // Get all users (if admin)
                if (isAdmin) {
                    const allUsers = await getUsers();
                    setUsers(allUsers);
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
                if (error.response?.status === 401) {
                    navigate('/login');
                } else {
                    showAlert('Failed to fetch users', 'danger');
                }
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [isAdmin, navigate]);

    // Handle edit initialization
    const handleEdit = (idx) => {
        setEditIndex(idx);
        setEditData({ ...users[idx], password: '' });
        setImageFile(null);
    };

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    // Handle image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setEditData(prev => ({
                ...prev,
                image: URL.createObjectURL(file)
            }));
        }
    };

    // Save user changes
    const handleSave = async (idx) => {
        try {
            const userId = users[idx]._id;
            let dataToSend = { ...editData };
            
            // Remove password if empty
            if (!dataToSend.password) {
                delete dataToSend.password;
            }

            let updatedUser;
            if (imageFile) {
                const formData = new FormData();
                Object.entries(dataToSend).forEach(([key, value]) => {
                    if (value !== undefined) formData.append(key, value);
                });
                formData.append('image', imageFile);
                updatedUser = await updateUser(userId, formData, true);
            } else {
                updatedUser = await updateUser(userId, dataToSend);
            }

            const updatedUsers = [...users];
            updatedUsers[idx] = updatedUser;
            setUsers(updatedUsers);
            setEditIndex(null);
            showAlert('User updated successfully!');
        } catch (err) {
            showAlert(err.response?.data?.error || 'Failed to update user', 'danger');
        }
    };

    // Delete user with confirmation
    const handleDelete = async (idx) => {
        if (!window.confirm('Delete this user permanently?')) return;
        
        try {
            await deleteUser(users[idx]._id);
            setUsers(users.filter((_, i) => i !== idx));
            showAlert('User deleted successfully!');
        } catch (err) {
            showAlert('Failed to delete user', 'danger');
        }
    };

    // Handle logout
    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
            showAlert('Logged out successfully');
        } catch (err) {
            showAlert('Failed to logout', 'danger');
        }
    };

    return (
        <Container fluid className="vh-100 d-flex flex-column p-0 bg-white users-list-container">
            {/* Alert Notification (keep existing) */}

            {/* Header with User Controls */}
            <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                <h2 className="m-0 text-dark fw-bold">USER MANAGEMENT</h2>
                <div className="d-flex align-items-center gap-2">
                    <Dropdown className="users-list-dropdown">
                        <Dropdown.Toggle 
                            variant="outline-dark" 
                            className="users-list-dropdown-toggle d-flex align-items-center gap-2 rounded-pill px-3 py-2"
                        >
                            <div className="d-flex align-items-center gap-2">
                                <Image 
                                    src={userData?.image ? `${API}/${userData.image}` : '/default-profile.png'} 
                                    roundedCircle 
                                    width={32} 
                                    height={32} 
                                    className="users-list-profile-image border border-dark"
                                />
                                <div className="text-start users-list-user-info">
                                    <div className="small fw-bold">{userData?.name || 'User'}</div>
                                    <div className="small text-muted">{userData?.email || ''}</div>
                                </div>
                            </div>
                        </Dropdown.Toggle>
                        <Dropdown.Menu align="end" className="users-list-dropdown-menu">
                            <Dropdown.Header className="users-list-dropdown-header small text-muted">
                                {isAdmin ? 'ADMIN MENU' : 'USER MENU'}
                            </Dropdown.Header>
                            {isAdmin && (
                                <>
                                    <Dropdown.Item 
                                        as="button"
                                        className="users-list-dropdown-item"
                                        onClick={() => navigate('/host')}
                                    >
                                        <i className="fas fa-home text-secondary me-2"></i>
                                        Host Dashboard
                                    </Dropdown.Item>
                                    <Dropdown.Divider className="users-list-dropdown-divider" />
                                </>
                            )}
                            <Dropdown.Item 
                                as="button"
                                className="users-list-dropdown-item"
                                onClick={() => navigate('/individual')}
                            >
                                <i className="fas fa-user text-secondary me-2"></i>
                                Individual Dashboard
                            </Dropdown.Item>
                            <Dropdown.Divider className="users-list-dropdown-divider" />
                            <Dropdown.Item 
                                as="button"
                                className="users-list-dropdown-item"
                                onClick={() => navigate('/settings')}
                            >
                                <i className="fas fa-cog text-secondary me-2"></i>
                                Settings
                            </Dropdown.Item>
                            <Dropdown.Divider className="users-list-dropdown-divider" />
                            <Dropdown.Item 
                                as="button"
                                onClick={handleLogout}
                                className="users-list-dropdown-item users-list-logout-item"
                            >
                                <i className="fas fa-sign-out-alt me-2"></i>
                                Logout
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Button 
                        variant="outline-dark" 
                        className="rounded-circle p-2 users-list-refresh-btn"
                        onClick={() => window.location.reload()}
                    >
                        <i className="fas fa-sync-alt"></i>
                    </Button>
                </div>
            </div>


            {/* Loading State */}
            {loading && (
                <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                    <div className="spinner-border text-dark" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            {/* Table Container */}
            {!loading && (
                <div className="flex-grow-1 overflow-auto">
                    <Table striped bordered hover className="m-0">
                        <thead className="bg-dark text-white">
                            <tr>
                                <th className="p-3">Email</th>
                                <th className="p-3">Username</th>
                                <th className="p-3">Password</th>
                                <th className="p-3">Avatar</th>
                                <th className="p-3">User Type</th>
                                <th className="p-3">Verified</th>
                                <th className="p-3">Role</th>
                                {isAdmin && <th className="p-3">Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, idx) => (
                                <tr key={user._id}>
                                    {/* Email */}
                                    <td className="align-middle">
                                        {editIndex === idx ? (
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={editData.email}
                                                onChange={handleChange}
                                                className="border-dark"
                                            />
                                        ) : (
                                            <span>{user.email}</span>
                                        )}
                                    </td>

                                    {/* Username */}
                                    <td className="align-middle">
                                        {editIndex === idx ? (
                                            <Form.Control
                                                name="name"
                                                value={editData.name}
                                                onChange={handleChange}
                                                className="border-dark"
                                            />
                                        ) : (
                                            <span>{user.name}</span>
                                        )}
                                    </td>

                                    {/* Password */}
                                    <td className="align-middle">
                                        {editIndex === idx ? (
                                            isAdmin ? (
                                                <Form.Control
                                                    type="password"
                                                    name="password"
                                                    value={editData.password}
                                                    onChange={handleChange}
                                                    placeholder="New password"
                                                    className="border-dark"
                                                />
                                            ) : (
                                                <span>••••••</span>
                                            )
                                        ) : (
                                            <span>••••••</span>
                                        )}
                                    </td>

                                    {/* Avatar */}
                                    <td className="align-middle text-center">
                                        {editIndex === idx ? (
                                            <>
                                                <Form.Control
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="mb-2 border-dark"
                                                />
                                                {editData.image && (
                                                    <Image
                                                        src={editData.image.startsWith('blob:') 
                                                            ? editData.image 
                                                            : `${API}/${editData.image}`}
                                                        roundedCircle
                                                        width={40}
                                                        height={40}
                                                        className="border border-dark"
                                                    />
                                                )}
                                            </>
                                        ) : (
                                            <Image
                                                src={user.image ? `${API}/${user.image}` : '/default-profile.png'}
                                                roundedCircle
                                                width={40}
                                                height={40}
                                                className="border border-dark"
                                            />
                                        )}
                                    </td>

                                    {/* User Type */}
                                    <td className="align-middle">
                                        {editIndex === idx ? (
                                            <Form.Select
                                                name="userType"
                                                value={editData.userType || 'individual'}
                                                onChange={handleChange}
                                                className="border-dark"
                                            >
                                                <option value="individual">Individual</option>
                                                <option value="business">Business</option>
                                            </Form.Select>
                                        ) : (
                                            <Badge 
                                                bg={user.userType === 'business' ? 'dark' : 'secondary'} 
                                                className="text-capitalize"
                                            >
                                                {user.userType || 'individual'}
                                            </Badge>
                                        )}
                                    </td>

                                    {/* Verified Status */}
                                    <td className="align-middle">
                                        {editIndex === idx ? (
                                            <Form.Check
                                                type="switch"
                                                id="verified-switch"
                                                label=""
                                                checked={editData.verified || false}
                                                onChange={(e) => setEditData(prev => ({
                                                    ...prev,
                                                    verified: e.target.checked
                                                }))}
                                            />
                                        ) : (
                                            <Badge bg={user.verified ? 'success' : 'danger'}>
                                                {user.verified ? 'Verified' : 'Unverified'}
                                            </Badge>
                                        )}
                                    </td>

                                    {/* Role */}
                                    <td className="align-middle">
                                        {editIndex === idx ? (
                                            <Form.Select
                                                name="role"
                                                value={editData.role}
                                                onChange={handleChange}
                                                className="border-dark"
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                            </Form.Select>
                                        ) : (
                                            <span className="text-uppercase">{user.role}</span>
                                        )}
                                    </td>

                                    {/* Actions */}
                                    {isAdmin && (
                                        <td className="align-middle">
                                            <div className="d-flex gap-2">
                                                {editIndex === idx ? (
                                                    <>
                                                        <Button 
                                                            variant="outline-success" 
                                                            onClick={() => handleSave(idx)}
                                                            className="border-dark"
                                                        >
                                                            Save
                                                        </Button>
                                                        <Button 
                                                            variant="outline-secondary" 
                                                            onClick={() => setEditIndex(null)}
                                                            className="border-dark"
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Button 
                                                            variant="outline-primary" 
                                                            onClick={() => handleEdit(idx)}
                                                            className="border-dark"
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button 
                                                            variant="outline-danger" 
                                                            onClick={() => handleDelete(idx)}
                                                            className="border-dark"
                                                        >
                                                            Delete
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}

            {/* Empty State */}
            {!loading && users.length === 0 && (
                <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center gap-3">
                    <i className="fas fa-users fa-3x text-muted"></i>
                    <p className="text-muted fs-5">No users found</p>
                    <Button 
                        variant="outline-dark" 
                        onClick={() => window.location.reload()}
                        className="rounded-pill px-4"
                    >
                        <i className="fas fa-sync-alt me-2"></i> Refresh
                    </Button>
                </div>
            )}
        </Container>
    );
}

export default UsersList;
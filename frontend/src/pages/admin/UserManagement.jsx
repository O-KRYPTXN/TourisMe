import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Users, Search, Edit, Trash2, Ban, CheckCircle, ArrowLeft, UserCheck, Building2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { secureStorage } from '../../utils/security';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const USERS_KEY = 'luxor_users';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const pageRef = useRef(null);

    useEffect(() => {
        loadUsers();

        // Page animation
        gsap.fromTo(pageRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
        );
    }, []);

    useEffect(() => {
        filterUsers();
    }, [searchQuery, roleFilter, users]);

    const loadUsers = () => {
        const allUsers = secureStorage.getItem(USERS_KEY) || [];
        setUsers(allUsers);
    };

    const filterUsers = () => {
        let filtered = [...users];

        // Filter by role
        if (roleFilter !== 'All') {
            filtered = filtered.filter(u => u.role === roleFilter);
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(u =>
                u.firstName?.toLowerCase().includes(query) ||
                u.lastName?.toLowerCase().includes(query) ||
                u.email?.toLowerCase().includes(query) ||
                u.companyName?.toLowerCase().includes(query)
            );
        }

        setFilteredUsers(filtered);
    };

    const handleSuspendUser = (userId) => {
        if (userId === currentUser.id) {
            alert("You cannot suspend your own account!");
            return;
        }

        const allUsers = secureStorage.getItem(USERS_KEY) || [];
        const updatedUsers = allUsers.map(u => {
            if (u.id === userId) {
                return { ...u, status: u.status === 'Suspended' ? 'Active' : 'Suspended' };
            }
            return u;
        });
        secureStorage.setItem(USERS_KEY, updatedUsers);
        loadUsers();
    };

    const handleDeleteUser = (userId) => {
        if (userId === currentUser.id) {
            alert("You cannot delete your own account!");
            return;
        }

        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }

        const allUsers = secureStorage.getItem(USERS_KEY) || [];
        const updatedUsers = allUsers.filter(u => u.id !== userId);
        secureStorage.setItem(USERS_KEY, updatedUsers);
        loadUsers();
    };

    const handleChangeRole = (userId, newRole) => {
        if (userId === currentUser.id) {
            alert("You cannot change your own role!");
            return;
        }

        const allUsers = secureStorage.getItem(USERS_KEY) || [];
        const updatedUsers = allUsers.map(u => {
            if (u.id === userId) {
                return { ...u, role: newRole };
            }
            return u;
        });
        secureStorage.setItem(USERS_KEY, updatedUsers);
        loadUsers();
    };

    const stats = {
        total: users.length,
        tourists: users.filter(u => u.role === 'Tourist').length,
        providers: users.filter(u => u.role === 'LocalBusinessOwner').length,
        admins: users.filter(u => u.role === 'Admin').length,
    };

    const roleColors = {
        Admin: 'text-red-400 bg-red-500/10',
        Tourist: 'text-primary-400 bg-primary-500/10',
        LocalBusinessOwner: 'text-secondary-400 bg-secondary-500/10',
    };

    return (
        <div ref={pageRef} className="min-h-screen bg-dark-900 py-8">
            <div className="container-custom">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/dashboard/admin')}
                            className="mb-4"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Button>
                        <h1 className="text-4xl font-display font-bold text-white flex items-center gap-3">
                            <Users className="w-10 h-10 text-primary-400" />
                            User Management
                        </h1>
                        <p className="text-white/50 mt-2">Manage all registered users</p>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/50 text-sm">Total Users</p>
                                <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
                            </div>
                            <Users className="w-8 h-8 text-primary-400" />
                        </div>
                    </Card>
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/50 text-sm">Tourists</p>
                                <p className="text-3xl font-bold text-white mt-1">{stats.tourists}</p>
                            </div>
                            <UserCheck className="w-8 h-8 text-primary-400" />
                        </div>
                    </Card>
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/50 text-sm">Service Providers</p>
                                <p className="text-3xl font-bold text-white mt-1">{stats.providers}</p>
                            </div>
                            <Building2 className="w-8 h-8 text-secondary-400" />
                        </div>
                    </Card>
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/50 text-sm">Administrators</p>
                                <p className="text-3xl font-bold text-white mt-1">{stats.admins}</p>
                            </div>
                            <Users className="w-8 h-8 text-red-400" />
                        </div>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or company..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                            />
                        </div>

                        {/* Role Filter */}
                        <div className="flex gap-2">
                            {['All', 'Admin', 'Tourist', 'LocalBusinessOwner'].map((role) => (
                                <button
                                    key={role}
                                    onClick={() => setRoleFilter(role)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${roleFilter === role
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-dark-700/50 text-white/70 hover:bg-dark-700 hover:text-white'
                                        }`}
                                >
                                    {role === 'LocalBusinessOwner' ? 'Providers' : role}
                                </button>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Users Table */}
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-dark-700/30">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Email</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Role</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Phone</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-white/50">
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-white font-medium">
                                                        {user.firstName} {user.lastName}
                                                    </p>
                                                    {user.companyName && (
                                                        <p className="text-white/50 text-sm">{user.companyName}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-white/70">{user.email}</td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleChangeRole(user.id, e.target.value)}
                                                    disabled={user.id === currentUser.id}
                                                    className={`px-3 py-1 rounded-lg text-sm font-medium ${roleColors[user.role]} border-0 ${user.id === currentUser.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                                        }`}
                                                >
                                                    <option value="Admin">Admin</option>
                                                    <option value="Tourist">Tourist</option>
                                                    <option value="LocalBusinessOwner">Provider</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 text-white/70">{user.phone}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-lg text-xs font-medium ${user.status === 'Suspended'
                                                        ? 'bg-red-500/10 text-red-400'
                                                        : 'bg-green-500/10 text-green-400'
                                                    }`}>
                                                    {user.status || 'Active'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setShowDetailsModal(true);
                                                        }}
                                                        className="p-2 hover:bg-primary-500/10 text-primary-400 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleSuspendUser(user.id)}
                                                        disabled={user.id === currentUser.id}
                                                        className={`p-2 rounded-lg transition-colors ${user.id === currentUser.id
                                                                ? 'opacity-30 cursor-not-allowed'
                                                                : 'hover:bg-yellow-500/10 text-yellow-400'
                                                            }`}
                                                        title={user.status === 'Suspended' ? 'Activate' : 'Suspend'}
                                                    >
                                                        {user.status === 'Suspended' ? (
                                                            <CheckCircle className="w-4 h-4" />
                                                        ) : (
                                                            <Ban className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        disabled={user.id === currentUser.id}
                                                        className={`p-2 rounded-lg transition-colors ${user.id === currentUser.id
                                                                ? 'opacity-30 cursor-not-allowed'
                                                                : 'hover:bg-red-500/10 text-red-400'
                                                            }`}
                                                        title="Delete User"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* User Details Modal */}
                {showDetailsModal && selectedUser && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <Card className="max-w-2xl w-full p-8">
                            <h2 className="text-2xl font-bold text-white mb-6">User Details</h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-white/50 text-sm">First Name</p>
                                        <p className="text-white font-medium">{selectedUser.firstName}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/50 text-sm">Last Name</p>
                                        <p className="text-white font-medium">{selectedUser.lastName}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/50 text-sm">Email</p>
                                        <p className="text-white font-medium">{selectedUser.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/50 text-sm">Phone</p>
                                        <p className="text-white font-medium">{selectedUser.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/50 text-sm">Role</p>
                                        <p className="text-white font-medium">{selectedUser.role}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/50 text-sm">Status</p>
                                        <p className="text-white font-medium">{selectedUser.status || 'Active'}</p>
                                    </div>
                                </div>

                                {selectedUser.companyName && (
                                    <>
                                        <hr className="border-white/10" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-white/50 text-sm">Company Name</p>
                                                <p className="text-white font-medium">{selectedUser.companyName}</p>
                                            </div>
                                            <div>
                                                <p className="text-white/50 text-sm">License Number</p>
                                                <p className="text-white font-medium">{selectedUser.licenseNumber}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-white/50 text-sm">Business Description</p>
                                                <p className="text-white font-medium">{selectedUser.businessDescription || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div>
                                    <p className="text-white/50 text-sm">Joined</p>
                                    <p className="text-white font-medium">
                                        {new Date(selectedUser.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        setSelectedUser(null);
                                    }}
                                >
                                    Close
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;

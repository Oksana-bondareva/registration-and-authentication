import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Container, Form, Button, ButtonGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './UsersTable.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface User {
    email: string;
    username: string;
    status: string;
    last_login: Date;
}

const UsersTable = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [filter, setFilter] = useState<string>('');
    const navigate = useNavigate();

    const fetchUsers = async (): Promise<User[]> => {
        try {
            const response = await axios.get<User[]>('https://registration-and-authentication-1.onrender.com/users');
            return response.data;
        } catch (err) {
            console.error('Error fetching users:', err);
            return [];
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const users = await fetchUsers();
            setUsers(users);
        };

        fetchData();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [filter, users]);

    const filterUsers = () => {
        let newFilteredUsers = users;
        if (filter) {
            newFilteredUsers = users.filter(user => user.email.includes(filter) || user.status.includes(filter));
        }
        setFilteredUsers(newFilteredUsers);
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(event.target.value);
    };

    const handleSelectAll = () => {
        if (selectedUsers.length === users.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(users.map(user => user.email));
        }
    };

    const handleSelectUser = (email: string) => {
        if (selectedUsers.includes(email)) {
            setSelectedUsers(selectedUsers.filter(userEmail => userEmail !== email));
        } else {
            setSelectedUsers([...selectedUsers, email]);
        }
    };

    const handleBlockUsers = async () => {
        try {
            await axios.put('https://registration-and-authentication-1.onrender.com/users/block', { emails: selectedUsers });
            const updatedUsers = users.map(user => selectedUsers.includes(user.email) ? { ...user, status: 'blocked' } : user);
            setUsers(updatedUsers);
            setSelectedUsers([]);

            const allBlocked = updatedUsers.every(user => user.status === 'blocked');
            if (allBlocked) {
                console.log('All users are blocked');
                localStorage.setItem('allUsersBlocked', 'true');
                navigate('/sign-in');
            }
        } catch (err) {
            toast.error('Error blocking users');
        }
    };

    const handleUnblockUsers = async () => {
        try {
            await axios.put('https://registration-and-authentication-1.onrender.com/users/unblock', { emails: selectedUsers });
            const updatedUsers = users.map(user => selectedUsers.includes(user.email) ? { ...user, status: 'active' } : user);
            setUsers(updatedUsers);
            setSelectedUsers([]);
            localStorage.removeItem('allUsersBlocked');
        } catch (err) {
            toast.error('Error unblocking users');
        }
    };

    const handleDeleteUsers = async () => {
        try {
            const response = await axios.delete('https://registration-and-authentication-1.onrender.com/users/delete', { data: { emails: selectedUsers } });
            const updatedUsers = users.filter(user => !selectedUsers.includes(user.email));
            setUsers(updatedUsers);
            setSelectedUsers([]);

            if (response.data.allUsersDeleted) {
                toast.success('All users deleted. Redirecting to login page...');
                localStorage.setItem('allUsersDeleted', 'true');
                setTimeout(() => {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('allUsersBlocked');
                    navigate('/sign-in');
                }, 1000);
            } else {
                    toast.success('Users deleted successfully');
            }
        } catch (err) {
            toast.error('Error deleting users');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('allUsersBlocked');
        navigate('/sign-in');
    };

    const allSelectedBlocked = selectedUsers.every(userEmail => {
        const user = users.find(user => user.email === userEmail);
        return user?.status === 'blocked';
    });

    const allSelectedActive = selectedUsers.every(userEmail => {
        const user = users.find(user => user.email === userEmail);
        return user?.status === 'active';
    });

    return (
        <Container className="main-container">
            <ToastContainer />
            <div className="d-flex justify-content-between align-items-center my-4">
                <h1>User List</h1>
                <Button variant="outline-dark" onClick={handleLogout}>
                    Logout
                </Button>
            </div>
            <ButtonGroup className="mb-3">
                <Button variant="danger" onClick={handleBlockUsers} disabled={!selectedUsers.length || allSelectedBlocked}>
                    Block
                </Button>
                <Button variant="success" onClick={handleUnblockUsers} disabled={!selectedUsers.length || allSelectedActive}>
                    Unblock
                </Button>
                <Button variant="secondary" onClick={handleDeleteUsers} disabled={!selectedUsers.length}>
                    Delete
                </Button>
            </ButtonGroup>
            <Form.Group controlId="filter">
                <Form.Label>Filter by Email or Status</Form.Label>
                <Form.Control type="text" placeholder="Enter email or status" value={filter} onChange={handleFilterChange} />
            </Form.Group>
            <Table striped bordered hover responsive className="table-primary">
                <thead className="table-dark">
                    <tr>
                        <th>
                            <Form.Check
                                type="checkbox"
                                onChange={handleSelectAll}
                                checked={selectedUsers.length === users.length}
                            />
                        </th>
                        <th>Email</th>
                        <th>Username</th>
                        <th>Status</th>
                        <th>Last Login</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map(user => (
                        <tr key={user.email} className={user.status === 'blocked' ? 'table-danger' : ''}>
                            <td>
                                <Form.Check
                                    type="checkbox"
                                    checked={selectedUsers.includes(user.email)}
                                    onChange={() => handleSelectUser(user.email)}
                                />
                            </td>
                            <td>{user.email}</td>
                            <td>{user.username}</td>
                            <td>{user.status}</td>
                            <td>{new Date(user.last_login).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default UsersTable;

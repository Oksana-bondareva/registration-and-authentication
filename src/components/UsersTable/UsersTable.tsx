import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Container, Form, Button, ButtonGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './UsersTable.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface User {
    id: number;
    username: string;
    email: string;
    status: string;
    last_login: Date;
}

const UsersTable = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
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
            newFilteredUsers = users.filter(user => user.email.includes(filter) || user.status.includes(filter) );
        } setFilteredUsers(newFilteredUsers);
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(event.target.value);
    };

    const handleSelectAll = () => {
        if (selectedUsers.length === users.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(users.map(user => user.id));
        }
    };

    const handleSelectUser = (id: number) => {
        if (selectedUsers.includes(id)) {
            setSelectedUsers(selectedUsers.filter(userId => userId !== id));
        } else {
            setSelectedUsers([...selectedUsers, id]);
        }
    };

    const handleBlockUsers = async () => {
        try {
            await axios.put('https://registration-and-authentication-1.onrender.com/users/block', { ids: selectedUsers });
            const updatedUsers = users.map(user => selectedUsers.includes(user.id) ? { ...user, status: 'blocked' } : user);
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
            await axios.put('https://registration-and-authentication-1.onrender.com/users/unblock', { ids: selectedUsers });
            const updatedUsers = users.map(user => selectedUsers.includes(user.id) ? { ...user, status: 'active' } : user);
            setUsers(updatedUsers);
            setSelectedUsers([]);
            localStorage.removeItem('allUsersBlocked');
        } catch (err) {
            toast.error('Error unblocking users');
        }
    };

    const handleDeleteUsers = async () => {
        try {
            await axios.delete('https://registration-and-authentication-1.onrender.com/users/delete', { data: { ids: selectedUsers } });
            const updatedUsers = users.filter(user => !selectedUsers.includes(user.id));
            setUsers(updatedUsers);
            setSelectedUsers([]);
        } catch (err) {
            toast.error('Error deleting users');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('allUsersBlocked');
        navigate('/sign-in');
    };

    const allSelectedBlocked = selectedUsers.every(userId => {
        const user = users.find(user => user.id === userId);
        return user?.status === 'blocked';
    });

    const allSelectedActive = selectedUsers.every(userId => {
        const user = users.find(user => user.id === userId);
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
            <Form.Group controlId="filter"> <Form.Label>Filter by Email or Status</Form.Label> <Form.Control type="text" placeholder="Enter email or status" value={filter} onChange={handleFilterChange} /> </Form.Group>
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
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Last Login</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map(user => (
                        <tr key={user.id} className={user.status === 'blocked' ? 'table-danger' : ''}>
                            <td>
                                <Form.Check
                                type="checkbox"
                                checked={selectedUsers.includes(user.id)}
                                onChange={() => handleSelectUser(user.id)}
                                />
                            </td>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
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

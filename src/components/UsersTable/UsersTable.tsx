import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Container, Form, Button, ButtonGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();

    const fetchUsers = async (): Promise<User[]> => {
        try {
            const response = await axios.get<User[]>('http://localhost:5000/users');
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
            await axios.put('http://localhost:5000/users/block', { ids: selectedUsers });
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
            console.error('Error blocking users:', err);
        }
    };

    const handleUnblockUsers = async () => {
        try {
            await axios.put('http://localhost:5000/users/unblock', { ids: selectedUsers });
            const updatedUsers = users.map(user => selectedUsers.includes(user.id) ? { ...user, status: 'active' } : user);
            setUsers(updatedUsers);
            setSelectedUsers([]);
            localStorage.removeItem('allUsersBlocked');
        } catch (err) {
            console.error('Error unblocking users:', err);
        }
    };

    const handleDeleteUsers = async () => {
        try {
            await axios.delete('http://localhost:5000/users/delete', { data: { ids: selectedUsers } });
            const updatedUsers = users.filter(user => !selectedUsers.includes(user.id));
            setUsers(updatedUsers);
            setSelectedUsers([]);
        } catch (err) {
            console.error('Error deleting users:', err);
        }
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
        <Container>
            <h1 className="my-4 text-center">User List</h1>
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
                    {users.map(user => (
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

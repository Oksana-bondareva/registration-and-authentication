import { Button, Card, Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const SignUpForm = () => {
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        try {
            const response = await axios.post('https://registration-and-authentication-1.onrender.com/sign-up', { username, email, password });
            localStorage.removeItem('allUsersBlocked');
            localStorage.setItem('authToken', response.data.token);
            localStorage.removeItem('allUsersDeleted');
            toast.success('User registered successfully');
            setTimeout(() => {
                navigate('/main');
            }, 1000);
        } catch (err: any) {
            console.error('Error registering user:', err);
            if (!err.response) {
                toast.error('No connection to the server. Please try again later.');
            } else if (err.errno = 1062) {
                toast.error('Email already in use');
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <Container className="bg-light p-5">
            <ToastContainer />
            <Card className="my-5 px-5 py-3">
                <h1 className="m-3 text-center">Sign up</h1>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="my-2">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter name"
                            required
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="my-2">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="my-2">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Button type="submit" variant="secondary">Sign Up</Button>
                </Form>
            </Card>
            <p className="mt-2">
                Already have an account? <Link to="/sign-in">Login</Link>
            </p>
        </Container>
    )
}

export default SignUpForm;
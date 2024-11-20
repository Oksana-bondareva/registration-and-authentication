import { Button, Card, Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { Link } from "react-router-dom";
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignInForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/sign-in', { email, password });
            localStorage.removeItem('allUsersBlocked');
            localStorage.setItem('authToken', response.data.token);
            toast.success('User signed in successfully');
            setTimeout(() => {
                navigate('/main');
            }, 1000);
        } catch (err: any) {
            if (!err.response) {
                toast.error('No connection to the server. Please try again later.');
            }
            toast.error('Error authentication user. Please enter the correct email and password.');
        }
    };

    return (
        <Container className="bg-light p-5">
            <ToastContainer />
            <Card className="my-5 px-5 py-3">
                <h1 className="m-3 text-center">Sign in</h1>
                <Form onSubmit={handleSubmit}>
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
                    <Button type="submit" variant="secondary">Sign In</Button>
                </Form>
            </Card>
            <p className="mt-2">
                Don't have an account? <Link to="/sign-up">Register</Link>
            </p>
        </Container>
    )
}

export default SignInForm;
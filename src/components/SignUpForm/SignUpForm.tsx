import { Button, Card, Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import axios from 'axios';

const SignUpForm = () => {
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/sign-up', { username, email, password });
            console.log('User registered successfully');
            localStorage.setItem('authToken', response.data.token);
            navigate('/main');
        } catch (err) {
            console.log('Error registering user');
        }
    };

    return (
        <Container>
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
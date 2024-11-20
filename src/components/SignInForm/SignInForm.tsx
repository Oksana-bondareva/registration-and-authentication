import { Button, Card, Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { Link } from "react-router-dom";
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignInForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        try { const response = await axios.post('http://localhost:5000/sign-in', { email, password });
            console.log('User signed in successfully');
            localStorage.removeItem('allUsersBlocked');
            localStorage.setItem('authToken', response.data.token);
            navigate('/main');
        } catch (err) {
            console.error(err); alert('Error signing in');
        }
    };

    return (
        <Container>
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
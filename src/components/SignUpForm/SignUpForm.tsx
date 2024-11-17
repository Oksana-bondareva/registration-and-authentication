import { Button, Card, Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { Link } from "react-router-dom";

const SignUpForm = () => {
    return (
        <Container>
            <Card className="my-5 px-5 py-3">
                <h1 className="m-3 text-center">Sign up</h1>
                <Form>
                    <Form.Group className="my-2">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter name"
                            required
                        />
                    </Form.Group>
                    <Form.Group className="my-2">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            required
                        />
                    </Form.Group>
                    <Form.Group className="my-2">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            required
                        />
                    </Form.Group>
                </Form>
                <Button type="submit" variant="secondary">Sign Up</Button>
            </Card>
            <p className="mt-2">
                Already have an account? <Link to="/sign-in">Login</Link>
            </p>
        </Container>
    )
}

export default SignUpForm;
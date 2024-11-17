import { Button, Card, Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { Link } from "react-router-dom";

const SignInForm = () => {
    return (
        <Container>
            <Card className="my-5 px-5 py-3">
                <h1 className="m-3 text-center">Sign in</h1>
                <Form>
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
                <Button type="submit" variant="secondary">Sign In</Button>
            </Card>
            <p className="mt-2">
                Don't have an account? <Link to="/sign-up">Register</Link>
            </p>
        </Container>
    )
}

export default SignInForm;
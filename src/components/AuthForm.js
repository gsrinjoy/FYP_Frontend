// src/components/AuthForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card } from 'react-bootstrap';
import styled from 'styled-components';

const AuthFormContainer = styled(Container)`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;

const AuthForm = ({ setToken, handleLogout }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isLogin ? 'https://api.femizone.in/api/login/' : 'https://api.femizone.in/api/register/';
        try {
            const response = await axios.post(url, { username, password });
            setToken(response.data.access);
            localStorage.setItem('refreshToken', response.data.refresh);
            navigate('/questions');
        } catch (error) {
            console.error(`${isLogin ? 'Login' : 'Registration'} failed:`, error);
        }
    };

    return (
        <AuthFormContainer>
            <Card style={{ width: '400px' }}>
                <Card.Body>
                    {isLogin ? <Card.Title>Login</Card.Title> : <Card.Title>Register</Card.Title>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formBasicUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-3" block>
                            {isLogin ? 'Login' : 'Register'}
                        </Button>
                        <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="mt-2" block>
                            {isLogin ? 'Switch to Register' : 'Switch to Login'}
                        </Button>
                    </Form>
                    {localStorage.getItem('token') && (
                        <Button variant="danger" onClick={handleLogout} className="mt-2" block>
                            Logout
                        </Button>
                    )}
                </Card.Body>
            </Card>
        </AuthFormContainer>
    );
};

export default AuthForm;

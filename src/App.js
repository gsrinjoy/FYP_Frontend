import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import AuthForm from './components/AuthForm';
import QuestionsForm from './components/QuestionsForm';
import Dashboard from './components/Dashboard';
import ResultsDashboard from './components/ResultsDashboard';

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const handleSetToken = (token) => {
        setToken(token);
        localStorage.setItem('token', token);
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
    };

    const ProtectedRoute = ({ element, ...rest }) => {
        return token ? element : <Navigate to="/auth" />;
    };

    return (
        <Router>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand href="/">MyApp</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            {token && (
                                <>
                                    <Nav.Link href="/questions">Questions</Nav.Link>
                                    <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                                    <Nav.Link href="/results">Results</Nav.Link>
                                </>
                            )}
                        </Nav>
                        <Nav>
                            {token ? (
                                <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
                            ) : (
                                <Nav.Link href="/auth">Login</Nav.Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Routes>
                <Route path="/auth" element={<AuthForm setToken={handleSetToken} />} />
                <Route path="/questions" element={<ProtectedRoute element={<QuestionsForm token={token} />} />} />
                <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
                <Route path="/results" element={<ProtectedRoute element={<ResultsDashboard />} />} />
                <Route path="/" element={<Navigate to={token ? "/dashboard" : "/auth"} />} />
            </Routes>
        </Router>
    );
};

export default App;

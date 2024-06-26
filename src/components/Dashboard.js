// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Modal, Button } from 'react-bootstrap';
import styled from 'styled-components';
import axiosInstance from '../axiosInstance';

const DashboardContainer = styled(Container)`
    padding: 20px;
    background-color: #f8f9fa;
`;

const Dashboard = () => {
    const [results, setResults] = useState([]);
    const [selectedResult, setSelectedResult] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const response = await axiosInstance.get('/results/');
            setResults(response.data);
        } catch (error) {
            console.error('Error fetching results:', error);
        }
    };

    const handleCardClick = (result) => {
        setSelectedResult(result);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    return (
        <DashboardContainer>
            <h1>Results Dashboard</h1>
            <Row>
                {results.map((result, index) => (
                    <Col key={index} md={4}>
                        <Card className="mb-4 shadow-sm" onClick={() => handleCardClick(result)}>
                            <Card.Body>
                                <Card.Title>Question Set {result.id}</Card.Title>
                                <Card.Text>User: {result.user}</Card.Text>
                                <Card.Text>Created At: {result.created_at}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {selectedResult && (
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Question Set {selectedResult.id}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>User: {selectedResult.user}</p>
                        <p>Created At: {selectedResult.created_at}</p>
                        {selectedResult.questions.map((question, qIndex) => (
                            <div key={qIndex}>
                                <p>Question: {question.text}</p>
                                <p>Label: {question.label}</p>
                                <p>Confidence: {question.confidence}</p>
                            </div>
                        ))}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </DashboardContainer>
    );
};

export default Dashboard;

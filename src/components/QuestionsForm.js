import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, InputGroup, Spinner } from 'react-bootstrap';
import styled from 'styled-components';

const QuestionsFormContainer = styled(Container)`
    padding: 20px;
    background-color: #f8f9fa;
`;

const QuestionsForm = ({ token }) => {
    const [questions, setQuestions] = useState(['']);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index] = value;
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, '']);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post(
                'https://api.femizone.in/api/gen/',
                { questions: questions.map(q => ({ text: q })) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setIsLoading(false);
            navigate('/dashboard');
        } catch (error) {
            setIsLoading(false);
            console.error('Error submitting questions:', error);
        }
    };

    return (
        <QuestionsFormContainer>
            <Form onSubmit={handleSubmit}>
                {questions.map((question, index) => (
                    <InputGroup className="mb-3" key={index}>
                        <Form.Control
                            type="text"
                            placeholder="Enter your question"
                            value={question}
                            onChange={(e) => handleChange(index, e.target.value)}
                        />
                    </InputGroup>
                ))}
                <Button variant="secondary" onClick={addQuestion} className="mr-2">Add Question</Button>
                <Button variant="primary" type="submit" disabled={isLoading}>
                    {isLoading ? <Spinner animation="border" size="sm" /> : 'Submit'}
                </Button>
            </Form>
        </QuestionsFormContainer>
    );
};

export default QuestionsForm;

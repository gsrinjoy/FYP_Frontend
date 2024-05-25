// src/components/QuestionsForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import ProgressBar from 'react-bootstrap/ProgressBar';

const QuestionsForm = ({ token }) => {
    const [questions, setQuestions] = useState(['']);
    const [progress, setProgress] = useState(0);
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
        try {
            const response = await axiosInstance.post(
                'https://api.femizone.in/api/gen/',
                { questions: questions.map(q => ({ text: q })) }
            );
            console.log('Questions processed:', response.data);
            navigate('/dashboard');
        } catch (error) {
            console.error('Error submitting questions:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {questions.map((question, index) => (
                <input
                    key={index}
                    type="text"
                    placeholder="Enter your question"
                    value={question}
                    onChange={(e) => handleChange(index, e.target.value)}
                />
            ))}
            <button type="button" onClick={addQuestion}>Add Question</button>
            <button type="submit">Submit</button>
            <ProgressBar now={progress} label={`${progress}%`} />
        </form>
    );
};

export default QuestionsForm;

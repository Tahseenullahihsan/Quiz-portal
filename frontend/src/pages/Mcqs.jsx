import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message, Typography, Divider, List, Card, Spin } from 'antd';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;

const Mcqs = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [mcqsList, setMcqsList] = useState([]);
  const [loading, setLoading] = useState(false);

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role === 'Admin') {
      setIsAdmin(true);
    }

    // Fetch existing MCQs
    fetchMcqs();
  }, []);

  const fetchMcqs = async () => {
    setLoading(true); // Set loading state to true while fetching
    try {

      const res = await axios.get(`${API_BASE}/api/mcqs/`);

      setMcqsList(res.data);
    } catch (error) {
      console.error(error);
      message.error('Error fetching MCQs');
    } finally {
      setLoading(false); // Set loading state to false after fetching
    }
  };

  const handleOptionChange = (value, index) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleSubmit = async () => {
    if (!question || options.some(opt => !opt) || !correctAnswer) {
      message.error('Please fill all fields');
      return;
    }

    // Ensure the correct answer is one of the options
    if (!options.includes(correctAnswer)) {
      message.error('Correct answer must be one of the options');
      return;
    }

    try {
      const payload = {
        question,
        options,
        correctAnswer,
      };
      await axios.post('http://localhost:5000/api/mcqs/create', payload);
      message.success('MCQ created successfully!');
      setQuestion('');
      setOptions(['', '', '', '']);
      setCorrectAnswer('');
      fetchMcqs(); // Refresh the list after submission
    } catch (error) {
      console.error(error);
      message.error('Error creating MCQ');
    }
  };

  if (!isAdmin) {
    return <Title level={4} style={{ marginTop: '20px' }}>Access Denied. Only Admins can create MCQs.</Title>;
  }

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
      <Title level={3}>Create New MCQ</Title>
      <Form layout="vertical">
        <Form.Item label="Question">
          <Input.TextArea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            placeholder="Enter the MCQ question"
          />
        </Form.Item>

        {options.map((opt, index) => (
          <Form.Item key={index} label={`Option ${index + 1}`}>
            <Input
              value={opt}
              onChange={(e) => handleOptionChange(e.target.value, index)}
              placeholder={`Enter option ${index + 1}`}
            />
          </Form.Item>
        ))}

        <Form.Item label="Correct Answer">
          <Select
            placeholder="Select the correct answer"
            value={correctAnswer}
            onChange={setCorrectAnswer}
          >
            {options.map((opt, index) => (
              <Option key={index} value={opt}>
                {opt || `Option ${index + 1}`}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Divider />
        <Button type="primary" onClick={handleSubmit}>
          Submit MCQ
        </Button>
      </Form>

      <Divider />
      <Title level={4}>Existing MCQs</Title>

      {loading ? (  // Show loading spinner while fetching MCQs
        <Spin size="large" />
      ) : (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={mcqsList}
          renderItem={(mcq, idx) => (
            <List.Item>
              <Card title={`Q${idx + 1}: ${mcq.question}`}>
                <ol type="A">
                  {mcq.options.map((opt, i) => (
                    <li key={i} style={{ color: opt === mcq.correctAnswer ? 'green' : undefined }}>
                      {opt}
                    </li>
                  ))}
                </ol>
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default Mcqs;

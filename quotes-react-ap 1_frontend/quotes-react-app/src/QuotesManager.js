import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const API_URL = 'http://localhost:5000/quotes'; // Adjust this as per your API endpoint

function QuotesManager() {
    const [quotes, setQuotes] = useState([]);
    const [formData, setFormData] = useState({ author: '', tags: '', quoteText: '' });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchQuotes();
    }, []);

    const fetchQuotes = async () => {
        const response = await axios.get(API_URL);
        setQuotes(response.data);
    };

    const handleSearch = async () => {
        const response = await axios.get(`${API_URL}/search?author=${searchTerm}`);
        setQuotes(response.data);
    };

    const handleAddQuote = async () => {
        const newQuote = {
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim())
        };
        await axios.post(API_URL, [newQuote]);
        fetchQuotes();
        setFormData({ author: '', tags: '', quoteText: '' });
    };

    const handleUpdateQuote = async (id) => {
        const quoteToUpdate = {
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim())
        };
        await axios.put(`${API_URL}/${id}`, quoteToUpdate);
        fetchQuotes();
    };

    const handleDeleteQuote = async (id) => {
        await axios.delete(`${API_URL}/${id}`);
        fetchQuotes();
    };

    return (
        <Container>
            <h1>Quotes Manager</h1>
            <TextField
                label="Search by Author"
                variant="outlined"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ margin: '20px' }}
            />
            <Button variant="contained" onClick={handleSearch}>Search</Button>
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Author</TableCell>
                            <TableCell>Tags</TableCell>
                            <TableCell>Quote</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {quotes.map((quote, index) => (
                            <TableRow key={index}>
                                <TableCell>{quote.author}</TableCell>
                                <TableCell>{quote.tags.join(', ')}</TableCell>
                                <TableCell>{quote.quoteText}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleDeleteQuote(quote.id)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleUpdateQuote(quote.id)} color="primary">
                                        <AddIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <h2>Add or Update Quote</h2>
            <TextField
                label="Author"
                variant="outlined"
                value={formData.author}
                onChange={e => setFormData({ ...formData, author: e.target.value })}
                style={{ margin: '10px' }}
            />
            <TextField
                label="Tags (comma-separated)"
                variant="outlined"
                value={formData.tags}
                onChange={e => setFormData({ ...formData, tags: e.target.value })}
                style={{ margin: '10px' }}
            />
            <TextField
                label="Quote"
                variant="outlined"
                multiline
                rows={4}
                value={formData.quoteText}
                onChange={e => setFormData({ ...formData, quoteText: e.target.value })}
                style={{ margin: '10px' }}
            />
            <Button variant="contained" onClick={handleAddQuote} color="primary">Add Quote</Button>
        </Container>
    );
}

export default QuotesManager;

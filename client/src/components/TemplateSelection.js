import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Container,
  CircularProgress
} from '@mui/material';

const TemplateSelection = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await axios.get('/api/templates');
      setTemplates(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load templates');
      setLoading(false);
    }
  };

  const handleTemplateSelect = (templateId) => {
    navigate(`/resume/create/${templateId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Choose a Resume Template
      </Typography>
      <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary" sx={{ mb: 4 }}>
        Select a template that best fits your career goals and experience
      </Typography>
      
      <Grid container spacing={4}>
        {templates.map((template) => (
          <Grid item xs={12} md={4} key={template.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  cursor: 'pointer'
                }
              }}
              onClick={() => handleTemplateSelect(template.id)}
            >
              <CardMedia
                component="img"
                height="200"
                image={template.previewImage}
                alt={template.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {template.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {template.description}
                </Typography>
                <Typography variant="subtitle2" color="primary">
                  Recommended for:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {template.recommendedFor.join(', ')}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  Use This Template
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TemplateSelection; 
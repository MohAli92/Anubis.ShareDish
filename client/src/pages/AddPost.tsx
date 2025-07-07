import React, { useState, useRef, DragEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Chip,
  Stack,
  IconButton,
  Alert,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import { PhotoCamera, Add as AddIcon, Delete as DeleteIcon, Restaurant } from '@mui/icons-material';
import api from '../api';

interface Ingredient {
  name: string;
  quantity: string;
}

const AddPost: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [newIngredient, setNewIngredient] = useState({ name: '', quantity: '' });
  const [allergies, setAllergies] = useState<string[]>([]);
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [description, setDescription] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);
      const response = await api.post('/api/posts/upload', formData);
      setPhoto(response.data.url);
      setError(null);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload photo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddIngredient = () => {
    if (newIngredient.name && newIngredient.quantity) {
      setIngredients([...ingredients, newIngredient]);
      setNewIngredient({ name: '', quantity: '' });
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const isFormValid = () => {
    return (
      photo &&
      ingredients.length > 0 &&
      city.trim() !== '' &&
      address.trim() !== '' &&
      pickupTime !== ''
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      setError('You must be logged in to create a post');
      return;
    }

    if (!isFormValid()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const postData = {
        photo,
        ingredients: ingredients.map(i => `${i.name} (${i.quantity})`),
        allergies,
        city,
        address,
        time: new Date(pickupTime),
        description,
        reserved: false
      };

      console.log('Submitting post data:', postData);
      const response = await api.post('/api/posts', postData);
      console.log('Post created successfully:', response.data);
      
      // Navigate to home page after successful post creation
      navigate('/');
    } catch (err: any) {
      console.error('Error creating post:', err);
      setError(err.response?.data?.error || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Drag and drop support
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const formData = new FormData();
      formData.append('image', file);
      try {
        setLoading(true);
        const response = await api.post('/api/posts/upload', formData);
        setPhoto(response.data.url);
        setError(null);
      } catch (err) {
        setError('Failed to upload photo. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  console.log({
    photo,
    ingredients,
    city,
    address,
    pickupTime,
    isFormValid: isFormValid()
  });

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 3, py: 1, border: '2px solid #e0e0e0', borderRadius: 3, bgcolor: '#fff', boxShadow: 1 }}>
            <Restaurant sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h4" fontWeight={700} color="primary">
              Share Your Meal
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Photo Upload with drag and drop support */}
            <Box
              sx={{
                textAlign: 'center',
                border: dragActive ? '2px dashed #43a047' : '2px dashed #e0e0e0',
                borderRadius: 2,
                p: 2,
                bgcolor: dragActive ? '#e8f5e9' : 'transparent',
                transition: 'border 0.2s, background 0.2s',
                cursor: 'pointer',
                position: 'relative',
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
                ref={fileInputRef}
              />
              <PhotoCamera sx={{ fontSize: 40, color: '#43a047', mb: 1 }} />
              <Typography variant="body1" color="text.secondary">
                Drag & Drop or Click to Upload Photo
              </Typography>
              {photo && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={photo}
                    alt="Uploaded"
                    style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }}
                  />
                </Box>
              )}
              {loading && <CircularProgress sx={{ mt: 2 }} />}
            </Box>

            {/* Ingredients */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Ingredients *
              </Typography>
              <Stack spacing={2}>
                {ingredients.map((ingredient, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={`${ingredient.name} (${ingredient.quantity})`}
                      onDelete={() => handleRemoveIngredient(index)}
                      deleteIcon={<DeleteIcon />}
                    />
                  </Box>
                ))}
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <TextField
                    label="Ingredient"
                    value={newIngredient.name}
                    onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                    size="small"
                  />
                  <TextField
                    label="Quantity"
                    value={newIngredient.quantity}
                    onChange={(e) => setNewIngredient({ ...newIngredient, quantity: e.target.value })}
                    size="small"
                  />
                  <IconButton
                    onClick={handleAddIngredient}
                    disabled={!newIngredient.name || !newIngredient.quantity}
                    color="primary"
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              </Stack>
            </Box>

            {/* Allergies */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Allergies (Optional)
              </Typography>
              <Autocomplete
                multiple
                freeSolo
                options={['Nuts', 'Dairy', 'Gluten', 'Shellfish', 'Eggs', 'Soy']}
                value={allergies}
                onChange={(_, newValue) => setAllergies(newValue)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Add allergies..."
                  />
                )}
              />
            </Box>

            {/* Location */}
            <TextField
              label="City *"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              fullWidth
              required
            />

            <TextField
              label="Address *"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              fullWidth
              required
            />

            {/* Pickup Time */}
            <TextField
              label="Pickup Time *"
              type="datetime-local"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />

            {/* Description */}
            <TextField
              label="Description (Optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={4}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading || !isFormValid()}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Share Meal'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default AddPost;
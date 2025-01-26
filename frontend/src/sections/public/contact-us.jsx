import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { LoadingButton } from '@mui/lab';
import { MusicNote } from '@mui/icons-material';
import { Box, Grid, Stack, Container, TextField, Typography } from '@mui/material';

import axiosInstance from 'src/utils/axios';

export default function ContactView() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            // await axiosInstance().post('/feedback/', data);
            toast.success('Message Sent Successfully');
            reset();
        } catch (err) {
            toast.error('Failed to Send Message');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: 'calc(100vh - 100px)',
                pt: 8,
                pb: 6
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={5}>
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <MusicNote sx={{ color: '#8B4513', fontSize: 40 }} />
                            <Typography
                                variant="h3"
                                sx={{
                                    fontFamily: "'Playfair Display', serif",
                                    color: '#8B4513'
                                }}
                            >
                                Contact Us
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography
                            variant="body1"
                            paragraph
                            sx={{
                                color: '#654321',
                                fontSize: '1.1rem',
                                lineHeight: 1.8,
                                mb: 4
                            }}
                        >
                            Feel free to reach out using the form below. We'll get back to you as soon
                            as possible.
                        </Typography>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Stack spacing={3}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Name"
                                    {...register('name', { required: 'Name is required' })}
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {
                                                borderColor: '#8B4513',
                                            },
                                        },
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Email"
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^\S+@\S+$/i,
                                            message: 'Invalid email format'
                                        }
                                    })}
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {
                                                borderColor: '#8B4513',
                                            },
                                        },
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Message"
                                    {...register('message', { required: 'Message is required' })}
                                    error={!!errors.message}
                                    helperText={errors.message?.message}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {
                                                borderColor: '#8B4513',
                                            },
                                        },
                                    }}
                                />
                                <LoadingButton
                                    fullWidth
                                    loading={isLoading}
                                    type="submit"
                                    variant="contained"
                                    sx={{
                                        bgcolor: '#8B4513',
                                        '&:hover': {
                                            bgcolor: '#654321',
                                        },
                                    }}
                                >
                                    Send Message
                                </LoadingButton>
                            </Stack>
                        </form>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                p: 4,
                                bgcolor: 'white',
                                borderRadius: 2,
                                boxShadow: '0 4px 12px rgba(139, 69, 19, 0.1)'
                            }}
                        >
                            <Typography
                                variant="h5"
                                sx={{
                                    fontFamily: "'Playfair Display', serif",
                                    color: '#8B4513',
                                    mb: 3
                                }}
                            >
                                Other Ways to Reach Us
                            </Typography>
                            <Stack spacing={2}>
                                <Typography variant="body1" sx={{ color: '#654321' }}>
                                    Email: info@info.com
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#654321' }}>
                                    Phone: +977 9818000000
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#654321' }}>
                                    Address: Kathmandu, Nepal
                                </Typography>
                            </Stack>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

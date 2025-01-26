import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { LoadingButton } from '@mui/lab';
import { MusicNote } from '@mui/icons-material';
import {
    Box,
    Card,
    Stack,
    Divider,
    TextField,
    Container,
    Typography,
} from '@mui/material';


export default function ProfileView() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [isLoading, setIsLoading] = useState(false);

    const formSubmit = async (data) => {
        setIsLoading(true);
        try {
            // await axiosInstance(user.token).patch(`accounts/users/${user.id}/`, data);
            toast.success('Profile Updated Successfully');
        } catch (err) {
            toast.error('Failed to Update Profile');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const renderForm = (
        <Stack spacing={3}>
            <Stack direction="row" spacing={2}>
                <TextField
                    fullWidth
                    size="small"
                    label="First Name"
                    {...register('first_name', { required: true })}
                    error={!!errors.first_name}
                    helperText={errors.first_name?.message}
                    defaultValue={user.first_name}
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
                    label="Last Name"
                    {...register('last_name', { required: true })}
                    error={!!errors.last_name}
                    helperText={errors.last_name?.message}
                    defaultValue={user.last_name}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                                borderColor: '#8B4513',
                            },
                        },
                    }}
                />
            </Stack>

            <TextField
                fullWidth
                size="small"
                label="Username"
                {...register('username', { required: true })}
                error={!!errors.username}
                helperText={errors.username?.message}
                defaultValue={user.username}
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
                type="email"
                {...register('email', { required: true })}
                error={!!errors.email}
                helperText={errors.email?.message}
                defaultValue={user.email}
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
                label="Phone Number"
                {...register('phone_number', { required: true })}
                error={!!errors.phone_number}
                helperText={errors.phone_number?.message}
                defaultValue={user.phone_number}
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
                label="Address"
                {...register('address', { required: true })}
                error={!!errors.address}
                helperText={errors.address?.message}
                defaultValue={user.address}
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
                type="date"
                {...register('dob', { required: true })}
                error={!!errors.dob}
                helperText={errors.dob?.message}
                defaultValue={user.dob}
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
                size="large"
                type="submit"
                variant="contained"
                onClick={handleSubmit(formSubmit)}
                loading={isLoading}
                sx={{
                    bgcolor: '#8B4513',
                    color: '#FDF5E6',
                    '&:hover': {
                        bgcolor: '#654321',
                    },
                }}
            >
                Save Changes
            </LoadingButton>
        </Stack>
    );

    return isAuthenticated ? (
        <Box>
            <Container>
                <Stack alignItems="center" justifyContent="center" sx={{ height: 1, py: 5 }}>
                    <Card
                        sx={{
                            p: 5,
                            width: 1,
                            maxWidth: 720,
                            backgroundColor: '#FDF5E6',
                            boxShadow: '0 4px 12px rgba(139, 69, 19, 0.15)',
                        }}
                    >
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 5 }}>
                            <MusicNote sx={{ color: '#8B4513', fontSize: '2rem' }} />
                            <Typography
                                variant="h4"
                                sx={{
                                    color: '#8B4513',
                                    fontFamily: "'Playfair Display', serif",
                                }}
                            >
                                Profile Settings
                            </Typography>
                            <MusicNote sx={{ color: '#8B4513', fontSize: '2rem' }} />
                        </Stack>

                        <Divider sx={{ mb: 5 }} />

                        {renderForm}
                    </Card>
                </Stack>
            </Container>
        </Box>
    ) : (
        <Navigate to="/" replace />
    );
}

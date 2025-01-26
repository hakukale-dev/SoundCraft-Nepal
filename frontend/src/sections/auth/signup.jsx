import React, { useState } from 'react';
import { useTheme } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { LoadingButton } from '@mui/lab';
import { Visibility, VisibilityOff, MusicNote } from '@mui/icons-material';
import {
    Box,
    Card,
    alpha,
    Stack,
    TextField,
    Typography,
    IconButton,
    InputAdornment,
} from '@mui/material';

import axiosInstance from 'src/utils/axios';
import { bgGradient } from 'src/theme/css';

export default function SignUpView() {
    const navigation = useNavigate();
    const theme = useTheme();

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        phone_number: '',
        dob: '',
        address: '',
        password: '',
        password2: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            await axiosInstance().post('api/auth/register/', formData);
            toast.success('Registration successful! Please login.');
            navigation('/login');
        } catch (err) {
            setErrors(err.response.data);
            toast.error(err.response.data.error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderForm = (
        <>
            <Stack spacing={3}>
                <Stack direction="row" spacing={2}>
                    <TextField
                        fullWidth
                        label="First Name"
                        name="first_name"
                        error={!!errors.first_name}
                        helperText={errors.first_name}
                        onChange={handleChange}
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
                        label="Last Name"
                        name="last_name"
                        error={!!errors.last_name}
                        helperText={errors.last_name}
                        onChange={handleChange}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: '#8B4513',
                                },
                            },
                        }}
                    />
                </Stack>

                <Stack direction="row" spacing={2}>
                    <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        error={!!errors.username}
                        onChange={handleChange}
                        helperText={errors.username}
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
                        label="Email"
                        type="email"
                        name="email"
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
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
                    label="Phone Number"
                    name="phone_number"
                    inputProps={{ maxLength: 10 }}
                    onChange={handleChange}
                    error={!!errors.phone_number}
                    helperText={errors.phone_number}
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
                    label="Date of Birth"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    onChange={handleChange}
                    name="dob"
                    error={!!errors.dob}
                    helperText={errors.dob}
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
                    label="Address"
                    name="address"
                    error={!!errors.address}
                    onChange={handleChange}
                    helperText={errors.address}
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
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
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
                    label="Confirm Password"
                    type={showPassword ? 'text' : 'password'}
                    name="password2"
                    onChange={handleChange}
                    error={!!errors.password2}
                    helperText={errors.password2}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                                borderColor: '#8B4513',
                            },
                        },
                    }}
                />
            </Stack>

            <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                onClick={handleSubmit}
                loading={isLoading}
                sx={{
                    mt: 3,
                    bgcolor: '#8B4513',
                    color: '#FDF5E6',
                    '&:hover': {
                        bgcolor: '#654321',
                    },
                }}
            >
                Sign Up
            </LoadingButton>

            <Typography
                marginTop={2}
                textAlign="center"
                onClick={() => navigation('/login')}
                sx={{
                    color: '#8B4513',
                    cursor: 'pointer',
                    '&:hover': {
                        color: '#654321',
                        textDecoration: 'underline',
                    },
                }}
            >
                Already have an account? Login here
            </Typography>

            <Typography
                marginTop={2}
                textAlign="center"
                onClick={() => navigation('/')}
                sx={{
                    color: '#8B4513',
                    cursor: 'pointer',
                    '&:hover': {
                        color: '#654321',
                        textDecoration: 'underline',
                    },
                }}
            >
                Back to Homepage
            </Typography>
        </>
    );

    return (
        <Box
            sx={{
                ...bgGradient({
                    color: alpha("#000000", 0.4),
                    imgUrl: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpng.pngtree.com%2Fbackground%2F20230611%2Foriginal%2Fpngtree-an-antique-musical-instrument-picture-image_3132823.jpg&f=1&nofb=1&ipt=40f5bda6264c41d3f81fcfa66b139f074186706c4272ccb5acd9363c93603783&ipo=images',
                }),
                height: 1,
            }}
        >
            <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
                <Card
                    sx={{
                        p: 5,
                        width: 1,
                        maxWidth: 560,
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
                            Create Account
                        </Typography>
                        <MusicNote sx={{ color: '#8B4513', fontSize: '2rem' }} />
                    </Stack>

                    {renderForm}
                </Card>
            </Stack>
        </Box>
    );
}
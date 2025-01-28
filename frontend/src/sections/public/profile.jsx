import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { LoadingButton } from '@mui/lab';
import { MusicNote, AddAPhoto } from '@mui/icons-material';
import {
    Box,
    Card,
    Stack,
    Divider,
    TextField,
    Container,
    Typography,
    Avatar,
    IconButton,
} from '@mui/material';

import axiosInstance from 'src/utils/axios';

export default function ProfileView() {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [isLoading, setIsLoading] = useState(false);
    const [profileImage, setProfileImage] = useState(user?.photo || null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosInstance(user.token).get('api/account/user');
                const fetchedUserData = response.data;
                setUserData(fetchedUserData);
                setProfileImage(fetchedUserData.photo || null);
                
                // Set form values
                setValue('first_name', fetchedUserData.first_name);
                setValue('last_name', fetchedUserData.last_name);
                setValue('username', fetchedUserData.username);
                setValue('email', fetchedUserData.email);
                setValue('phone_number', fetchedUserData.phone_number);
                setValue('address.street', fetchedUserData.address?.street);
                setValue('address.city', fetchedUserData.address?.city);
                setValue('address.state', fetchedUserData.address?.state);
                setValue('address.zip_code', fetchedUserData.address?.zip_code);
                if (fetchedUserData.dob) {
                    setValue('dob', new Date(fetchedUserData.dob).toISOString().split('T')[0]);
                }
            } catch (err) {
                toast.error('Failed to fetch user data');
                console.error('Fetch user error:', err);
            }
        };

        if (isAuthenticated && user) {
            fetchUserData();
        }
    }, [isAuthenticated, user, setValue]);

    const handleImageUpload = async (event) => {
        console.log(user);
        const file = event.target.files[0];
        if (!file) return;

        if (!user || !user.id) {
            toast.error('User ID not found. Please try logging in again.');
            return;
        }

        const formData = new FormData();
        formData.append('photo', file);

        try {
            const response = await axiosInstance(user.token).patch(
                `api/account/user/${user.id}/photo`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            
            if (response.data && response.data.photo) {
                setProfileImage(response.data.photo);
                toast.success('Profile Photo Updated Successfully');
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err) {
            toast.error('Failed to Update Profile Photo');
            console.error('Upload error:', err);
        }
    };

    const formSubmit = async (data) => {
        setIsLoading(true);
        try {
            await axiosInstance(user.token).patch(`api/account/user/${user._id}/`, data);
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
            <Stack alignItems="center" spacing={2}>
                <Avatar
                    src={profileImage}
                    alt={userData?.first_name ? `${userData.first_name}'s photo` : 'Profile photo'}
                    sx={{ width: 100, height: 100 }}
                />
                <Box position="relative">
                    <input
                        accept="image/*"
                        type="file"
                        id="profile-image-upload"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="profile-image-upload">
                        <IconButton
                            component="span"
                            sx={{
                                bgcolor: '#8B4513',
                                color: '#FDF5E6',
                                '&:hover': {
                                    bgcolor: '#654321',
                                },
                            }}
                        >
                            <AddAPhoto />
                        </IconButton>
                    </label>
                </Box>
            </Stack>

            <Stack direction="row" spacing={2}>
                <TextField
                    fullWidth
                    size="small"
                    label="First Name"
                    {...register('first_name', { required: true })}
                    error={!!errors.first_name}
                    helperText={errors.first_name?.message}
                    InputLabelProps={{ shrink: true }}
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
                    InputLabelProps={{ shrink: true }}
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
                InputLabelProps={{ shrink: true }}
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
                InputLabelProps={{ shrink: true }}
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
                {...register('phone_number')}
                error={!!errors.phone_number}
                helperText={errors.phone_number?.message}
                InputLabelProps={{ shrink: true }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                            borderColor: '#8B4513',
                        },
                    },
                }}
            />

            <Stack spacing={2}>
                <Typography variant="subtitle1" sx={{ color: '#8B4513' }}>
                    Address
                </Typography>
                <TextField
                    fullWidth
                    size="small"
                    label="Street"
                    {...register('address.street')}
                    error={!!errors.address?.street}
                    helperText={errors.address?.street?.message}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                                borderColor: '#8B4513',
                            },
                        },
                    }}
                />
                <Stack direction="row" spacing={2}>
                    <TextField
                        fullWidth
                        size="small"
                        label="City"
                        {...register('address.city')}
                        error={!!errors.address?.city}
                        helperText={errors.address?.city?.message}
                        InputLabelProps={{ shrink: true }}
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
                        label="State"
                        {...register('address.state')}
                        error={!!errors.address?.state}
                        helperText={errors.address?.state?.message}
                        InputLabelProps={{ shrink: true }}
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
                    label="ZIP Code"
                    {...register('address.zip_code')}
                    error={!!errors.address?.zip_code}
                    helperText={errors.address?.zip_code?.message}
                    InputLabelProps={{ shrink: true }}
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
                type="date"
                label="Date of Birth"
                {...register('dob')}
                error={!!errors.dob}
                helperText={errors.dob?.message}
                InputLabelProps={{ shrink: true }}
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

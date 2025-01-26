import { useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
    Dialog,
    Button,
    TextField,
    InputLabel,
    IconButton,
    DialogTitle,
    FormControl,
    DialogActions,
    DialogContent,
    OutlinedInput,
    InputAdornment,
    FormControlLabel,
    Checkbox,
    Grid
} from '@mui/material';

export const SimpleDialogForm = ({ isAdd, formData = {}, onClose, onSubmit }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            first_name: formData.first_name || '',
            last_name: formData.last_name || '',
            username: formData.username || '',
            email: formData.email || '',
            phone_number: formData.phone_number || '',
            dob: formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : '',
            street: formData.address?.street || '',
            city: formData.address?.city || '',
            state: formData.address?.state || '',
            zip_code: formData.address?.zip_code || '',
            is_admin: formData.is_admin || false
        }
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleShowPassword = () => setShowPassword(prev => !prev);

    const validationRules = {
        first_name: { required: 'First name is required' },
        last_name: { required: 'Last name is required' },
        username: { required: 'Username is required' },
        email: {
            required: 'Email is required',
            pattern: {
                value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: 'Invalid email format'
            }
        },
        password: isAdd ? { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } } : {}
    };

    return (
        <Dialog open onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{isAdd ? 'Add New User' : 'Edit User'}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="First Name"
                                {...register('first_name', validationRules.first_name)}
                                error={!!errors.first_name}
                                helperText={errors.first_name?.message}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                {...register('last_name', validationRules.last_name)}
                                error={!!errors.last_name}
                                helperText={errors.last_name?.message}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Username"
                                {...register('username', validationRules.username)}
                                error={!!errors.username}
                                helperText={errors.username?.message}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                {...register('email', validationRules.email)}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                {...register('phone_number')}
                                error={!!errors.phone_number}
                                helperText={errors.phone_number?.message}
                            />
                        </Grid>
                        {isAdd && (
                            <Grid item xs={12}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel htmlFor="password">Password</InputLabel>
                                    <OutlinedInput
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        {...register('password', validationRules.password)}
                                        error={!!errors.password}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton onClick={handleShowPassword} edge="end">
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Password"
                                    />
                                    {errors.password && (
                                        <span style={{ color: 'red', fontSize: '0.75rem', marginTop: '3px' }}>
                                            {errors.password.message}
                                        </span>
                                    )}
                                </FormControl>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Date of Birth"
                                type="date"
                                {...register('dob')}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Street"
                                {...register('street')}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="City"
                                {...register('city')}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="State"
                                {...register('state')}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="ZIP Code"
                                {...register('zip_code')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        {...register('is_admin')}
                                    />
                                }
                                label="Admin User"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained" color="primary">
                        {isAdd ? 'Add User' : 'Save Changes'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

SimpleDialogForm.propTypes = {
    isAdd: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    formData: PropTypes.shape({
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        username: PropTypes.string,
        email: PropTypes.string,
        phone_number: PropTypes.string,
        dob: PropTypes.string,
        address: PropTypes.shape({
            street: PropTypes.string,
            city: PropTypes.string,
            state: PropTypes.string,
            zip_code: PropTypes.string
        }),
        is_admin: PropTypes.bool
    })
};

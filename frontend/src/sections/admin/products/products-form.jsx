import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

import {
    Dialog,
    Button,
    TextField,
    DialogTitle,
    DialogActions,
    DialogContent,
    Grid,
    MenuItem
} from '@mui/material';

// ----------------------------------------------------------------------

const INSTRUMENT_CATEGORIES = [
    'String Instruments',
    'Woodwind Instruments', 
    'Brass Instruments',
    'Percussion Instruments',
    'Keyboard Instruments',
    'Electronic Instruments',
    'Traditional Instruments',
    'Accessories'
];

export const SimpleDialogForm = ({ isAdd, formData = {}, onClose, onSubmit }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: formData.name || '',
            model: formData.model || '',
            description: formData.description || '',
            price: formData.price || '',
            category: formData.category || '',
            stock: formData.stock || 0,
            image: formData.image || ""
        }
    });

    const validationRules = {
        name: { 
            required: 'Product name is required',
        },
        model: {
            required: 'Product model is required'
        },
        description: {
            required: 'Product description is required'
        },
        price: {
            required: 'Product price is required',
            min: {
                value: 0,
                message: 'Price cannot be negative'
            },
            pattern: {
                value: /^\d*\.?\d*$/,
                message: 'Please enter a valid number'
            }
        },
        category: {
            required: 'Product category is required'
        },
        stock: {
            required: 'Stock quantity is required',
            min: {
                value: 0,
                message: 'Stock cannot be negative'
            },
            pattern: {
                value: /^\d+$/,
                message: 'Please enter a valid whole number'
            }
        },
        image: {
            validate: {
                acceptedFormats: (files) => {
                    if (!files?.length) return true;
                    for (const file of files) {
                        const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
                        if (!acceptedTypes.includes(file.type)) {
                            return 'Only JPG, JPEG, PNG and GIF files are allowed';
                        }
                        if (file.size > 5 * 1024 * 1024) {
                            return 'File size must be less than 5MB';
                        }
                    }
                    return true;
                }
            }
        }
    };

    const handleFormSubmit = async (data) => {
        const formData = {
            name: data.name,
            model: data.model, 
            description: data.description,
            price: data.price,
            category: data.category,
            stock: data.stock,
            image: data.image
        };

        onSubmit(formData);
    };

    return (
        <Dialog open onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{isAdd ? 'Add New Product' : 'Edit Product'}</DialogTitle>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Product Name"
                                {...register('name', validationRules.name)}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Model"
                                {...register('model', validationRules.model)}
                                error={!!errors.model}
                                helperText={errors.model?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                multiline
                                rows={4}
                                {...register('description', validationRules.description)}
                                error={!!errors.description}
                                helperText={errors.description?.message}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Price"
                                type="text"
                                inputMode="decimal"
                                {...register('price', validationRules.price)}
                                error={!!errors.price}
                                helperText={errors.price?.message}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Category"
                                {...register('category', validationRules.category)}
                                error={!!errors.category}
                                helperText={errors.category?.message}
                            >
                                {INSTRUMENT_CATEGORIES.map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Stock"
                                type="text"
                                inputMode="numeric"
                                {...register('stock', validationRules.stock)}
                                error={!!errors.stock}
                                helperText={errors.stock?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="file"
                                fullWidth
                                label="Product Image"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    accept: 'image/*'
                                }}
                                {...register('image', validationRules.image)}
                                error={!!errors.image}
                                helperText={errors.image?.message}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained" color="primary">
                        {isAdd ? 'Add Product' : 'Save Changes'}
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
        name: PropTypes.string,
        model: PropTypes.string,
        description: PropTypes.string,
        price: PropTypes.number,
        category: PropTypes.string,
        stock: PropTypes.number,
        image: PropTypes.string
    })
};

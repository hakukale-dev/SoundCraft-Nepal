import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { useTheme } from '@mui/material/styles'
import {
	Dialog,
	Button,
	TextField,
	DialogTitle,
	DialogActions,
	DialogContent,
	Grid,
	MenuItem,
	Avatar,
	useMediaQuery,
} from '@mui/material'
import { useEffect, useState } from 'react'

const INSTRUMENT_CATEGORIES = [
	'String Instruments',
	'Woodwind Instruments',
	'Brass Instruments',
	'Percussion Instruments',
	'Keyboard Instruments',
	'Electronic Instruments',
	'Traditional Instruments',
	'Accessories',
]

export const SimpleDialogForm = ({
	isAdd,
	formData = {},
	onClose,
	onSubmit,
}) => {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm({
		defaultValues: {
			name: formData.name || '',
			model: formData.model || '',
			description: formData.description || '',
			price: formData.price || '',
			category: formData.category || '',
			stock: formData.stock || 0,
			image: formData.image || '',
		},
	})
	const [imageUploaded, setImageUploaded] = useState(false)

	const imagePreview = watch('image') || formData.image

	const validationRules = {
		name: { required: 'Product name is required' },
		model: { required: 'Product model is required' },
		description: { required: 'Product description is required' },
		price: {
			required: 'Product price is required',
			min: { value: 0, message: 'Price cannot be negative' },
			pattern: {
				value: /^\d*\.?\d*$/,
				message: 'Please enter a valid number',
			},
		},
		category: { required: 'Product category is required' },
		stock: {
			required: 'Stock quantity is required',
			min: { value: 0, message: 'Stock cannot be negative' },
			pattern: {
				value: /^\d+$/,
				message: 'Please enter a valid whole number',
			},
		},
		image: {
			required: isAdd ? 'Product image is required' : false,
			validate: {
				acceptedFormats: (file) => {
					if (isAdd || imageUploaded) {
						const acceptedTypes = [
							'image/jpeg',
							'image/png',
							'image/gif',
							'image/jpg',
						]
						if (!acceptedTypes.includes(file.type)) {
							return 'Only JPG, JPEG, PNG and GIF files are allowed'
						}
						if (file.size > 5 * 1024 * 1024) {
							return 'File size must be less than 5MB'
						}
						return true
					}
				},
			},
		},
	}

	const handleFormSubmit = async (data) => {
		const formData = {
			name: data.name,
			model: data.model,
			description: data.description,
			price: data.price,
			category: data.category,
			stock: data.stock,
			image: data.image,
		}
		onSubmit(formData)
	}

	const getImageSrc = () => {
		if (!imagePreview) return ''
		if (typeof imagePreview === 'string') return imagePreview
		if (imagePreview instanceof FileList) {
			return URL.createObjectURL(imagePreview?.[0])
		}
		return ''
	}

	return (
		<Dialog
			open
			onClose={onClose}
			maxWidth="md"
			fullWidth
			fullScreen={isMobile}>
			<DialogTitle>
				{isAdd ? 'Add New Product' : 'Edit Product'}
			</DialogTitle>
			<form onSubmit={handleSubmit(handleFormSubmit)}>
				<DialogContent dividers>
					<Grid
						container
						spacing={isMobile ? 1 : 3}
						direction={isMobile ? 'column' : 'row'}>
						<Grid
							item
							xs={12}
							md={4}>
							<Avatar
								src={getImageSrc()}
								variant="rounded"
								sx={{
									width: '100%',
									height: isMobile ? 200 : 300,
									bgcolor: theme.palette.grey[200],
									mb: 2,
								}}
							/>
							<TextField
								type="file"
								fullWidth
								required={isAdd}
								label={`Product Image ${
									isAdd ? '' : '(Optional)'
								}`}
								InputLabelProps={{ shrink: true }}
								inputProps={{
									accept: 'image/*',
									multiple: false,
								}}
								{...register('image', {
									...validationRules.image,
									onChange: (e) => {
										if (
											e.target.files &&
											e.target.files.length > 0
										) {
											setImageUploaded(true)
										}
									},
								})}
								error={!!errors.image}
								helperText={errors.image?.message}
								size={isMobile ? 'small' : 'medium'}
							/>
						</Grid>
						<Grid
							item
							xs={12}
							md={8}>
							<Grid
								container
								spacing={isMobile ? 1 : 2}>
								<Grid
									item
									xs={12}
									sm={6}>
									<TextField
										fullWidth
										label="Product Name"
										size={isMobile ? 'small' : 'medium'}
										{...register(
											'name',
											validationRules.name
										)}
										error={!!errors.name}
										helperText={errors.name?.message}
									/>
								</Grid>
								<Grid
									item
									xs={12}
									sm={6}>
									<TextField
										fullWidth
										label="Model"
										size={isMobile ? 'small' : 'medium'}
										{...register(
											'model',
											validationRules.model
										)}
										error={!!errors.model}
										helperText={errors.model?.message}
									/>
								</Grid>
								<Grid
									item
									xs={12}>
									<TextField
										fullWidth
										label="Description"
										multiline
										rows={isMobile ? 2 : 4}
										size={isMobile ? 'small' : 'medium'}
										{...register(
											'description',
											validationRules.description
										)}
										error={!!errors.description}
										helperText={errors.description?.message}
									/>
								</Grid>
								<Grid
									item
									xs={12}
									sm={6}>
									<TextField
										fullWidth
										label="Price"
										type="text"
										inputMode="decimal"
										size={isMobile ? 'small' : 'medium'}
										{...register(
											'price',
											validationRules.price
										)}
										error={!!errors.price}
										helperText={errors.price?.message}
									/>
								</Grid>
								<Grid
									item
									xs={12}
									sm={6}>
									<TextField
										fullWidth
										select
										label="Category"
										size={isMobile ? 'small' : 'medium'}
										{...register(
											'category',
											validationRules.category
										)}
										error={!!errors.category}
										helperText={errors.category?.message}
										value={INSTRUMENT_CATEGORIES.find(
											(category) =>
												category === formData.category
										)}>
										{INSTRUMENT_CATEGORIES.map(
											(category) => (
												<MenuItem
													key={category}
													value={category}>
													{category}
												</MenuItem>
											)
										)}
									</TextField>
								</Grid>
								<Grid
									item
									xs={12}
									sm={6}>
									<TextField
										fullWidth
										label="Stock"
										type="text"
										inputMode="numeric"
										size={isMobile ? 'small' : 'medium'}
										{...register(
											'stock',
											validationRules.stock
										)}
										error={!!errors.stock}
										helperText={errors.stock?.message}
									/>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={onClose}
						size={isMobile ? 'small' : 'medium'}>
						Cancel
					</Button>
					<Button
						type="submit"
						variant="contained"
						color="primary">
						{isAdd ? 'Add Product' : 'Save Changes'}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	)
}

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
		image: PropTypes.string,
	}),
}

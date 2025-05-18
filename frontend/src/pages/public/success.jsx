import { useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import {
	Box,
	List,
	Paper,
	Button,
	Divider,
	ListItem,
	Container,
	Typography,
	ListItemText,
} from '@mui/material'

import axios from 'src/utils/axios'

// ----------------------------------------------------------------------

export default function SuccessPage() {
	const { isAuthenticated, user } = useSelector((state) => state.auth)
	const navigate = useNavigate()
	const { slug } = useParams()

	const [order, setOrder] = useState(null)

	const fetchData = useCallback(async () => {
		await axios
			.get(`/get-order/${slug}/`)
			.then((res) => {
				setOrder(res.data)
				console.log(res.data)
			})
			.catch((err) => {
				setOrder(null)
			})
	}, [slug, user])

	useEffect(() => {
		fetchData()
	}, [slug, fetchData])

	return isAuthenticated && order ? (
		<>
			<Helmet>Thank You</Helmet>
			<Container maxWidth="md">
				<Paper
					elevation={3}
					sx={{ padding: 4, marginTop: 4 }}>
					<Typography
						variant="h4"
						gutterBottom>
						Thank You for Your Purchase!
					</Typography>
					<Typography
						variant="subtitle1"
						gutterBottom>
						Your order number is: {order[0].id}
					</Typography>
					<Typography
						variant="subtitle1"
						gutterBottom>
						Your Transaction Ref is:{' '}
						{order[0].transaction.transaction_ref}
					</Typography>
					<Divider sx={{ marginY: 2 }} />
					<Typography
						variant="h6"
						gutterBottom>
						Order Summary
					</Typography>
					<List>
						{order.map((item, index) => (
							<ListItem key={index}>
								<ListItemText
									primary={item.equipment.name}
									secondary={`Quantity: ${item.quantity} | Price: $${item.price_per}`}
								/>
							</ListItem>
						))}
					</List>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							marginTop: 2,
						}}>
						<Typography variant="h6">
							Total: Rs.{order[0].transaction.total / 100}
						</Typography>
					</Box>
					<Divider sx={{ marginY: 2 }} />
					<Button
						variant="contained"
						color="primary"
						onClick={() => navigate('/products')}>
						Continue Shopping
					</Button>
				</Paper>
			</Container>
		</>
	) : (
		<Container>
			<Typography variant="h1">No Order Available</Typography>
		</Container>
	)
}

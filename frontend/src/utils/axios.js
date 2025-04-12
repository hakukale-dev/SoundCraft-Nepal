import axios from 'axios'

// Create base instance
const instance = axios.create({
	baseURL: 'http://localhost:8080/',
	timeout: 10000, // 10 seconds
	headers: {
		'Content-Type': 'application/json',
	},
})

// Request interceptor
instance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token')
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

// Response interceptor
instance.interceptors.response.use(
	(response) => {
		// Handle successful responses
		return response
	},
	(error) => {
		// Handle errors
		if (error.response) {
			// Server responded with a status code outside 2xx
			const { status, data } = error.response

			if (status === 401) {
				// Handle unauthorized access
				localStorage.removeItem('token')
				window.location.href = '/login'
			}

			const errorMessage =
				data?.message || data?.error || 'An error occurred'
			return Promise.reject(new Error(errorMessage))
		} else if (error.request) {
			// The request was made but no response was received
			return Promise.reject(
				new Error('Network error. Please check your connection.')
			)
		} else {
			// Something happened in setting up the request
			return Promise.reject(new Error('Request setup error.'))
		}
	}
)

// Helper functions
const get = (url, config) => instance.get(url, config)
const post = (url, data, config) => instance.post(url, data, config)
const put = (url, data, config) => instance.put(url, data, config)
const patch = (url, data, config) => instance.patch(url, data, config)
const del = (url, config) => instance.delete(url, config)

export default {
	instance,
	get,
	post,
	put,
	patch,
	delete: del,
}

import ReactDOM from 'react-dom/client'
import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'

import App from './App'

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
	<StrictMode>
		<BrowserRouter basename="/">
			<App />
		</BrowserRouter>
	</StrictMode>
)

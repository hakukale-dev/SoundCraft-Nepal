import { IconButton } from '@mui/material'
import { useColorMode } from '../../theme'
import Iconify from '../iconify'

export default function ThemeModeToggle() {
	const { toggleColorMode, mode } = useColorMode()

	return (
		<IconButton
			onClick={toggleColorMode}
			color={'primary'}>
			<Iconify
				icon={mode === 'dark' ? 'eva:sun-fill' : 'eva:moon-fill'}
				width={20}
				height={20}
			/>
		</IconButton>
	)
}

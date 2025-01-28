import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx }, ref) => {
    const logo = (
        <Box
            component="img"
            src="src/assets/icons/logo.png"
            sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}
            ref={ref}
        />
    );

    if (disabledLink) {
        return logo;
    }

    return (
        <Link component={RouterLink} href="/homepage" sx={{ display: 'contents' }}>
            {logo}
        </Link>
    );
});

Logo.displayName = 'Logo';

Logo.propTypes = {
    disabledLink: PropTypes.bool,
    sx: PropTypes.object,
};

export default Logo;

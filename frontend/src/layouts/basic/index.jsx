import { Outlet } from 'react-router-dom';

import Box from '@mui/material/Box';

import Main from './main';
import BasicHeader from './header';
import BasicFooter from './footer';

// ----------------------------------------------------------------------

export default function BasicLayout ()
{
    return (
        <>
            <BasicHeader />

            <Box
                sx={ {
                    minHeight: 1,
                    display: 'flex',
                    flexDirection: { xs: 'column', lg: 'row' },
                } }
            >
                <Main>
                    <Outlet />
                </Main>
            </Box>

            <BasicFooter />
        </>
    );
}

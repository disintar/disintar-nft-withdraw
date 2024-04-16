import {TonConnectButton} from "@tonconnect/ui-react";
import './header.scss';
import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import { Link, redirect } from "react-router-dom";

const pages = ['Sell', 'Withdraw'];

export const Header = () => {
    return  <AppBar position="static">
         <Container maxWidth="xl">
         <Toolbar disableGutters>
         <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Disintar
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={()=> redirect(`/${page.toLowerCase()}`)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                <Link to={`/${page.toLowerCase()}`}>{page}</Link>
              </Button>
            ))}
          </Box>
          
        <TonConnectButton />
            </Toolbar>
         </Container>
    </AppBar>
}

import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles( (theme) => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1.
    },
    title: {
        flexGrow: 1,
        cursor: 'pointer'
    },
}));

const NavBar = ({ sideBarOnClick }) => {
    const classes = useStyles();
    const history = useHistory();

  return (
        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
                <IconButton className={classes.menuButton} edge="start" color="inherit" aria-label="menu" onClick={sideBarOnClick}>
                 <MenuIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title} onClick={() => {history.push('/')}}>Document AI - Demo</Typography>
            </Toolbar>
        </AppBar>
  );
};

export default NavBar;

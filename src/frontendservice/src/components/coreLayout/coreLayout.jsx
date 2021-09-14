import React from 'react';
import NavBar from '../navbar/navbar';
import SideBar from '../sidebar/sideBar';
import Home from '../home/home';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const drawerWidth = 150;

const useStyles = makeStyles( (theme) => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    shiftLeft: {
        marginLeft: '0px',
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    shiftRight: {
        marginLeft: drawerWidth,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    }
}));

const CoreLayoutComponent = () => {
    const classes = useStyles();
    const [sideBarOpen, setSideBarOpen] = React.useState(true);

    const handleSideBarOpen = () => {
        setSideBarOpen(!sideBarOpen);
    };

    return (
        <Router>
            <div>
                <NavBar sideBarOnClick={handleSideBarOpen} />
                <SideBar open={sideBarOpen} />
                <main className={classes.content}>
                    <Toolbar />
                    <div className={sideBarOpen ? classes.shiftRight : classes.shiftLeft}>
                        <Switch>
                            <Route exact path="/">
                                <Home />
                            </Route>
                        </Switch>
                    </div>
                </main>
            </div>
        </Router>
    );
};

export default CoreLayoutComponent;

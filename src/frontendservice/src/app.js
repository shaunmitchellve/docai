import React from 'react';
import NavBar from './components/navbar/navbar';
import SideBar from './components/sidebar/sideBar';
import Home from './components/home/home';
import ViewFile from './components/fileviewer/fileviewer';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

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
        }),    },
    shiftRight: {
        marginLeft: drawerWidth,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),    },
    parent: {}
}));

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />
}

const App = () => {
    const classes = useStyles();
    const [state, setState] = React.useState({
        fileSnack: false,
        snackError: '',
        snackSev: 'info'
    });
    const [sideBarOpen, setSideBarOpen] = React.useState(true);

    const handleSideBarOpen = () => {
        setSideBarOpen(!sideBarOpen);
    };

    const { fileSnack, snackError, snackSev } = state;

    const handleOpen = (sev, error) => {
        setState({ fileSnack: true, snackError: error, snackSev: sev });
    };

    const handleClose = () => {
        setState( { ...state, fileSnack: false });
    };

    return (
        <Router>
            <div className="parent">
                <NavBar sideBarOnClick={handleSideBarOpen} />
                <SideBar open={sideBarOpen} snackHandle={handleOpen} />
                <main className={classes.content}>
                    <Toolbar />
                    <div className={sideBarOpen ? classes.shiftRight : classes.shiftLeft}>
                        <Switch>
                            <Route component={Home} path="/" exact={true} />
                            <Route component={ViewFile} path="/view"/>
                        </Switch>
                        
                    </div>
                    <Snackbar
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left"
                    }}
                    open={fileSnack}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    >
                        <Alert severity={snackSev}>
                            {snackError}
                            <Button color="primary" size="small" onClick={handleClose}>
                                ok
                            </Button>
                        </Alert>
                    </Snackbar>
                </main>
            </div>
        </Router>
    );
};

export default App;
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles( (theme) => ({
}));

const Home = () => {
    const classes = useStyles();

    return (
        <Typography>Welcome Home</Typography>
    );
};

export default Home;

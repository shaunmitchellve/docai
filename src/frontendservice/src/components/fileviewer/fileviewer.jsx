import React from 'react';
import { useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import IFrame from 'react-iframe';

const useStyles = makeStyles( (theme) => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        height: "calc(100vh - 160px)",
    },
}));

const ViewFile = () => {
    const location = useLocation();
    const fileUrl = location.state.fileUrl;
    console.log(`FILEURL: ${location.state.fileUrl}`);
    
    const classes = useStyles();

    return (
        <div className={classes.content}>
            <IFrame
             url={fileUrl}
             display="block" 
             width="50%"
             height="100%"
             frameBorder="0"
             id="uploaded_doc"
              />
        </div>
    );
};

export default ViewFile;

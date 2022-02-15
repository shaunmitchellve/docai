import React from 'react';
import { useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import IFrame from 'react-iframe';
import FormEditor from './formEditor';

const useStyles = makeStyles( (theme) => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        height: "calc(100vh - 160px)",
    },
}));

const ViewFile = () => {
    const location = useLocation();
    const fileUrl = location.state.fileData.url;
    const fileId = location.state.fileData.fileId;
    
    const classes = useStyles();

    return (
        <div>
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
            <FormEditor fileId={fileId} />
        </div>
    );
};

export default ViewFile;

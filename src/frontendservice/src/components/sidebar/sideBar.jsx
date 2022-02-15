import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import ToolBar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { green } from '@material-ui/core/colors';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';

const drawerWidth = 150

const useStyles = makeStyles( (theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerContent: {
        overflow: 'auto',
    },
    create: {
        marginRight: theme.spacing(1),
    },
    button: {
        margin: theme.spacing(1),
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
      }
}));

const checkFileSize = event => {
    let file = event.target.files[0];
    let size = 5242880;
    if (file.size > size) {
        return false;
    }

    return true;
}

const SideBar = (props) => {
    const classes = useStyles();
    const [loading, setLoading] = React.useState(false);
    const { open, snackHandle } = props;
    const history = useHistory();


    const handleButtonClick = () => {
        if (!loading) {
            setLoading(true);
        }
    };

    const onFileUpload = event => {
        if(checkFileSize(event)) {
            const data = new FormData();

            data.append('file', event.target.files[0]);
            axios.post(`${process.env.REACT_APP_UPLOADSERVICE}/upload?key=${process.env.REACT_APP_APIKEY}&`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then( res => { 
                setLoading(false);
                snackHandle('success', 'Upload Successful');
                console.log(res.data);

                history.push('/view', {
                    fileData: res.data
                })
            }).catch( error => {console.error(error)});
        } else {
            setLoading(false);
            snackHandle('error', 'File is to lage. Max 5MB');
        }
    }

    return (
        <div className={classes.root}>
            <Drawer
                variant="persistent"
                anchor="left"
                open={open}
                className={classes.drawer}
                classes={{
                    paper: classes.drawerPaper
            }}>
                <ToolBar />
                <div className={classes.drawerContent}>
                    <form>
                        <List>
                        <input
                            accept=".pdf"
                            style={{ display: 'none' }}
                            id="uploaded_doc"
                            type="file"
                            onChange={onFileUpload}
                        />
                        <label htmlFor="uploaded_doc">
                        <ListItem button onClick={handleButtonClick} disabled={loading}>
                           <ListItemIcon><CloudUploadIcon /></ListItemIcon>
                           <ListItemText primary="Upload" />
                        </ListItem>
                        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                        </label>
                   </List>
                   </form>
                </div>
            </Drawer>
        </div>
    );
};

export default SideBar;
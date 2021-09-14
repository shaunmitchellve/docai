import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import ToolBar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';

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
    }
}));

const onFileUpload = event => {
    const data = new FormData();
    data.append('file', event.target.files[0]);
    axios.post('https://127.0.0.1:3005/upload', data).then( res => { console.log(res); }).catch( error => {console.error(error)});
}

const SideBar = ({ open }) => {
    const classes = useStyles();

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
                        <ListItem button>
                           <ListItemIcon><CloudUploadIcon /></ListItemIcon>
                           <ListItemText primary="Upload" />
                        </ListItem>
                        </label>
                   </List>
                   </form>
                </div>
            </Drawer>
        </div>
    );
};

export default SideBar;
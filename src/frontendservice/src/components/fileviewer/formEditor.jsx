import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FormEditor = ( fileId ) => {
    const [data, setData] = useState({});

    const getFileData = (fileId) => {
        axios.post(`${process.env.REACT_APP_DOBBYSERVICE}/file_data?key=${process.env.REACT_APP_APIKEY}&fileId=${fileId}`).then( res => {
            console.log(res);
            setData(res.json());
        });
    }

    useEffect((fileId) => {
        getFileData(fileId);
        return () => {};
    }, []);
    return (
        <div>
            <form>
                <label>
                    Doc ID:
                </label>
                <input name="docId" value="" disabled />
            </form>
        </div>
    );
}

export default FormEditor;
/* eslint-disable max-len */
'use strict';

/**
 * Interface outlines the required properties and methods are required to be implemented for
 * custom document collection.
 */
class DocInterface {
    /**
     * The class constructor should test that custom document collection meets the interface
     * once I figure out how to get this executed properly
     */
    constructor() {
        /*
        if(!this.docRecord) throw new Error("Doc must have a record object that matches the custom table schema. (this.docRecord)");
        if(!this._docTable) throw new Error("Doc needs to know the table name to save to. (this._docTable)");
        if(!this.addEntity) throw new Error("Doc must accept new entities. (this.addEntity())");
        if(!this.docFound) throw new Error("Doc needs to know which column / property will be required to capture to determine if a document should be saved. (this.docFound())")
        */
    }

    /**
     * Get the document record
     */
    get doc() {
        return this.docRecord;
    }

    /**
     * Get the document SQL table
     */
    get docTable() {
        return this._docTable;
    }
}

export default DocInterface;

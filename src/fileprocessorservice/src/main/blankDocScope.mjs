'use strict';

import DocInterface from './DocInterface.mjs';

/**
 * Example document class extenstion
 */
class DefaultDocScope extends DocInterface {
    docRecord = {};
    _docTable = '';

    /**
     * Class constructor.
     */
    constructor() {
        super();
    }

    /**
     * This core method will look at the entityName.entity and using a ruleset to determine which element is being
     * usedand then read the value in the correct way for a particula document
     * @param {object} entityName
     * @param {object} entityValue
     * @param {object} entityType
     * @see {@link entityDataRecord}
     */
    addEntity(entityName, entityValue, entityType) {
        return;
    }

    /**
     * Getter function to determine if the document was actually found.
     * This is used to check whether of not to save the document data to BigQuery
     */
    get docFound() {
        return false;
    }
}

export default DefaultDocScope;

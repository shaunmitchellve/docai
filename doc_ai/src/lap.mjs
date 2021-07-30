'use strict';

import {v4 as uuid} from 'uuid';
import DocInterface from './DocInterface.mjs';

/**
 * Example document class extenstion
 */
class LapDoc extends DocInterface {
    docRecord = {
        application_id: uuid(),
        date_signed: null,
        phone: null,
        phy_address: null,
        phy_postal: null,
        application_type: null,
        mail_address: null,
        mail_postal: null,
        marital_status: null,
        email_address: null,
        spouse_visit_canada: null,
        spouse_long_term_care: null,
        currently_enrolled: null,
        post_sec_rec_fac: null,
        upass: null,
        dats_client: null,
        dats_client_num: null,
        cnib_client: null,
        cnib_client_name: null,
        applicants: [],
    };

    applicants = {};

    _applicantEntry = 0;

    _docTable = 'lartp_docs';

    constructor() {   
        super();
        this._newApplicants();
    }

    addEntity(entityName, entityValue, entityType) {
        const x = ~~JSON.parse(entityName.entityVertices)[0].x;
        const y = entityType !== 'table' ? ~~JSON.parse(entityName.entityVertices)[0].y : ~~JSON.parse(entityValue.entityVertices)[0].y;

        switch (entityName.entity) {
         case 'DATE (MM/DD/YYYY)':
             this.docRecord.date_signed = this._convertDate(entityValue.entity);
             break;
         case 'Phone #:':
             this.docRecord.phone = entityValue.entity;
             break;
         case 'Current Physical Address (including suite, unit or apartment #):':
             this.docRecord.phy_address = entityValue.entity;
             break;
         case 'Postal Code:':
             if(y > 1100) this.docRecord.mail_postal = entityValue.entity;
             else this.docRecord.phy_postal = entityValue.entity;
             break;
         case 'Mailing Address (if different from physical address):':
             this.docRecord.mail_address = entityValue.entity;
             break;
         case 'Renewal':
         case 'New':
         case 'Adding Members':
             if(entityType === 'filled_checkbox') this.docRecord.application_type = entityName.entity;
             break;
         case 'Email Address:':
             this.docRecord.email_address = entityValue.entity;
             break;
         case 'Married / Common-law*':
         case 'Single':
         case 'Legally Separated / Divorced':
         case 'Widowed':
             if(entityType === 'filled_checkbox') this.docRecord.marital_status = entityName.entity;
             break;
         case 'If yes, please list Client Number(s):':
             this.docRecord.dats_client_num = entityValue.entity;
             break;
         case 'Yes':
         case 'Yes;':
         case 'No':
             if(entityType === 'filled_checkbox') {
                 const value = this._convertNoYes(entityName.entity);

                 if( (x > 881 && x < 1100) && (y > 1627 && y < 1696)) this.docRecord.upass = value;
                 if( (x > 1455 && x < 1690) && (y > 1820 && y < 1881)) this.docRecord.cnib_client = value;
                 if( (x > 35 && x < 276) && (y > 1538 && y < 1583)) this.docRecord.currently_enrolled = value;
                 if( (x > 305 && x < 520) && (y > 1633 && y < 1670)) this.docRecord.post_sec_rec_fac = value;
                 if( (x > 1254 && x < 1490) && (y > 1700 && y < 1770)) this.docRecord.dats_client = value;
                 if( (x > 556 && x < 750) && (y > 1390 && y < 1450)) this.docRecord.spouse_visit_canada = value;
                 if( (x > 765 && x < 965) && (y > 1390 && y < 1490)) this.docRecord.spouse_long_term_care = value;

             }
             break;
         case 'FIRST NAME':
             if(y > 495 && y < 931) {
                 this.applicants.first_name = entityValue.entity;
                 this.applicantEntry();
             }
             break;
         case 'LAST NAME':
             if(y > 495 && y < 931) {
                 this.applicants.last_name = entityValue.entity;
                 this.applicantEntry();
             }
             break;
         case 'POST-SECONDARYSCHOOL ENROLLED(if applicable)':
             if(y > 495 && y < 931) {
                 this.applicants.post_sec_school= entityValue.entity;
                 this.applicantEntry();
             }
             break;
         case 'RELATION TOAPPLICANT':
             if(y > 495 && y < 931){
                 this.applicants.relation_to_applicant = entityValue.entity;
                 this.applicantEntry();
             }
             break;             
         case 'MEMBERBARCODE(if applicable)':
             if(y > 495 && y < 931) {
                 this.applicants.member_barcode = entityValue.entity;
                 this.applicantEntry();
             }
             break;
         case 'DATE OF BIRTHMM/DD/YYYY':
             if(y > 495 && y < 931){
                 this.applicants.dob = this._convertDate(entityValue.entity);
                 this.applicantEntry();
             }
             break;
         
        }
    }

    get docFound() {
        return this.docRecord.phone !== null;
    }

    applicantEntry() {
        this._applicantEntry += 1;

        if(this._applicantEntry === 6) {
            this.docRecord.applicants.push(this.applicants);
            this._newApplicants();
        }
    }

    _newApplicants() {
        this.applicants = {
            first_name: null,
            last_name: null,
            post_sec_school: null,
            relation_to_applicant: null,
            member_barcode: null,
            dob: null,
        };

        this._applicantEntry = 0;
    }

    _convertNoYes(value) {
        return value.toLowerCase().trim() === 'no' ? false : true;
    }

    _convertDate(value) {
        return value.substr(6, 4) + '-' + value.substr(0, 2) + '-' + value.substr(3, 2);
    }
}

export default LapDoc;

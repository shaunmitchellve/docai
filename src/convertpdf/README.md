# Convert PDF Service

The Convert PDF service was create to take a multi-page PDF document and convert each page into an individual PDF. This is done because the maximum number of PDF pages the Form Parser can handle is 5. The service does not check if the PDF conatins more then 5 pages for synchronous/online requests, it just process the PDF regardless.

See more: https://cloud.google.com/document-ai/docs/processors-list#processor_form-parser

# Service Build
To build the service you can call:
```
gcloud builds submit . --substitutions=_REGION=$REGION,_ARTIFACT_NAME=$ARTIFACT_REG_NAME
```

Where $REGION and $ARTIFACT_REG_NAME are replaced with the outputs from the Terraform process.

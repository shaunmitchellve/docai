# File Upload Service

The file upload service is a simple endpoint used by the web front end service in order to upload a file 
to a Google Cloud Storage bucket. While uploading the file the service will add a UUID to the files metadata
so that the file can be tracked throughout the process.

# Service Build

This service can be build by modifying the cloudbuild.yaml and adjust the substitutions to meet your environemnt and running:

```
gcloud builds submit .
```
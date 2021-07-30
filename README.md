# Document AI Demo

This repository contains 2 programs, one (doc_ai) will process a document from a Google Cloud Storage bucket (using a pub/sub subscription on object creation)
and send the documents contents (PDF) to a Document AI form processor. The returning JSON is then parsed and saved in a generic BigQuery table.

There is also a hook example for saving the same processed results into a table structure that directly matchs the document contents. It will use different methodolgies
to capture the correct data for a specific example document.

NOTE: You will need to run ./setup.sh -b first to deploy the program to Cloud Run. Once the deployment is complete then you need to copy the Cloud Run endpoint into the environment variable and run ./setup.sh -s

Also make sure to enable the Cloud Run Service account permissions on the Cloud Build page or you will get permissions errors on your Cloud Build pipeline

See setup.sh for more pre-conditions and setup paramaters needed.

The second program (pdfConvert) will take in a PDF document from a Google Cloud Storage bucket  (using a pub/sub subscription on object creation) and convert that PDF
to a JPEG so that it can be used in an AutoML Vision Object detection training pipeline.

See setup.sh for more pre-conditions and setup paramaters needed.

## Products

- [Document AI](https://cloud.google.com/document-ai)
- [Cloud Storage](https://cloud.google.com/storage)
- [Cloud Pub / Sub](https://cloud.google.com/pubsub)
- [Vertex AI: AutoML Vision Object Detection](https://cloud.google.com/vision/automl/object-detection/docs)
- [Cloud Run](https://cloud.google.com/run)
- [Cloud Build](https://cloud.google.com/build)

## Deploy Process

In each programs folder there is a setup.sh file. Update the environment variables to match your GCP environment. Then call the startup.sh in cloud shell with
either -s for first time setup or -b to deploy the container to Cloud Run. (Note: After initial clone you will need to: chmod +x setup.sh to make the file executable)

## Updates

This is provided as is with out any warranty. It's for demo purposes only and should NOT be run in any production environments.

# Document AI Demo

The Document AI Demo is a simple use-case of uploading a document into a Google Cloud Storage bucket
that will then be processed using a form processor to capture the documents key/value pairs then save them into a generic BigQuery table and a
table that matches the demo document.

If you don't wish to use the demo document specific table and code then make the following changes before applying the demo:
- In bigquery.tf, comment out the second table definition "lartp_docs"
- In the fileprocessorserivce/src/main/doc_ai.mjs comment out and uncomment the lines near the top. Look for the @TODO comments.

You can extend this demo and load in your custom document object.

## Products

- [Document AI](https://cloud.google.com/document-ai)
- [Cloud Storage](https://cloud.google.com/storage)
- [Cloud Pub / Sub](https://cloud.google.com/pubsub)
- [Cloud Run](https://cloud.google.com/run)
- [Cloud Build](https://cloud.google.com/build)

## Notes

The file processor service is built using an updated version of Node that does not come default with Cloud Shell. To upgrade Node in Cloud Shell
run: `nvm install 14.17.6`

If your environment has the following Organization Police Set you will need to update it with-in your project after it's been created in order to allow the Front End to be access by anyone:
- constraints/iam.allowedPolicyMemberDomains

## Deploy Process

`terraform init`

`terraform apply`

Take the outputs from the above to replace the substitutions with the matching values
`gcloud builds submit --substitutions=_DATASET="${DATASET}",_REGION="${REGION}",_ARTIFACT_NAME="${ARTIFACT_NAME}",_PROCESSOR_ID="${PROCESSOR_ID}",_STORAGE_BUCKET="${STORAGE_BUCKET}`

## Updates

This is provided as is with out any warranty. It's for demo purposes only and should NOT be run in any production environments.
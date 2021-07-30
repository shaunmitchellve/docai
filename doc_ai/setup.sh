#!/bin/sh

## Setup the environment variables to match your GCP environment
export PROJECT_ID=<PROJECT_ID>
export PROJECT_NUMBER=<PROJECT_NUMBER>
export REGION=<REGION_FOR_SERVICES>
export PS_TOPIC=<PUB_SUB_TOPIC_NAME>
export BUCKET_NAME=<STORAGE_BUCKET_NAME>
export ARTIFACT_NAME=<ARTIFACT_REPO_NAME> #This needs to be created first as the setup.sh file doesn't set the artifact repo
export DATASET=<BQ_DATASETNAME> #This needs to be created first as the setup.sh file doesn't create the BigQuery dataset
export TABLE=document_entities # Table name right now is hard-coded
export PROCESSOR_ID=<DOC_AI_PROCESSOR_ID> # This needs to be created first as setup.sh file doesn't create the processor you want
export CLOUD_RUN_ENDPOINT_URL=<CLOUD_RUN_ENDPOINT_URL>

deploy() {
    # Create a build pipeline using the cloudbuild.yaml spec
    gcloud builds submit --config=cloudbuild.yaml \
    --substitutions=_DATASET="${DATASET}",_REGION="${REGION}",_ARTIFACT_NAME="${ARTIFACT_NAME}",_PROCESSOR_ID="${PROCESSOR_ID}" .
}

start_setup() {
    # Create the dataset and table from the schema file
    bq mk --table $PROJECT_ID:$DATASET.$TABLE ./schema.json

    # Give the pubsub default service accont the accountokencreator role so that it can auth against Cloud Run services
    gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member=serviceAccount:service-$PROJECT_NUMBER@gcp-sa-pubsub.iam.gserviceaccount.com \
    --role=roles/iam.serviceAccountTokenCreator

    # Create a new SA for a pubsub subscription to push auth
    gcloud iam service-accounts create cloud-run-pubsub-invoker \
    --display-name "Cloud Run Pub/Sub Invoker"

    # Give the new SA the ability to be a cloud run invoker
    gcloud run services add-iam-policy-binding document-processor  \
    --member=serviceAccount:cloud-run-pubsub-invoker@$PROJECT_ID.iam.gserviceaccount.com \
    --role=roles/run.invoker

    # Create a storage bucket for the demo files to be uploaded to
    gsutil mb -p $PROJECT_ID -l $REGION -b on gs://$BUCKET_NAME

    # create a notification to the pubsub topic for the bucket
    gsutil notification create -t $PS_TOPIC -f json -e OBJECT_FINALIZE gs://$BUCKET_NAME

    # Create a subscription for the topic and that will nootify the cloud run endpooint
    # When you push your first revision of the cloud run server, it will give you an endpoint URL, copy that into this command.
    gcloud pubsub subscriptions create fileProcessorSub --topic $PS_TOPIC \
    --push-endpoint=$CLOUD_RUN_ENDPOINT_URL \
    --push-auth-service-account=cloud-run-pubsub-invoker@$PROJECT_ID.iam.gserviceaccount.com
}


while getopts "bs" opt
do
    case $opt in
        b) deploy
            ;;
        s)  start_setup
            ;;
    esac
done
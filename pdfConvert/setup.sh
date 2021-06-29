#!/bin/sh

 ## Setup the environment variables to match your GCP environment
export PROJECT_ID=<PROJECT_ID>
export REGION=<REGION_FOR_SERVICES>
export ARTIFACT_NAME=<ARTIFACT_REPO_NAME> #This needs to be created first as the setup.sh file doesn't set the artifact repo
export BUCKET_NAME=<STORAGE_BUCKET_NAME>
export PS_TOPIC=<PUB_SUB_TOPIC_NAME>

# Create a build pipeline using the cloudbuild.yaml spec
gcloud builds submit --config=cloudbuild.yaml \
--substitutions=_REGION="${REGION}",_ARTIFACT_NAME="${ARTIFACT_NAME}" .

# create a notification to the pubsub topic for the bucket
gsutil notification create -t $PS_TOPIC -f json -e OBJECT_FINALIZE gs://$BUCKET_NAME

gcloud run services add-iam-policy-binding pdf-converter \
--member=serviceAccount:cloud-run-pubsub-invoker@coe-doc-ai.iam.gserviceaccount.com \
--role=roles/run.invoker \
--region=us-west1

# Create a subscription for the topic and that will nootify the cloud run endpooint
# When you push your first revision of the cloud run server, it will give you an endpoint URL, copy that into this command.
gcloud pubsub subscriptions create trainingFileProcessorConvert --topic $PS_TOPIC \
--push-endpoint=CLOUD_RUN_ENDPOINT_URL \
--push-auth-service-account=cloud-run-pubsub-invoker@$PROJECT_ID.iam.gserviceaccount.com
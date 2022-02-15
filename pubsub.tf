# ---------------------------------------------------------------------------------------------
# Setup the Pub/Sub Topic and Subscription
# ---------------------------------------------------------------------------------------------

resource "google_pubsub_topic" "forms-pst" {
    project = "${module.project.project_id}"
    name = "${var.forms-pst}"

    depends_on = [
      module.project
    ]
}

resource "google_pubsub_topic_iam_binding" "binding" {
  project = "${module.project.project_id}"
  topic   = google_pubsub_topic.forms-pst.id
  role    = "roles/pubsub.publisher"
  members = ["serviceAccount:${data.google_storage_project_service_account.gcs_account.email_address}"]

  depends_on = [
    google_pubsub_topic.forms-pst
  ]
}

# ---------------------------------------------------------------------------------------------
# NOTE: This subscription requires that the Cloud Run service endpoint has been created first.
# ---------------------------------------------------------------------------------------------
resource "google_pubsub_subscription" "fileProcessorSub" {
    name = "fileProcessorSub"
    topic = "${google_pubsub_topic.forms-pst.id}"
    project = "${module.project.project_id}"
    ack_deadline_seconds = 30

    push_config {
        push_endpoint = "${google_cloud_run_service.document-processor.status[0].url}"

        attributes = {
            x-goog-version = "v1"
        }

        oidc_token {
          service_account_email = "cloud-run-pubsub-invoker@${module.project.project_id}.iam.gserviceaccount.com"
        }
    }

    depends_on = [
      module.project,
      google_pubsub_topic.forms-pst,
      google_cloud_run_service.document-processor
    ]
}
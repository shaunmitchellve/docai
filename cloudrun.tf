# ---------------------------------------------------------------------------------------------
# Setup the Cloud Run service. A default "hello world" container is deployed in order to create the service so that we can attach the proper invocation roles.
# The gcloud builds submit command (after terraform apply), will push and update the Cloud Run revision to the proper application
# ---------------------------------------------------------------------------------------------

resource "google_cloud_run_service" "document-processor" {
    project = "${module.project.project_id}"
    name = "document-processor"
    location = "${var.region}"

    template {
        spec {
            containers {
                image = "us-docker.pkg.dev/cloudrun/container/hello"
            }
        }
    }

    traffic {
        percent = 100
        latest_revision = true
    }

    depends_on = [
      module.project
    ]

    lifecycle {
      ignore_changes = [
          template
      ]
    }
}

resource "google_cloud_run_service_iam_binding" "document-processor-iam" {
    project = "${module.project.project_id}"
    location = "${google_cloud_run_service.document-processor.location}"
    service = "${google_cloud_run_service.document-processor.name}"
    role = "roles/run.invoker"
    members = [
        "serviceAccount:cloud-run-pubsub-invoker@${module.project.project_id}.iam.gserviceaccount.com"
    ]
    depends_on = [
      google_cloud_run_service.document-processor
    ]
}
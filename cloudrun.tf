# ---------------------------------------------------------------------------------------------
# Setup the Cloud Run service. A default "hello world" container is deployed in order to create the service so that we can attach the proper invocation roles.
# The gcloud builds submit command (after terraform apply), will push and update the Cloud Run revision to the proper application
# ---------------------------------------------------------------------------------------------

# ----------------------------------------------------------------
# Document Processor Service - START
# ----------------------------------------------------------------
resource "google_cloud_run_service" "document-processor" {
    project = "${module.project.project_id}"
    name = "document-processor"
    location = "${var.region}"

    template {
        spec {
            service_account_name = "${google_service_account.fileprocessor-cloudrun.email}"
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
      module.project,
      google_service_account.fileprocessor-cloudrun
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
        "serviceAccount:${google_service_account.cloud-run-pubsub-invoker.email}"
    ]

    depends_on = [
      google_cloud_run_service.document-processor,
      google_service_account.cloud-run-pubsub-invoker
    ]
}
# ----------------------------------------------------------------
# Document Processor Service - END
# ----------------------------------------------------------------

# ----------------------------------------------------------------
# Convert PDF Service - START
# ----------------------------------------------------------------
resource "google_cloud_run_service" "convert-pdf" {
    project = "${module.project.project_id}"
    name = "convert-pdf"
    location = "${var.region}"

    template {
        spec {
            service_account_name = "${google_service_account.pdfconvert-cloudrun.email}"
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
      module.project,
      google_service_account.pdfconvert-cloudrun
    ]

    lifecycle {
      ignore_changes = [
          template
      ]
    }
}

resource "google_cloud_run_service_iam_binding" "convert-pdf-iam" {
    project = "${module.project.project_id}"
    location = "${google_cloud_run_service.convert-pdf.location}"
    service = "${google_cloud_run_service.convert-pdf.name}"
    role = "roles/run.invoker"
    members = [
        "serviceAccount:${google_service_account.fileprocessor-cloudrun.email}"
    ]
    
    depends_on = [
      google_cloud_run_service.document-processor,
      google_service_account.fileprocessor-cloudrun
    ]
}
# ----------------------------------------------------------------
# Convert PDF Service - END
# ----------------------------------------------------------------

# ----------------------------------------------------------------
# Front End Service - START
# ----------------------------------------------------------------
resource "google_cloud_run_service" "frontend" {
    project = "${module.project.project_id}"
    name = "frontend"
    location = "${var.region}"

    template {
        spec {
            service_account_name = "${google_service_account.frontend-cloudrun.email}"
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
      module.project,
      google_service_account.frontend-cloudrun
    ]

    lifecycle {
      ignore_changes = [
          template
      ]
    }
}

 resource "google_cloud_run_service_iam_binding" "frontend-iam" {
   project = "${module.project.project_id}"
   location = "${google_cloud_run_service.frontend.location}"
    service = "${google_cloud_run_service.frontend.name}"
    role = "roles/run.invoker"
    members = [
        "allUsers"
    ]

    depends_on = [
      google_cloud_run_service.frontend
    ]
}
# ----------------------------------------------------------------
# Front End Service - END
# ----------------------------------------------------------------

# ----------------------------------------------------------------
# Upload Service - START
# ----------------------------------------------------------------
resource "google_cloud_run_service" "upload" {
    project = "${module.project.project_id}"
    name = "upload"
    location = "${var.region}"

    template {
        spec {
            service_account_name = "${google_service_account.upload-cloudrun.email}"
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
      module.project,
      google_service_account.upload-cloudrun
    ]

    lifecycle {
      ignore_changes = [
          template
      ]
    }
}

resource "google_cloud_run_service_iam_binding" "upload-iam" {
    project = "${module.project.project_id}"
    location = "${google_cloud_run_service.upload.location}"
    service = "${google_cloud_run_service.upload.name}"
    role = "roles/run.invoker"
    members = [
        "serviceAccount:${google_service_account.frontend-cloudrun.email}"
    ]

    depends_on = [
      google_cloud_run_service.document-processor,
      google_service_account.frontend-cloudrun
    ]
}
# ----------------------------------------------------------------
# Upload Service - END
# ----------------------------------------------------------------

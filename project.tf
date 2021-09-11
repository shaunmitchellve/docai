# --------------------------------------------------------------------------------------------------------------------------------------------------
# Create the Google Cloud project and setup the relevant IAM roles for default service accounts and create a new SA for PubSub Cloud Run invocation
# --------------------------------------------------------------------------------------------------------------------------------------------------

module "project" {
    source  = "terraform-google-modules/project-factory/google"
    version = "11.1.1"
    name = "${var.project_name}"
    random_project_id = true
    org_id = local.parent_type == "organizations" ? local.parent_id : ""
    folder_id = local.parent_type == "folders" ? local.parent_id : ""
    billing_account = var.billing_account
    default_service_account = "keep"
    activate_apis = [
        "storage-component.googleapis.com",
        "documentai.googleapis.com",
        "cloudbuild.googleapis.com",
        "run.googleapis.com",
        "pubsub.googleapis.com",
        "artifactregistry.googleapis.com",
        "bigquery.googleapis.com",
        "cloudfunctions.googleapis.com"
    ]
}

resource "google_project_iam_binding" "cloud_build_run_admin" {
    project = "${module.project.project_id}"
    role = "roles/run.admin"

    members = [
        "serviceAccount:${module.project.project_number}@cloudbuild.gserviceaccount.com"
    ]

    depends_on = [
      module.project
    ]
}

resource "google_project_iam_binding" "cloud_build_sa_user" {
    project = "${module.project.project_id}"
    role = "roles/iam.serviceAccountUser"

    members = [
        "serviceAccount:${module.project.project_number}@cloudbuild.gserviceaccount.com"
    ]

    depends_on = [
      module.project
    ]
}

resource "google_project_iam_binding" "service-account-token-creator" {
    project = "${module.project.project_id}"
    role = "roles/iam.serviceAccountTokenCreator"

    members = [
        "serviceAccount:service-${module.project.project_number}@gcp-sa-pubsub.iam.gserviceaccount.com"
    ]

    depends_on = [
      module.project
    ]
}

resource "google_project_iam_binding" "default-compute-docai-apiuser" {
    project = "${module.project.project_id}"
    role = "roles/documentai.apiUser"

    members = [
        "serviceAccount:${module.project.project_number}-compute@developer.gserviceaccount.com"
    ]

    depends_on = [
      module.project
    ]
}

resource "google_project_iam_binding" "default-compute-bigquery-editor" {
    project = "${module.project.project_id}"
    role = "roles/bigquery.dataEditor"

    members = [
        "serviceAccount:${module.project.project_number}-compute@developer.gserviceaccount.com"
    ]

    depends_on = [
      module.project
    ]
}

resource "google_service_account" "cloud-run-pubsub-invoker" {
    project = "${module.project.project_id}"
    account_id = "cloud-run-pubsub-invoker"
    display_name = "Cloud Run Pub/Sub Invoker"
    depends_on = [
      module.project
    ]
}
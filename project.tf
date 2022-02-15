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


# ----------------------------------------------------------------
# Default Service Account Role Assignments - START
# ----------------------------------------------------------------
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
# ----------------------------------------------------------------
# Default Service Account Role Assignments - END
# ----------------------------------------------------------------

# ----------------------------------------------------------------
# Service Accounts Creation - START
# ----------------------------------------------------------------
resource "google_service_account" "cloud-run-pubsub-invoker" {
    project = "${module.project.project_id}"
    account_id = "cloud-run-pubsub-invoker"
    display_name = "Cloud Run Pub/Sub Invoker"
    depends_on = [
      module.project
    ]
}

resource "google_service_account" "fileprocessor-cloudrun" {
    project = "${module.project.project_id}"
    account_id = "fileprocessor-service"
    display_name = "File Processor Service"
    description = "Cloud Run SA for the file processor service"
    depends_on = [
      module.project
    ]
}

resource "google_service_account" "pdfconvert-cloudrun" {
    project = "${module.project.project_id}"
    account_id = "pdfconvert-service"
    display_name = "Convert PDF Service"
    description = "Cloud Run SA for the PDF Convert Service"
    depends_on = [
      module.project
    ]
}

resource "google_service_account" "upload-cloudrun" {
    project = "${module.project.project_id}"
    account_id = "upload-service"
    display_name = "Upload Service"
    description = "Cloud Run SA for the Upload Service"
    depends_on = [
      module.project
    ]
}

resource "google_service_account" "frontend-cloudrun" {
    project = "${module.project.project_id}"
    account_id = "frontend-service"
    display_name = "Front End Service"
    description = "Cloud Run SA for the Front End Service"
    depends_on = [
      module.project
    ]
}

resource "google_service_account" "dobby-cloudrun" {
    project = "${module.project.project_id}"
    account_id = "dobby-service"
    display_name = "Dobby (DB) Service"
    description = "Cloud Run SA for the Dobby (DB) Service"
    depends_on = [
      module.project
    ]
}
# ----------------------------------------------------------------
# Service Account Creation - End
# ----------------------------------------------------------------

# ----------------------------------------------------------------
# Service Account Policy Bindings - START
# ----------------------------------------------------------------
resource "google_project_iam_binding" "fileprocessor-docai-apiuser" {
    project = "${module.project.project_id}"
    role = "roles/documentai.apiUser"

    members = [
        "serviceAccount:${google_service_account.fileprocessor-cloudrun.email}"
    ]

    depends_on = [
      module.project,
      google_service_account.fileprocessor-cloudrun
    ]
}
# ----------------------------------------------------------------
# Service Account Policy Bindings - END
# ----------------------------------------------------------------

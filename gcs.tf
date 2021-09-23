# ---------------------------------------------------------------------------------------------
# Setup Cloud Storage for dropping files and adding notification to pub/sub
# ---------------------------------------------------------------------------------------------

resource "google_storage_bucket" "forms_repo" {
    project = "${module.project.project_id}"
    name = "${var.storage_bucket_name}"
    location = "${var.region}"
    uniform_bucket_level_access = true
    force_destroy = true

    depends_on = [
      module.project
    ]
}

resource "google_storage_bucket_iam_binding" "read_access" {
    bucket = "${google_storage_bucket.forms_repo.name}"
    role = "roles/storage.objectViewer"

    members = [
        "serviceAccount:${google_service_account.fileprocessor-cloudrun.email}"
    ]

    depends_on = [
      google_storage_bucket.forms_repo,
      google_service_account.fileprocessor-cloudrun
    ]
}


resource "google_storage_bucket_iam_binding" "write_access" {
    bucket = "${google_storage_bucket.forms_repo.name}"
    role = "roles/storage.admin"

    members = [
        "serviceAccount:${google_service_account.upload-cloudrun.email}"
    ]

    depends_on = [
      google_storage_bucket.forms_repo,
      google_service_account.upload-cloudrun
    ]
}

data "google_storage_project_service_account" "gcs_account" {
    project = "${module.project.project_id}"

    depends_on = [
      google_storage_bucket.forms_repo
    ]
}

# ---------------------------------------------------------------------------------------------
# NOTE: The Pub/Sub topic needs to exist first before the notifiction can be added
# ---------------------------------------------------------------------------------------------
resource "google_storage_notification" "notification" {
    bucket = google_storage_bucket.forms_repo.name
    payload_format = "JSON_API_V1"
    topic = google_pubsub_topic.forms-pst.id
    event_types = ["OBJECT_FINALIZE"]
    depends_on = [
      google_storage_bucket.forms_repo,
      google_pubsub_topic_iam_binding.binding
    ]    
}
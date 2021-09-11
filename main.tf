provider "google" {
    region = "${var.region}"
}

provider "google-beta" {}

locals {
    parent_type = split("/", var.parent)[0]
    parent_id = split("/", var.parent)[1]
}

#
# Single resources like Artifact Repo, BigQuery and Document AI setup is done below. The other GCP resources are setup in the
# related .tf files due to having more setup requirements.
#
resource "google_artifact_registry_repository" "docai-demo-repo" {
    provider = google-beta

    project = "${module.project.project_id}"
    location = "${var.artifact_repo_location}"
    repository_id = "${var.artifact_repo_name}"
    format = "DOCKER"

    depends_on = [
      module.project
    ]
}

#
# An external Nodejs project is being called in order to setup Document AI forms processor. This is due to the fact that the management API's are not in V1 yet
# and therefore no TF modules exist
#
data "external" "enable_doc_ai" {
    program = ["bash", "-c", <<EOT
    (npm install && gcloud config set project ${module.project.project_id}) > /dev/null 2>&1 && export PROJECT_ID=${module.project.project_id}&& node DocAi-Setup.js
    EOT
    ]
    working_dir = "${path.module}/dai_setup"

    depends_on = [
      module.project
    ]
}
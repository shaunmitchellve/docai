# --------------------------------
# REQUIRED VARIABLES -- Start
# --------------------------------
variable "project_name" {
    type = string
    description = "The name of the project that will be created for the Doc AI Demo"
}

variable "storage_bucket_name" {
    type = string
    description = "The name of the storage bucket that forms will be uploaded to and processed from. This needs to be globally unique!!!!"
}

variable "parent" {
    type = string
    description = "The organization ID or folder ID that the project will be created under. Must be in the format of organizations/org_id or folders_folder_id"
    validation {
      condition = can(regex("^organizations|folders/\\d+$", var.parent))
      error_message = "The parent value must be in the format of: organizations/org_id or folders/folder_id."
    }
}

variable "billing_account" {
    type = string
    description = "The billing account ID (BID) that will be attached to the project."
}
# --------------------------------
# REQUIRED VARIABLES -- End
# --------------------------------


# --------------------------------
# OPTIONAL VARIABLES -- Start
# --------------------------------
variable "region" {
    type = string
    description = "The region to create most resources in"
    default = "us-west1"
}

variable "bigquery_table" {
    type = string
    description = "The bigquery table to store the extracted form entities. Current value is hardcoded @TODO FIX ME"
    default = "document_entities"
}

variable "bigquery_dataset" {
    type = string
    description = "The bigquery dataset name"
    default = "doc_ai_demo"
}

variable "artifact_repo_location" {
    type = string
    description = "The location of the Artifact Repository. Defaults to us-west1"
    default = "us-west1"
}

variable "artifact_repo_name" {
    type = string
    description = "The name of the Artifact Repository. Defaults to doc-ai-demo-repo"
    default = "doc-ai-demo-repo"
}

variable "forms-pst"{
    type = string
    description = "The Pub/Sub topic name where new form uploads will be registered"
    default = "doc-ai-forms-pst"
}
# --------------------------------
# OPTIONAL VARIABLES -- End
# --------------------------------
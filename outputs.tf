output "project_id" {
    value = "${module.project.project_id}"
}

output "region" {
    value = "${var.region}"
}

output "doc_ai_processor_id" {
    value = "${data.external.enable_doc_ai.result.processorId}"
}

output "artifcat_repo_name" {
    value = "${var.artifact_repo_name}"
}

output "dataset" {
    value = "${var.bigquery_dataset}"
}
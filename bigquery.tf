# ---------------------------------------------------------------------------------------------
# Setup BigQuery tables to store document data.
# ---------------------------------------------------------------------------------------------
module "bigquery" {
    source = "terraform-google-modules/bigquery/google"
    version = "~> 5.2.0"

    project_id = module.project.project_id
    dataset_id = "${var.bigquery_dataset}"

    tables = [
        {
            table_id = "${var.bigquery_table}"
            schema = file("src/fileprocessorservice/sql/document_entities.json")
            time_partitioning = null
            expiration_time = null
            labels = null
            range_partitioning = null
            clustering = null
        },
        {
            table_id = "lartp_docs"
            schema = file("src/fileprocessorservice/sql/lap_doc.json")
            time_partitioning = null
            expiration_time = null
            labels = null
            range_partitioning = null
            clustering = null
        }
    ]

    depends_on = [
      module.project
    ]   
}

resource "google_project_iam_binding" "fileprocessor-bigquery-editor" {
    project = "${module.project.project_id}"
    role = "roles/bigquery.dataEditor"

    members = [
        "serviceAccount:${google_service_account.fileprocessor-cloudrun.email}"
    ]

    depends_on = [
      module.project,
      google_service_account.fileprocessor-cloudrun
    ]
}
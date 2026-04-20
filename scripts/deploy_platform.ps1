# Crowza Platform Deployment Script
# This script automates the deployment of the Backend and Organizer Web to Cloud Run.

$PROJECT_ID = Read-Host "Please enter your GCP Project ID (e.g., venue-project or crowza)"

Write-Host "--- Step 1: Deploying Backend (API Gateway) ---" -ForegroundColor Cyan
gcloud builds submit --config apps/backend/cloudbuild.yaml --project $PROJECT_ID .

# Try to get the backend URL automatically
Write-Host "Fetching Backend Service URL..." -ForegroundColor Yellow
$BACKEND_URL = gcloud run services describe venue-backend --platform managed --region us-central1 --project $PROJECT_ID --format 'value(status.url)'

if (-not $BACKEND_URL) {
    $BACKEND_URL = Read-Host "Could not fetch URL automatically. Please enter the Backend Service URL"
}

Write-Host "Backend URL: $BACKEND_URL" -ForegroundColor Green

Write-Host "--- Step 2: Deploying Organizer Web (Frontend) ---" -ForegroundColor Cyan
gcloud builds submit --config apps/organizer-web/cloudbuild.yaml `
    --substitutions=_VITE_API_URL="$BACKEND_URL/api" `
    --project $PROJECT_ID .

Write-Host "--- Deployment Complete! ---" -ForegroundColor Green
$FRONTEND_URL = gcloud run services describe venue-organizer-web --platform managed --region us-central1 --project $PROJECT_ID --format 'value(status.url)'
Write-Host "Your Dashboard is live at: $FRONTEND_URL" -ForegroundColor Green

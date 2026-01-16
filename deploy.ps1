# PowerShell deployment script
# Equivalent of deploy.sh for Windows/PowerShell

# Exit on any error
$ErrorActionPreference = "Stop"

Write-Host "Starting deployment..." -ForegroundColor Green

try {
    # Navigate to app directory
    Set-Location "D:\medvarsity\medai\cms-frontend"  # Adjust path for Windows

    # Pull latest changes
    Write-Host "Pulling latest changes from Git..." -ForegroundColor Yellow
    git pull origin main  # or your main branch name

    # Stop existing container
    Write-Host "Stopping existing container..." -ForegroundColor Yellow
    try {
        docker stop cms-ui-app
        docker rm cms-ui-app
    }
    catch {
        Write-Host "Container cms-ui-app was not running" -ForegroundColor Yellow
    }

    # Remove old image
    Write-Host "Removing old image..." -ForegroundColor Yellow
    try {
        docker rmi cms-ui
    }
    catch {
        Write-Host "Image cms-ui not found" -ForegroundColor Yellow
    }

    # Build new image
    Write-Host "Building new Docker image..." -ForegroundColor Yellow
    docker build -t cms-ui .

    # Run new container
    Write-Host "Starting new container..." -ForegroundColor Yellow
    docker run -d `
        --name cms-ui-app `
        --restart unless-stopped `
        -p 4000:4000 `
        cms-ui

    # Wait for container to be ready
    Write-Host "Waiting for container to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10

    # Check if container is running
    $containerRunning = docker ps --filter "name=cms-ui-app" --format "{{.Names}}" | Select-String "cms-ui-app"

    if ($containerRunning) {
        Write-Host "Deployment successful!" -ForegroundColor Green
        Write-Host "Application is running at: http://localhost:4000" -ForegroundColor Green
    }
    else {
        Write-Host "Deployment failed!" -ForegroundColor Red
        docker logs cms-ui-app
        exit 1
    }
}
catch {
    Write-Host "Deployment failed with error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Stack trace: $($_.ScriptStackTrace)" -ForegroundColor Red
    exit 1
}
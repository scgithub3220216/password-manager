# Build
npm run build

# Get version from package.json
$versionOutput = & node -p "require('./package.json').version" 2>&1
$version = $versionOutput.Trim()

Write-Host "Version: $version" -ForegroundColor Green

# Upload to server (exclude win-unpacked folder)
$releaseDir = "release\$version"

# Get files to upload
$null = Get-ChildItem -Path $releaseDir
$files = Get-ChildItem -Path $releaseDir | Where-Object { $_.Name -ne "win-unpacked" }

foreach ($file in $files) {
    Write-Host "Uploading: $($file.Name)" -ForegroundColor Cyan
    scp -r $file.FullName root@47.98.114.76:/data/nginx/html/passwordManager/
}

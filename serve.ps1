# IVAS Closet - Local Dev Server (Pure PowerShell, no dependencies)
# Usage: .\serve.ps1   or double-click

$port = 3000
$root = $PSScriptRoot
if (-not $root) { $root = Split-Path -Parent $MyInvocation.MyCommand.Path }

$mime = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".json" = "application/json"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".webp" = "image/webp"
  ".svg"  = "image/svg+xml"
  ".ico"  = "image/x-icon"
  ".woff2"= "font/woff2"
  ".woff" = "font/woff"
  ".ttf"  = "font/ttf"
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host ""
Write-Host "  ================================================" -ForegroundColor Cyan
Write-Host "  🛍  IVAS Closet - Dev Server Running" -ForegroundColor White
Write-Host "  ================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Local:   http://localhost:$port" -ForegroundColor Green
Write-Host "  Shop:    http://localhost:$port/shop.html" -ForegroundColor Green
Write-Host "  Admin:   http://localhost:$port/admin.html" -ForegroundColor Green
Write-Host "  Login:   http://localhost:$port/login.html" -ForegroundColor Green
Write-Host ""
Write-Host "  Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "  ================================================" -ForegroundColor Cyan
Write-Host ""

# Auto-open browser
Start-Process "http://localhost:$port/index.html"

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $res = $ctx.Response

    $urlPath = $req.Url.LocalPath
    if ($urlPath -eq "/" -or $urlPath -eq "") { $urlPath = "/index.html" }

    $filePath = Join-Path $root ($urlPath.TrimStart("/").Replace("/", [System.IO.Path]::DirectorySeparatorChar))

    Write-Host "  $(Get-Date -Format 'HH:mm:ss')  $($req.HttpMethod) $urlPath" -ForegroundColor DarkGray

    if (Test-Path $filePath -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
      $contentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { "application/octet-stream" }
      $bytes = [System.IO.File]::ReadAllBytes($filePath)
      $res.ContentType = $contentType
      $res.ContentLength64 = $bytes.Length
      $res.StatusCode = 200
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $body = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 Not Found</h1><p>$urlPath</p>")
      $res.StatusCode = 404
      $res.ContentType = "text/html"
      $res.ContentLength64 = $body.Length
      $res.OutputStream.Write($body, 0, $body.Length)
    }

    $res.OutputStream.Close()
  }
} finally {
  $listener.Stop()
  Write-Host "`n  Server stopped." -ForegroundColor Yellow
}

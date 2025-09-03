param(
  [int]$Port = 8000
)

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')

Write-Host "Starting static server at $repoRoot on port $Port..."

$proc = Start-Process -FilePath python -ArgumentList @('-m','http.server',"$Port") -WorkingDirectory $repoRoot -PassThru

Start-Sleep -Milliseconds 600

try {
  if (Get-Command Get-NetTCPConnection -ErrorAction SilentlyContinue) {
    $listening = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    if ($listening) {
      Write-Output "Server running on http://localhost:$Port (PID: $($proc.Id))"
    } else {
      Write-Output "Process started (PID: $($proc.Id)), but port not yet listening. Try http://localhost:$Port"
    }
  } else {
    Write-Output "Process started (PID: $($proc.Id)). Open http://localhost:$Port"
  }
}
catch {
  Write-Warning "Could not verify port state. Process PID: $($proc.Id)"
  Write-Output "Open http://localhost:$Port"
}


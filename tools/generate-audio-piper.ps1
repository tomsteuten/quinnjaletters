param(
  [string]$PiperExe = "",
  [string]$ModelPath = "",
  [string]$ManifestPath = (Join-Path $PSScriptRoot "piper-trial-manifest.json"),
  [string]$OutputDir = (Join-Path (Split-Path $PSScriptRoot -Parent) "assets\\audio\\piper-trial"),
  [ValidateSet("mp3", "wav")][string]$Format = "mp3",
  [string]$FfmpegExe = "",
  [double]$LengthScale = 0.94,
  [double]$NoiseScale = 0.55,
  [double]$NoiseW = 0.8,
  [double]$SentenceSilence = 0.12,
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"

function Resolve-Executable {
  param(
    [string]$PreferredPath,
    [string[]]$Fallbacks
  )

  if ($PreferredPath) {
    if (Test-Path -LiteralPath $PreferredPath) {
      return (Resolve-Path -LiteralPath $PreferredPath).Path
    }
    throw "Executable not found: $PreferredPath"
  }

  foreach ($candidate in $Fallbacks) {
    if (-not $candidate) {
      continue
    }

    if (Test-Path -LiteralPath $candidate) {
      return (Resolve-Path -LiteralPath $candidate).Path
    }

    $command = Get-Command $candidate -ErrorAction SilentlyContinue
    if ($command) {
      return $command.Source
    }
  }

  return $null
}

$projectRoot = Split-Path $PSScriptRoot -Parent
$bundledFfmpeg = Join-Path $projectRoot "tools\\ffmpeg\\ffmpeg.exe"
$localPiperExe = Join-Path $projectRoot "tools\\piper\\piper.exe"
$nestedPiperExe = Join-Path $projectRoot "tools\\piper\\piper\\piper.exe"
$localModelPath = Join-Path $projectRoot "tools\\piper\\en_US-lessac-medium.onnx"

if (-not $PiperExe -and $env:PIPER_EXE) {
  $PiperExe = $env:PIPER_EXE
}

if (-not $ModelPath -and $env:PIPER_MODEL) {
  $ModelPath = $env:PIPER_MODEL
}

if (-not $ModelPath -and (Test-Path -LiteralPath $localModelPath)) {
  $ModelPath = $localModelPath
}

$piperPath = Resolve-Executable -PreferredPath $PiperExe -Fallbacks @($localPiperExe, $nestedPiperExe, "piper.exe", "piper")

if (-not $piperPath) {
  throw "Piper was not found. Pass -PiperExe or set PIPER_EXE."
}

if (-not $ModelPath) {
  throw "ModelPath is required. Pass -ModelPath or set PIPER_MODEL."
}

if (-not (Test-Path -LiteralPath $ModelPath)) {
  throw "Piper model not found: $ModelPath"
}

if (-not (Test-Path -LiteralPath $ManifestPath)) {
  throw "Manifest not found: $ManifestPath"
}

$ffmpegPath = $null
if ($Format -eq "mp3") {
  $ffmpegPath = Resolve-Executable -PreferredPath $FfmpegExe -Fallbacks @($bundledFfmpeg, "ffmpeg.exe", "ffmpeg")
  if (-not $ffmpegPath) {
    throw "FFmpeg is required for MP3 output. Pass -FfmpegExe or use -Format wav."
  }
}

$manifest = Get-Content -LiteralPath $ManifestPath -Raw | ConvertFrom-Json
if (-not $manifest -or $manifest.Count -eq 0) {
  throw "Manifest is empty: $ManifestPath"
}

New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null

Write-Host ""
Write-Host "Piper trial generation"
Write-Host "Piper:  $piperPath"
Write-Host "Model:  $ModelPath"
Write-Host "Output: $OutputDir"
Write-Host "Format: $Format"
Write-Host "Items:  $($manifest.Count)"

if ($DryRun) {
  Write-Host ""
  Write-Host "Dry run only. No files will be generated."
}

foreach ($entry in $manifest) {
  if (-not $entry.file -or -not $entry.text) {
    throw "Each manifest entry must have 'file' and 'text'."
  }

  $targetPath = Join-Path $OutputDir $entry.file
  $wavPath = if ($Format -eq "wav") {
    $targetPath
  } else {
    [System.IO.Path]::ChangeExtension($targetPath, ".wav")
  }

  Write-Host ("- " + $entry.file + " <= " + $entry.text)

  if ($DryRun) {
    continue
  }

  $entry.text | & $piperPath `
    --model $ModelPath `
    --output_file $wavPath `
    --length_scale $LengthScale `
    --noise_scale $NoiseScale `
    --noise_w $NoiseW `
    --sentence_silence $SentenceSilence

  if ($LASTEXITCODE -ne 0) {
    throw "Piper failed for $($entry.file)"
  }

  if ($Format -eq "mp3") {
    & $ffmpegPath -y -loglevel error -i $wavPath -codec:a libmp3lame -q:a 4 $targetPath
    if ($LASTEXITCODE -ne 0) {
      throw "FFmpeg failed for $($entry.file)"
    }
    Remove-Item -LiteralPath $wavPath -Force
  }
}

Write-Host ""
Write-Host "Done."

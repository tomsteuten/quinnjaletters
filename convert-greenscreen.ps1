$ErrorActionPreference = 'Stop'

# --- Configuration ---
# Adjust these if the green isn't fully removed or Quinnja is getting clipped:
#   $keyColor    = the hex color of your green background (sample it in any image editor)
#   $similarity  = how close a pixel must be to the key color to be removed (0.0-1.0, higher = more aggressive)
#   $blend       = feather/softness at the edges (0.0-1.0, higher = softer edges)
$keyColor   = '#98B176'   # Dark green from deevid AI — tweak if your green differs
$similarity = 0.1
$blend      = 0.08

# --- Setup portable ffmpeg ---
$root       = Split-Path -Parent $MyInvocation.MyCommand.Path
$toolsDir   = Join-Path $root 'tools'
$ffmpegDir  = Join-Path $toolsDir 'ffmpeg'
$zipPath    = Join-Path $toolsDir 'ffmpeg-release-essentials.zip'

New-Item -ItemType Directory -Force -Path $toolsDir | Out-Null
New-Item -ItemType Directory -Force -Path $ffmpegDir | Out-Null

$ffmpegExe  = Join-Path $ffmpegDir 'ffmpeg.exe'
$ffprobeExe = Join-Path $ffmpegDir 'ffprobe.exe'

if (-not (Test-Path $ffmpegExe)) {
  Write-Host 'Downloading portable FFmpeg (first run only)...'
  $url = 'https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip'
  Invoke-WebRequest -Uri $url -OutFile $zipPath

  Write-Host 'Extracting FFmpeg...'
  $extractDir = Join-Path $toolsDir 'ffmpeg-extract'
  if (Test-Path $extractDir) { Remove-Item -Recurse -Force $extractDir }
  Expand-Archive -Path $zipPath -DestinationPath $extractDir -Force

  $binDir = Get-ChildItem -Path $extractDir -Directory | Select-Object -First 1
  if (-not $binDir) { throw 'Could not locate extracted FFmpeg folder.' }

  Copy-Item -Path (Join-Path $binDir.FullName 'bin\ffmpeg.exe')  -Destination $ffmpegExe  -Force
  Copy-Item -Path (Join-Path $binDir.FullName 'bin\ffprobe.exe') -Destination $ffprobeExe -Force

  # Clean up zip and extracted folder to save space
  Remove-Item -Path $zipPath -Force -ErrorAction SilentlyContinue
  Remove-Item -Path $extractDir -Recurse -Force -ErrorAction SilentlyContinue
  Write-Host 'FFmpeg ready.'
}

# --- Resolve input file ---
if ($args.Count -ge 1) {
  $inputFile = $args[0]
} else {
  # Default fallback - change this to your current clip
  $inputFile = Join-Path $root 'assets\quinnjawaving.mp4'
}

if (-not (Test-Path $inputFile)) {
  throw "Input file not found: $inputFile"
}

$baseName   = [System.IO.Path]::GetFileNameWithoutExtension($inputFile)
$outputDir  = Join-Path $root 'assets\processed'
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

$webmOut    = Join-Path $outputDir "${baseName}_transparent.webm"
$previewOut = Join-Path $outputDir "${baseName}_preview.mp4"

# --- Step 1: Create transparent WebM (VP9 with alpha) ---
Write-Host ''
Write-Host "Processing: $inputFile"
Write-Host "Key color: $keyColor | Similarity: $similarity | Blend: $blend"
Write-Host ''
Write-Host 'Creating transparent WebM...'
& $ffmpegExe -y -i $inputFile `
  -vf "colorkey=${keyColor}:${similarity}:${blend},format=yuva420p" `
  -c:v libvpx-vp9 -b:v 0 -crf 30 -auto-alt-ref 0 -an `
  $webmOut

# --- Step 2: Create checkerboard preview (so you can visually verify) ---
Write-Host 'Creating checkerboard preview...'
& $ffmpegExe -y -i $inputFile `
  -filter_complex "[0:v]colorkey=${keyColor}:${similarity}:${blend}[fg];color=c=white:s=640x640:d=60[bg1];color=c=lightgray:s=640x640:d=60[bg2];[bg1][bg2]blend=all_expr='if(gte(mod(X,40),20)*gte(mod(Y,40),20)+lt(mod(X,40),20)*lt(mod(Y,40),20),A,B)'[chk];[chk][fg]overlay=(W-w)/2:(H-h)/2:format=auto" `
  -c:v libx264 -pix_fmt yuv420p -an `
  $previewOut

Write-Host ''
Write-Host '--- Done ---'
Write-Host "Transparent WebM: $webmOut"
Write-Host "Preview MP4:      $previewOut"
Write-Host ''
Write-Host 'Tuning tips:'
Write-Host '  Green fringe remaining?  -> Raise similarity (e.g. 0.35) or adjust keyColor'
Write-Host '  Quinnja getting erased?  -> Lower similarity (e.g. 0.25) or lower blend'
Write-Host '  Wrong shade of green?    -> Open a frame in Paint, use color picker, update keyColor'
Write-Host ''
Write-Host 'Usage: .\convert-greenscreen.ps1 [path-to-mp4]'
Write-Host 'Example: .\convert-greenscreen.ps1 .\assets\quinnjadancing.mp4'

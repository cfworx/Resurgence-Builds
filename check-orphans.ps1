$imgDir = "public\images"
$webpFiles = Get-ChildItem -Recurse -File -Path $imgDir -Filter "*.webp" | Where-Object { $_.FullName -notmatch '\\map\\' }
$webpBasenames = $webpFiles | ForEach-Object { [System.IO.Path]::GetFileNameWithoutExtension($_.Name) }

$originals = Get-ChildItem -Recurse -File -Path $imgDir -Include "*.png","*.jpg","*.jpeg" | Where-Object { $_.FullName -notmatch '\\map\\' }

foreach ($f in $originals) {
    $base = [System.IO.Path]::GetFileNameWithoutExtension($f.Name)
    $hasWebp = $webpBasenames -contains $base
    $rel = $f.FullName.Substring((Resolve-Path $imgDir).Path.Length + 1)
    Write-Output "$rel|hasWebp=$hasWebp|$($f.Length)"
}

Add-Type -AssemblyName System.Drawing
$src = [System.Drawing.Image]::FromFile("C:\Users\cfwor\.gemini\antigravity\brain\e86fef7e-2d80-4295-8844-04b1ac5b82a8\resurgence_banner_1779551737551.png")
$bmp = New-Object System.Drawing.Bitmap(2048, 1152)
$graphics = [System.Drawing.Graphics]::FromImage($bmp)
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.DrawImage($src, 0, -448, 2048, 2048)
$graphics.Dispose()
$bmp.Save("C:\Users\cfwor\.gemini\antigravity\brain\e86fef7e-2d80-4295-8844-04b1ac5b82a8\resurgence_youtube_banner.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$src.Dispose()

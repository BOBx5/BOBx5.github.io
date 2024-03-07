$maxNum = 1;
for ($i = 1; $i -lt $maxNum+1; $i++) {
    # Exectue ImageMagick convert to webp => convert "$i.jpg" "$i.webp"
    Write-Host "Converting '$i.png' to '$i.webp'"
    & convert "$i.png" "$i.webp"
}
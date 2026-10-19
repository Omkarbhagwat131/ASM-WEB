
from pathlib import Path
from PIL import Image

image_dir = Path("image")
output_dir = image_dir / "optimized"
output_dir.mkdir(exist_ok=True)

files = [
    "Dhananjay sir.png",
    "Ketan sir.png",
    "jyoti mam1.jpeg",
    "sakshi mam.jpeg",
]

for filename in files:
    source = image_dir / filename
    destination = output_dir / f"{source.stem}.webp"

    with Image.open(source) as img:
        img.thumbnail((600, 600))
        if img.mode not in ("RGB", "RGBA"):
            img = img.convert("RGB")
        img.save(destination, "WEBP", quality=82, method=6)

    original_kb = source.stat().st_size / 1024
    optimized_kb = destination.stat().st_size / 1024

    print(
        f"{filename}: {original_kb:.1f} KB -> "
        f"{destination.name}: {optimized_kb:.1f} KB"
    )

import numpy as np
from PIL import Image, ImageFilter
import os

W, H = 1400, 900
SW, SH = 700, 450
rng = np.random.default_rng(11)


def octave(cells, w=SW, h=SH):
    small = rng.random((max(2, int(cells * h / w)), max(2, cells)))
    img = Image.fromarray((small * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
    return np.asarray(img, dtype=np.float32) / 255.0


height = np.zeros((SH, SW), dtype=np.float32)
for cells, amp in [(3, 1.0), (6, 0.55), (12, 0.3), (24, 0.16), (48, 0.09)]:
    height += amp * octave(cells)

crease = 1.0 - np.abs(2.0 * octave(14) - 1.0)
height += 0.4 * (crease ** 3)

height = (height - height.min()) / (height.max() - height.min())

gy, gx = np.gradient(height)
shade = 0.5 + (gx * -0.72 + gy * -0.69) * 42.0
shade = np.clip(shade, 0.0, 1.0)

out = np.clip((shade - 0.5) * 1.55, 0.0, 1.0) ** 1.7

img = Image.fromarray((out * 255).astype(np.uint8), mode="L")
img = img.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(0.6))

arr = np.asarray(img, dtype=np.float32) / 255.0
arr += rng.normal(0.0, 0.014, (H, W))
arr = np.clip(arr, 0.0, 1.0)

Image.fromarray((arr * 255).astype(np.uint8), mode="L").save(
    "app/public/wrinkle.webp", quality=62, method=6
)

print(f"wrinkle.webp: {os.path.getsize('app/public/wrinkle.webp') / 1024:.0f} KB")
print(f"mean={arr.mean():.3f} p95={np.percentile(arr, 95):.3f} max={arr.max():.3f}")

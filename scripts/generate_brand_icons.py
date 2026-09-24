from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
MIDNIGHT_NAVY = (11, 15, 26, 255)
ELECTRIC_BLUE = (59, 130, 246, 255)
CYAN_GLOW = (34, 211, 238, 255)
NEO_PURPLE = (139, 92, 246, 255)


def mix(left: tuple[int, ...], right: tuple[int, ...], amount: float) -> tuple[int, ...]:
    return tuple(round(a + (b - a) * amount) for a, b in zip(left, right))


def create_icon(size: int) -> Image.Image:
    scale = 4
    canvas_size = size * scale
    image = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    radius = round(canvas_size * 0.22)
    draw.rounded_rectangle(
        (0, 0, canvas_size - 1, canvas_size - 1),
        radius=radius,
        fill=MIDNIGHT_NAVY,
        outline=(148, 163, 184, 55),
        width=max(1, round(canvas_size * 0.015)),
    )

    mask = Image.new("L", (canvas_size, canvas_size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle(
        (
            round(canvas_size * 0.34),
            round(canvas_size * 0.13),
            round(canvas_size * 0.50),
            round(canvas_size * 0.76),
        ),
        radius=round(canvas_size * 0.075),
        fill=255,
    )
    mask_draw.rounded_rectangle(
        (
            round(canvas_size * 0.27),
            round(canvas_size * 0.34),
            round(canvas_size * 0.64),
            round(canvas_size * 0.47),
        ),
        radius=round(canvas_size * 0.075),
        fill=255,
    )

    if size <= 48:
        letter = Image.new("RGBA", (canvas_size, canvas_size), ELECTRIC_BLUE)
    else:
        strip = Image.new("RGBA", (canvas_size, 1))
        for x in range(canvas_size):
            strip.putpixel((x, 0), mix(CYAN_GLOW, ELECTRIC_BLUE, x / max(1, canvas_size - 1)))
        letter = strip.resize((canvas_size, canvas_size))

    image.alpha_composite(Image.composite(letter, Image.new("RGBA", image.size), mask))
    draw = ImageDraw.Draw(image)
    dot_radius = round(canvas_size * 0.07)
    dot_center = (round(canvas_size * 0.72), round(canvas_size * 0.69))
    draw.ellipse(
        (
            dot_center[0] - dot_radius,
            dot_center[1] - dot_radius,
            dot_center[0] + dot_radius,
            dot_center[1] + dot_radius,
        ),
        fill=NEO_PURPLE,
    )

    return image.resize((size, size), Image.Resampling.LANCZOS)


def main() -> None:
    PUBLIC.mkdir(parents=True, exist_ok=True)
    outputs = {
        16: "favicon-16x16.png",
        32: "favicon-32x32.png",
        48: "favicon-48x48.png",
        180: "apple-touch-icon.png",
        192: "android-chrome-192x192.png",
        512: "android-chrome-512x512.png",
    }

    for size, filename in outputs.items():
        create_icon(size).save(PUBLIC / filename, "PNG", optimize=True)

    create_icon(48).save(PUBLIC / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])


if __name__ == "__main__":
    main()

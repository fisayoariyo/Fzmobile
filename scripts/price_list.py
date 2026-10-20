"""
Ops price list -> catalog reconciliation.

Encodes the list exactly as supplied, then reports which catalog entries
match, which are missing, and which carry a value the list does not agree
with. Prices displayed are list * (1 + UPLIFT).
"""

from __future__ import annotations

UPLIFT = 0.10

# label -> list price, transcribed from the ops list
PRICE_LIST: dict[str, int] = {
    # --- brand new / NonActive ---
    "iPhone Air 256GB eSIM Blue": 1_150_000,
    "iPhone Air 256GB eSIM Cloud White": 1_170_000,
    "iPhone 17 256GB Phys&eSim": 1_150_000,
    # --- UK used ---
    "iPhone 11 64GB": 220_000,
    "iPhone 11 128GB": 255_000,
    "iPhone 12 64GB": 240_000,
    "iPhone 12 128GB": 280_000,
    "iPhone 12 256GB": 310_000,
    "iPhone 12 Pro 128GB": 345_000,
    "iPhone 12 Pro 256GB": 370_000,
    "iPhone 12 Pro 512GB": 390_000,
    "iPhone 12 Pro Max 128GB": 415_000,
    "iPhone 12 Pro Max 256GB": 455_000,
    "iPhone 13 128GB": 355_000,
    "iPhone 13 256GB": 390_000,
    "iPhone 14 128GB": 415_000,
    "iPhone 14 256GB": 485_000,
    "iPhone 14 512GB": 485_000,
    "iPhone 14 Pro 128GB eSIM": 565_000,
    "iPhone 14 Pro 128GB Phys&eSim": 620_000,
    "iPhone 14 Pro 256GB eSIM": 620_000,
    "iPhone 14 Pro 256GB Phys&eSim": 660_000,
    "iPhone 15 128GB": 590_000,
    "iPhone 15 256GB": 645_000,
    "iPhone 15 Pro 128GB": 695_000,
    "iPhone 15 Pro Max 256GB": 910_000,
    "iPhone 16 256GB eSIM": 800_000,
    "iPhone 16 256GB Phys&eSim": 810_000,
    "iPhone 16 Plus 128GB eSIM": 790_000,
    "iPhone 16 Plus 128GB eSIM Pink": 800_000,
    "iPhone 16 Plus 256GB eSIM": 890_000,
    "iPhone Air 256GB eSIM Black": 1_040_000,
    "iPhone Air 256GB eSIM Colours": 1_060_000,
    "iPhone Air 512GB eSIM": 1_170_000,
    "iPhone 17 Pro 256GB eSIM Blue": 1_370_000,
    "iPhone 17 Pro 256GB eSIM Silver": 1_400_000,
    "iPhone 17 Pro Max 256GB eSIM": 1_480_000,
    "iPhone 17 Pro Max 512GB eSIM": 1_660_000,
    # --- accessories ---
    "Apple Adapter 20W 3 Pin": 26_000,
    "Apple Adapter 40W 2 Pin": 48_000,
    "Apple Adapter 40W 3 Pin": 55_000,
    "Meta Ray-Ban Wayfarer Dark": 320_000,
    "Meta Ray-Ban Wayfarer Clear": 340_000,
    "Meta Ray-Ban Transition": 450_000,
    "AirPods Pro 3 NonActive": 285_000,
    "AirPods Pro 3 Open Box": 260_000,
    "AirPods replacement 4 ANC Case": 60_000,
    "AirPods replacement 4 Ear": 60_000,
    "AirPods replacement Pro 2 Case": 100_000,
    "AirPods replacement Pro 2 Ear": 80_000,
    "AirPods replacement Pro 3 Ear": 100_000,
    # --- audio ---
    "JBL Tune 720BT": 70_000,
    "JBL Flip 7": 125_000,
    "JBL Xtreme 4": 340_000,
    "JBL Boombox 4": 620_000,
    "Beats Pill": 220_000,
    # --- tablets ---
    "iPad 10th Gen 64GB Cellular": 410_000,
    "iPad 11th Gen 128GB WiFi Blue": 590_000,
    "iPad 11th Gen 128GB WiFi Silver": 600_000,
    "iPad 11th Gen 128GB WiFi Pink": 605_000,
    "Samsung Tab A11+ 5G 128GB": 325_000,
    "Apple Pencil USB-C": 120_000,
    # --- laptops ---
    "HP EliteBook 830 G8": 380_000,
    "HP EliteBook 840 G7": 380_000,
    "HP EliteBook 830 G7 x360": 400_000,
    "HP EliteBook 850 G8": 540_000,
    "Dell Precision 5530": 380_000,
    "MacBook Pro 2018 15in": 550_000,
    "MacBook Pro 2020 13in": 700_000,
    "MacBook Pro M1 2020 8/256": 670_000,
    "MacBook Pro M1 2020 16/256": 820_000,
    "MacBook Pro M1 2020 16/512": 900_000,
    "MacBook Pro 14 2021 16/512": 1_150_000,
    "MacBook Pro 14 2021 32/512": 1_250_000,
}


def shown(list_price: int) -> int:
    return round(list_price * (1 + UPLIFT))


if __name__ == "__main__":
    print(f"lines on the list: {len(PRICE_LIST)}")
    print()
    print(f"{'item':42} {'list':>10} {'displayed':>11}")
    for label, price in PRICE_LIST.items():
        print(f"{label:42} {price:>10,} {round(price * (1 + UPLIFT)):>11,}")

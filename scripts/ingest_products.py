import os
import glob
import csv

# Target directory and output CSV path
IMAGE_DIR = r"C:\Users\User\Downloads\Ms Rong Bahar products"
OUTPUT_CSV = os.path.join(IMAGE_DIR, "ecommerce_product_import.csv")

# Master database mapping visual signatures to catalog data
CATALOG_DB = {
    "input_file_0": {
        "Handle": "berger-robbialac-enamel-blue-091l",
        "Title": "Berger Robbialac Super Gloss Synthetic Enamel – Blue (0.91L)",
        "Vendor": "Berger Paints BD",
        "Type": "Synthetic Enamel Paint",
        "Price": 540.00,
        "SKU": "BER-ROB-SGE-BLU-091",
        "Stock": 45,
        "Weight": 1.10,
        "Tags": "Paint, Enamel, Berger, Blue, Gloss"
    },
    "input_file_1": {
        "Handle": "fevicol-1k-pur-adhesive-500g",
        "Title": "Fevicol 1K PUR Polyurethane Adhesive – 500g",
        "Vendor": "Fevicol (Pidilite)",
        "Type": "Polyurethane Glue",
        "Price": 744.00,
        "SKU": "FEV-1KPUR-500G",
        "Stock": 60,
        "Weight": 0.55,
        "Tags": "Adhesive, Wood Glue, Fevicol, Polyurethane, Waterproof"
    },
    "input_file_2": {
        "Handle": "jm-lacquer-spray-37-light-green",
        "Title": "JM Lacquer Spray Paint – 37 Light Green (400ml)",
        "Vendor": "JM Tools",
        "Type": "Aerosol Spray Paint",
        "Price": 240.00,
        "SKU": "JM-LSP-37-LGRN",
        "Stock": 100,
        "Weight": 0.40,
        "Tags": "Spray Paint, Acrylic, Green, JM Lacquer"
    },
    "input_file_5": {
        "Handle": "hmbr-50mm-security-padlock",
        "Title": "HMBR 50mm Stainless Steel Top Security Padlock",
        "Vendor": "HMBR Hardware",
        "Type": "Security Lock",
        "Price": 490.00,
        "SKU": "HMBR-PL-50MM-SS",
        "Stock": 30,
        "Weight": 0.48,
        "Tags": "Lock, Padlock, Hardware, Security, HMBR"
    },
    "input_file_6": {
        "Handle": "aqua-rangila-enamel-cng-green",
        "Title": "Aqua Paints Rangila Synthetic Enamel – CNG Green (0.145L)",
        "Vendor": "Aqua Paints BD",
        "Type": "Economy Enamel Paint",
        "Price": 200.00,
        "SKU": "AQU-RNG-CNG-145",
        "Stock": 80,
        "Weight": 0.20,
        "Tags": "Paint, Enamel, Aqua Paints, CNG Green"
    },
    "input_file_8": {
        "Handle": "industrial-paint-brush-125mm",
        "Title": "Professional 125mm (5-Inch) Industrial Paint Brush",
        "Vendor": "Generic Industrial",
        "Type": "Painting Tools",
        "Price": 180.00,
        "SKU": "PBR-IND-125MM",
        "Stock": 120,
        "Weight": 0.18,
        "Tags": "Brush, Paint Tools, Hardware, 125mm"
    }
}

def process_product_directory():
    target_dir = IMAGE_DIR if os.path.exists(IMAGE_DIR) else "./public/products"
    os.makedirs(target_dir, exist_ok=True)
    out_csv = OUTPUT_CSV if os.path.exists(IMAGE_DIR) else "./public/ecommerce_product_import.csv"

    headers = [
        "Handle", "Title", "Body (HTML)", "Vendor", "Type", "Tags",
        "Published", "Option1 Name", "Option1 Value", "Variant SKU",
        "Variant Inventory Qty", "Variant Price", "Variant Grams", "Image Src"
    ]

    records = []
    for key, meta in CATALOG_DB.items():
        records.append({
            "Handle": meta["Handle"],
            "Title": meta["Title"],
            "Body (HTML)": f"<p>High quality {meta['Title']} distributed by {meta['Vendor']}. Designed for professional and industrial use.</p>",
            "Vendor": meta["Vendor"],
            "Type": meta["Type"],
            "Tags": meta["Tags"],
            "Published": "TRUE",
            "Option1 Name": "Title",
            "Option1 Value": "Default Title",
            "Variant SKU": meta["SKU"],
            "Variant Inventory Qty": meta["Stock"],
            "Variant Price": meta["Price"],
            "Variant Grams": int(meta["Weight"] * 1000),
            "Image Src": os.path.join(target_dir, f"{key}.png")
        })

    with open(out_csv, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        writer.writerows(records)

    print(f"Successfully generated Shopify/WooCommerce master import CSV ({len(records)} records) at: {out_csv}")

if __name__ == "__main__":
    process_product_directory()

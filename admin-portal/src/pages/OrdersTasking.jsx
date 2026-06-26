import React, { useState, useEffect } from 'react';
import { PRODUCT_CATALOG } from '../data/products';
import { supabase } from '../supabase';

import toast from 'react-hot-toast';

const TEMPLATE_M_1 = [
  { sr: 1, price: 498.06, profit: 1.10, title: "Saint Laurent Monogram Leather Card Holder", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-1.png" },
  { sr: 2, price: 476.07, profit: 0.80, title: "Gucci Double G Flower Ring in Silver", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-2.png" },
  { sr: 3, price: 500.10, profit: 1.00, title: "Prada Saffiano Leather Keychain", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-3.png" },
  { sr: 4, price: 456.11, profit: 0.77, title: "Balenciaga Classic Card Case Black", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-4.png" },
  { sr: 5, price: 499.12, profit: 0.69, title: "Off-White Industrial Belt Yellow/Black", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-5.png" },
  { sr: 6, price: 486.30, profit: 0.74, title: "Alexander McQueen Skull Friendship Bracelet", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-6.png" },
  { sr: 7, price: 501.66, profit: 1.01, title: "Givenchy G-Link Chain Bracelet in Metal", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-7.png" },
  { sr: 8, price: 487.12, profit: 0.89, title: "Burberry Vintage Check Cotton Baseball Cap", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-8.png" },
  { sr: 9, price: 491.90, profit: 0.88, title: "Versace Medusa Tribute Hair Clip Gold", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-1.png" },
  { sr: 10, price: 503.65, profit: 1.40, title: "Tom Ford FT5532 Optical Glasses", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-2.png" },
  { sr: 11, price: 503.44, profit: 0.80, title: "Moncler Tricolour Logo Wool Beanie", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-3.png" },
  { sr: 12, price: 489.87, profit: 0.76, title: "Valentino Garavani Rockstud Bracelet", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-4.png" },
  { sr: 13, price: 504.00, profit: 1.10, title: "Fendi Baguette Canvas Key Charm", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-5.png" },
  { sr: 14, price: 495.65, profit: 0.86, title: "Bottega Veneta Intrecciato Leather Card Case", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-6.png" },
  { sr: 15, price: 741.80, profit: 68.00, title: "Dyson Airwrap Multi-Styler Complete Long (Special Combo Match)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-7.png" },
  { sr: 16, price: 733.80, profit: 1.20, title: "Apple Watch Series 9 GPS + Cellular 45mm", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-8.png" },
  { sr: 17, price: 731.70, profit: 1.00, title: "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-9.png" },
  { sr: 18, price: 729.50, profit: 1.43, title: "Bose QuietComfort Ultra Headphones Black", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-10.png" },
  { sr: 19, price: 721.60, profit: 1.21, title: "GoPro HERO12 Black Creator Edition", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-11.png" },
  { sr: 20, price: 730.40, profit: 1.20, title: "Nintendo Switch OLED Model Bundle", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-12.png" },
  { sr: 21, price: 727.90, profit: 1.10, title: "Sennheiser MOMENTUM 4 Wireless Headphones", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-13.png" },
  { sr: 22, price: 739.30, profit: 1.80, title: "Garmin Venu 3 GPS Smartwatch Slate", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-14.png" },
  { sr: 23, price: 733.90, profit: 1.30, title: "Marshall Woburn III Wireless Speaker", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-15.png" },
  { sr: 24, price: 721.40, profit: 1.10, title: "DJI Pocket 3 Handheld 3-Axis Gimbal Camera", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-16.png" },
  { sr: 25, price: 734.20, profit: 1.30, title: "Insta360 X3 Waterproof 360 Action Camera", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-17.png" },
  { sr: 26, price: 740.40, profit: 1.50, title: "iPad 10.9-inch (10th Gen) Wi-Fi 256GB", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-18.png" },
  { sr: 27, price: 749.60, profit: 1.60, title: "Sonos Move 2 Portable Wireless Speaker", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-19.png" },
  { sr: 28, price: 1133.54, profit: 97.00, title: "Sony Alpha 7 III Mirrorless Camera (Premium Combo Match)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-20.png" },
  { sr: 29, price: 1121.54, profit: 1.70, title: "iPhone 15 Pro Max 256GB Titanium", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-1.png" },
  { sr: 30, price: 1123.56, profit: 1.60, title: "Samsung Galaxy S24 Ultra 512GB Black", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-2.png" },
  { sr: 31, price: 999.78, profit: 1.00, title: "Apple MacBook Air 13.6-inch M3 SSD", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-3.png" },
  { sr: 32, price: 1002.40, profit: 1.10, title: "Lenovo Legion Slim 5 Gaming Laptop", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-4.png" },
  { sr: 33, price: 1123.40, profit: 1.50, title: "HP Spectre x360 2-in-1 Touchscreen Laptop", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-5.png" },
  { sr: 34, price: 1110.50, profit: 1.40, title: "Dell XPS 13 Evo Laptop Intel Core i7", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-6.png" },
  { sr: 35, price: 1123.76, profit: 1.30, title: "Asus ROG Ally Gaming Console Extreme", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-7.png" },
  { sr: 36, price: 1147.66, profit: 1.40, title: "Segway Ninebot Max G30P Electric Scooter", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-8.png" },
  { sr: 37, price: 1138.99, profit: 1.50, title: "TUMI 19 Degree Carry-On Suitcase", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-1.png" },
  { sr: 38, price: 1136.86, profit: 1.40, title: "Rimowa Essential Lite Cabin Suitcase", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-2.png" },
  { sr: 39, price: 1144.79, profit: 1.30, title: "Meta Quest 3 512GB VR Gaming Headset", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-3.png" },
  { sr: 40, price: 1147.74, profit: 1.90, title: "iPad Pro 11-inch M2 Chip 256GB", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-4.png" }
];

const TEMPLATE_C_1 = [
  { sr: 1, price: 21.01, profit: 0.07, title: "Premium Gel Ink Pen Set (0.7mm)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-1.png" },
  { sr: 2, price: 20.12, profit: 0.06, title: "Stainless Steel Reusable Straws (6-Pack)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-2.png" },
  { sr: 3, price: 19.45, profit: 0.04, title: "Ergonomic Anti-Slip Mouse Pad", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-3.png" },
  { sr: 4, price: 20.11, profit: 0.07, title: "Organic Bamboo Fiber Makeup Remover Pads", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-4.png" },
  { sr: 5, price: 20.43, profit: 0.06, title: "Portable Desktop Cell Phone Stand", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-5.png" },
  { sr: 6, price: 20.56, profit: 0.05, title: "Microfiber Screen Cleaning Cloths (10-Pack)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-6.png" },
  { sr: 7, price: 20.88, profit: 0.08, title: "Double-Walled Insulated Glass Mug", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-7.png" },
  { sr: 8, price: 20.94, profit: 0.07, title: "Waterproof Travel Toiletry Organizer Bag", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-8.png" },
  { sr: 9, price: 21.12, profit: 0.08, title: "Mini Desktop USB Quiet Personal Fan", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-1.png" },
  { sr: 10, price: 19.88, profit: 0.06, title: "Adjustable Resistance Hand Gripper", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-2.png" },
  { sr: 11, price: 18.98, profit: 0.05, title: "Scented Soy Wax Travel Candle (Lavender)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-3.png" },
  { sr: 12, price: 20.77, profit: 0.09, title: "Retractable Keychain Badge Holder Reel", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-4.png" },
  { sr: 13, price: 19.45, profit: 0.08, title: "Multi-Angle Laptop Cooling Stand", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-5.png" },
  { sr: 14, price: 20.77, profit: 0.07, title: "Self-Adhesive Silicone Cable Clips (6-Pack)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-6.png" },
  { sr: 15, price: 21.21, profit: 0.07, title: "Stainless Steel Dual-Blade Pocket Peeler", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-7.png" },
  { sr: 16, price: 21.11, profit: 0.06, title: "High-Bounce Tennis Balls (3-Pack)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-8.png" },
  { sr: 17, price: 20.56, profit: 0.05, title: "Nylon Braided USB-C Charging Cable (6ft)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-9.png" },
  { sr: 18, price: 20.88, profit: 0.08, title: "Thermal Insulated Travel Coffee Tumbler", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-10.png" },
  { sr: 19, price: 20.94, profit: 0.07, title: "Ceramic Ring Jewelry Dish Tray", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-11.png" },
  { sr: 20, price: 21.12, profit: 0.08, title: "Elastic Sports Hair Bands (12-Pack)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-12.png" },
  { sr: 21, price: 19.88, profit: 0.06, title: "Reusable Silicone Food Storage Bags", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-13.png" },
  { sr: 22, price: 19.88, profit: 0.06, title: "LED Clip-On Reading Book Light", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-14.png" },
  { sr: 23, price: 18.98, profit: 0.05, title: "Organic Peppermint Herbal Tea Box", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-15.png" },
  { sr: 24, price: 20.77, profit: 0.09, title: "Magnetic Dry Erase Whiteboard Marker Set", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-16.png" },
  { sr: 25, price: 19.45, profit: 0.08, title: "Natural Lavender Wardrobe Deodorizer Sachet", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-17.png" },
  { sr: 26, price: 20.77, profit: 0.07, title: "Hard Shell Travel Sunglasses Case", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-18.png" },
  { sr: 27, price: 21.21, profit: 0.07, title: "Memory Foam Sleep Mask with Eye Cavities", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-19.png" },
  { sr: 28, price: 21.11, profit: 0.06, title: "Aluminum Pocket Business Card Holder", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-20.png" },
  { sr: 29, price: 20.56, profit: 0.05, title: "Compact Travel Umbrella (Windproof)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-1.png" },
  { sr: 30, price: 20.88, profit: 0.08, title: "Bamboo Wood Toothbrush Set (4-Pack)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-2.png" },
  { sr: 31, price: 20.94, profit: 0.07, title: "Universal Air Vent Magnetic Car Phone Mount", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-3.png" },
  { sr: 32, price: 21.12, profit: 0.08, title: "Exfoliating Loofah Back Scrubber Strap", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-4.png" },
  { sr: 33, price: 19.88, profit: 0.06, title: "Stainless Steel Keychain Multi-Tool", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-5.png" },
  { sr: 34, price: 19.88, profit: 0.06, title: "Velvet Hair Scrunchies Elastic Bands (6-Pack)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-6.png" },
  { sr: 35, price: 18.98, profit: 0.05, title: "Portable Pill Organizer Box (Weekly)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-7.png" },
  { sr: 36, price: 20.77, profit: 0.09, title: "Silicone Kitchen Cooking Utensils Set", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-8.png" },
  { sr: 37, price: 20.94, profit: 0.07, title: "Microfiber Hair Drying Turban Towel", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-1.png" },
  { sr: 38, price: 21.12, profit: 0.08, title: "Heavy-Duty Reusable Shopping Tote Bag", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-2.png" },
  { sr: 39, price: 19.88, profit: 0.06, title: "Digital Kitchen Scale (Precision 1g)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-3.png" },
  { sr: 40, price: 19.88, profit: 0.06, title: "Natural Pumice Stone Pedicure Tool", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-4.png" }
];

const TEMPLATE_C_2 = [
  { sr: 1, price: 40.2, profit: 0.12, title: "Ergonomic Memory Foam Seat Cushion", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-1.png" },
  { sr: 2, price: 43.8, profit: 0.11, title: "Stainless Steel French Press Coffee Maker", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-2.png" },
  { sr: 3, price: 46.8, profit: 0.15, title: "Professional Bartender Cocktail Shaker Set", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-3.png" },
  { sr: 4, price: 43.8, profit: 0.11, title: "Wireless Charging LED Desk Lamp", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-4.png" },
  { sr: 5, price: 47.8, profit: 0.14, title: "High-Density Speckled Yoga Mat & Strap", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-5.png" },
  { sr: 6, price: 40.2, profit: 0.27, title: "Acoustic Foam Soundproofing Panels (12-Pack)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-6.png" },
  { sr: 7, price: 43.8, profit: 0.11, title: "Double-Wall Vacuum Insulated Water Bottle", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-7.png" },
  { sr: 8, price: 47.8, profit: 0.28, title: "Vintage Style Wood Tabletop AM/FM Radio", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-8.png" },
  { sr: 9, price: 43.8, profit: 0.11, title: "Digital Thermostat Dual-Probe Meat Thermometer", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-1.png" },
  { sr: 10, price: 46.8, profit: 0.15, title: "Adjustable Laptop Stand with Heat-Vent", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-2.png" },
  { sr: 11, price: 47.8, profit: 0.14, title: "Ultrasonic Essential Oil Diffuser (500ml)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-3.png" },
  { sr: 12, price: 43.8, profit: 0.11, title: "Portable Waterproof Bluetooth Speaker", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-4.png" },
  { sr: 13, price: 45.9, profit: 0.14, title: "Premium Leather Minimalist Slim Wallet", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-5.png" },
  { sr: 14, price: 43.8, profit: 0.11, title: "Heavy Duty Resistance Exercise Bands", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-6.png" },
  { sr: 15, price: 47.8, profit: 0.14, title: "Rechargeable Sonic Electric Toothbrush", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-7.png" },
  { sr: 16, price: 95.874, profit: 14, title: "Smart Ambient Mood Lighting Kit (Combo Match)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-8.png" },
  { sr: 17, price: 94.11, profit: 0.23, title: "Mechanical Backlit Gaming Keyboard", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-9.png" },
  { sr: 18, price: 93.24, profit: 0.22, title: "Noise-Cancelling Over-Ear Headphones", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-10.png" },
  { sr: 19, price: 91.88, profit: 0.2, title: "Portable External SSD 1TB USB-C", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-11.png" },
  { sr: 20, price: 94.99, profit: 0.3, title: "Instant-Read Digital Air Fryer (4-Quart)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-12.png" },
  { sr: 21, price: 91.96, profit: 0.19, title: "Professional Hair Clipper & Grooming Set", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-13.png" },
  { sr: 22, price: 91.88, profit: 0.2, title: "Premium Shiatsu Neck and Shoulder Massager", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-14.png" },
  { sr: 23, price: 94.99, profit: 0.3, title: "Heated Stadium Seats for Bleachers", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-15.png" },
  { sr: 24, price: 92.66, profit: 0.19, title: "Aero-Grade Aluminum Hiking Poles", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-16.png" },
  { sr: 25, price: 94.11, profit: 0.23, title: "Waterproof Sports Action Camera 4K", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-17.png" },
  { sr: 26, price: 93.24, profit: 0.22, title: "Cordless Handheld Car Vacuum Cleaner", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-18.png" },
  { sr: 27, price: 91.88, profit: 0.2, title: "Minimalist Floating Wall Shelves (Set of 3)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-19.png" },
  { sr: 28, price: 94.99, profit: 0.3, title: "Professional Acrylic Paint Set with Easel", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-20.png" },
  { sr: 29, price: 97.01, profit: 0.34, title: "Electric Gooseneck Kettle for Pour-Over", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-1.png" },
  { sr: 30, price: 187.994, profit: 26, title: "Ultimate Pro-Gamer Ergonomic Office Chair (Premium Combo Match)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-2.png" },
  { sr: 31, price: 180.55, profit: 0.5, title: "Home Security Wireless Camera 4-Pack", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-3.png" },
  { sr: 32, price: 187.01, profit: 0.6, title: "1200W High-Speed Nutrient Extractor Blender", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-4.png" },
  { sr: 33, price: 164.88, profit: 0.4, title: "Premium 100% Mulberry Silk Sheets Set", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-5.png" },
  { sr: 34, price: 183.99, profit: 0.4, title: "Therapeutic Red Light Therapy Device", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-6.png" },
  { sr: 35, price: 186.96, profit: 0.4, title: "High-Performance Wi-Fi 6 Mesh Router System", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-7.png" },
  { sr: 36, price: 171.8, profit: 0.3, title: "Handcrafted Premium Leather Travel Duffle", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-8.png" },
   { sr: 37, price: 177.9, profit: 0.3, title: "Ultra-Quiet Smart Air Purifier (True HEPA)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-1.png" },
  { sr: 38, price: 180.55, profit: 0.5, title: "GPS Smartwatch with Heart Rate Monitor", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-2.png" },
  { sr: 39, price: 187.01, profit: 0.6, title: "Compact Countertop Dishwasher (Portable)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-3.png" },
  { sr: 40, price: 164.88, profit: 0.4, title: "All-Weather Outdoor Patio Conversation Set", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-4.png" }
];

const TEMPLATE_C_3 = [
  { sr: 1, price: 460.44, profit: 4.6, title: "Premium Noise-Cancelling Wireless Headphones", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-1.png" },
  { sr: 2, price: 421.88, profit: 4.3, title: "4K Ultra HD Streaming Projector", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-2.png" },
  { sr: 3, price: 450.99, profit: 5.1, title: "Handcrafted Oak Wood Bedside Nightstand", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-3.png" },
  { sr: 4, price: 460.66, profit: 6.4, title: "Professional Multi-Channel Studio Mixer", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-4.png" },
  { sr: 5, price: 433.74, profit: 5.5, title: "Ergonomic High-Back Executive Office Chair", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-5.png" },
  { sr: 6, price: 421.88, profit: 5.9, title: "Under-Sink Reverse Osmosis Water Filter", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-6.png" },
  { sr: 7, price: 441.77, profit: 5.8, title: "Smart Wi-Fi Touchscreen Thermostat Combo", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-7.png" },
  { sr: 8, price: 460.44, profit: 4.9, title: "Chef-Grade 15-Piece Stainless Steel Knife Block Set", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-8.png" },
  { sr: 9, price: 433.93, profit: 5, title: "Portable Power Station 500W Solar Generator", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-9.png" },
  { sr: 10, price: 460.66, profit: 6.4, title: "Solid Wood 4-Tier Bookshelf Organizer", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-10.png" },
  { sr: 11, price: 499.65, profit: 7.9, title: "Deep Tissue Percussion Muscle Massage Gun Pro", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-11.png" },
  { sr: 12, price: 510.88, profit: 13.6, title: "Adjustable Height Motorized Standing Desk", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-12.png" },
  { sr: 13, price: 899.495, profit: 129.66, title: "Next-Gen Gaming Console Bundle (Premium Special Combo Match)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-13.png" },
  { sr: 14, price: 890.77, profit: 20.1, title: "Ultra-Wide 34-inch Curved Gaming Monitor 144Hz", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-14.png" },
  { sr: 15, price: 888.54, profit: 20, title: "Home Theater Atmos Soundbar with Wireless Subwoofer", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-15.png" },
  { sr: 16, price: 920.77, profit: 25.95, title: "Automatic Espresso Machine with Integrated Grinder", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-16.png" },
  { sr: 17, price: 930.11, profit: 30.46, title: "Smart Robot Vacuum and Mop with Self-Empty Base", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-17.png" },
  { sr: 18, price: 920.66, profit: 40.44, title: "High-Resolution Mirrorless Camera Lens (50mm f/1.2)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-18.png" },
  { sr: 19, price: 1010.87, profit: 50.66, title: "Premium Leather Convertible Sectional Sofa", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-19.png" },
  { sr: 20, price: 908.99, profit: 40.55, title: "Professional Grade Drone with 4K HDR Camera Gimbal", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-20.png" },
  { sr: 21, price: 1100.93, profit: 60.55, title: "Dual-Fuel Portable Generator 4500-Watt", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-1.png" },
  { sr: 22, price: 1189.66, profit: 50.94, title: "Full-Body Zero Gravity Shiatsu Massage Chair", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-2.png" },
  { sr: 23, price: 1211.55, profit: 60.41, title: "Commercial Grade Countertop Soft Serve Ice Cream Machine", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-3.png" },
  { sr: 24, price: 1289.51, profit: 70.65, title: "Multi-Zone Ductless Mini Split Air Conditioner Heat Pump", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-4.png" },
  { sr: 25, price: 1236.88, profit: 60.79, title: "Retro Compact Refrigerator with Freezer Chest", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-5.png" },
  { sr: 26, price: 2612.515, profit: 397.65, title: "Pro-Athlete Smart Treadmill with 22-inch HD Touchscreen (Elite Special Combo Match)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-6.png" },
  { sr: 27, price: 2601.88, profit: 120.99, title: "Professional Electric Guitar with Hard Shell Case", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-7.png" },
  { sr: 28, price: 2507.54, profit: 110.92, title: "Advanced Laser Engraving and Cutting Machine", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-8.png" },
  { sr: 29, price: 2799.84, profit: 140.9, title: "High-Performance Carbon Fiber Road Racing Bike", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-1.png" },
  { sr: 30, price: 2675.8, profit: 130.8, title: "Commercial Multi-Station Home Gym Workout Center", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-2.png" },
  { sr: 31, price: 3100.66, profit: 167.25, title: "Top-Tier Handcrafted Wood Pool Table Set", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-3.png" },
  { sr: 32, price: 5693.565, profit: 867.31, title: "Signature Edition Master Chef Gas Range & Double Oven (Supreme Special Combo Match)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-4.png" },
  { sr: 33, price: 5550.59, profit: 280.88, title: "Premium Inground Backyard Hot Tub & Spa Tub", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-5.png" },
  { sr: 34, price: 5498.77, profit: 263.22, title: "Commercial-Grade Fully Automatic Lawn Mower Robot", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-6.png" },
  { sr: 35, price: 6100.69, profit: 300.6, title: "Smart Interactive Fitness Mirror with Weight Accessories", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-7.png" },
  { sr: 36, price: 5900.51, profit: 400.6, title: "High-Capacity Built-In Dual-Zone Wine Refrigerator", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-8.png" },
  { sr: 37, price: 5821.63, profit: 398.22, title: "Luxury Hard Shell Expandable Luggage Suite (5-Piece Set)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-9.png" },
  { sr: 38, price: 6590.61, profit: 502.91, title: "Off-Road Electric Fat Tire Mountain Bicycle 1000W", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-10.png" },
  { sr: 39, price: 12793.695, profit: 1567.31, title: "Ultra-Premium 85-inch 8K Neo QLED Smart TV (Grand Special Combo Match)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-11.png" },
  { sr: 40, price: 21643.875, profit: 2852.77, title: "Enterprise Level AI-Powered Server Rack Console (Mega Special Combo Match)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-12.png" }
];

const TEMPLATE_C_4 = [
  { sr: 1, price: 750.55, profit: 6.44, title: "Premium Lightweight Hiking Backpack 60L", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-1.png" },
  { sr: 2, price: 711.76, profit: 6.9, title: "Advanced Dual-Lens Dash Camera 4K", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-2.png" },
  { sr: 3, price: 743.77, profit: 7.9, title: "Ergonomic Mesh Office Chair with Lumbar Support", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-3.png" },
  { sr: 4, price: 769.33, profit: 7.43, title: "Outdoor Gas Fire Pit Table with Glass Wind Guard", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-4.png" },
  { sr: 5, price: 721.77, profit: 6.9, title: "Professional 7-Piece Ceramic Cookware Set", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-5.png" },
  { sr: 6, price: 777.81, profit: 8, title: "Smart Wi-Fi Garage Door Opener System", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-6.png" },
  { sr: 7, price: 801.22, profit: 9.5, title: "High-Fidelity Bookshelf Speakers Set", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-7.png" },
  { sr: 8, price: 799.43, profit: 8.3, title: "Robot Lawn Mower with Boundary Wire", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-8.png" },
  { sr: 9, price: 800.3, profit: 8.6, title: "Heavy-Duty Inflatable Stand Up Paddle Board", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-9.png" },
  { sr: 10, price: 751.7, profit: 7.4, title: "Commercial Quality Vacuum Sealer Machine", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-10.png" },
  { sr: 11, price: 811.7, profit: 9.1, title: "Portable Outdoor Propane Pizza Oven", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-11.png" },
  { sr: 12, price: 729.11, profit: 6.4, title: "Smart Deadbolt Lock with Keypad", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-12.png" },
  { sr: 13, price: 831.55, profit: 10.2, title: "Cordless Stick Vacuum Cleaner with Laser", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-13.png" },
  { sr: 14, price: 791.54, profit: 7.8, title: "Digital Piano with Weighted Keys (88-Key)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-14.png" },
  { sr: 15, price: 870.33, profit: 11.5, title: "Self-Cleaning Litter Box for Cats", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-15.png" },
  { sr: 16, price: 1585.743, profit: 256.1, title: "Premium E-Bike Commuter Edition (Combo Match)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-16.png" },
  { sr: 17, price: 1500.22, profit: 56.87, title: "Smart Home Security System Bundle 12-Piece", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-17.png" },
  { sr: 18, price: 1600.34, profit: 60.4, title: "Fully Automatic Integrated Coffee Machine", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-18.png" },
  { sr: 19, price: 1476.65, profit: 40.5, title: "Professional 3D Printer with Dual Extruder", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-19.png" },
  { sr: 20, price: 1621.87, profit: 50.6, title: "Countertop Clear Ice Maker Machine", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-20.png" },
  { sr: 21, price: 1438.91, profit: 39.4, title: "Ultra-Lightweight Carbon Fiber Tripod", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-1.png" },
  { sr: 22, price: 1830.43, profit: 70.52, title: "Portable Air Conditioner 14,000 BTU", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-2.png" },
  { sr: 23, price: 1654.98, profit: 50.22, title: "Heavy-Duty Power Rack with Lat Pull-Down", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-3.png" },
  { sr: 24, price: 1794.88, profit: 60.12, title: "Smart Indoor Rowing Machine with Screen", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-4.png" },
  { sr: 25, price: 1887.53, profit: 70.33, title: "Premium Whole House Water Filtration System", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-5.png" },
  { sr: 26, price: 1997.55, profit: 90.5, title: "Professional Recording Studio Microphone Set", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-6.png" },
  { sr: 27, price: 1876.87, profit: 76.9, title: "High-End Turntable with Ortofon Cartridge", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-7.png" },
  { sr: 28, price: 2100.63, profit: 100.57, title: "Smart Electric Smoker with Meat Probe", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-8.png" },
  { sr: 29, price: 4196.873, profit: 605.32, title: "Advanced VR Headset System (Combo Match)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-1.png" },
  { sr: 30, price: 4111.34, profit: 200.67, title: "Professional Video Editing Workstation Laptop", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-2.png" },
  { sr: 31, price: 3999.76, profit: 197.55, title: "Commercial Grade Under-Counter Ice Machine", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-3.png" },
  { sr: 32, price: 4288.56, profit: 230.91, title: "Luxury Freestanding Soaking Bathtub", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-4.png" },
  { sr: 33, price: 8798.903, profit: 1299.99, title: "Premium Home Golf Simulator Package (Combo Match)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-5.png" },
  { sr: 34, price: 8722.23, profit: 362.66, title: "Professional 12-Burner Gas Range with Griddle", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-6.png" },
  { sr: 35, price: 8112.98, profit: 310.55, title: "High-End Home Theater Laser Projector 8K", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-7.png" },
  { sr: 36, price: 9200.56, profit: 450.57, title: "Complete Solar Panel Kit with Inverter", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-8.png" },
  { sr: 37, price: 9771.84, profit: 560.44, title: "Custom Built Outdoor Kitchen Island", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-9.png" },
  { sr: 38, price: 8176.93, profit: 432.98, title: "Luxury Steam Shower Enclosure Unit", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-10.png" },
  { sr: 39, price: 19471.813, profit: 2912.93, title: "Grand Piano with Self-Playing System (Combo Match)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-11.png" },
  { sr: 40, price: 36646.083, profit: 5927.51, title: "State-of-the-Art Private Submersible (Combo Match)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-12.png" }
];

const TEMPLATE_M_2 = [
  { sr: 1, price: 1936.33, profit: 2.10, title: "Louis Vuitton Keepall Bandoulière 50 Monogram", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-1.png" },
  { sr: 2, price: 1999.64, profit: 1.98, title: "Apple MacBook Pro 14-inch M3 Max (Late 2023)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-2.png" },
  { sr: 3, price: 1821.75, profit: 1.77, title: "Sony Alpha 7R V Mirrorless Camera Body", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-3.png" },
  { sr: 4, price: 2001.55, profit: 2.00, title: "Prada Re-Nylon Medium Backpack Black", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-4.png" },
  { sr: 5, price: 1721.90, profit: 1.88, title: "Gucci GG Marmont Small Shoulder Bag", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-5.png" },
  { sr: 6, price: 1856.41, profit: 1.96, title: "Christian Louboutin Kate 85 Patent Pumps", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-6.png" },
  { sr: 7, price: 1998.58, profit: 2.20, title: "Canon EOS R6 Mark II Mirrorless Camera", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-7.png" },
  { sr: 8, price: 1962.95, profit: 2.10, title: "Sennheiser HD 800 S High-Resolution Headphones", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-8.png" },
  { sr: 9, price: 2030.88, profit: 2.30, title: "Yves Saint Laurent Loulou Medium Bag", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-1.png" },
  { sr: 10, price: 2001.99, profit: 2.00, title: "DJI Inspire 3 Professional Cinema Drone", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-2.png" },
  { sr: 11, price: 1995.80, profit: 1.88, title: "Moncler Maya Short Down Jacket Black", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-3.png" },
  { sr: 12, price: 1953.48, profit: 1.70, title: "Balenciaga Neo Classic Medium Handbag", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-4.png" },
  { sr: 13, price: 2010.42, profit: 1.80, title: "Off-White Jitney 1.4 Leather Top Handle Bag", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-5.png" },
  { sr: 14, price: 1889.53, profit: 1.60, title: "Givenchy Antigona Small Leather Tote", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-6.png" },
  { sr: 15, price: 1946.99, profit: 1.99, title: "Fendi First Medium Leather Clutch", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-7.png" },
  { sr: 16, price: 1826.79, profit: 1.98, title: "Bottega Veneta Cassette Intrecciato Bag", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-8.png" },
  { sr: 17, price: 2068.98, profit: 2.40, title: "Burberry Chelsea Heritage Trench Coat", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-9.png" },
  { sr: 18, price: 2447.64, profit: 112.00, title: "Hermès Birkin 30 Togo Gold Hardware (Special Combo Match)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-10.png" },
  { sr: 19, price: 2412.70, profit: 5.60, title: "Cartier Love Wedding Band 18K Yellow Gold", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-11.png" },
  { sr: 20, price: 2411.60, profit: 5.10, title: "Tiffany & Co. T1 Narrow Ring in Rose Gold", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-12.png" },
  { sr: 21, price: 2315.50, profit: 4.90, title: "ASUS ROG Zephyrus G14 OLED Gaming Laptop", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-13.png" },
  { sr: 22, price: 2409.88, profit: 5.60, title: "Sinn 104 St Sa I Automatic Pilot Watch", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-14.png" },
  { sr: 23, price: 2367.90, profit: 4.70, title: "Devialet Phantom I 108dB Wireless Speaker", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-15.png" },
  { sr: 24, price: 2386.90, profit: 4.90, title: "Omega Seamaster Aqua Terra Automatic Watch", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-16.png" },
  { sr: 25, price: 2399.50, profit: 5.30, title: "Tudor Black Bay Fifty-Eight Automatic Watch", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-17.png" },
  { sr: 26, price: 2480.70, profit: 5.90, title: "Breitling Avenger Automatic GMT Watch", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-18.png" },
  { sr: 27, price: 2370.90, profit: 4.60, title: "Tag Heuer Aquaracer Professional 300 Watch", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-19.png" },
  { sr: 28, price: 2383.80, profit: 4.80, title: "Longines Spirit Zulu Time GMT Watch", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-20.png" },
  { sr: 29, price: 3329.04, profit: 238.00, title: "Chanel Classic Double Flap Bag Medium (Premium Combo Match)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-1.png" },
  { sr: 30, price: 3322.90, profit: 6.00, title: "LG OLED evo G3 Series 65-inch 4K Smart TV", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-2.png" },
  { sr: 31, price: 3212.00, profit: 5.10, title: "Astell&Kern A&ultima SP3000 Music Player", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-3.png" },
  { sr: 32, price: 3169.80, profit: 4.90, title: "Focal Utopia 2022 Open-Back Headphones", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-4.png" },
  { sr: 33, price: 3274.90, profit: 5.70, title: "Bang & Olufsen Beosound Stage Soundbar", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-5.png" },
  { sr: 34, price: 3311.80, profit: 5.40, title: "Leica Q3 Compact Digital Camera Black", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-6.png" },
  { sr: 35, price: 3258.90, profit: 5.10, title: "Hasselblad X2D 100C Medium Format Camera", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-7.png" },
  { sr: 36, price: 3311.80, profit: 6.00, title: "RAZER Blade 16 Gaming Laptop Dual QHD+", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-8.png" },
  { sr: 37, price: 3313.80, profit: 6.00, title: "MSI Titan 18 HX Core i9 Gaming Laptop", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-1.png" },
  { sr: 38, price: 3126.70, profit: 5.10, title: "Aero 16 OLED Creator Laptop Intel Core i9", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-2.png" },
  { sr: 39, price: 3217.60, profit: 6.10, title: "Eurocom Tornado F9 17.3-inch Superlaptop", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-3.png" },
  { sr: 40, price: 3380.70, profit: 6.40, title: "Alienware m18 R2 Liquid-Cooled Gaming Laptop", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-4.png" }
];

const TEMPLATE_M_3 = [
  { sr: 1, price: 5997.87, profit: 29.50, title: "Chanel Medium Classic Flap Bag", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-1.png" },
  { sr: 2, price: 5624.00, profit: 28.70, title: "Rolex Submariner Date Watch", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-2.png" },
  { sr: 3, price: 5999.89, profit: 30.10, title: "Cartier LOVE Bracelet 4 Diamonds", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-3.png" },
  { sr: 4, price: 5267.80, profit: 26.00, title: "Apple Mac Pro Tower M2 Ultra", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-4.png" },
  { sr: 5, price: 5742.99, profit: 31.00, title: "Louis Vuitton Horizon 55 Suitcase", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-5.png" },
  { sr: 6, price: 5822.77, profit: 29.85, title: "DJI Inspire 3 Cinema Drone", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-6.png" },
  { sr: 7, price: 5986.83, profit: 30.11, title: "Sony CineAlta Venice 6K Camera", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-7.png" },
  { sr: 8, price: 5542.50, profit: 26.60, title: "RED V-RAPTOR 8K S35 Camera", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-8.png" },
  { sr: 9, price: 5846.61, profit: 27.00, title: "Hermes Clic Clac H Bracelet", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-1.png" },
  { sr: 10, price: 5999.89, profit: 30.10, title: "Leica M11 Rangefinder Camera", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-2.png" },
  { sr: 11, price: 5267.80, profit: 26.00, title: "Tiffany T True Narrow Ring", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-3.png" },
  { sr: 12, price: 6242.98, profit: 36.76, title: "Gucci Savoy Medium Duffel Bag", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-4.png" },
  { sr: 13, price: 6001.01, profit: 30.40, title: "Prada Saffiano Leather Tote", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-5.png" },
  { sr: 14, price: 6311.22, profit: 34.60, title: "Rolex Oyster Perpetual 41", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-6.png" },
  { sr: 15, price: 8822.06, profit: 863.00, title: "Patek Philippe Nautilus Ref. 5711 (Special Combo Match)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-7.png" },
  { sr: 16, price: 8790.77, profit: 45.22, title: "Audemars Piguet Royal Oak Selfwinding", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-8.png" },
  { sr: 17, price: 8682.33, profit: 40.96, title: "Saint Laurent Sac de Jour Bag", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-9.png" },
  { sr: 18, price: 8769.65, profit: 41.55, title: "Dior Book Tote Oblique Bag", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-10.png" },
  { sr: 19, price: 8802.53, profit: 47.80, title: "Loewe Puzzle Medium Bag", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-11.png" },
  { sr: 20, price: 8102.44, profit: 38.90, title: "Celine Triomphe Shoulder Bag", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-12.png" },
  { sr: 21, price: 8682.33, profit: 40.96, title: "Fendi Peekaboo ISeeU Medium", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-13.png" },
  { sr: 22, price: 8769.65, profit: 41.55, title: "Balenciaga Hourglass XS Bag", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-14.png" },
  { sr: 23, price: 9100.30, profit: 49.70, title: "Bottega Veneta Andiamo Small Bag", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-15.png" },
  { sr: 24, price: 8802.53, profit: 47.80, title: "Burberry Trench Coat Heritage Chelsea", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-16.png" },
  { sr: 25, price: 8102.44, profit: 38.90, title: "Moncler Maya Short Down Jacket", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-17.png" },
  { sr: 26, price: 7632.99, profit: 28.99, title: "Tom Ford Shearling Bomber Jacket", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-18.png" },
  { sr: 27, price: 8913.84, profit: 46.22, title: "Graff Spiral Diamond Pendant", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-19.png" },
  { sr: 28, price: 8802.53, profit: 47.80, title: "Bvlgari B.zero1 18K Rose Gold Ring", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-20.png" },
  { sr: 29, price: 8102.44, profit: 38.90, title: "Van Cleef & Arpels Vintage Alhambra", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-1.png" },
  { sr: 30, price: 9401.46, profit: 50.34, title: "Chopard Happy Hearts Bracelet", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-2.png" },
  { sr: 31, price: 13767.53, profit: 1737.00, title: "Audemars Piguet Royal Oak Chronograph (Premium Combo Match)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-3.png" },
  { sr: 32, price: 12876.55, profit: 90.34, title: "Rolex Day-Date 40 President Gold", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-4.png" },
  { sr: 33, price: 13309.65, profit: 100.40, title: "Vacheron Constantin Overseas Automatic", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-5.png" },
  { sr: 34, price: 13394.76, profit: 99.97, title: "Hasselblad H6D-100c Medium Format", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-6.png" },
  { sr: 35, price: 12867.88, profit: 98.90, title: "Phase One XF IQ4 150MP System", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-7.png" },
  { sr: 36, price: 13427.00, profit: 89.99, title: "Devialet Phantom I Gold Speaker Pair", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-8.png" },
  { sr: 37, price: 14100.67, profit: 120.87, title: "Steinway & Sons Spirio Player Piano", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-1.png" },
  { sr: 38, price: 13998.73, profit: 110.77, title: "Moog One 16-Voice Polyphonic Synth", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-2.png" },
  { sr: 39, price: 14400.98, profit: 120.77, title: "Leica Noctilux-M 50mm f/0.95 ASPH", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-3.png" },
  { sr: 40, price: 14521.52, profit: 130.73, title: "RED V-RAPTOR XL 8K VV Camera", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-4.png" }
];

const TEMPLATE_M_4 = [
  { sr: 1, price: 7998.88, profit: 45.99, title: "Hermès Constance Slim Wallet", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-1.png" },
  { sr: 2, price: 7689.23, profit: 40.69, title: "Rolex Oyster Perpetual 36 Olive Green", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-2.png" },
  { sr: 3, price: 8000.20, profit: 50.22, title: "Chanel Classic Card Holder Gold", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-3.png" },
  { sr: 4, price: 7946.81, profit: 47.10, title: "Cartier Juste un Clou Ring Gold with Diamonds", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-4.png" },
  { sr: 5, price: 7140.60, profit: 42.60, title: "Louis Vuitton Bleecker Box Vernis", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-5.png" },
  { sr: 6, price: 7994.98, profit: 45.77, title: "RED V-RAPTOR S35 Cinema Camera", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-6.png" },
  { sr: 7, price: 8152.16, profit: 58.99, title: "Sony CineAlta Venice 6K Extension System", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-7.png" },
  { sr: 8, price: 7863.91, profit: 43.90, title: "DJI Inspire 3 Drone Base Combo", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-8.png" },
  { sr: 9, price: 7891.61, profit: 45.22, title: "Leica M11 Mirrorless Rangefinder Body Only", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-1.png" },
  { sr: 10, price: 8235.71, profit: 60.10, title: "Tiffany T Diamond Wire Bracelet Rose Gold", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-2.png" },
  { sr: 11, price: 7812.73, profit: 50.44, title: "Chopard Happy Diamonds White Gold Ring", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-3.png" },
  { sr: 12, price: 7912.80, profit: 55.90, title: "Gucci Savoy Medium Duffel Trolley Bag", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-4.png" },
  { sr: 13, price: 12095.72, profit: 1384.81, title: "Hermès Birkin 35 Rose Azalee Epsom (Special Combo Match)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-5.png" },
  { sr: 14, price: 12007.91, profit: 65.66, title: "Audemars Piguet Royal Oak Selfwinding 34mm", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-6.png" },
  { sr: 15, price: 11854.88, profit: 60.70, title: "Patek Philippe Aquanaut Lady Steel Blue", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-7.png" },
  { sr: 16, price: 11678.91, profit: 70.40, title: "Saint Laurent Sac de Jour Alligator Leather", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-8.png" },
  { sr: 17, price: 12115.60, profit: 75.80, title: "Dior Book Tote Crocodile Embossed Calfskin", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-9.png" },
  { sr: 18, price: 11765.81, profit: 60.44, title: "Bottega Veneta Andiamo Large Intrecciato", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-10.png" },
  { sr: 19, price: 11623.66, profit: 60.41, title: "Loewe Puzzle Medium Crocodile Finish", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-11.png" },
  { sr: 20, price: 12118.40, profit: 70.10, title: "Celine Triomphe Medium Lizard Skin Shoulder Bag", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-12.png" },
  { sr: 21, price: 11862.88, profit: 70.40, title: "Fendi Peekaboo ISeeU Crocodile Accents", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-13.png" },
  { sr: 22, price: 12178.66, profit: 75.80, title: "Balenciaga Hourglass XS Metallic Python Bag", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-14.png" },
  { sr: 23, price: 11854.88, profit: 60.44, title: "Graff Spiral 18K White Gold Diamond Pendant", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-15.png" },
  { sr: 24, price: 11678.91, profit: 60.41, title: "Bvlgari B.zero1 4-Band Rose Gold Diamond Ring", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-16.png" },
  { sr: 25, price: 12115.60, profit: 70.10, title: "Van Cleef & Arpels Magic Alhambra Pendant", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-17.png" },
  { sr: 26, price: 11765.81, profit: 60.59, title: "Tom Ford Shearling Flight Jacket Leather", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-18.png" },
  { sr: 27, price: 11149.79, profit: 68.20, title: "Steinway & Sons Spirio Player Grand Piano", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-19.png" },
  { sr: 28, price: 18884.46, profit: 2616.51, title: "Patek Philippe Aquanaut Chronograph Rose Gold (Premium Combo Match)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-20.png" },
  { sr: 29, price: 17654.76, profit: 120.67, title: "Audemars Piguet Royal Oak Chronograph Silver Dial", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-1.png" },
  { sr: 30, price: 17231.99, profit: 126.88, title: "Rolex Day-Date 40 President Platinum", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-2.png" },
  { sr: 31, price: 17983.66, profit: 130.11, title: "Vacheron Constantin Overseas Dual Time Blue", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-3.png" },
  { sr: 32, price: 16984.88, profit: 110.26, title: "Hasselblad H6D-100c Multi-Shot System", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-4.png" },
  { sr: 33, price: 19112.66, profit: 180.67, title: "Phase One XF IQ4 150MP Trichromatic System", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-5.png" },
  { sr: 34, price: 17883.90, profit: 150.66, title: "Leica Noctilux-M 75mm f/1.25 ASPH Lens", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-6.png" },
  { sr: 35, price: 15832.91, profit: 130.22, title: "RED V-RAPTOR XL 8K Super35 Production Pack", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-7.png" },
  { sr: 36, price: 19700.43, profit: 200.32, title: "Devialet Phantom I Gold Wireless Speaker Pair", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-8.png" },
  { sr: 37, price: 18943.81, profit: 197.44, title: "Moog One 16-Voice Synthesizer Pro Pack", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-1.png" },
  { sr: 38, price: 19432.61, profit: 199.90, title: "Steinway & Sons Model S Baby Grand Piano", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-2.png" },
  { sr: 39, price: 19842.64, profit: 200.40, title: "Alienware m18 R2 Dual Liquid-Cooled Laptop", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-3.png" },
  { sr: 40, price: 20007.67, profit: 382.80, title: "Eurocom Tornado F9 Supercomputer Workstation", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-4.png" }
];

export default function OrdersTasking() {
  const [users, setUsers] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [session, setSession] = useState({ role: 'Owner', name: 'System Owner', email: 'owner@wallmark.com' });
  const [searchQuery, setSearchQuery] = useState('');

  // Form assignment states
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('custom'); // 'custom', 'M-1', 'M-2', 'M-3', 'M-4', 'C-1', 'C-2', 'C-3', 'C-4'
  const [totalAmount, setTotalAmount] = useState('1000');
  const [orderCount, setOrderCount] = useState('5');
  const [profitPercent, setProfitPercent] = useState('5');
  const [showModal, setShowModal] = useState(false);
  const [newAssignOrders, setNewAssignOrders] = useState([]);

  // Edit Worksheet Orders states
  const [showEditOrdersModal, setShowEditOrdersModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingOrders, setEditingOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const fetchUsersAndTasks = async () => {
    try {
      // Session
      const savedSession = localStorage.getItem('cb_admin_session');
      if (savedSession) {
        setSession(JSON.parse(savedSession));
      }

      // Users
      const { data: usersData, error: usersError } = await supabase
        .from('cb_users')
        .select('*')
        .order('reg_time', { ascending: false });

      if (!usersError && usersData) {
        const mappedUsers = usersData.map(u => ({
          id: u.id,
          username: u.username,
          email: u.email,
          phone: u.phone,
          nickname: u.nickname,
          level: u.level,
          rate: u.rate,
          acceptance: u.acceptance,
          online: u.online,
          balance: parseFloat(u.balance || 0),
          frozen: parseFloat(u.frozen || 0),
          topup: parseFloat(u.topup || 0),
          spentToday: parseFloat(u.spent_today || 0),
          spentCurrent: parseFloat(u.spent_current || 0),
          remaining: u.remaining,
          withdraw: u.withdraw,
          tpRecharge: parseFloat(u.tp_recharge || 0),
          beRecharge: parseFloat(u.be_recharge || 0),
          earnings: parseFloat(u.earnings || 0),
          commissions: parseFloat(u.commissions || 0),
          withdrawals: parseFloat(u.withdrawals || 0),
          inviteCode: u.invite_code,
          subs: u.subs,
          inviter: u.inviter,
          referred_by_staff_id: u.referred_by_staff_id,
          member_of_admin_id: u.member_of_admin_id,
          referral_id: u.referral_id,
          l1Agent: u.l1_agent,
          l2Agent: u.l2_agent,
          ip: u.ip,
          regTime: new Date(u.reg_time).toLocaleDateString()
        }));
        setUsers(mappedUsers);
      }

      // Assigned Tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('cb_assigned_tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (!tasksError && tasksData) {
        const mappedTasks = tasksData.map(t => ({
          id: t.id,
          userId: t.user_id,
          username: t.username,
          totalAmount: parseFloat(t.total_amount || 0),
          orderCount: t.order_count,
          profitPercent: parseFloat(t.profit_percent || 0),
          status: t.status,
          createdAt: new Date(t.created_at).toLocaleString(),
          assignedBy: t.assigned_by,
          orders: typeof t.orders === 'string' ? JSON.parse(t.orders) : t.orders,
          referred_by_staff_id: t.referred_by_staff_id || 'None',
          member_of_admin_id: t.member_of_admin_id || 'None'
        }));
        setAssignedTasks(mappedTasks);
      }
    } catch (err) {
      console.error("Error loading users and tasks:", err);
    }
  };

  const loadProducts = async () => {
    try {
      let activeProducts = PRODUCT_CATALOG;
      const { data: dbProducts } = await supabase.from('cb_products').select('*');
      if (dbProducts && dbProducts.length > 0) {
        activeProducts = dbProducts.map(p => ({
          title: p.title,
          image: p.image_url || p.image,
          price: parseFloat(p.price || 0),
          profit: parseFloat(p.profit || 0)
        }));
      }
      setProducts(activeProducts);
    } catch (err) {
      console.error("Error loading products catalog:", err);
    }
  };

  useEffect(() => {
    fetchUsersAndTasks();
    loadProducts();
    const interval = setInterval(fetchUsersAndTasks, 3000);
    return () => clearInterval(interval);
  }, []);

  // Hierarchy filter based on role permissions
  const getFilteredUsers = () => {
    return users.filter(u => {
      // Role Node checking
      if (session.role === 'Admin') {
        if (u.member_of_admin_id !== session.accountId) return false;
      } else if (session.role === 'Staff') {
        if (u.referred_by_staff_id !== session.accountId) return false;
      }

      // Search checking
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return u.username.toLowerCase().includes(q) || u.id.toLowerCase().includes(q);
      }

      return true;
    });
  };

  const getFilteredTasks = () => {
    return assignedTasks.filter(t => {
      // Role Node checking
      if (session.role === 'Admin') {
        if (t.member_of_admin_id !== session.accountId) return false;
      } else if (session.role === 'Staff') {
        if (t.referred_by_staff_id !== session.accountId) return false;
      }
      return true;
    });
  };

  const handleOpenAssignModal = (user) => {
    // Check if user has an active task already
    const activeTask = assignedTasks.find(t => 
      t.username.toLowerCase() === user.username.toLowerCase() && 
      (t.status === 'Pending' || t.status === 'In Progress')
    );

    if (activeTask) {
      toast.error(`User ${user.username} already has an active task in progress (${activeTask.status}). Please complete or cancel it before assigning a new one.`);
      return;
    }

    setSelectedUser(user);
    setSelectedTemplate('custom');
    // Initialize with 1 empty manual order
    setNewAssignOrders([
      { title: '', image: '', price: '100', profit: '10', status: 'Pending' }
    ]);
    setShowModal(true);
  };

  const handleOrderCountChange = (valStr) => {
    let count = parseInt(valStr || '0');
    if (isNaN(count)) count = 0;
    if (count < 1) count = 1;
    if (count > 40) count = 40;

    setNewAssignOrders((prev) => {
      const next = [...prev];
      if (count > next.length) {
        for (let i = next.length; i < count; i++) {
          next.push({ title: '', image: '', price: '100', profit: '10', status: 'Pending' });
        }
      } else if (count < next.length) {
        return next.slice(0, count);
      }
      return next;
    });
  };

  const handleAddOrder = () => {
    setNewAssignOrders((prev) => [
      ...prev,
      { title: '', image: '', price: '100', profit: '10', status: 'Pending' }
    ]);
  };

  const handleRemoveOrder = (idx) => {
    setNewAssignOrders((prev) => {
      if (prev.length <= 1) {
        toast.error("A task must have at least one order.");
        return prev;
      }
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleConfirmAssignment = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    if (newAssignOrders.length === 0) {
      toast.error("Please add at least one order to the task.");
      return;
    }

    // Validate all manual orders
    for (let idx = 0; idx < newAssignOrders.length; idx++) {
      const o = newAssignOrders[idx];
      if (!o.title) {
        toast.error(`Order #${idx + 1} has no product selected/configured.`);
        return;
      }
      const priceVal = parseFloat(o.price);
      const profitVal = parseFloat(o.profit);
      if (isNaN(priceVal) || priceVal <= 0) {
        toast.error(`Order #${idx + 1} must have a valid positive price.`);
        return;
      }
      if (isNaN(profitVal) || profitVal < 0) {
        toast.error(`Order #${idx + 1} must have a valid positive commission.`);
        return;
      }
    }

    // Compute totals
    const totalAmountSum = newAssignOrders.reduce((sum, o) => sum + parseFloat(o.price || 0), 0);
    const totalProfitSum = newAssignOrders.reduce((sum, o) => sum + parseFloat(o.profit || 0), 0);
    const orderCountVal = newAssignOrders.length;
    const computedProfitPercent = totalAmountSum > 0 ? parseFloat(((totalProfitSum / totalAmountSum) * 100).toFixed(2)) : 0;

    // Generate unique order IDs
    const ordersWithIds = newAssignOrders.map((o, idx) => ({
      id: Date.now() + idx,
      title: o.title,
      image: o.image || null,
      price: parseFloat(o.price),
      profit: parseFloat(o.profit),
      status: 'Pending'
    }));

    const newTask = {
      id: 'TSK-' + Math.floor(10000 + Math.random() * 90000),
      user_id: selectedUser.id,
      username: selectedUser.username,
      total_amount: totalAmountSum,
      order_count: orderCountVal,
      profit_percent: computedProfitPercent,
      status: 'Pending',
      created_at: new Date().toISOString(),
      assigned_by: session.name,
      orders: ordersWithIds,
      referred_by_staff_id: selectedUser.referred_by_staff_id || null,
      member_of_admin_id: selectedUser.member_of_admin_id || null
    };

    try {
      const { error } = await supabase
        .from('cb_assigned_tasks')
        .insert([newTask]);

      if (error) {
        toast.error("Error assigning task: " + error.message);
        return;
      }

      // Pre-populate cb_orders so the user sees them immediately in the Pending tab
      const dbOrders = ordersWithIds.map((o, idx) => ({
        id: o.id,
        username: selectedUser.username,
        timestamp: new Date().toISOString(),
        status: 'Pending',
        title: o.title,
        image: o.image || null,
        price: parseFloat(o.price),
        profit: parseFloat(o.profit),
        type: 'product',
        assigned_task_id: newTask.id,
        assigned_order_index: idx
      }));

      const { error: insertOrdersError } = await supabase
        .from('cb_orders')
        .insert(dbOrders);

      if (insertOrdersError) {
        toast.error("Error creating individual orders: " + insertOrdersError.message);
        return;
      }

      setShowModal(false);
      setSelectedUser(null);
      toast.success(`Successfully assigned task ${newTask.id} with ${orderCountVal} manual orders to user ${newTask.username}!`);
      fetchUsersAndTasks();
    } catch (err) {
      toast.error("Failed to assign task: " + err.message);
    }
  };

  const handleCancelTask = async (taskId) => {
    if (window.confirm("Are you sure you want to cancel and delete this assigned task? All pending orders will be removed.")) {
      try {
        // Step 1: Delete all linked orders from cb_orders
        const { error: ordersDeleteError } = await supabase
          .from('cb_orders')
          .delete()
          .eq('assigned_task_id', taskId);

        if (ordersDeleteError) {
          toast.error("Error removing linked orders: " + ordersDeleteError.message);
          return;
        }

        // Step 2: Delete the task itself from cb_assigned_tasks
        const { error: taskDeleteError } = await supabase
          .from('cb_assigned_tasks')
          .delete()
          .eq('id', taskId);

        if (taskDeleteError) {
          toast.error("Error deleting task: " + taskDeleteError.message);
          return;
        }

        toast.success("Task and all linked orders cancelled and deleted successfully.");
        fetchUsersAndTasks();
      } catch (err) {
        toast.error("Failed to delete task: " + err.message);
      }
    }
  };

  const handlePurgeTaskData = async () => {
    const isConfirmed = window.confirm(
      "⚠️ WARNING: This operation is IRREVERSIBLE!\n\n" +
      "This will permanently delete all records of assigned tasks and associated orders (completed, pending, in-progress) from the database.\n\n" +
      "Are you absolutely sure you want to proceed?"
    );
    if (!isConfirmed) return;

    try {
      // Delete all from cb_orders
      const { error: ordersErr } = await supabase
        .from('cb_orders')
        .delete()
        .neq('id', 0);

      if (ordersErr) {
        throw ordersErr;
      }

      // Delete all from cb_assigned_tasks
      const { error: tasksErr } = await supabase
        .from('cb_assigned_tasks')
        .delete()
        .neq('id', '0');

      if (tasksErr) {
        throw tasksErr;
      }

      toast.success("Successfully purged all assigned tasks and associated orders from the database!");
      fetchUsersAndTasks();
    } catch (err) {
      console.error(err);
      toast.error("Failed to purge database records: " + err.message);
    }
  };

  const handleOpenEditOrdersModal = (task) => {
    setEditingTask(task);
    setEditingOrders(task.orders.map(o => ({ ...o })));
    setShowEditOrdersModal(true);
  };

  const handleSaveEditedOrders = async (e) => {
    e.preventDefault();
    if (!editingTask) return;

    for (let idx = 0; idx < editingOrders.length; idx++) {
      const o = editingOrders[idx];
      const pPrice = parseFloat(o.price);
      const pProfit = parseFloat(o.profit);
      if (isNaN(pPrice) || pPrice <= 0 || isNaN(pProfit) || pProfit < 0) {
        toast.error(`Order #${idx + 1} has invalid price or profit.`);
        return;
      }
    }

    try {
      // 1. Update cb_assigned_tasks JSON field
      const { error: taskErr } = await supabase
        .from('cb_assigned_tasks')
        .update({ orders: editingOrders })
        .eq('id', editingTask.id);

      if (taskErr) {
        toast.error("Error updating worksheet orders in task: " + taskErr.message);
        return;
      }

      // 2. Update individual order records in cb_orders table
      for (let idx = 0; idx < editingOrders.length; idx++) {
        const o = editingOrders[idx];
        await supabase
          .from('cb_orders')
          .update({
            title: o.title,
            price: parseFloat(o.price),
            profit: parseFloat(o.profit),
            status: o.status
          })
          .eq('assigned_task_id', editingTask.id)
          .eq('assigned_order_index', idx);
      }

      toast.success("Successfully updated worksheet orders!");
      setShowEditOrdersModal(false);
      setEditingTask(null);
      setEditingOrders([]);
      fetchUsersAndTasks();
    } catch (err) {
      toast.error("Failed to save changes: " + err.message);
    }
  };

  const getActiveTaskDisplay = (username) => {
    const task = assignedTasks.find(t => 
      t.username.toLowerCase() === username.toLowerCase() && 
      (t.status === 'Pending' || t.status === 'In Progress')
    );
    if (!task) return <span style={{ color: 'var(--text-admin-light)' }}>None</span>;
    const completed = task.orders.filter(o => o.status === 'Success').length;
    return (
      <span className={`badge ${task.status === 'In Progress' ? 'badge-warning' : 'badge-deposit-pending'}`} style={{ display: 'inline-flex', flexDirection: 'column', padding: '4px 8px' }}>
        <b>{task.status}</b>
        <span style={{ fontSize: 9 }}>({completed}/{task.orderCount} orders)</span>
      </span>
    );
  };

  // Preview computations
  const avgAmt = selectedUser ? (parseFloat(totalAmount) / parseInt(orderCount || '1')).toFixed(2) : '0.00';
  const profPerOrd = selectedUser ? (parseFloat(avgAmt) * (parseFloat(profitPercent || '0') / 100)).toFixed(2) : '0.00';
  const totalProf = selectedUser ? (parseFloat(profPerOrd) * parseInt(orderCount || '1')).toFixed(2) : '0.00';

  const filteredUsers = getFilteredUsers();
  const filteredTasks = getFilteredTasks();

  return (
    <div className="admin-page-container scale-up">
      <div className="admin-card">
        <h3 className="section-title" style={{ marginBottom: 12 }}>User Accounts Allocation</h3>
        <p style={{ fontSize: 13, color: 'var(--text-admin-light)', marginBottom: 16 }}>
          Assign custom retail matching worksheets to users to configure matching progress, order amounts, and commission yields.
        </p>

        <div className="filter-controls-row" style={{ padding: 0, marginBottom: 16 }}>
          <div className="search-box-wrapper" style={{ flex: 1, maxWidth: 360 }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" className="search-icon" style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-admin-light)' }}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input 
              type="text" 
              placeholder="Search user by ID or username..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              style={{ height: 36, width: '100%', borderRadius: 6, border: '1px solid var(--border-color)', paddingLeft: 36, outline: 'none' }}
            />
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Staff Node</th>
              <th>Active Balance</th>
              <th>Active Task Progress</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-admin-light)' }}>
                  No client accounts found matching filter node.
                </td>
              </tr>
            ) : (
              filteredUsers.map(u => (
                <tr key={u.id}>
                  <td><b>{u.id}</b></td>
                  <td>{u.username}</td>
                  <td><span className="badge badge-node">{u.referred_by_staff_id}</span></td>
                  <td style={{ fontWeight: 700 }}>$ {parseFloat(u.balance).toFixed(2)}</td>
                  <td>{getActiveTaskDisplay(u.username)}</td>
                  <td>
                    <button 
                      className="action-btn btn-approve"
                      onClick={() => handleOpenAssignModal(u)}
                      style={{ padding: '4px 12px', borderRadius: 4 }}
                    >
                      ➕ Assign Task
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="admin-card" style={{ marginTop: 24 }}>
        <h3 className="section-title" style={{ marginBottom: 16 }}>Worksheet Task Tracker</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Task ID</th>
              <th>Client User</th>
              <th>Total Sum</th>
              <th>Orders Count</th>
              <th>Profit Margin</th>
              <th>Assigned By</th>
              <th>Task Status</th>
              <th>Assigned Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-admin-light)' }}>
                  No assigned tasks active in this node.
                </td>
              </tr>
            ) : (
              filteredTasks.map(t => {
                const completedCount = t.orders.filter(o => o.status === 'Success').length;
                return (
                  <tr key={t.id}>
                    <td><b>{t.id}</b></td>
                    <td>{t.username}</td>
                    <td style={{ fontWeight: 700 }}>$ {t.totalAmount.toFixed(2)}</td>
                    <td>{t.orderCount} orders</td>
                    <td style={{ color: 'var(--color-green)', fontWeight: 600 }}>{t.profitPercent}%</td>
                    <td>{t.assignedBy}</td>
                    <td>
                      <span className={`badge ${
                        t.status === 'Completed' ? 'badge-success' : 
                        t.status === 'In Progress' ? 'badge-warning' : 'badge-deposit-pending'
                      }`}>
                        {t.status} ({completedCount}/{t.orderCount})
                      </span>
                    </td>
                    <td>{t.createdAt}</td>
                    <td>
                      <div className="action-buttons-cell">
                        {t.status !== 'Completed' ? (
                          <>
                            <button className="action-btn btn-view" onClick={() => handleOpenEditOrdersModal(t)} style={{ whiteSpace: 'nowrap' }}>
                              📝 Edit Orders
                            </button>
                            <button className="action-btn btn-reject" onClick={() => handleCancelTask(t.id)}>
                              Cancel
                            </button>
                          </>
                        ) : (
                          <span style={{ fontSize: 11, color: 'var(--text-admin-light)' }}>Locked</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Database Maintenance & System Control Center */}
      <div className="admin-card" style={{ marginTop: 24, border: '1px solid #f87171', backgroundColor: '#fef2f2' }}>
        <h3 className="section-title" style={{ marginBottom: 8, color: '#991b1b', display: 'flex', alignItems: 'center', gap: 8 }}>
          🛡️ Database Maintenance & System Control Center
        </h3>
        <p style={{ margin: '0 0 16px 0', fontSize: 13, color: '#7f1d1d', lineHeight: 1.5 }}>
          Admin tool for clearing existing records. You can purge all order tasking data and wipe ongoing or pending orders to reset the system.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <button 
            type="button"
            className="action-btn btn-reject"
            onClick={handlePurgeTaskData}
            style={{ 
              backgroundColor: '#dc2626', 
              color: '#ffffff', 
              border: 'none', 
              fontWeight: 700, 
              fontSize: 13, 
              padding: '10px 16px', 
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            🗑️ Wipe All Orders & Assigned Tasks From Database
          </button>
        </div>
      </div>

      {/* Assign Task Modal */}
      {showModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content-card" style={{ maxWidth: 650, width: '95%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header" style={{ paddingBottom: 12, borderBottom: '1px solid var(--border-color)', marginBottom: 12 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--text-admin-main)' }}>
                  Assign Manual Worksheet to {selectedUser.username}
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: 11, color: 'var(--text-admin-light)' }}>
                  Configure each matched order manually. Both the product title, price, and commission can be customized.
                </p>
              </div>
              <button className="modal-close-btn" onClick={() => { setShowModal(false); setSelectedUser(null); }}>✕</button>
            </div>

            <form onSubmit={handleConfirmAssignment} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div className="modal-body" style={{ flex: 1, overflowY: 'auto', paddingRight: 6, display: 'flex', flexDirection: 'column', gap: 16 }}>
                
                {/* Worksheet Template Selector */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, backgroundColor: 'var(--bg-surface-hover)', padding: 12, borderRadius: 6, border: '1px solid var(--border-color)' }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-admin-light)', textTransform: 'uppercase' }}>
                    Select Allocation Method
                  </label>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => {
                      const mode = e.target.value;
                      setSelectedTemplate(mode);
                      if (mode === 'M-1') {
                        setNewAssignOrders(TEMPLATE_M_1.map(item => ({
                          title: item.title,
                          image: item.image,
                          price: item.price.toString(),
                          profit: item.profit.toString(),
                          status: 'Pending'
                        })));
                      } else if (mode === 'M-2') {
                        setNewAssignOrders(TEMPLATE_M_2.map(item => ({
                          title: item.title,
                          image: item.image,
                          price: item.price.toString(),
                          profit: item.profit.toString(),
                          status: 'Pending'
                        })));
                      } else if (mode === 'M-3') {
                        setNewAssignOrders(TEMPLATE_M_3.map(item => ({
                          title: item.title,
                          image: item.image,
                          price: item.price.toString(),
                          profit: item.profit.toString(),
                          status: 'Pending'
                        })));
                      } else if (mode === 'M-4') {
                        setNewAssignOrders(TEMPLATE_M_4.map(item => ({
                          title: item.title,
                          image: item.image,
                          price: item.price.toString(),
                          profit: item.profit.toString(),
                          status: 'Pending'
                        })));
                      } else if (mode === 'C-1') {
                        setNewAssignOrders(TEMPLATE_C_1.map(item => ({
                          title: item.title,
                          image: item.image,
                          price: item.price.toString(),
                          profit: item.profit.toString(),
                          status: 'Pending'
                        })));
                      } else if (mode === 'C-2') {
                        setNewAssignOrders(TEMPLATE_C_2.map(item => ({
                          title: item.title,
                          image: item.image,
                          price: item.price.toString(),
                          profit: item.profit.toString(),
                          status: 'Pending'
                        })));
                      } else if (mode === 'C-3') {
                        setNewAssignOrders(TEMPLATE_C_3.map(item => ({
                          title: item.title,
                          image: item.image,
                          price: item.price.toString(),
                          profit: item.profit.toString(),
                          status: 'Pending'
                        })));
                      } else if (mode === 'C-4') {
                        setNewAssignOrders(TEMPLATE_C_4.map(item => ({
                          title: item.title,
                          image: item.image,
                          price: item.price.toString(),
                          profit: item.profit.toString(),
                          status: 'Pending'
                        })));
                      } else {
                        setNewAssignOrders([
                          { title: '', image: '', price: '100', profit: '10', status: 'Pending' }
                        ]);
                      }
                    }}
                    style={{
                      fontSize: 13,
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-admin-card)',
                      color: 'var(--text-admin-main)',
                      outline: 'none',
                      width: '100%',
                      fontWeight: 600
                    }}
                  >
                    <option value="custom">✍️ Custom Manual Worksheet (Assign items one-by-one)</option>
                    <option value="M-1">📦 Order Template M-1 (40 Items - total: $30,973.03 | profit: $210.54)</option>
                    <option value="M-2">📦 Order Template M-2 (40 Items - total: $98,640.93 | profit: $496.84)</option>
                    <option value="M-3">📦 Order Template M-3 (40 Items - total: $354,599.82 | profit: $4,605.05)</option>
                    <option value="M-4">📦 Order Template M-4 (40 Items - total: $512,003.42 | profit: $7,648.02)</option>
                    <option value="C-1">💼 Order Template C-1 (40 Items - total: $817.17 | profit: $2.69)</option>
                    <option value="C-2">💼 Order Template C-2 (40 Items - total: $3,960.24 | profit: $49.71)</option>
                    <option value="C-3">💼 Order Template C-3 (40 Items - total: $110,747.83 | profit: $9,238.89)</option>
                    <option value="C-4">💼 Order Template C-4 (40 Items - total: $159,526.35 | profit: $14,637.48)</option>
                  </select>
                </div>

                {selectedTemplate === 'custom' && (
                  /* Control Header */
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'end', backgroundColor: 'var(--bg-surface-hover)', padding: 12, borderRadius: 6, border: '1px solid var(--border-color)' }}>
                    <div className="form-group-sla" style={{ margin: 0 }}>
                      <label style={{ fontWeight: 700 }}>Number of Orders in Task</label>
                      <input 
                        type="number"
                        value={newAssignOrders.length}
                        onChange={(e) => handleOrderCountChange(e.target.value)}
                        required
                        className="input-sla-field"
                        min="1"
                        max="40"
                        style={{ height: 36 }}
                      />
                      <span style={{ fontSize: 9, color: 'var(--text-admin-light)', marginTop: 4, display: 'block' }}>
                        * Adjust the number of orders dynamically.
                      </span>
                    </div>
                    <button 
                      type="button" 
                      className="action-btn btn-view" 
                      onClick={handleAddOrder}
                      style={{ height: 36, display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}
                    >
                      ➕ Add Order Row
                    </button>
                  </div>
                )}

                {/* Orders Preview Area */}
                {selectedTemplate !== 'custom' ? (
                  <div style={{ border: '1px solid var(--border-color)', borderRadius: 8, backgroundColor: 'var(--bg-admin-card)', overflow: 'hidden' }}>
                    <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface-hover)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-admin-muted)' }}>
                      Preset Worksheet Order Sequence ({newAssignOrders.length} items)
                    </div>
                    <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                      <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface-hover)', fontSize: 10, textTransform: 'uppercase', opacity: 0.8 }}>
                            <th style={{ padding: '8px 12px', width: 50 }}>Sr.</th>
                            <th style={{ padding: '8px 12px' }}>Product Title</th>
                            <th style={{ padding: '8px 12px', textAlign: 'right', width: 100 }}>Price</th>
                            <th style={{ padding: '8px 12px', textAlign: 'right', width: 100 }}>Profit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {newAssignOrders.map((o, oIdx) => (
                            <tr key={oIdx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                              <td style={{ padding: '8px 12px', fontWeight: 600 }}>{oIdx + 1}</td>
                              <td style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                                {o.image && (
                                  <img 
                                    src={o.image} 
                                    alt="" 
                                    referrerPolicy="no-referrer"
                                    style={{ width: 24, height: 24, objectFit: 'contain', border: '1px solid var(--border-color)', borderRadius: 4, padding: 1, backgroundColor: 'white' }} 
                                  />
                                )}
                                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: 280 }} title={o.title}>
                                  {o.title}
                                </span>
                              </td>
                              <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600 }}>$ {parseFloat(o.price).toFixed(2)}</td>
                              <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: 'var(--color-green)' }}>$ {parseFloat(o.profit).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {newAssignOrders.map((order, idx) => (
                      <div 
                        key={idx} 
                        style={{ 
                          border: '1px solid var(--border-color)', 
                          borderRadius: 8, 
                          padding: 12, 
                          backgroundColor: 'var(--bg-admin-card)',
                          position: 'relative'
                        }}
                      >
                        {/* Order Row Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-admin-muted)', textTransform: 'uppercase' }}>
                            Order #{idx + 1}
                          </span>
                          {newAssignOrders.length > 1 && (
                            <button 
                              type="button" 
                              onClick={() => handleRemoveOrder(idx)}
                              style={{ 
                                background: 'none', 
                                border: 'none', 
                                color: '#ef4444', 
                                fontSize: 11, 
                                cursor: 'pointer', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 2 
                              }}
                            >
                              ✕ Remove
                            </button>
                          )}
                        </div>

                        {/* Dropdown for products to select */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-admin-light)', textTransform: 'uppercase' }}>
                              Select Product Catalog
                            </label>
                            <select
                              onChange={(e) => {
                                if (e.target.value !== "") {
                                  const prod = products[parseInt(e.target.value)];
                                  const updated = [...newAssignOrders];
                                  updated[idx] = {
                                    ...updated[idx],
                                    title: prod.title,
                                    image: prod.image,
                                    price: String(prod.price),
                                    profit: String(prod.profit || (prod.price * 0.1).toFixed(2))
                                  };
                                  setNewAssignOrders(updated);
                                }
                              }}
                              style={{ 
                                fontSize: 11, 
                                padding: '6px', 
                                borderRadius: 4, 
                                border: '1px solid var(--border-color)', 
                                backgroundColor: 'var(--bg-surface-hover)',
                                color: 'var(--text-admin-main)',
                                outline: 'none',
                                width: '100%'
                              }}
                              defaultValue=""
                            >
                              <option value="">-- Choose a product to auto-fill title, image, price & profit --</option>
                              {products.map((p, pIdx) => (
                                <option key={pIdx} value={pIdx}>
                                  {p.title.length > 60 ? p.title.substring(0, 60) + '...' : p.title} (${p.price})
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Custom fields & Image Preview */}
                          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                            {order.image && (
                              <img 
                                src={order.image} 
                                alt="Product" 
                                referrerPolicy="no-referrer"
                                style={{ 
                                  width: 44, 
                                  height: 44, 
                                  objectFit: 'contain', 
                                  border: '1px solid var(--border-color)', 
                                  borderRadius: 4, 
                                  backgroundColor: 'var(--bg-surface-hover)', 
                                  padding: 2,
                                  marginTop: 18
                                }} 
                              />
                            )}
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                              <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-admin-light)', textTransform: 'uppercase' }}>
                                Product Title / Name
                              </label>
                              <input 
                                type="text"
                                value={order.title}
                                onChange={(e) => {
                                  const updated = [...newAssignOrders];
                                  updated[idx].title = e.target.value;
                                  setNewAssignOrders(updated);
                                }}
                                required
                                placeholder="e.g. barkTHINS Snacking Chocolate"
                                style={{ 
                                  width: '100%', 
                                  height: 34, 
                                  borderRadius: 4, 
                                  border: '1px solid var(--border-color)', 
                                  padding: '0 8px', 
                                  fontSize: 12 
                                }}
                              />
                            </div>
                          </div>

                          {/* Price and Profit */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-admin-light)', textTransform: 'uppercase' }}>
                                Price ($)
                              </label>
                              <input 
                                type="number"
                                step="0.01"
                                value={order.price}
                                onChange={(e) => {
                                  const updated = [...newAssignOrders];
                                  updated[idx].price = e.target.value;
                                  setNewAssignOrders(updated);
                                }}
                                required
                                placeholder="0.00"
                                style={{ 
                                  width: '100%', 
                                  height: 34, 
                                  borderRadius: 4, 
                                  border: '1px solid var(--border-color)', 
                                  padding: '0 8px', 
                                  fontSize: 12 
                                }}
                              />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-admin-light)', textTransform: 'uppercase' }}>
                                Commission / Profit ($)
                              </label>
                              <input 
                                type="number"
                                step="0.01"
                                value={order.profit}
                                onChange={(e) => {
                                  const updated = [...newAssignOrders];
                                  updated[idx].profit = e.target.value;
                                  setNewAssignOrders(updated);
                                }}
                                required
                                placeholder="0.00"
                                style={{ 
                                  width: '100%', 
                                  height: 34, 
                                  borderRadius: 4, 
                                  border: '1px solid var(--border-color)', 
                                  padding: '0 8px', 
                                  fontSize: 12 
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Computation Summary block */}
                <div style={{ backgroundColor: 'var(--color-success-bg)', padding: 12, borderRadius: 6, border: '1px solid var(--color-success)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <h4 style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-success)', textTransform: 'uppercase', margin: 0 }}>
                    Manual Worksheet Summary
                  </h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-admin-main)' }}>
                    <span>Total Orders:</span>
                    <b>{newAssignOrders.length}</b>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-admin-main)' }}>
                    <span>Computed Total Price ($):</span>
                    <b>${newAssignOrders.reduce((sum, o) => sum + parseFloat(o.price || 0), 0).toFixed(2)}</b>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--color-success)', margin: '4px 0', opacity: 0.3 }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, color: 'var(--color-success)' }}>
                    <span>Total User Profit / Commission:</span>
                    <span>${newAssignOrders.reduce((sum, o) => sum + parseFloat(o.profit || 0), 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: 12, marginTop: 12, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  className="action-btn"
                  style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-admin-muted)' }}
                  onClick={() => { setShowModal(false); setSelectedUser(null); }}
                >
                  Cancel
                </button>
                <button type="submit" className="sla-submit-btn">
                  ✅ Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Worksheet Orders Modal */}
      {showEditOrdersModal && editingTask && (
        <div className="modal-overlay">
          <div className="modal-content-card" style={{ maxWidth: 650, width: '90%', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header" style={{ paddingBottom: 12, borderBottom: '1px solid var(--border-color)', marginBottom: 12 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--text-admin-main)' }}>
                  Edit Worksheet Orders (Task: {editingTask.id})
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: 11, color: 'var(--text-admin-light)' }}>
                  Assigned to: <b>{editingTask.username}</b> | Total sum: <b>${editingTask.totalAmount.toFixed(2)}</b>
                </p>
              </div>
              <button className="modal-close-btn" onClick={() => { setShowEditOrdersModal(false); setEditingTask(null); }}>✕</button>
            </div>

            <form onSubmit={handleSaveEditedOrders} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div className="modal-body" style={{ flex: 1, overflowY: 'auto', paddingRight: 6, display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ backgroundColor: 'var(--color-warning-bg)', border: '1px solid var(--color-warning)', padding: 10, borderRadius: 6, fontSize: 11, color: 'var(--text-admin-main)', lineHeight: 1.4 }}>
                  💡 <b>Pro-Tip:</b> You can customize each individual order in the worksheet sequence. Editing prices and profits here will directly update both the task worksheet and the user's pending order screen. To prevent discrepancy, edit <b>Pending</b> orders only.
                </div>

                {editingOrders.map((order, idx) => {
                  const isCompleted = order.status === 'Success';
                  return (
                    <div 
                      key={idx} 
                      style={{ 
                        border: '1px solid var(--border-color)', 
                        borderRadius: 8, 
                        padding: 12, 
                        backgroundColor: isCompleted ? 'var(--bg-surface-hover)' : 'var(--bg-admin-card)',
                        opacity: isCompleted ? 0.8 : 1,
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-admin-muted)', textTransform: 'uppercase' }}>
                          Order #{idx + 1} <span style={{ fontSize: 10, fontWeight: 400, textTransform: 'none', marginLeft: 6 }}>({isCompleted ? '✓ Submitted' : '⌛ Pending'})</span>
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 11, color: 'var(--text-admin-light)' }}>Status:</span>
                          <select
                            value={order.status}
                            onChange={(e) => {
                              const newOrders = [...editingOrders];
                              newOrders[idx].status = e.target.value;
                              setEditingOrders(newOrders);
                            }}
                            style={{ 
                              fontSize: 12, 
                              padding: '2px 6px', 
                              borderRadius: 4, 
                              border: '1px solid var(--border-color)',
                              outline: 'none',
                              backgroundColor: isCompleted ? 'var(--border-color)' : 'var(--bg-admin-card)',
                              color: 'var(--text-admin-main)'
                            }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Success">Success</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {/* Quick fill dropdown from Catalog */}
                        {!isCompleted && products.length > 0 && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-admin-light)', textTransform: 'uppercase' }}>Quick Fill from Product Catalog</label>
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  const prod = products[parseInt(e.target.value)];
                                  const newOrders = [...editingOrders];
                                  newOrders[idx].title = prod.title;
                                  newOrders[idx].image = prod.image;
                                  newOrders[idx].price = prod.price;
                                  // Re-calculate profit based on task's profit yield percent
                                  const pYield = parseFloat(editingTask.profitPercent || '5');
                                  newOrders[idx].profit = parseFloat((prod.price * (pYield / 100)).toFixed(2));
                                  setEditingOrders(newOrders);
                                }
                              }}
                              style={{ 
                                fontSize: 11, 
                                padding: '6px', 
                                borderRadius: 4, 
                                border: '1px solid #cbd5e1', 
                                backgroundColor: '#f8fafc',
                                outline: 'none'
                              }}
                              defaultValue=""
                            >
                              <option value="">-- Choose a product to auto-fill title, image, price & profit --</option>
                              {products.map((p, pIdx) => (
                                <option key={pIdx} value={pIdx}>
                                  {p.title.length > 50 ? p.title.substring(0, 50) + '...' : p.title} (${p.price})
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-admin-light)', textTransform: 'uppercase' }}>Product Title</label>
                          <input 
                            type="text"
                            value={order.title}
                            onChange={(e) => {
                              const newOrders = [...editingOrders];
                              newOrders[idx].title = e.target.value;
                              setEditingOrders(newOrders);
                            }}
                            required
                            disabled={isCompleted}
                            style={{ 
                              width: '100%', 
                              height: 34, 
                              borderRadius: 4, 
                              border: '1px solid var(--border-color)', 
                              padding: '0 8px', 
                              fontSize: 12,
                              backgroundColor: isCompleted ? 'var(--bg-surface-hover)' : 'var(--bg-admin-card)',
                              color: 'var(--text-admin-main)'
                            }}
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-admin-light)', textTransform: 'uppercase' }}>Price ($)</label>
                            <input 
                              type="number"
                              step="0.01"
                              value={order.price}
                              onChange={(e) => {
                                const newOrders = [...editingOrders];
                                newOrders[idx].price = e.target.value;
                                // Automatically recalculate profit using the task's profit commission yield percentage
                                const pYield = parseFloat(editingTask.profitPercent || '5');
                                const val = parseFloat(e.target.value || '0');
                                newOrders[idx].profit = parseFloat((val * (pYield / 100)).toFixed(2));
                                setEditingOrders(newOrders);
                              }}
                              required
                              disabled={isCompleted}
                              style={{ 
                                width: '100%', 
                                height: 34, 
                                borderRadius: 4, 
                                border: '1px solid var(--border-color)', 
                                padding: '0 8px', 
                                fontSize: 12,
                                backgroundColor: isCompleted ? 'var(--bg-surface-hover)' : 'var(--bg-admin-card)',
                                color: 'var(--text-admin-main)'
                              }}
                            />
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-admin-light)', textTransform: 'uppercase' }}>Profit ($)</label>
                            <input 
                              type="number"
                              step="0.01"
                              value={order.profit}
                              onChange={(e) => {
                                const newOrders = [...editingOrders];
                                newOrders[idx].profit = e.target.value;
                                setEditingOrders(newOrders);
                              }}
                              required
                              disabled={isCompleted}
                              style={{ 
                                width: '100%', 
                                height: 34, 
                                borderRadius: 4, 
                                border: '1px solid var(--border-color)', 
                                padding: '0 8px', 
                                fontSize: 12,
                                backgroundColor: isCompleted ? 'var(--bg-surface-hover)' : 'var(--bg-admin-card)',
                                color: 'var(--text-admin-main)'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: 12, marginTop: 12, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  className="action-btn"
                  style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-admin-muted)' }}
                  onClick={() => { setShowEditOrdersModal(false); setEditingTask(null); }}
                >
                  Cancel
                </button>
                <button type="submit" className="sla-submit-btn">
                  💾 Save All Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .badge-node {
          background-color: var(--bg-surface-hover);
          color: var(--text-admin-muted);
          font-weight: 600;
        }

        .filter-controls-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .badge-deposit-pending {
          background-color: #fef3c7;
          color: #d97706;
          border: 1px solid #fde68a;
        }

        .action-buttons-cell {
          display: flex;
          gap: 6px;
        }

        .action-btn {
          height: 28px;
          padding: 0 10px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-view {
          background-color: #eff6ff;
          color: #2563eb;
        }

        .btn-approve {
          background-color: #ecfdf5;
          color: #10b981;
        }

        .btn-reject {
          background-color: #fef2f2;
          color: #ef4444;
        }

        .form-group-sla {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group-sla label {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-admin-light);
          text-transform: uppercase;
        }

        .input-sla-field {
          height: 38px;
          border-radius: 6px;
          border: 1px solid var(--border-color);
          padding: 0 12px;
          font-size: 13px;
          color: var(--text-admin-main);
          background-color: var(--bg-surface);
          outline: none;
        }

        .input-sla-field:focus {
          background-color: var(--bg-admin-card);
          border-color: var(--color-primary);
        }

        .sla-submit-btn {
          height: 40px;
          border-radius: 6px;
          background-color: var(--color-primary);
          color: white;
          font-weight: 600;
          font-size: 13px;
          border: none;
          cursor: pointer;
          padding: 0 16px;
        }

        .sla-submit-btn:hover {
          background-color: var(--color-primary-hover);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15,23,42,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content-card {
          background-color: var(--bg-admin-card);
          border-radius: 8px;
          border: 1px solid var(--border-color);
          width: 90%;
          max-width: 500px;
          padding: 20px;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 8px;
          margin-bottom: 12px;
        }

        .modal-header h3 {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-admin-main);
        }

        .modal-close-btn {
          background: none;
          border: none;
          font-size: 16px;
          color: var(--text-admin-light);
          cursor: pointer;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          border-top: 1px solid var(--border-color);
          padding-top: 10px;
        }
      `}</style>
    </div>
  );
}

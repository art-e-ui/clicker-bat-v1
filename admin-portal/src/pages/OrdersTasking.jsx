import React, { useState, useEffect } from 'react';
import { PRODUCT_CATALOG } from '../data/products';
import { supabase } from '../supabase';
import toast from 'react-hot-toast';
import { 
  ClipboardList, 
  UserPlus, 
  ListOrdered, 
  TrendingUp, 
  DollarSign, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Layers, 
  AlertCircle,
  HelpCircle,
  Briefcase,
  Layers3,
  Sparkles,
  Award,
  Database,
  Eye,
  Info,
  Layers as LayersIcon,
  BadgeAlert,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const TEMPLATE_M_1 = [
  { sr: 1, price: 498.06, profit: 1.10, title: "RÉNERGIE LIFT MULTI-ACTION ULTRA FACE CREAM WITH SPF 30 1.0 Fl. Oz. (30 mL)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-1.png" },
  { sr: 2, price: 476.07, profit: 0.80, title: "Apple Watch Series 9 GPS 41mm Smartwatch with Midnight Aluminum Case", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-2.png" },
  { sr: 3, price: 500.10, profit: 1.00, title: "Sony WH-1000XM4 Wireless Noise Canceling Overhead Headphones", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-3.png" },
  { sr: 4, price: 456.11, profit: 0.77, title: "Nike Air Max 270 Sneakers Athletic Outdoor Sports Running Shoes", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-4.png" },
  { sr: 5, price: 499.12, profit: 0.69, title: "Stanley Quencher H2.0 FlowState Tumbler 40oz Vacuum Insulated Mug", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-5.png" },
  { sr: 6, price: 486.30, profit: 0.74, title: "BLEU DE CHANEL Eau de Parfum Spray for Men 3.4 Fl. Oz.", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-6.png" },
  { sr: 7, price: 501.66, profit: 1.01, title: "L'Oreal Paris Revitalift Pure Hyaluronic Acid Face Serum", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-7.png" },
  { sr: 8, price: 487.12, profit: 0.89, title: "Dyson V8 Absolute Cordless Vacuum Cleaner with HEPA Filtration", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-8.png" },
  { sr: 9, price: 491.90, profit: 0.88, title: "GrandPad Senior Tablet (Renewed) with Phone", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-1.png" },
  { sr: 10, price: 503.65, profit: 1.40, title: "Woeoe Thick Warm Winter Hat Yellow", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-2.png" },
  { sr: 11, price: 503.44, profit: 0.80, title: "Photozyme DNA Repair Enzymes Probiotic P291", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-3.png" },
  { sr: 12, price: 489.87, profit: 0.76, title: "Elfeves Lot 4 PCS Classic Men’s", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-4.png" },
  { sr: 13, price: 504.00, profit: 1.10, title: "Tommy Hilfiger Men’s Oxford Ribb Stripe", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-5.png" },
  { sr: 14, price: 495.65, profit: 0.86, title: "Scales Of Justice Blue Navy Blue", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-6.png" },
  { sr: 15, price: 673.80, profit: 68.00, title: "AUTOGEN 12V & 24V Jump Starter", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-7.png" },
  { sr: 16, price: 733.80, profit: 1.20, title: "Autel Maxisys CV MS908CV", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-8.png" },
  { sr: 17, price: 731.70, profit: 1.00, title: "Tyrell Chenergy 1800/900 Peak Amp 12V/24V", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-9.png" },
  { sr: 18, price: 729.50, profit: 1.43, title: "NOCO Boost HD GB70 2000 Amp", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-10.png" },
  { sr: 19, price: 721.60, profit: 1.21, title: "Garmin DriveSmart 86", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-11.png" },
  { sr: 20, price: 730.40, profit: 1.20, title: "CARTMAN 3 Pack Warning Triangle DOT", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-12.png" },
  { sr: 21, price: 727.90, profit: 1.10, title: "Schumacher DSR115 DSR ProSeries Rechargeable Pro", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-13.png" },
  { sr: 22, price: 739.30, profit: 1.80, title: "Touch Screen Android Head Unit for", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-14.png" },
  { sr: 23, price: 733.90, profit: 1.30, title: "ProFormX Velocity 14 Golf Cart Wheels", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-15.png" },
  { sr: 24, price: 721.40, profit: 1.10, title: "Mob Armor Mob Mount Switch Magnetic", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-16.png" },
  { sr: 25, price: 734.20, profit: 1.30, title: "1 New ROAD CREW 11L-16 12", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-17.png" },
  { sr: 26, price: 740.40, profit: 1.50, title: "Walker Products 350-64080 Oxygen Sensor", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-18.png" },
  { sr: 27, price: 749.60, profit: 1.60, title: "Walker Products 350-34643 Oxygen Sensor", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-19.png" },
  { sr: 28, price: 1036.54, profit: 97.00, title: "Inteset 12ft 40amp J1772 EV Extension", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-20.png" },
  { sr: 29, price: 1121.54, profit: 1.70, title: "RÉNERGIE LIFT MULTI-ACTION ULTRA FACE CREAM WITH SPF 30 1.0 Fl. Oz. (30 mL)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-1.png" },
  { sr: 30, price: 1123.56, profit: 1.60, title: "Apple Watch Series 9 GPS 41mm Smartwatch with Midnight Aluminum Case", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-2.png" },
  { sr: 31, price: 999.78, profit: 1.00, title: "Sony WH-1000XM4 Wireless Noise Canceling Overhead Headphones", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-3.png" },
  { sr: 32, price: 1002.40, profit: 1.10, title: "Nike Air Max 270 Sneakers Athletic Outdoor Sports Running Shoes", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-4.png" },
  { sr: 33, price: 1123.40, profit: 1.50, title: "Stanley Quencher H2.0 FlowState Tumbler 40oz Vacuum Insulated Mug", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-5.png" },
  { sr: 34, price: 1110.50, profit: 1.40, title: "BLEU DE CHANEL Eau de Parfum Spray for Men 3.4 Fl. Oz.", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-6.png" },
  { sr: 35, price: 1123.76, profit: 1.30, title: "L'Oreal Paris Revitalift Pure Hyaluronic Acid Face Serum", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-7.png" },
  { sr: 36, price: 1137.66, profit: 1.40, title: "Dyson V8 Absolute Cordless Vacuum Cleaner with HEPA Filtration", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-8.png" },
  { sr: 37, price: 1138.99, profit: 1.50, title: "GrandPad Senior Tablet (Renewed) with Phone", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-1.png" },
  { sr: 38, price: 1136.86, profit: 1.40, title: "Woeoe Thick Warm Winter Hat Yellow", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-2.png" },
  { sr: 39, price: 1144.79, profit: 1.30, title: "Photozyme DNA Repair Enzymes Probiotic P291", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-3.png" },
  { sr: 40, price: 1147.74, profit: 1.90, title: "Elfeves Lot 4 PCS Classic Men’s", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-4.png" }
];

export const TEMPLATE_C_1 = [
  { sr: 1, price: 21.01, profit: 0.07, title: "RÉNERGIE LIFT MULTI-ACTION ULTRA FACE CREAM WITH SPF 30 1.0 Fl. Oz. (30 mL)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-1.png" },
  { sr: 2, price: 20.12, profit: 0.06, title: "Apple Watch Series 9 GPS 41mm Smartwatch with Midnight Aluminum Case", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-2.png" },
  { sr: 3, price: 19.45, profit: 0.04, title: "Sony WH-1000XM4 Wireless Noise Canceling Overhead Headphones", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-3.png" },
  { sr: 4, price: 20.11, profit: 0.07, title: "Nike Air Max 270 Sneakers Athletic Outdoor Sports Running Shoes", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-4.png" },
  { sr: 5, price: 20.43, profit: 0.06, title: "Stanley Quencher H2.0 FlowState Tumbler 40oz Vacuum Insulated Mug", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-5.png" },
  { sr: 6, price: 20.56, profit: 0.05, title: "BLEU DE CHANEL Eau de Parfum Spray for Men 3.4 Fl. Oz.", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-6.png" },
  { sr: 7, price: 20.88, profit: 0.08, title: "L'Oreal Paris Revitalift Pure Hyaluronic Acid Face Serum", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-7.png" },
  { sr: 8, price: 20.94, profit: 0.07, title: "Dyson V8 Absolute Cordless Vacuum Cleaner with HEPA Filtration", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-8.png" },
  { sr: 9, price: 21.12, profit: 0.08, title: "GrandPad Senior Tablet (Renewed) with Phone", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-1.png" },
  { sr: 10, price: 19.88, profit: 0.06, title: "Woeoe Thick Warm Winter Hat Yellow", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-2.png" },
  { sr: 11, price: 18.98, profit: 0.05, title: "Photozyme DNA Repair Enzymes Probiotic P291", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-3.png" },
  { sr: 12, price: 20.77, profit: 0.09, title: "Elfeves Lot 4 PCS Classic Men’s", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-4.png" },
  { sr: 13, price: 19.45, profit: 0.08, title: "Tommy Hilfiger Men’s Oxford Ribb Stripe", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-5.png" },
  { sr: 14, price: 20.77, profit: 0.07, title: "Scales Of Justice Blue Navy Blue", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-6.png" },
  { sr: 15, price: 21.21, profit: 0.07, title: "AUTOGEN 12V & 24V Jump Starter", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-7.png" },
  { sr: 16, price: 21.11, profit: 0.06, title: "Autel Maxisys CV MS908CV", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-8.png" },
  { sr: 17, price: 20.56, profit: 0.05, title: "Tyrell Chenergy 1800/900 Peak Amp 12V/24V", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-9.png" },
  { sr: 18, price: 20.88, profit: 0.08, title: "NOCO Boost HD GB70 2000 Amp", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-10.png" },
  { sr: 19, price: 20.94, profit: 0.07, title: "Garmin DriveSmart 86", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-11.png" },
  { sr: 20, price: 21.12, profit: 0.08, title: "CARTMAN 3 Pack Warning Triangle DOT", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-12.png" },
  { sr: 21, price: 19.88, profit: 0.06, title: "Schumacher DSR115 DSR ProSeries Rechargeable Pro", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-13.png" },
  { sr: 22, price: 19.88, profit: 0.06, title: "Touch Screen Android Head Unit for", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-14.png" },
  { sr: 23, price: 18.98, profit: 0.05, title: "ProFormX Velocity 14 Golf Cart Wheels", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-15.png" },
  { sr: 24, price: 20.77, profit: 0.09, title: "Mob Armor Mob Mount Switch Magnetic", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-16.png" },
  { sr: 25, price: 19.45, profit: 0.08, title: "1 New ROAD CREW 11L-16 12", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-17.png" },
  { sr: 26, price: 20.77, profit: 0.07, title: "Walker Products 350-64080 Oxygen Sensor", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-18.png" },
  { sr: 27, price: 21.21, profit: 0.07, title: "Walker Products 350-34643 Oxygen Sensor", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-19.png" },
  { sr: 28, price: 21.11, profit: 0.06, title: "Inteset 12ft 40amp J1772 EV Extension", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-20.png" },
  { sr: 29, price: 20.56, profit: 0.05, title: "RÉNERGIE LIFT MULTI-ACTION ULTRA FACE CREAM WITH SPF 30 1.0 Fl. Oz. (30 mL)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-1.png" },
  { sr: 30, price: 20.88, profit: 0.08, title: "Apple Watch Series 9 GPS 41mm Smartwatch with Midnight Aluminum Case", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-2.png" },
  { sr: 31, price: 20.94, profit: 0.07, title: "Sony WH-1000XM4 Wireless Noise Canceling Overhead Headphones", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-3.png" },
  { sr: 32, price: 21.12, profit: 0.08, title: "Nike Air Max 270 Sneakers Athletic Outdoor Sports Running Shoes", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-4.png" },
  { sr: 33, price: 19.88, profit: 0.06, title: "Stanley Quencher H2.0 FlowState Tumbler 40oz Vacuum Insulated Mug", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-5.png" },
  { sr: 34, price: 19.88, profit: 0.06, title: "BLEU DE CHANEL Eau de Parfum Spray for Men 3.4 Fl. Oz.", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-6.png" },
  { sr: 35, price: 18.98, profit: 0.05, title: "L'Oreal Paris Revitalift Pure Hyaluronic Acid Face Serum", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-7.png" },
  { sr: 36, price: 20.77, profit: 0.09, title: "Dyson V8 Absolute Cordless Vacuum Cleaner with HEPA Filtration", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-8.png" },
  { sr: 37, price: 20.94, profit: 0.07, title: "GrandPad Senior Tablet (Renewed) with Phone", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-1.png" },
  { sr: 38, price: 21.12, profit: 0.08, title: "Woeoe Thick Warm Winter Hat Yellow", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-2.png" },
  { sr: 39, price: 19.88, profit: 0.06, title: "Photozyme DNA Repair Enzymes Probiotic P291", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-3.png" },
  { sr: 40, price: 19.88, profit: 0.06, title: "Elfeves Lot 4 PCS Classic Men’s", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-4.png" }
];

export const TEMPLATE_C_2 = [
  { sr: 1, price: 40.2, profit: 0.12, title: "RÉNERGIE LIFT MULTI-ACTION ULTRA FACE CREAM WITH SPF 30 1.0 Fl. Oz. (30 mL)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-1.png" },
  { sr: 2, price: 43.8, profit: 0.11, title: "Apple Watch Series 9 GPS 41mm Smartwatch with Midnight Aluminum Case", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-2.png" },
  { sr: 3, price: 46.8, profit: 0.15, title: "Sony WH-1000XM4 Wireless Noise Canceling Overhead Headphones", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-3.png" },
  { sr: 4, price: 43.8, profit: 0.11, title: "Nike Air Max 270 Sneakers Athletic Outdoor Sports Running Shoes", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-4.png" },
  { sr: 5, price: 47.8, profit: 0.14, title: "Stanley Quencher H2.0 FlowState Tumbler 40oz Vacuum Insulated Mug", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-5.png" },
  { sr: 6, price: 40.2, profit: 0.27, title: "BLEU DE CHANEL Eau de Parfum Spray for Men 3.4 Fl. Oz.", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-6.png" },
  { sr: 7, price: 43.8, profit: 0.11, title: "L'Oreal Paris Revitalift Pure Hyaluronic Acid Face Serum", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-7.png" },
  { sr: 8, price: 47.8, profit: 0.28, title: "Dyson V8 Absolute Cordless Vacuum Cleaner with HEPA Filtration", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-8.png" },
  { sr: 9, price: 43.8, profit: 0.11, title: "GrandPad Senior Tablet (Renewed) with Phone", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-1.png" },
  { sr: 10, price: 46.8, profit: 0.15, title: "Woeoe Thick Warm Winter Hat Yellow", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-2.png" },
  { sr: 11, price: 47.8, profit: 0.14, title: "Photozyme DNA Repair Enzymes Probiotic P291", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-3.png" },
  { sr: 12, price: 43.8, profit: 0.11, title: "Elfeves Lot 4 PCS Classic Men’s", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-4.png" },
  { sr: 13, price: 45.9, profit: 0.14, title: "Tommy Hilfiger Men’s Oxford Ribb Stripe", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-5.png" },
  { sr: 14, price: 43.8, profit: 0.11, title: "Scales Of Justice Blue Navy Blue", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-6.png" },
  { sr: 15, price: 47.8, profit: 0.14, title: "AUTOGEN 12V & 24V Jump Starter", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-7.png" },
  { sr: 16, price: 81.874, profit: 14, title: "Autel Maxisys CV MS908CV", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-8.png" },
  { sr: 17, price: 94.11, profit: 0.23, title: "Tyrell Chenergy 1800/900 Peak Amp 12V/24V", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-9.png" },
  { sr: 18, price: 93.24, profit: 0.22, title: "NOCO Boost HD GB70 2000 Amp", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-10.png" },
  { sr: 19, price: 91.88, profit: 0.2, title: "Garmin DriveSmart 86", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-11.png" },
  { sr: 20, price: 94.99, profit: 0.3, title: "CARTMAN 3 Pack Warning Triangle DOT", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-12.png" },
  { sr: 21, price: 91.96, profit: 0.19, title: "Schumacher DSR115 DSR ProSeries Rechargeable Pro", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-13.png" },
  { sr: 22, price: 91.88, profit: 0.2, title: "Touch Screen Android Head Unit for", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-14.png" },
  { sr: 23, price: 94.99, profit: 0.3, title: "ProFormX Velocity 14 Golf Cart Wheels", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-15.png" },
  { sr: 24, price: 92.66, profit: 0.19, title: "Mob Armor Mob Mount Switch Magnetic", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-16.png" },
  { sr: 25, price: 94.11, profit: 0.23, title: "1 New ROAD CREW 11L-16 12", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-17.png" },
  { sr: 26, price: 93.24, profit: 0.22, title: "Walker Products 350-64080 Oxygen Sensor", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-18.png" },
  { sr: 27, price: 91.88, profit: 0.2, title: "Walker Products 350-34643 Oxygen Sensor", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-19.png" },
  { sr: 28, price: 94.99, profit: 0.3, title: "Inteset 12ft 40amp J1772 EV Extension", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-20.png" },
  { sr: 29, price: 97.01, profit: 0.34, title: "RÉNERGIE LIFT MULTI-ACTION ULTRA FACE CREAM WITH SPF 30 1.0 Fl. Oz. (30 mL)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-1.png" },
  { sr: 30, price: 161.994, profit: 26, title: "Apple Watch Series 9 GPS 41mm Smartwatch with Midnight Aluminum Case", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-2.png" },
  { sr: 31, price: 180.55, profit: 0.5, title: "Sony WH-1000XM4 Wireless Noise Canceling Overhead Headphones", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-3.png" },
  { sr: 32, price: 187.01, profit: 0.6, title: "Nike Air Max 270 Sneakers Athletic Outdoor Sports Running Shoes", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-4.png" },
  { sr: 33, price: 164.88, profit: 0.4, title: "Stanley Quencher H2.0 FlowState Tumbler 40oz Vacuum Insulated Mug", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-5.png" },
  { sr: 34, price: 183.99, profit: 0.4, title: "BLEU DE CHANEL Eau de Parfum Spray for Men 3.4 Fl. Oz.", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-6.png" },
  { sr: 35, price: 186.96, profit: 0.4, title: "L'Oreal Paris Revitalift Pure Hyaluronic Acid Face Serum", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-7.png" },
  { sr: 36, price: 171.8, profit: 0.3, title: "Dyson V8 Absolute Cordless Vacuum Cleaner with HEPA Filtration", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-8.png" },
   { sr: 37, price: 177.9, profit: 0.3, title: "GrandPad Senior Tablet (Renewed) with Phone", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-1.png" },
  { sr: 38, price: 180.55, profit: 0.5, title: "Woeoe Thick Warm Winter Hat Yellow", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-2.png" },
  { sr: 39, price: 187.01, profit: 0.6, title: "Photozyme DNA Repair Enzymes Probiotic P291", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-3.png" },
  { sr: 40, price: 164.88, profit: 0.4, title: "Elfeves Lot 4 PCS Classic Men’s", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-4.png" }
];

export const TEMPLATE_C_3 = [
  { sr: 1, price: 460.44, profit: 4.6, title: "GrandPad Senior Tablet (Renewed) with Phone", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-1.png" },
  { sr: 2, price: 421.88, profit: 4.3, title: "Woeoe Thick Warm Winter Hat Yellow", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-2.png" },
  { sr: 3, price: 450.99, profit: 5.1, title: "Photozyme DNA Repair Enzymes Probiotic P291", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-3.png" },
  { sr: 4, price: 460.66, profit: 6.4, title: "Elfeves Lot 4 PCS Classic Men’s", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-4.png" },
  { sr: 5, price: 433.74, profit: 5.5, title: "Tommy Hilfiger Men’s Oxford Ribb Stripe", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-5.png" },
  { sr: 6, price: 421.88, profit: 5.9, title: "Scales Of Justice Blue Navy Blue", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-6.png" },
  { sr: 7, price: 441.77, profit: 5.8, title: "AUTOGEN 12V & 24V Jump Starter", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-7.png" },
  { sr: 8, price: 460.44, profit: 4.9, title: "Autel Maxisys CV MS908CV", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-8.png" },
  { sr: 9, price: 433.93, profit: 5, title: "Tyrell Chenergy 1800/900 Peak Amp 12V/24V", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-9.png" },
  { sr: 10, price: 460.66, profit: 6.4, title: "NOCO Boost HD GB70 2000 Amp", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-10.png" },
  { sr: 11, price: 499.65, profit: 7.9, title: "Garmin DriveSmart 86", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-11.png" },
  { sr: 12, price: 510.88, profit: 13.6, title: "CARTMAN 3 Pack Warning Triangle DOT", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-12.png" },
  { sr: 13, price: 769.835, profit: 129.66, title: "Schumacher DSR115 DSR ProSeries Rechargeable Pro", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-13.png" },
  { sr: 14, price: 890.77, profit: 20.1, title: "Touch Screen Android Head Unit for", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-14.png" },
  { sr: 15, price: 888.54, profit: 20, title: "ProFormX Velocity 14 Golf Cart Wheels", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-15.png" },
  { sr: 16, price: 920.77, profit: 25.95, title: "Mob Armor Mob Mount Switch Magnetic", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-16.png" },
  { sr: 17, price: 930.11, profit: 30.46, title: "1 New ROAD CREW 11L-16 12", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-17.png" },
  { sr: 18, price: 920.66, profit: 40.44, title: "Walker Products 350-64080 Oxygen Sensor", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-18.png" },
  { sr: 19, price: 1010.87, profit: 50.66, title: "Walker Products 350-34643 Oxygen Sensor", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-19.png" },
  { sr: 20, price: 908.99, profit: 40.55, title: "Inteset 12ft 40amp J1772 EV Extension", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-20.png" },
  { sr: 21, price: 1100.93, profit: 60.55, title: "RÉNERGIE LIFT MULTI-ACTION ULTRA FACE CREAM WITH SPF 30 1.0 Fl. Oz. (30 mL)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-1.png" },
  { sr: 22, price: 1179.66, profit: 50.94, title: "Apple Watch Series 9 GPS 41mm Smartwatch with Midnight Aluminum Case", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-2.png" },
  { sr: 23, price: 1211.55, profit: 60.41, title: "Sony WH-1000XM4 Wireless Noise Canceling Overhead Headphones", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-3.png" },
  { sr: 24, price: 1289.51, profit: 70.65, title: "Nike Air Max 270 Sneakers Athletic Outdoor Sports Running Shoes", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-4.png" },
  { sr: 25, price: 1236.88, profit: 60.79, title: "Stanley Quencher H2.0 FlowState Tumbler 40oz Vacuum Insulated Mug", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-5.png" },
  { sr: 26, price: 2232.865, profit: 397.65, title: "BLEU DE CHANEL Eau de Parfum Spray for Men 3.4 Fl. Oz.", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-6.png" },
  { sr: 27, price: 2601.88, profit: 120.99, title: "L'Oreal Paris Revitalift Pure Hyaluronic Acid Face Serum", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-7.png" },
  { sr: 28, price: 2507.54, profit: 110.92, title: "Dyson V8 Absolute Cordless Vacuum Cleaner with HEPA Filtration", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-8.png" },
  { sr: 29, price: 2799.84, profit: 140.9, title: "GrandPad Senior Tablet (Renewed) with Phone", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-1.png" },
  { sr: 30, price: 2675.8, profit: 130.8, title: "Woeoe Thick Warm Winter Hat Yellow", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-2.png" },
  { sr: 31, price: 3100.66, profit: 167.25, title: "Photozyme DNA Repair Enzymes Probiotic P291", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-3.png" },
  { sr: 32, price: 4826.255, profit: 867.31, title: "Elfeves Lot 4 PCS Classic Men’s", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-4.png" },
  { sr: 33, price: 5550.59, profit: 280.88, title: "Tommy Hilfiger Men’s Oxford Ribb Stripe", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-5.png" },
  { sr: 34, price: 5498.77, profit: 263.22, title: "Scales Of Justice Blue Navy Blue", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-6.png" },
  { sr: 35, price: 6100.69, profit: 300.6, title: "AUTOGEN 12V & 24V Jump Starter", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-7.png" },
  { sr: 36, price: 5900.51, profit: 400.6, title: "Autel Maxisys CV MS908CV", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-8.png" },
  { sr: 37, price: 5821.63, profit: 398.22, title: "Tyrell Chenergy 1800/900 Peak Amp 12V/24V", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-9.png" },
  { sr: 38, price: 6590.61, profit: 502.91, title: "NOCO Boost HD GB70 2000 Amp", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-10.png" },
  { sr: 39, price: 11226.385, profit: 1567.31, title: "Garmin DriveSmart 86", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-11.png" },
  { sr: 40, price: 18791.105, profit: 2852.77, title: "CARTMAN 3 Pack Warning Triangle DOT", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-12.png" }
];

export const TEMPLATE_C_4 = [
  { sr: 1, price: 750.55, profit: 6.44, title: "GrandPad Senior Tablet (Renewed) with Phone", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-1.png" },
  { sr: 2, price: 711.76, profit: 6.9, title: "Woeoe Thick Warm Winter Hat Yellow", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-2.png" },
  { sr: 3, price: 743.77, profit: 7.9, title: "Photozyme DNA Repair Enzymes Probiotic P291", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-3.png" },
  { sr: 4, price: 769.33, profit: 7.43, title: "Elfeves Lot 4 PCS Classic Men’s", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-4.png" },
  { sr: 5, price: 721.77, profit: 6.9, title: "Tommy Hilfiger Men’s Oxford Ribb Stripe", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-5.png" },
  { sr: 6, price: 777.81, profit: 8, title: "Scales Of Justice Blue Navy Blue", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-6.png" },
  { sr: 7, price: 801.22, profit: 9.5, title: "AUTOGEN 12V & 24V Jump Starter", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-7.png" },
  { sr: 8, price: 799.43, profit: 8.3, title: "Autel Maxisys CV MS908CV", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-8.png" },
  { sr: 9, price: 800.3, profit: 8.6, title: "Tyrell Chenergy 1800/900 Peak Amp 12V/24V", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-9.png" },
  { sr: 10, price: 751.7, profit: 7.4, title: "NOCO Boost HD GB70 2000 Amp", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-10.png" },
  { sr: 11, price: 811.7, profit: 9.1, title: "Garmin DriveSmart 86", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-11.png" },
  { sr: 12, price: 729.11, profit: 6.4, title: "CARTMAN 3 Pack Warning Triangle DOT", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-12.png" },
  { sr: 13, price: 831.55, profit: 10.2, title: "Schumacher DSR115 DSR ProSeries Rechargeable Pro", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-13.png" },
  { sr: 14, price: 791.54, profit: 7.8, title: "Touch Screen Android Head Unit for", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-14.png" },
  { sr: 15, price: 870.33, profit: 11.5, title: "ProFormX Velocity 14 Golf Cart Wheels", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-15.png" },
  { sr: 16, price: 1329.643, profit: 256.1, title: "Mob Armor Mob Mount Switch Magnetic", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-16.png" },
  { sr: 17, price: 1500.22, profit: 56.87, title: "1 New ROAD CREW 11L-16 12", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-17.png" },
  { sr: 18, price: 1600.34, profit: 60.4, title: "Walker Products 350-64080 Oxygen Sensor", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-18.png" },
  { sr: 19, price: 1476.65, profit: 40.5, title: "Walker Products 350-34643 Oxygen Sensor", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-19.png" },
  { sr: 20, price: 1621.87, profit: 50.6, title: "Inteset 12ft 40amp J1772 EV Extension", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-20.png" },
  { sr: 21, price: 1438.91, profit: 39.4, title: "RÉNERGIE LIFT MULTI-ACTION ULTRA FACE CREAM WITH SPF 30 1.0 Fl. Oz. (30 mL)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-1.png" },
  { sr: 22, price: 1830.43, profit: 70.52, title: "Apple Watch Series 9 GPS 41mm Smartwatch with Midnight Aluminum Case", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-2.png" },
  { sr: 23, price: 1654.98, profit: 50.22, title: "Sony WH-1000XM4 Wireless Noise Canceling Overhead Headphones", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-3.png" },
  { sr: 24, price: 1794.88, profit: 60.12, title: "Nike Air Max 270 Sneakers Athletic Outdoor Sports Running Shoes", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-4.png" },
  { sr: 25, price: 1887.53, profit: 70.33, title: "Stanley Quencher H2.0 FlowState Tumbler 40oz Vacuum Insulated Mug", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-5.png" },
  { sr: 26, price: 1997.55, profit: 90.5, title: "BLEU DE CHANEL Eau de Parfum Spray for Men 3.4 Fl. Oz.", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-6.png" },
  { sr: 27, price: 1876.87, profit: 76.9, title: "L'Oreal Paris Revitalift Pure Hyaluronic Acid Face Serum", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-7.png" },
  { sr: 28, price: 2100.63, profit: 100.57, title: "Dyson V8 Absolute Cordless Vacuum Cleaner with HEPA Filtration", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-8.png" },
  { sr: 29, price: 3591.553, profit: 605.32, title: "GrandPad Senior Tablet (Renewed) with Phone", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-1.png" },
  { sr: 30, price: 4111.34, profit: 200.67, title: "Woeoe Thick Warm Winter Hat Yellow", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-2.png" },
  { sr: 31, price: 3999.76, profit: 197.55, title: "Photozyme DNA Repair Enzymes Probiotic P291", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-3.png" },
  { sr: 32, price: 4288.56, profit: 230.91, title: "Elfeves Lot 4 PCS Classic Men’s", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-4.png" },
  { sr: 33, price: 7498.913, profit: 1299.99, title: "Tommy Hilfiger Men’s Oxford Ribb Stripe", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-5.png" },
  { sr: 34, price: 8722.23, profit: 362.66, title: "Scales Of Justice Blue Navy Blue", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-6.png" },
  { sr: 35, price: 8112.98, profit: 310.55, title: "AUTOGEN 12V & 24V Jump Starter", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-7.png" },
  { sr: 36, price: 9200.56, profit: 450.57, title: "Autel Maxisys CV MS908CV", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-8.png" },
  { sr: 37, price: 9771.84, profit: 560.44, title: "Tyrell Chenergy 1800/900 Peak Amp 12V/24V", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-9.png" },
  { sr: 38, price: 8176.93, profit: 432.98, title: "NOCO Boost HD GB70 2000 Amp", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-10.png" },
  { sr: 39, price: 16558.883, profit: 2912.93, title: "Garmin DriveSmart 86", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-11.png" },
  { sr: 40, price: 30718.573, profit: 5927.51, title: "CARTMAN 3 Pack Warning Triangle DOT", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-12.png" }
];

export const TEMPLATE_C_5 = [
  { sr: 1, price: 378.98, profit: 3.22, title: "GrandPad Senior Tablet (Renewed) with Phone", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-1.png" },
  { sr: 2, price: 390.22, profit: 4.1, title: "Woeoe Thick Warm Winter Hat Yellow", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-2.png" },
  { sr: 3, price: 370.35, profit: 3.7, title: "Photozyme DNA Repair Enzymes Probiotic P291", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cj-3.png" },
  { sr: 4, price: 380.43, profit: 3.8, title: "Elfeves Lot 4 PCS Classic Men’s", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cj-4.png" },
  { sr: 5, price: 390.11, profit: 4, title: "Tommy Hilfiger Men’s Oxford Ribb Stripe", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cj-5.png" },
  { sr: 6, price: 360.43, profit: 3.1, title: "Scales Of Justice Blue Navy Blue", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cj-6.png" },
  { sr: 7, price: 388.55, profit: 3.8, title: "AUTOGEN 12V & 24V Jump Starter", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cj-7.png" },
  { sr: 8, price: 367.98, profit: 3.2, title: "Autel Maxisys CV MS908CV", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cj-8.png" },
  { sr: 9, price: 386.43, profit: 4.1, title: "Tyrell Chenergy 1800/900 Peak Amp 12V/24V", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cj-9.png" },
  { sr: 10, price: 387.99, profit: 4.2, title: "NOCO Boost HD GB70 2000 Amp", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cj-10.png" },
  { sr: 11, price: 360.43, profit: 3.1, title: "Garmin DriveSmart 86", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cj-11.png" },
  { sr: 12, price: 400.08, profit: 4.5, title: "CARTMAN 3 Pack Warning Triangle DOT", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cj-12.png" },
  { sr: 13, price: 693.662, profit: 112.47, title: "Schumacher DSR115 DSR ProSeries Rechargeable Pro", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cj-13.png" },
  { sr: 14, price: 799.54, profit: 19.45, title: "Touch Screen Android Head Unit for", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cj-14.png" },
  { sr: 15, price: 786.99, profit: 18.55, title: "ProFormX Velocity 14 Golf Cart Wheels", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cj-15.png" },
  { sr: 16, price: 800.1, profit: 23.22, title: "Mob Armor Mob Mount Switch Magnetic", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cj-16.png" },
  { sr: 17, price: 765.54, profit: 17.88, title: "1 New ROAD CREW 11L-16 12", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cj-17.png" },
  { sr: 18, price: 799.99, profit: 20.11, title: "Walker Products 350-64080 Oxygen Sensor", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cj-18.png" },
  { sr: 19, price: 803.48, profit: 21.22, title: "Walker Products 350-34643 Oxygen Sensor", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cj-19.png" },
  { sr: 20, price: 806.39, profit: 22, title: "Inteset 12ft 40amp J1772 EV Extension", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cj-20.png" },
  { sr: 21, price: 785.97, profit: 19.33, title: "RÉNERGIE LIFT MULTI-ACTION ULTRA FACE CREAM WITH SPF 30 1.0 Fl. Oz. (30 mL)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/prod-1.png" },
  { sr: 22, price: 921.88, profit: 30.46, title: "Apple Watch Series 9 GPS 41mm Smartwatch with Midnight Aluminum Case", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/prod-2.png" },
  { sr: 23, price: 867.99, profit: 25.47, title: "Sony WH-1000XM4 Wireless Noise Canceling Overhead Headphones", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/prod-3.png" },
  { sr: 24, price: 856.5, profit: 24.5, title: "Nike Air Max 270 Sneakers Athletic Outdoor Sports Running Shoes", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/prod-4.png" },
  { sr: 25, price: 898.06, profit: 24.55, title: "Stanley Quencher H2.0 FlowState Tumbler 40oz Vacuum Insulated Mug", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/prod-5.png" },
  { sr: 26, price: 1610.752, profit: 286.93, title: "BLEU DE CHANEL Eau de Parfum Spray for Men 3.4 Fl. Oz.", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/prod-6.png" },
  { sr: 27, price: 1856.44, profit: 50.44, title: "L'Oreal Paris Revitalift Pure Hyaluronic Acid Face Serum", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/prod-7.png" },
  { sr: 28, price: 1877.99, profit: 49.44, title: "Dyson V8 Absolute Cordless Vacuum Cleaner with HEPA Filtration", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/prod-8.png" },
  { sr: 29, price: 1930.44, profit: 52.79, title: "GrandPad Senior Tablet (Renewed) with Phone", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cj-1.png" },
  { sr: 30, price: 1899.86, profit: 49.65, title: "Woeoe Thick Warm Winter Hat Yellow", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cj-2.png" },
  { sr: 31, price: 2008.55, profit: 62.44, title: "Photozyme DNA Repair Enzymes Probiotic P291", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cj-3.png" },
  { sr: 32, price: 3445.902, profit: 589.44, title: "Elfeves Lot 4 PCS Classic Men’s", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cj-4.png" },
  { sr: 33, price: 3997.99, profit: 70.45, title: "Tommy Hilfiger Men’s Oxford Ribb Stripe", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cj-5.png" },
  { sr: 34, price: 4001.33, profit: 80.23, title: "Scales Of Justice Blue Navy Blue", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cj-6.png" },
  { sr: 35, price: 3879.66, profit: 77.56, title: "AUTOGEN 12V & 24V Jump Starter", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cj-7.png" },
  { sr: 36, price: 4111.43, profit: 81.44, title: "Autel Maxisys CV MS908CV", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cj-8.png" },
  { sr: 37, price: 3999.99, profit: 79.7, title: "Tyrell Chenergy 1800/900 Peak Amp 12V/24V", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cj-9.png" },
  { sr: 38, price: 4324.44, profit: 85.45, title: "NOCO Boost HD GB70 2000 Amp", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cj-10.png" },
  { sr: 39, price: 7374.722, profit: 1482.39, title: "Garmin DriveSmart 86", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cj-11.png" },
  { sr: 40, price: 14384.932, profit: 2914.53, title: "CARTMAN 3 Pack Warning Triangle DOT", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cj-12.png" }
];

export const TEMPLATE_M_2 = [
  { sr: 1, price: 1936.33, profit: 2.10, title: "RÉNERGIE LIFT MULTI-ACTION ULTRA FACE CREAM WITH SPF 30 1.0 Fl. Oz. (30 mL)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-1.png" },
  { sr: 2, price: 1999.64, profit: 1.98, title: "Apple Watch Series 9 GPS 41mm Smartwatch with Midnight Aluminum Case", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-2.png" },
  { sr: 3, price: 1821.75, profit: 1.77, title: "Sony WH-1000XM4 Wireless Noise Canceling Overhead Headphones", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-3.png" },
  { sr: 4, price: 2001.55, profit: 2.00, title: "Nike Air Max 270 Sneakers Athletic Outdoor Sports Running Shoes", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-4.png" },
  { sr: 5, price: 1721.90, profit: 1.88, title: "Stanley Quencher H2.0 FlowState Tumbler 40oz Vacuum Insulated Mug", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-5.png" },
  { sr: 6, price: 1856.41, profit: 1.96, title: "BLEU DE CHANEL Eau de Parfum Spray for Men 3.4 Fl. Oz.", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-6.png" },
  { sr: 7, price: 1998.58, profit: 2.20, title: "L'Oreal Paris Revitalift Pure Hyaluronic Acid Face Serum", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-7.png" },
  { sr: 8, price: 1962.95, profit: 2.10, title: "Dyson V8 Absolute Cordless Vacuum Cleaner with HEPA Filtration", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-8.png" },
  { sr: 9, price: 2016.01, profit: 2.30, title: "GrandPad Senior Tablet (Renewed) with Phone", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-1.png" },
  { sr: 10, price: 2001.99, profit: 2.00, title: "Woeoe Thick Warm Winter Hat Yellow", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-2.png" },
  { sr: 11, price: 1995.80, profit: 1.88, title: "Photozyme DNA Repair Enzymes Probiotic P291", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-3.png" },
  { sr: 12, price: 1953.48, profit: 1.70, title: "Elfeves Lot 4 PCS Classic Men’s", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-4.png" },
  { sr: 13, price: 2010.42, profit: 1.80, title: "Tommy Hilfiger Men’s Oxford Ribb Stripe", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-5.png" },
  { sr: 14, price: 1889.53, profit: 1.60, title: "Scales Of Justice Blue Navy Blue", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-6.png" },
  { sr: 15, price: 1946.99, profit: 1.99, title: "AUTOGEN 12V & 24V Jump Starter", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-7.png" },
  { sr: 16, price: 1826.79, profit: 1.98, title: "Autel Maxisys CV MS908CV", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-8.png" },
  { sr: 17, price: 2030.90, profit: 2.40, title: "Tyrell Chenergy 1800/900 Peak Amp 12V/24V", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-9.png" },
  { sr: 18, price: 2335.64, profit: 112.00, title: "NOCO Boost HD GB70 2000 Amp", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-10.png" },
  { sr: 19, price: 2412.70, profit: 5.60, title: "Garmin DriveSmart 86", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-11.png" },
  { sr: 20, price: 2411.60, profit: 5.10, title: "CARTMAN 3 Pack Warning Triangle DOT", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-12.png" },
  { sr: 21, price: 2315.50, profit: 4.90, title: "Schumacher DSR115 DSR ProSeries Rechargeable Pro", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-13.png" },
  { sr: 22, price: 2409.88, profit: 5.60, title: "Touch Screen Android Head Unit for", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-14.png" },
  { sr: 23, price: 2367.90, profit: 4.70, title: "ProFormX Velocity 14 Golf Cart Wheels", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-15.png" },
  { sr: 24, price: 2386.90, profit: 4.90, title: "Mob Armor Mob Mount Switch Magnetic", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-16.png" },
  { sr: 25, price: 2399.50, profit: 5.30, title: "1 New ROAD CREW 11L-16 12", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-17.png" },
  { sr: 26, price: 2480.70, profit: 5.90, title: "Walker Products 350-64080 Oxygen Sensor", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-18.png" },
  { sr: 27, price: 2370.90, profit: 4.60, title: "Walker Products 350-34643 Oxygen Sensor", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-19.png" },
  { sr: 28, price: 2383.80, profit: 4.80, title: "Inteset 12ft 40amp J1772 EV Extension", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-20.png" },
  { sr: 29, price: 3091.04, profit: 238.00, title: "RÉNERGIE LIFT MULTI-ACTION ULTRA FACE CREAM WITH SPF 30 1.0 Fl. Oz. (30 mL)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-1.png" },
  { sr: 30, price: 3322.90, profit: 6.00, title: "Apple Watch Series 9 GPS 41mm Smartwatch with Midnight Aluminum Case", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-2.png" },
  { sr: 31, price: 3212.00, profit: 5.10, title: "Sony WH-1000XM4 Wireless Noise Canceling Overhead Headphones", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-3.png" },
  { sr: 32, price: 3169.80, profit: 4.90, title: "Nike Air Max 270 Sneakers Athletic Outdoor Sports Running Shoes", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-4.png" },
  { sr: 33, price: 3274.90, profit: 5.70, title: "Stanley Quencher H2.0 FlowState Tumbler 40oz Vacuum Insulated Mug", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-5.png" },
  { sr: 34, price: 3311.80, profit: 5.40, title: "BLEU DE CHANEL Eau de Parfum Spray for Men 3.4 Fl. Oz.", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-6.png" },
  { sr: 35, price: 3258.90, profit: 5.10, title: "L'Oreal Paris Revitalift Pure Hyaluronic Acid Face Serum", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-7.png" },
  { sr: 36, price: 3311.80, profit: 6.00, title: "Dyson V8 Absolute Cordless Vacuum Cleaner with HEPA Filtration", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-8.png" },
  { sr: 37, price: 3313.80, profit: 6.00, title: "GrandPad Senior Tablet (Renewed) with Phone", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-1.png" },
  { sr: 38, price: 3126.70, profit: 5.10, title: "Woeoe Thick Warm Winter Hat Yellow", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-2.png" },
  { sr: 39, price: 3217.60, profit: 6.10, title: "Photozyme DNA Repair Enzymes Probiotic P291", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-3.png" },
  { sr: 40, price: 3380.70, profit: 6.40, title: "Elfeves Lot 4 PCS Classic Men’s", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-4.png" }
];

export const TEMPLATE_M_3 = [
  { sr: 1, price: 5997.87, profit: 29.50, title: "RÉNERGIE LIFT MULTI-ACTION ULTRA FACE CREAM WITH SPF 30 1.0 Fl. Oz. (30 mL)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-1.png" },
  { sr: 2, price: 5624.00, profit: 28.70, title: "Apple Watch Series 9 GPS 41mm Smartwatch with Midnight Aluminum Case", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-2.png" },
  { sr: 3, price: 5999.89, profit: 30.10, title: "Sony WH-1000XM4 Wireless Noise Canceling Overhead Headphones", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-3.png" },
  { sr: 4, price: 5267.80, profit: 26.00, title: "Nike Air Max 270 Sneakers Athletic Outdoor Sports Running Shoes", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-4.png" },
  { sr: 5, price: 5742.99, profit: 31.00, title: "Stanley Quencher H2.0 FlowState Tumbler 40oz Vacuum Insulated Mug", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-5.png" },
  { sr: 6, price: 5822.77, profit: 29.85, title: "BLEU DE CHANEL Eau de Parfum Spray for Men 3.4 Fl. Oz.", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-6.png" },
  { sr: 7, price: 5986.83, profit: 30.11, title: "L'Oreal Paris Revitalift Pure Hyaluronic Acid Face Serum", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-7.png" },
  { sr: 8, price: 5542.50, profit: 26.60, title: "Dyson V8 Absolute Cordless Vacuum Cleaner with HEPA Filtration", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-8.png" },
  { sr: 9, price: 5846.61, profit: 27.00, title: "GrandPad Senior Tablet (Renewed) with Phone", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-1.png" },
  { sr: 10, price: 5999.89, profit: 30.10, title: "Woeoe Thick Warm Winter Hat Yellow", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-2.png" },
  { sr: 11, price: 5267.80, profit: 26.00, title: "Photozyme DNA Repair Enzymes Probiotic P291", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-3.png" },
  { sr: 12, price: 6242.98, profit: 36.76, title: "Elfeves Lot 4 PCS Classic Men’s", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-4.png" },
  { sr: 13, price: 6001.01, profit: 30.40, title: "Tommy Hilfiger Men’s Oxford Ribb Stripe", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-5.png" },
  { sr: 14, price: 6311.22, profit: 34.60, title: "Scales Of Justice Blue Navy Blue", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-6.png" },
  { sr: 15, price: 7959.06, profit: 863.00, title: "AUTOGEN 12V & 24V Jump Starter", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-7.png" },
  { sr: 16, price: 8790.77, profit: 45.22, title: "Autel Maxisys CV MS908CV", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-8.png" },
  { sr: 17, price: 8682.33, profit: 40.96, title: "Tyrell Chenergy 1800/900 Peak Amp 12V/24V", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-9.png" },
  { sr: 18, price: 8769.65, profit: 41.55, title: "NOCO Boost HD GB70 2000 Amp", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-10.png" },
  { sr: 19, price: 8802.53, profit: 47.80, title: "Garmin DriveSmart 86", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-11.png" },
  { sr: 20, price: 8102.44, profit: 38.90, title: "CARTMAN 3 Pack Warning Triangle DOT", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-12.png" },
  { sr: 21, price: 8682.33, profit: 40.96, title: "Schumacher DSR115 DSR ProSeries Rechargeable Pro", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-13.png" },
  { sr: 22, price: 8769.65, profit: 41.55, title: "Touch Screen Android Head Unit for", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-14.png" },
  { sr: 23, price: 9100.30, profit: 49.70, title: "ProFormX Velocity 14 Golf Cart Wheels", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-15.png" },
  { sr: 24, price: 8802.53, profit: 47.80, title: "Mob Armor Mob Mount Switch Magnetic", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-16.png" },
  { sr: 25, price: 8102.44, profit: 38.90, title: "1 New ROAD CREW 11L-16 12", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-17.png" },
  { sr: 26, price: 7632.99, profit: 28.99, title: "Walker Products 350-64080 Oxygen Sensor", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-18.png" },
  { sr: 27, price: 8913.84, profit: 46.22, title: "Walker Products 350-34643 Oxygen Sensor", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-19.png" },
  { sr: 28, price: 8802.53, profit: 47.80, title: "Inteset 12ft 40amp J1772 EV Extension", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-20.png" },
  { sr: 29, price: 8102.44, profit: 38.90, title: "RÉNERGIE LIFT MULTI-ACTION ULTRA FACE CREAM WITH SPF 30 1.0 Fl. Oz. (30 mL)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-1.png" },
  { sr: 30, price: 9401.46, profit: 50.34, title: "Apple Watch Series 9 GPS 41mm Smartwatch with Midnight Aluminum Case", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-2.png" },
  { sr: 31, price: 12030.53, profit: 1737.00, title: "Sony WH-1000XM4 Wireless Noise Canceling Overhead Headphones", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-3.png" },
  { sr: 32, price: 12876.55, profit: 90.34, title: "Nike Air Max 270 Sneakers Athletic Outdoor Sports Running Shoes", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-4.png" },
  { sr: 33, price: 13309.65, profit: 100.40, title: "Stanley Quencher H2.0 FlowState Tumbler 40oz Vacuum Insulated Mug", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-5.png" },
  { sr: 34, price: 13394.76, profit: 99.97, title: "BLEU DE CHANEL Eau de Parfum Spray for Men 3.4 Fl. Oz.", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-6.png" },
  { sr: 35, price: 12867.88, profit: 98.90, title: "L'Oreal Paris Revitalift Pure Hyaluronic Acid Face Serum", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-7.png" },
  { sr: 36, price: 13427.00, profit: 89.99, title: "Dyson V8 Absolute Cordless Vacuum Cleaner with HEPA Filtration", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-8.png" },
  { sr: 37, price: 14100.67, profit: 120.87, title: "GrandPad Senior Tablet (Renewed) with Phone", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-1.png" },
  { sr: 38, price: 13998.73, profit: 110.77, title: "Woeoe Thick Warm Winter Hat Yellow", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-2.png" },
  { sr: 39, price: 14400.98, profit: 120.77, title: "Photozyme DNA Repair Enzymes Probiotic P291", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-3.png" },
  { sr: 40, price: 14521.52, profit: 130.73, title: "Elfeves Lot 4 PCS Classic Men’s", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-4.png" }
];

export const TEMPLATE_M_4 = [
  { sr: 1, price: 5882.45, profit: 30.11, title: "RÉNERGIE LIFT MULTI-ACTION ULTRA FACE CREAM WITH SPF 30 1.0 Fl. Oz. (30 mL)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-1.png" },
  { sr: 2, price: 5947.7, profit: 31.96, title: "Apple Watch Series 9 GPS 41mm Smartwatch with Midnight Aluminum Case", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-2.png" },
  { sr: 3, price: 6011.25, profit: 32.56, title: "Sony WH-1000XM4 Wireless Noise Canceling Overhead Headphones", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-3.png" },
  { sr: 4, price: 5871.39, profit: 28.44, title: "Nike Air Max 270 Sneakers Athletic Outdoor Sports Running Shoes", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-4.png" },
  { sr: 5, price: 5993.64, profit: 30.23, title: "Stanley Quencher H2.0 FlowState Tumbler 40oz Vacuum Insulated Mug", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-5.png" },
  { sr: 6, price: 5999.65, profit: 30.49, title: "BLEU DE CHANEL Eau de Parfum Spray for Men 3.4 Fl. Oz.", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-6.png" },
  { sr: 7, price: 6100.79, profit: 33.66, title: "L'Oreal Paris Revitalift Pure Hyaluronic Acid Face Serum", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-7.png" },
  { sr: 8, price: 6001.36, profit: 32.33, title: "Dyson V8 Absolute Cordless Vacuum Cleaner with HEPA Filtration", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-8.png" },
  { sr: 9, price: 5997.99, profit: 31.44, title: "GrandPad Senior Tablet (Renewed) with Phone", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-1.png" },
  { sr: 10, price: 5779.99, profit: 28.87, title: "Woeoe Thick Warm Winter Hat Yellow", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-2.png" },
  { sr: 11, price: 5216.44, profit: 26.59, title: "Photozyme DNA Repair Enzymes Probiotic P291", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-3.png" },
  { sr: 12, price: 5993.64, profit: 31.22, title: "Elfeves Lot 4 PCS Classic Men’s", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-4.png" },
  { sr: 13, price: 5999.65, profit: 30.36, title: "Tommy Hilfiger Men’s Oxford Ribb Stripe", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-5.png" },
  { sr: 14, price: 6300.1, profit: 34.55, title: "Scales Of Justice Blue Navy Blue", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-6.png" },
  { sr: 15, price: 7680.25, profit: 630.22, title: "AUTOGEN 12V & 24V Jump Starter", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-7.png" },
  { sr: 16, price: 8221.33, profit: 40.44, title: "Autel Maxisys CV MS908CV", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-8.png" },
  { sr: 17, price: 8009.32, profit: 39.47, title: "Tyrell Chenergy 1800/900 Peak Amp 12V/24V", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-9.png" },
  { sr: 18, price: 7998.77, profit: 38.59, title: "NOCO Boost HD GB70 2000 Amp", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-10.png" },
  { sr: 19, price: 8002.44, profit: 40.34, title: "Garmin DriveSmart 86", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-11.png" },
  { sr: 20, price: 7999.99, profit: 39.88, title: "CARTMAN 3 Pack Warning Triangle DOT", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-12.png" },
  { sr: 21, price: 8213.44, profit: 42.85, title: "Schumacher DSR115 DSR ProSeries Rechargeable Pro", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-13.png" },
  { sr: 22, price: 8112.47, profit: 42.03, title: "Touch Screen Android Head Unit for", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-14.png" },
  { sr: 23, price: 7865.36, profit: 39.56, title: "ProFormX Velocity 14 Golf Cart Wheels", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-15.png" },
  { sr: 24, price: 7922.48, profit: 39.33, title: "Mob Armor Mob Mount Switch Magnetic", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-16.png" },
  { sr: 25, price: 7998.77, profit: 38.93, title: "1 New ROAD CREW 11L-16 12", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-17.png" },
  { sr: 26, price: 8002.44, profit: 39.99, title: "Walker Products 350-64080 Oxygen Sensor", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-18.png" },
  { sr: 27, price: 8111.65, profit: 40.01, title: "Walker Products 350-34643 Oxygen Sensor", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-19.png" },
  { sr: 28, price: 7653.54, profit: 37.99, title: "Inteset 12ft 40amp J1772 EV Extension", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-20.png" },
  { sr: 29, price: 8112.44, profit: 40.33, title: "RÉNERGIE LIFT MULTI-ACTION ULTRA FACE CREAM WITH SPF 30 1.0 Fl. Oz. (30 mL)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-1.png" },
  { sr: 30, price: 8176.84, profit: 41.22, title: "Apple Watch Series 9 GPS 41mm Smartwatch with Midnight Aluminum Case", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-2.png" },
  { sr: 31, price: 11032.87, profit: 1370.43, title: "Sony WH-1000XM4 Wireless Noise Canceling Overhead Headphones", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-3.png" },
  { sr: 32, price: 11165.55, profit: 99.98, title: "Nike Air Max 270 Sneakers Athletic Outdoor Sports Running Shoes", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-4.png" },
  { sr: 33, price: 10008.65, profit: 97.44, title: "Stanley Quencher H2.0 FlowState Tumbler 40oz Vacuum Insulated Mug", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-5.png" },
  { sr: 34, price: 12001.43, profit: 99.99, title: "BLEU DE CHANEL Eau de Parfum Spray for Men 3.4 Fl. Oz.", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-6.png" },
  { sr: 35, price: 12006.47, profit: 101.76, title: "L'Oreal Paris Revitalift Pure Hyaluronic Acid Face Serum", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-7.png" },
  { sr: 36, price: 11678.88, profit: 97.55, title: "Dyson V8 Absolute Cordless Vacuum Cleaner with HEPA Filtration", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-8.png" },
  { sr: 37, price: 11199.34, profit: 91.55, title: "GrandPad Senior Tablet (Renewed) with Phone", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-1.png" },
  { sr: 38, price: 12006.47, profit: 97.55, title: "Woeoe Thick Warm Winter Hat Yellow", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-2.png" },
  { sr: 39, price: 11165.55, profit: 97.11, title: "Photozyme DNA Repair Enzymes Probiotic P291", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-3.png" },
  { sr: 40, price: 13001.43, profit: 106.77, title: "Elfeves Lot 4 PCS Classic Men’s", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-4.png" }
];

export const TEMPLATE_M_5 = [
  { sr: 1, price: 7998.88, profit: 45.99, title: "RÉNERGIE LIFT MULTI-ACTION ULTRA FACE CREAM WITH SPF 30 1.0 Fl. Oz. (30 mL)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-1.png" },
  { sr: 2, price: 7689.23, profit: 40.69, title: "Apple Watch Series 9 GPS 41mm Smartwatch with Midnight Aluminum Case", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-2.png" },
  { sr: 3, price: 8000.20, profit: 50.22, title: "Sony WH-1000XM4 Wireless Noise Canceling Overhead Headphones", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-3.png" },
  { sr: 4, price: 7946.81, profit: 47.10, title: "Nike Air Max 270 Sneakers Athletic Outdoor Sports Running Shoes", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-4.png" },
  { sr: 5, price: 7140.60, profit: 42.60, title: "Stanley Quencher H2.0 FlowState Tumbler 40oz Vacuum Insulated Mug", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-5.png" },
  { sr: 6, price: 7994.98, profit: 45.77, title: "BLEU DE CHANEL Eau de Parfum Spray for Men 3.4 Fl. Oz.", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-6.png" },
  { sr: 7, price: 8152.16, profit: 58.99, title: "L'Oreal Paris Revitalift Pure Hyaluronic Acid Face Serum", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-7.png" },
  { sr: 8, price: 7863.91, profit: 43.90, title: "Dyson V8 Absolute Cordless Vacuum Cleaner with HEPA Filtration", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-8.png" },
  { sr: 9, price: 7891.61, profit: 45.22, title: "GrandPad Senior Tablet (Renewed) with Phone", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-1.png" },
  { sr: 10, price: 8235.71, profit: 60.10, title: "Woeoe Thick Warm Winter Hat Yellow", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-2.png" },
  { sr: 11, price: 7812.73, profit: 50.44, title: "Photozyme DNA Repair Enzymes Probiotic P291", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-3.png" },
  { sr: 12, price: 7912.80, profit: 55.90, title: "Elfeves Lot 4 PCS Classic Men’s", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-4.png" },
  { sr: 13, price: 10710.91, profit: 1384.81, title: "Tommy Hilfiger Men’s Oxford Ribb Stripe", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-5.png" },
  { sr: 14, price: 12007.91, profit: 65.66, title: "Scales Of Justice Blue Navy Blue", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-6.png" },
  { sr: 15, price: 11854.88, profit: 60.70, title: "AUTOGEN 12V & 24V Jump Starter", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-7.png" },
  { sr: 16, price: 11678.91, profit: 70.40, title: "Autel Maxisys CV MS908CV", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-8.png" },
  { sr: 17, price: 12115.60, profit: 75.80, title: "Tyrell Chenergy 1800/900 Peak Amp 12V/24V", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-9.png" },
  { sr: 18, price: 11765.81, profit: 60.44, title: "NOCO Boost HD GB70 2000 Amp", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-10.png" },
  { sr: 19, price: 11623.66, profit: 60.41, title: "Garmin DriveSmart 86", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-11.png" },
  { sr: 20, price: 12118.40, profit: 70.10, title: "CARTMAN 3 Pack Warning Triangle DOT", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-12.png" },
  { sr: 21, price: 11862.88, profit: 70.40, title: "Schumacher DSR115 DSR ProSeries Rechargeable Pro", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-13.png" },
  { sr: 22, price: 12178.66, profit: 75.80, title: "Touch Screen Android Head Unit for", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-14.png" },
  { sr: 23, price: 11854.88, profit: 60.44, title: "ProFormX Velocity 14 Golf Cart Wheels", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-15.png" },
  { sr: 24, price: 11678.91, profit: 60.41, title: "Mob Armor Mob Mount Switch Magnetic", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-16.png" },
  { sr: 25, price: 12115.60, profit: 70.11, title: "1 New ROAD CREW 11L-16 12", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-17.png" },
  { sr: 26, price: 11765.81, profit: 60.59, title: "Walker Products 350-64080 Oxygen Sensor", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-18.png" },
  { sr: 27, price: 11149.79, profit: 68.20, title: "Walker Products 350-34643 Oxygen Sensor", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-19.png" },
  { sr: 28, price: 16267.95, profit: 2616.51, title: "Inteset 12ft 40amp J1772 EV Extension", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-20.png" },
  { sr: 29, price: 17654.76, profit: 120.67, title: "RÉNERGIE LIFT MULTI-ACTION ULTRA FACE CREAM WITH SPF 30 1.0 Fl. Oz. (30 mL)", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-1.png" },
  { sr: 30, price: 17231.99, profit: 126.88, title: "Apple Watch Series 9 GPS 41mm Smartwatch with Midnight Aluminum Case", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-2.png" },
  { sr: 31, price: 17983.66, profit: 130.11, title: "Sony WH-1000XM4 Wireless Noise Canceling Overhead Headphones", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-3.png" },
  { sr: 32, price: 16984.88, profit: 110.26, title: "Nike Air Max 270 Sneakers Athletic Outdoor Sports Running Shoes", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-4.png" },
  { sr: 33, price: 19112.66, profit: 180.67, title: "Stanley Quencher H2.0 FlowState Tumbler 40oz Vacuum Insulated Mug", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-5.png" },
  { sr: 34, price: 17883.90, profit: 150.66, title: "BLEU DE CHANEL Eau de Parfum Spray for Men 3.4 Fl. Oz.", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-6.png" },
  { sr: 35, price: 15832.91, profit: 130.22, title: "L'Oreal Paris Revitalift Pure Hyaluronic Acid Face Serum", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-7.png" },
  { sr: 36, price: 19700.43, profit: 200.32, title: "Dyson V8 Absolute Cordless Vacuum Cleaner with HEPA Filtration", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/prod-8.png" },
  { sr: 37, price: 18943.81, profit: 197.44, title: "GrandPad Senior Tablet (Renewed) with Phone", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-1.png" },
  { sr: 38, price: 19432.61, profit: 199.90, title: "Woeoe Thick Warm Winter Hat Yellow", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-2.png" },
  { sr: 39, price: 19842.64, profit: 200.40, title: "Photozyme DNA Repair Enzymes Probiotic P291", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-3.png" },
  { sr: 40, price: 20007.67, profit: 382.80, title: "Elfeves Lot 4 PCS Classic Men’s", image: "https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/products/cj-4.png" }
];

export default function OrdersTasking() {
  const [users, setUsers] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [session, setSession] = useState({ role: 'Owner', name: 'System Owner', email: 'owner@wallmark.com' });
  const [searchQuery, setSearchQuery] = useState('');

  // Form assignment states
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('custom'); // 'custom', 'M-1', 'M-2', 'M-3', 'M-4', 'M-5', 'C-1', 'C-2', 'C-3', 'C-4', 'C-5'
  const [totalAmount, setTotalAmount] = useState('1000');
  const [orderCount, setOrderCount] = useState('5');
  const [profitPercent, setProfitPercent] = useState('5');
  const [showModal, setShowModal] = useState(false);
  const [newAssignOrders, setNewAssignOrders] = useState([]);
  const [freezeTarget, setFreezeTarget] = useState('');
  const [presetDropdownOpen, setPresetDropdownOpen] = useState(false);

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

  const getActiveTaskDisplay = (username) => {
    const task = assignedTasks.find(t => 
      t.username.toLowerCase() === username.toLowerCase() && 
      (t.status === 'Pending' || t.status === 'In Progress')
    );
    if (!task) return <span className="text-slate-400 text-sm font-medium">None</span>;
    const completed = task.orders.filter(o => o.status === 'Success').length;
    return (
      <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-semibold border ${task.status === 'In Progress' ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800' : 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800'}`}>
        <span>{task.status}</span>
        <span className="opacity-75">({completed}/{task.orderCount})</span>
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
    <div className="w-full space-y-6">
      <div className="admin-card">
        <h3 className="font-bold text-slate-900 dark:text-slate-50 text-xl tracking-tight mb-4">User Accounts Allocation</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="Search user by ID or username..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 text-sm focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all outline-none"
            />
          </div>
        </div>
      </div>

      <div className="admin-card !p-0 overflow-hidden flex flex-col mt-6">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
              <tr style={{ height: '81px' }} className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-2 align-middle">User ID</th>
                <th className="px-6 py-2 align-middle">Username</th>
                <th className="px-6 py-2 align-middle">Staff Node</th>
                <th className="px-6 py-2 align-middle">Active Balance</th>
                <th className="px-6 py-2 align-middle">Active Task Progress</th>
                <th className="px-6 py-2 text-right align-middle">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 font-medium text-sm">
                    No client accounts found matching filter node.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u.id} style={{ height: '54px' }} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors group">
                    <td className="px-6 py-1 align-middle">
                      <span className="font-mono text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{u.id.substring(0,8)}...</span>
                    </td>
                    <td className="px-6 py-1 font-bold text-slate-900 dark:text-slate-50 text-sm align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-700 dark:text-indigo-400 text-xs font-bold border border-indigo-100 dark:border-indigo-800/30">
                          {u.username.substring(0,2).toUpperCase()}
                        </div>
                        {u.username}
                      </div>
                    </td>
                    <td className="px-6 py-1 align-middle">
                      <span className="bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-lg text-xs font-semibold">{u.referred_by_staff_id}</span>
                    </td>
                    <td className="px-6 py-1 align-middle">
                      <span className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/10 px-2.5 py-1 rounded-md border border-emerald-100 dark:border-emerald-800/30 inline-block">
                        ${parseFloat(u.balance).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-1 align-middle">{getActiveTaskDisplay(u.username)}</td>
                    <td className="px-6 py-1 text-right align-middle">
                      <button 
                        className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl transition-all shadow-sm flex items-center justify-end gap-2 ml-auto"
                        onClick={() => handleOpenAssignModal(u)}
                      >
                        <Plus className="w-4 h-4" /> Assign Task
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Task Modal */}
      {showModal && selectedUser && (() => {
        const PRESETS = [
          { value: 'custom', name: 'Custom Worksheet (Manual)', details: 'Build custom worksheet step-by-step', badge: 'Manual' },
          { value: 'M-1', name: 'Preset M-1', details: '40 Items • $30,000 Total • $210.00 Comm.', badge: 'Preset' },
          { value: 'M-2', name: 'Preset M-2', details: '40 Items • $98,000 Total • $496.00 Comm.', badge: 'Preset' },
          { value: 'M-3', name: 'Preset M-3', details: '40 Items • $353,000 Total • $4.6k Comm.', badge: 'Preset' },
          { value: 'M-4', name: 'Preset M-4', details: '40 Items • $508,000 Total • $7.6k Comm.', badge: 'Preset' },
          { value: 'M-5', name: 'Preset M-5', details: '40 Items • $508k Total • $7.6k Comm.', badge: 'Preset' },
          { value: 'C-1', name: 'Preset C-1', details: '40 Items • $817.00 Total • $2.69 Comm.', badge: 'Preset' },
          { value: 'C-2', name: 'Preset C-2', details: '40 Items • $3,900 Total • $49.00 Comm.', badge: 'Preset' },
          { value: 'C-3', name: 'Preset C-3', details: '40 Items • $104,000 Total • $9.2k Comm.', badge: 'Preset' },
          { value: 'C-4', name: 'Preset C-4', details: '40 Items • $148,000 Total • $14.6k Comm.', badge: 'Preset' },
          { value: 'C-5', name: 'Preset C-5', details: '40 Items • $75.9k Total • $6.4k Comm.', badge: 'Preset' },
        ];

        const handlePresetSelect = (mode) => {
          setSelectedTemplate(mode);
          setPresetDropdownOpen(false);
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
          } else if (mode === 'M-5') {
            setNewAssignOrders(TEMPLATE_M_5.map(item => ({
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
          } else if (mode === 'C-5') {
            setNewAssignOrders(TEMPLATE_C_5.map(item => ({
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
        };

        const currentPreset = PRESETS.find(p => p.value === selectedTemplate) || PRESETS[0];

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6 transition-all">
            <div className="bg-white dark:bg-slate-950 w-full max-w-5xl overflow-hidden flex flex-col h-[85vh] max-h-[850px] min-h-[650px] shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-800">
              {/* Modal Header */}
              <div className="border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between flex-shrink-0" style={{ padding: '24px 32px' }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-100 dark:border-indigo-800/30">
                    <ClipboardList className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-xl tracking-tight">Allocate Worksheet</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Creating tasking layout for <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedUser.username}</span></p>
                  </div>
                </div>
                <button 
                  type="button"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                  onClick={() => { setShowModal(false); setSelectedUser(null); }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleConfirmAssignment} className="flex flex-col flex-1 overflow-hidden min-h-0">
                <div className="flex-1 overflow-y-auto flex flex-col gap-8 min-h-0" style={{ padding: '32px' }}>
                  
                  {/* Worksheet Template Selector */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                      Worksheet Template Preset
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setPresetDropdownOpen(!presetDropdownOpen)}
                        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-left transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100/50 dark:border-indigo-900/20">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-2">
                              {currentPreset.name}
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
                                {currentPreset.badge}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">{currentPreset.details}</p>
                          </div>
                        </div>
                        <div className="text-slate-400 pr-1">
                          {presetDropdownOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </button>

                      {presetDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setPresetDropdownOpen(false)} />
                          <div className="absolute left-0 right-0 mt-2 z-50 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-900">
                            {PRESETS.map((p) => {
                              const isSelected = p.value === selectedTemplate;
                              return (
                                <button
                                  key={p.value}
                                  type="button"
                                  onClick={() => handlePresetSelect(p.value)}
                                  className={`w-full flex items-center justify-between px-5 py-3 text-left transition-colors ${
                                    isSelected 
                                      ? 'bg-indigo-50/50 dark:bg-indigo-950/25' 
                                      : 'hover:bg-slate-50 dark:hover:bg-slate-900/60'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${
                                      isSelected 
                                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' 
                                        : 'bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400'
                                    }`}>
                                      {p.value === 'custom' ? 'M' : p.value}
                                    </div>
                                    <div>
                                      <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">{p.name}</div>
                                      <div className="text-xs text-slate-400 mt-1.5">{p.details}</div>
                                    </div>
                                  </div>
                                  {isSelected && (
                                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                                      <Check className="w-3 h-3 stroke-[3]" />
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {selectedTemplate === 'custom' && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Worksheet Row Builder</h4>
                        <p className="text-xs text-slate-400 mt-1.5">Customize up to 40 items in the user's tasking queue</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 font-medium">Rows:</span>
                          <input 
                            type="number"
                            value={newAssignOrders.length}
                            onChange={(e) => handleOrderCountChange(e.target.value)}
                            required
                            min="1"
                            max="40"
                            className="w-16 h-10 px-2 text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 text-xs font-bold focus:ring-1 focus:ring-indigo-600 outline-none"
                          />
                        </div>
                        <button 
                          type="button" 
                          onClick={handleAddOrder}
                          className="h-10 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add Row
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Sequence Preview / Configuration Cards Container */}
                  {selectedTemplate !== 'custom' ? (
                    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                      <div className="px-5 py-3.5 bg-slate-50/50 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <span className="flex items-center gap-2"><ListOrdered className="w-4 h-4 text-indigo-500" /> Worksheet Sequence Preview</span>
                        <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full">{newAssignOrders.length} Items</span>
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="sticky top-0 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-md z-10 border-b border-slate-100 dark:border-slate-800">
                            <tr className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              <th className="px-5 py-3 w-16 text-center">Sr.</th>
                              <th className="px-5 py-3">Product Title</th>
                              <th className="px-5 py-3 text-right">Price</th>
                              <th className="px-5 py-3 text-right">Commission</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                            {newAssignOrders.map((o, oIdx) => (
                              <tr key={oIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/30 transition-colors">
                                <td className="px-5 py-2.5 text-center text-xs text-slate-500 font-medium">{oIdx + 1}</td>
                                <td className="px-5 py-2.5">
                                  <div className="flex items-center gap-3">
                                    {o.image && (
                                      <img 
                                        src={o.image} 
                                        alt="" 
                                        referrerPolicy="no-referrer"
                                        className="w-8 h-8 object-contain rounded border border-slate-200 dark:border-slate-700 bg-white"
                                      />
                                    )}
                                    <span className="font-medium text-slate-700 dark:text-slate-300 max-w-[280px] truncate text-xs" title={o.title}>
                                      {o.title}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-5 py-2.5 text-right font-mono text-xs text-slate-600 dark:text-slate-400">$ {parseFloat(o.price || 0).toFixed(2)}</td>
                                <td className="px-5 py-2.5 text-right font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">$ {parseFloat(o.profit || 0).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6">
                      {newAssignOrders.map((order, idx) => (
                        <div 
                          key={idx} 
                          className={`bg-white dark:bg-slate-950 border ${freezeTarget === String(idx + 1) ? 'border-rose-400 dark:border-rose-500/50 shadow-rose-500/10' : 'border-slate-200 dark:border-slate-800'} rounded-2xl shadow-md relative group transition-all flex flex-col gap-6`}
                          style={{ padding: '24px' }}
                        >
                          {/* Order Header / Actions */}
                          <div className="flex justify-between items-center pb-3.5 border-b border-slate-100 dark:border-slate-800/60">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-mono text-[10px] font-bold">
                                {idx + 1}
                              </div>
                              Worksheet Order Row
                              {freezeTarget === String(idx + 1) && (
                                <span className="ml-2 px-2 py-0.5 rounded text-[10px] bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400 font-bold">Target Freeze</span>
                              )}
                            </span>
                            {newAssignOrders.length > 1 && (
                              <button 
                                type="button" 
                                onClick={() => handleRemoveOrder(idx)}
                                className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded transition-colors"
                                title="Remove row"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                            {/* Auto-Fill Catalog */}
                            <div className="md:col-span-4 flex flex-col gap-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Auto-Fill Catalog</label>
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
                                defaultValue=""
                                className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-100 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition-colors cursor-pointer"
                              >
                                <option value="">-- Choose --</option>
                                {products.map((p, pIdx) => (
                                  <option key={pIdx} value={pIdx}>
                                    {p.title.length > 40 ? p.title.substring(0, 40) + '...' : p.title} (${p.price})
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Product Title */}
                            <div className="md:col-span-8 flex gap-3 items-end">
                              {order.image && (
                                <div className="w-11 h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-white shadow-sm p-1 flex-shrink-0 flex items-center justify-center">
                                  <img 
                                    src={order.image} 
                                    alt="" 
                                    referrerPolicy="no-referrer"
                                    className="max-w-full max-h-full object-contain"
                                  />
                                </div>
                              )}
                              <div className="flex-1 flex flex-col gap-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Product Title</label>
                                <input 
                                  type="text"
                                  value={order.title}
                                  onChange={(e) => {
                                    const updated = [...newAssignOrders];
                                    updated[idx].title = e.target.value;
                                    setNewAssignOrders(updated);
                                  }}
                                  required
                                  placeholder="e.g. Premium Item Title"
                                  className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Price & Commission row */}
                          <div className="pt-5 border-t border-slate-100 dark:border-slate-800/40 grid grid-cols-2 gap-5">
                            <div className="flex flex-col gap-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Price ($)</label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-slate-400">$</span>
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
                                  className="w-full h-11 pl-7 pr-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 text-xs font-mono focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                                />
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider block">Commission ($)</label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-emerald-500">$</span>
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
                                  className="w-full h-11 pl-7 pr-3 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/30 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-xs font-mono focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Computation Summary block */}
                  <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80">
                    <div className="grid grid-cols-3 gap-5 text-center">
                      <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Total Items</span>
                        <b className="text-slate-900 dark:text-slate-100 text-base font-mono">{newAssignOrders.length}</b>
                      </div>
                      <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Total Price</span>
                        <b className="text-slate-900 dark:text-slate-100 text-sm font-mono truncate block">${newAssignOrders.reduce((sum, o) => sum + parseFloat(o.price || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b>
                      </div>
                      <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30 shadow-sm">
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-2">Total Commission</span>
                        <b className="text-emerald-700 dark:text-emerald-400 text-sm font-mono truncate block">${newAssignOrders.reduce((sum, o) => sum + parseFloat(o.profit || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3" style={{ padding: '20px 32px' }}>
                  <button 
                    type="button" 
                    className="px-5 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-xl transition-colors shadow-sm"
                    onClick={() => { setShowModal(false); setSelectedUser(null); }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-sm flex items-center gap-2 active:scale-[0.98]"
                  >
                    <Check className="w-4 h-4" />
                    Confirm and Allocate
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}



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
      `}</style>
    </div>
  );
}

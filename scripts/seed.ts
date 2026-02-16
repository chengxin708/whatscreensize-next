import { config } from 'dotenv';
config({ path: '.env.local' });

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import bcrypt from 'bcryptjs';
import * as schema from '../src/lib/db/schema';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

async function seed() {
  console.log('Seeding database...');

  // 1. Create admin user
  console.log('Creating admin user...');
  const passwordHash = await bcrypt.hash('admin123', 10);
  await db.insert(schema.users).values({
    email: 'chengxin@lnfitservices.com',
    password_hash: passwordHash,
    name: 'Admin',
  }).onConflictDoNothing();

  // 2. Seed TV products
  console.log('Seeding TV products...');
  const tvProducts = [
    // 42" TVs
    { size_inches: 42, brand: 'LG', model: 'C4 42" OLED evo', panel_type: 'OLED', resolution: '4K', price_range: '$800-1,000', features: ['120Hz', 'Dolby Vision IQ', 'HDMI 2.1', 'G-Sync / FreeSync'], image_url: 'images/products/tv/lg-c4-42.jpg', link: '', year: 2024, sort_order: 1 },
    { size_inches: 42, brand: 'LG', model: 'C3 42" OLED evo', panel_type: 'OLED', resolution: '4K', price_range: '$600-800', features: ['120Hz', 'Dolby Vision', 'HDMI 2.1', 'webOS'], image_url: 'images/products/tv/lg-c3-42.jpg', link: '', year: 2023, sort_order: 2 },
    // 48" TVs
    { size_inches: 48, brand: 'LG', model: 'C4 48" OLED evo', panel_type: 'OLED', resolution: '4K', price_range: '$1,000-1,300', features: ['120Hz', 'Dolby Vision IQ', 'HDMI 2.1', 'a9 AI Gen7'], image_url: 'images/products/tv/lg-c4-48.jpg', link: '', year: 2024, sort_order: 1 },
    { size_inches: 48, brand: 'Samsung', model: 'S90D 48" OLED', panel_type: 'OLED', resolution: '4K', price_range: '$1,000-1,200', features: ['144Hz', 'Dolby Atmos', 'HDR10+', 'Tizen OS'], image_url: 'images/products/tv/samsung-s90d-48.jpg', link: '', year: 2024, sort_order: 2 },
    // 55" TVs
    { size_inches: 55, brand: 'Samsung', model: 'S95D 55" QD-OLED', panel_type: 'QD-OLED', resolution: '4K', price_range: '$1,800-2,200', features: ['144Hz', 'Anti-Glare', 'Dolby Atmos', 'Neural Quantum 4K'], image_url: 'images/products/tv/samsung-s95d-55.jpg', link: '', year: 2024, sort_order: 1 },
    { size_inches: 55, brand: 'LG', model: 'C4 55" OLED evo', panel_type: 'OLED', resolution: '4K', price_range: '$1,200-1,500', features: ['120Hz', 'Dolby Vision IQ', 'HDMI 2.1 x4', 'webOS 24'], image_url: 'images/products/tv/lg-c4-55.jpg', link: '', year: 2024, sort_order: 2 },
    { size_inches: 55, brand: 'Sony', model: 'A80L 55" OLED', panel_type: 'OLED', resolution: '4K', price_range: '$1,200-1,600', features: ['120Hz', 'XR Processor', 'Acoustic Surface Audio', 'Google TV'], image_url: 'images/products/tv/sony-a80l-55.jpg', link: '', year: 2023, sort_order: 3 },
    // 65" TVs
    { size_inches: 65, brand: 'Samsung', model: 'S95D 65" QD-OLED', panel_type: 'QD-OLED', resolution: '4K', price_range: '$2,400-2,800', features: ['144Hz', 'Anti-Glare', 'Object Tracking Sound+', 'One Connect Box'], image_url: 'images/products/tv/samsung-s95d-65.jpg', link: '', year: 2024, sort_order: 1 },
    { size_inches: 65, brand: 'LG', model: 'G4 65" OLED evo', panel_type: 'OLED', resolution: '4K', price_range: '$2,400-2,800', features: ['120Hz', 'MLA Panel', 'Dolby Vision', 'Flush Wall Mount'], image_url: 'images/products/tv/lg-g4-65.jpg', link: '', year: 2024, sort_order: 2 },
    { size_inches: 65, brand: 'Sony', model: 'A95L 65" QD-OLED', panel_type: 'QD-OLED', resolution: '4K', price_range: '$2,500-3,000', features: ['120Hz', 'XR Processor', 'Cognitive AI', 'Acoustic Surface Audio+'], image_url: 'images/products/tv/sony-a95l-65.jpg', link: '', year: 2023, sort_order: 3 },
    { size_inches: 65, brand: 'TCL', model: 'QM8 65" Mini-LED', panel_type: 'Mini-LED', resolution: '4K', price_range: '$800-1,000', features: ['120Hz', '2000+ dimming zones', 'Dolby Vision IQ', 'Google TV'], image_url: 'images/products/tv/tcl-qm8-65.jpg', link: '', year: 2024, sort_order: 4 },
    // 75" TVs
    { size_inches: 75, brand: 'Samsung', model: 'QN90D 75" Neo QLED', panel_type: 'Mini-LED', resolution: '4K', price_range: '$2,000-2,500', features: ['144Hz', 'Neural Quantum 4K', 'Anti-Reflection', 'Object Tracking Sound+'], image_url: 'images/products/tv/samsung-qn90d-75.jpg', link: '', year: 2024, sort_order: 1 },
    { size_inches: 75, brand: 'Hisense', model: 'U8N 75" Mini-LED', panel_type: 'Mini-LED', resolution: '4K', price_range: '$1,200-1,500', features: ['144Hz', '2000+ dimming zones', 'Dolby Vision IQ', 'Google TV'], image_url: 'images/products/tv/hisense-u8n-75.jpg', link: '', year: 2024, sort_order: 2 },
    { size_inches: 75, brand: 'TCL', model: 'QM8 75" Mini-LED', panel_type: 'Mini-LED', resolution: '4K', price_range: '$1,100-1,400', features: ['120Hz', '2300+ dimming zones', 'HDR 2000 nits', 'Google TV'], image_url: 'images/products/tv/tcl-qm8-75.jpg', link: '', year: 2024, sort_order: 3 },
    // 77" TVs
    { size_inches: 77, brand: 'LG', model: 'C4 77" OLED evo', panel_type: 'OLED', resolution: '4K', price_range: '$2,200-2,700', features: ['120Hz', 'Dolby Vision IQ', 'a9 AI Gen7', 'webOS 24'], image_url: 'images/products/tv/lg-c4-77.jpg', link: '', year: 2024, sort_order: 1 },
    { size_inches: 77, brand: 'LG', model: 'G4 77" OLED evo', panel_type: 'OLED', resolution: '4K', price_range: '$3,000-3,600', features: ['120Hz', 'MLA Panel', 'Brightness Booster Max', 'Flush Mount'], image_url: 'images/products/tv/lg-g4-77.jpg', link: '', year: 2024, sort_order: 2 },
    { size_inches: 77, brand: 'Samsung', model: 'S95D 77" QD-OLED', panel_type: 'QD-OLED', resolution: '4K', price_range: '$3,200-3,800', features: ['144Hz', 'Anti-Glare', 'Dolby Atmos', 'Neural Quantum 4K'], image_url: 'images/products/tv/samsung-s95d-77.jpg', link: '', year: 2024, sort_order: 3 },
    // 83" TVs
    { size_inches: 83, brand: 'LG', model: 'C4 83" OLED evo', panel_type: 'OLED', resolution: '4K', price_range: '$3,000-3,600', features: ['120Hz', 'Dolby Vision IQ', 'HDMI 2.1 x4', 'a9 AI Gen7'], image_url: 'images/products/tv/lg-c4-83.jpg', link: '', year: 2024, sort_order: 1 },
    { size_inches: 83, brand: 'LG', model: 'G4 83" OLED evo', panel_type: 'OLED', resolution: '4K', price_range: '$4,000-4,800', features: ['120Hz', 'MLA Panel', 'Brightness Booster Max', 'Gallery Design'], image_url: 'images/products/tv/lg-g4-83.jpg', link: '', year: 2024, sort_order: 2 },
    // 85" TVs
    { size_inches: 85, brand: 'Samsung', model: 'QN90D 85" Neo QLED', panel_type: 'Mini-LED', resolution: '4K', price_range: '$2,800-3,500', features: ['144Hz', 'Neural Quantum 4K', 'Anti-Reflection', 'Dolby Atmos'], image_url: 'images/products/tv/samsung-qn90d-85.jpg', link: '', year: 2024, sort_order: 1 },
    { size_inches: 85, brand: 'Hisense', model: 'U8N 85" Mini-LED', panel_type: 'Mini-LED', resolution: '4K', price_range: '$1,800-2,200', features: ['144Hz', 'Hi-View Engine', 'Dolby Vision IQ', 'Game Mode Pro'], image_url: 'images/products/tv/hisense-u8n-85.jpg', link: '', year: 2024, sort_order: 2 },
    { size_inches: 85, brand: 'TCL', model: 'QM8 85" Mini-LED', panel_type: 'Mini-LED', resolution: '4K', price_range: '$1,500-2,000', features: ['120Hz', '2300+ dimming zones', 'AiPQ Pro', 'Google TV'], image_url: 'images/products/tv/tcl-qm8-85.jpg', link: '', year: 2024, sort_order: 3 },
    // 98" TVs
    { size_inches: 98, brand: 'TCL', model: 'S5 98" LED', panel_type: 'LED', resolution: '4K', price_range: '$2,000-2,500', features: ['120Hz', 'Dolby Vision', 'Game Accelerator 240', 'Google TV'], image_url: 'images/products/tv/tcl-s5-98.jpg', link: '', year: 2024, sort_order: 1 },
    { size_inches: 98, brand: 'Samsung', model: 'QN90D 98" Neo QLED', panel_type: 'Mini-LED', resolution: '4K', price_range: '$7,000-9,000', features: ['144Hz', 'Neural Quantum 4K', 'Anti-Reflection', 'Dolby Atmos'], image_url: 'images/products/tv/samsung-qn90d-98.jpg', link: '', year: 2024, sort_order: 2 },
    { size_inches: 98, brand: 'Hisense', model: 'U7N 98" Mini-LED', panel_type: 'Mini-LED', resolution: '4K', price_range: '$3,000-3,500', features: ['144Hz', 'Dolby Vision IQ', 'Game Mode Pro', 'Google TV'], image_url: 'images/products/tv/hisense-u7n-98.jpg', link: '', year: 2024, sort_order: 3 },
    // 100" TVs
    { size_inches: 100, brand: 'Samsung', model: 'QN900D 98" 8K Neo QLED', panel_type: 'Mini-LED', resolution: '8K', price_range: '$8,000-10,000', features: ['120Hz', 'Neural Quantum 8K', 'AI Upscaling', 'Dolby Atmos'], image_url: 'images/products/tv/samsung-qn900d-98.jpg', link: '', year: 2024, sort_order: 1 },
    { size_inches: 100, brand: 'Hisense', model: 'UX 100" Mini-LED', panel_type: 'Mini-LED', resolution: '4K', price_range: '$5,000-7,000', features: ['144Hz', '10000+ dimming zones', 'Dolby Vision IQ', 'Hi-View Engine X'], image_url: 'images/products/tv/hisense-ux-100.jpg', link: '', year: 2024, sort_order: 2 },
    // 115" TVs
    { size_inches: 115, brand: 'Samsung', model: 'The Wall 110" MicroLED', panel_type: 'MicroLED', resolution: '4K', price_range: '$100,000+', features: ['120Hz', 'Self-Emissive', 'Modular Design', 'Zero Bezel'], image_url: 'images/products/tv/samsung-the-wall-110.jpg', link: '', year: 2024, sort_order: 1 },
    { size_inches: 115, brand: 'LG', model: 'MAGNIT 118" MicroLED', panel_type: 'MicroLED', resolution: '4K', price_range: '$80,000+', features: ['120Hz', 'Self-Emissive', 'a9 Processor', 'webOS'], image_url: '', link: '', year: 2024, sort_order: 2 },
  ];

  for (const p of tvProducts) {
    await db.insert(schema.tvProducts).values({
      size_inches: p.size_inches,
      brand: p.brand,
      model: p.model,
      panel_type: p.panel_type,
      resolution: p.resolution,
      price_range: p.price_range,
      features: p.features,
      image_url: p.image_url,
      link: p.link,
      year: p.year,
      sort_order: p.sort_order,
    });
  }
  console.log(`  Inserted ${tvProducts.length} TV products`);

  // 3. Seed Monitor products
  console.log('Seeding Monitor products...');
  const monitorProducts = [
    // 24" 1920x1080
    { spec_key: '24-1920x1080', brand: 'ASUS', model: 'ROG Swift PG248QP', panel_type: 'TN', refresh_rate: '540Hz', price_range: '$400-500', features: ['G-Sync', 'ELMB Sync', '0.2ms GTG'], tags: ['gaming'], image_url: 'images/products/monitor/asus-rog-swift-pg248qp.jpg', link: '', year: 2024, sort_order: 1 },
    { spec_key: '24-1920x1080', brand: 'BenQ', model: 'ZOWIE XL2546X', panel_type: 'TN', refresh_rate: '360Hz', price_range: '$400-500', features: ['DyAc 2', 'XL Setting to Share', 'Shield'], tags: ['gaming'], image_url: 'images/products/monitor/benq-zowie-xl2546x.jpg', link: '', year: 2024, sort_order: 2 },
    // 24" 2560x1440
    { spec_key: '24-2560x1440', brand: 'ASUS', model: 'ROG Swift PG24UQ', panel_type: 'IPS', refresh_rate: '360Hz', price_range: '$500-600', features: ['G-Sync', 'HDR400', '0.5ms GTG'], tags: ['gaming', 'productivity'], image_url: 'images/products/monitor/asus-rog-swift-pg24uq.jpg', link: '', year: 2024, sort_order: 1 },
    // 27" 1920x1080
    { spec_key: '27-1920x1080', brand: 'ASUS', model: 'VG279Q1A', panel_type: 'IPS', refresh_rate: '165Hz', price_range: '$150-200', features: ['FreeSync Premium', 'ELMB', '1ms MPRT'], tags: ['gaming'], image_url: 'images/products/monitor/asus-vg279q1a.jpg', link: '', year: 2023, sort_order: 1 },
    { spec_key: '27-1920x1080', brand: 'AOC', model: '27G2SP', panel_type: 'IPS', refresh_rate: '165Hz', price_range: '$130-170', features: ['FreeSync Premium', 'Low Input Lag', '1ms MPRT'], tags: ['gaming'], image_url: 'images/products/monitor/aoc-27g2sp.jpg', link: '', year: 2023, sort_order: 2 },
    // 27" 2560x1440
    { spec_key: '27-2560x1440', brand: 'Samsung', model: 'Odyssey OLED G6 27"', panel_type: 'QD-OLED', refresh_rate: '360Hz', price_range: '$650-800', features: ['FreeSync Premium Pro', 'HDR True Black 400', '0.03ms GTG'], tags: ['gaming'], image_url: 'images/products/monitor/samsung-odyssey-oled-g6-27.jpg', link: '', year: 2024, sort_order: 1 },
    { spec_key: '27-2560x1440', brand: 'ASUS', model: 'ROG Swift OLED PG27AQDP', panel_type: 'WOLED', refresh_rate: '480Hz', price_range: '$800-1,000', features: ['G-Sync Compatible', 'HDR True Black 400', '0.03ms GTG'], tags: ['gaming'], image_url: 'images/products/monitor/asus-rog-swift-oled-pg27aqdp.jpg', link: '', year: 2024, sort_order: 2 },
    { spec_key: '27-2560x1440', brand: 'Dell', model: 'S2722DGM', panel_type: 'VA', refresh_rate: '165Hz', price_range: '$200-280', features: ['FreeSync Premium', 'HDR400', '1ms MPRT'], tags: ['gaming', 'productivity'], image_url: 'images/products/monitor/dell-s2722dgm.jpg', link: '', year: 2023, sort_order: 3 },
    // 27" 3840x2160
    { spec_key: '27-3840x2160', brand: 'ASUS', model: 'ROG Swift OLED PG27UCDM', panel_type: 'WOLED', refresh_rate: '240Hz', price_range: '$800-1,000', features: ['G-Sync Compatible', 'HDR True Black 400', 'USB-C 90W'], tags: ['gaming', 'productivity'], image_url: 'images/products/monitor/asus-rog-swift-oled-pg27ucdm.jpg', link: '', year: 2024, sort_order: 1 },
    { spec_key: '27-3840x2160', brand: 'LG', model: 'UltraGear 27GS95QE', panel_type: 'OLED', refresh_rate: '240Hz', price_range: '$700-900', features: ['FreeSync Premium', 'HDR True Black 400', 'Anti-Glare Low Reflection'], tags: ['gaming', 'productivity'], image_url: 'images/products/monitor/lg-ultragear-27gs95qe.jpg', link: '', year: 2024, sort_order: 2 },
    { spec_key: '27-3840x2160', brand: 'Dell', model: 'UltraSharp U2723QE', panel_type: 'IPS Black', refresh_rate: '60Hz', price_range: '$400-550', features: ['USB-C 90W', 'KVM Switch', 'VESA DisplayHDR 400'], tags: ['productivity'], image_url: 'images/products/monitor/dell-ultrasharp-u2723qe.jpg', link: '', year: 2023, sort_order: 3 },
    // 27" 5120x2880
    { spec_key: '27-5120x2880', brand: 'Apple', model: 'Studio Display', panel_type: 'IPS', refresh_rate: '60Hz', price_range: '$1,500-1,600', features: ['True Tone', '600 nits', '12MP Camera', 'Thunderbolt 3'], tags: ['productivity'], image_url: 'images/products/monitor/apple-studio-display.jpg', link: '', year: 2022, sort_order: 1 },
    { spec_key: '27-5120x2880', brand: 'LG', model: 'UltraFine 5K 27MD5KL', panel_type: 'IPS', refresh_rate: '60Hz', price_range: '$1,000-1,300', features: ['Thunderbolt 3', 'P3 Wide Color', '500 nits', 'macOS optimized'], tags: ['productivity'], image_url: 'images/products/monitor/lg-ultrafine-5k-27md5kl.jpg', link: '', year: 2022, sort_order: 2 },
    // 32" 2560x1440
    { spec_key: '32-2560x1440', brand: 'Samsung', model: 'Odyssey OLED G8 32"', panel_type: 'QD-OLED', refresh_rate: '240Hz', price_range: '$700-900', features: ['FreeSync Premium Pro', 'HDR True Black 400', '0.03ms GTG'], tags: ['gaming', 'productivity'], image_url: 'images/products/monitor/samsung-odyssey-oled-g8-32.jpg', link: '', year: 2024, sort_order: 1 },
    { spec_key: '32-2560x1440', brand: 'LG', model: 'UltraGear 32GS95UE', panel_type: 'OLED', refresh_rate: '240Hz', price_range: '$700-900', features: ['Dual Mode (4K/QHD)', 'FreeSync Premium', 'Anti-Glare Low Reflection'], tags: ['gaming', 'productivity'], image_url: 'images/products/monitor/lg-ultragear-32gs95ue.jpg', link: '', year: 2024, sort_order: 2 },
    // 32" 3840x2160
    { spec_key: '32-3840x2160', brand: 'Samsung', model: 'Odyssey OLED G8 32" 4K', panel_type: 'QD-OLED', refresh_rate: '240Hz', price_range: '$1,000-1,300', features: ['FreeSync Premium Pro', 'HDR True Black 400', 'USB-C'], tags: ['gaming', 'productivity'], image_url: 'images/products/monitor/samsung-odyssey-oled-g8-32-4k.jpg', link: '', year: 2024, sort_order: 1 },
    { spec_key: '32-3840x2160', brand: 'ASUS', model: 'ProArt PA32UCXR', panel_type: 'Mini-LED', refresh_rate: '120Hz', price_range: '$3,000-3,500', features: ['Calman Verified', 'HDR 1600', 'Thunderbolt 4', '2304 dimming zones'], tags: ['productivity'], image_url: 'images/products/monitor/asus-proart-pa32ucxr.jpg', link: '', year: 2024, sort_order: 2 },
    { spec_key: '32-3840x2160', brand: 'Dell', model: 'UltraSharp U3224KB', panel_type: 'IPS Black', refresh_rate: '60Hz', price_range: '$2,800-3,200', features: ['Thunderbolt 4', '4K Webcam', 'KVM Switch', 'HDR 400'], tags: ['productivity'], image_url: 'images/products/monitor/dell-ultrasharp-u3224kb.jpg', link: '', year: 2024, sort_order: 3 },
    // 32" 7680x4320
    { spec_key: '32-7680x4320', brand: 'Dell', model: 'UltraSharp UP3218K', panel_type: 'IPS', refresh_rate: '60Hz', price_range: '$3,500-4,500', features: ['8K Resolution', 'PremierColor', '100% sRGB', 'Dual DP Required'], tags: ['productivity'], image_url: 'images/products/monitor/dell-ultrasharp-up3218k.jpg', link: '', year: 2022, sort_order: 1 },
    // 43" 3840x2160
    { spec_key: '43-3840x2160', brand: 'LG', model: '43UN700-B', panel_type: 'IPS', refresh_rate: '60Hz', price_range: '$400-500', features: ['USB-C', 'HDR10', '4x HDMI', 'Remote Control'], tags: ['productivity'], image_url: 'images/products/monitor/lg-43un700-b.jpg', link: '', year: 2023, sort_order: 1 },
    { spec_key: '43-3840x2160', brand: 'ASUS', model: 'ROG Strix XG43UQ', panel_type: 'VA', refresh_rate: '144Hz', price_range: '$800-1,100', features: ['HDMI 2.1', 'FreeSync Premium Pro', 'HDR1000', 'DisplayPort 1.4'], tags: ['gaming'], image_url: 'images/products/monitor/asus-rog-strix-xg43uq.jpg', link: '', year: 2023, sort_order: 2 },
    // 48" 3840x2160
    { spec_key: '48-3840x2160', brand: 'LG', model: 'UltraGear 48GQ900', panel_type: 'OLED', refresh_rate: '120Hz', price_range: '$800-1,000', features: ['FreeSync Premium', 'HDR True Black 400', 'Anti-Glare'], tags: ['gaming', 'productivity'], image_url: 'images/products/monitor/lg-ultragear-48gq900.jpg', link: '', year: 2023, sort_order: 1 },
    { spec_key: '48-3840x2160', brand: 'Corsair', model: 'Xeneon Flex 45WQHD240', panel_type: 'OLED', refresh_rate: '240Hz', price_range: '$1,500-2,000', features: ['Bendable Screen', 'G-Sync Compatible', 'HDR True Black 400'], tags: ['gaming'], image_url: 'images/products/monitor/corsair-xeneon-flex-45wqhd240.jpg', link: '', year: 2024, sort_order: 2 },
    // 30" 2560x1080 (Ultrawide)
    { spec_key: '30-2560x1080', brand: 'LG', model: '30WP500-B', panel_type: 'IPS', refresh_rate: '75Hz', price_range: '$180-250', features: ['FreeSync', 'HDR10', 'sRGB 99%', 'Reader Mode'], tags: ['gaming'], image_url: 'images/products/monitor/lg-30wp500-b.jpg', link: '', year: 2023, sort_order: 1 },
    // 34" 3440x1440 (Ultrawide)
    { spec_key: '34-3440x1440', brand: 'Alienware', model: 'AW3425DW', panel_type: 'QD-OLED', refresh_rate: '240Hz', price_range: '$900-1,100', features: ['G-Sync Ultimate', 'HDR True Black 400', '0.03ms GTG'], tags: ['gaming'], image_url: 'images/products/monitor/alienware-aw3425dw.jpg', link: '', year: 2024, sort_order: 1 },
    { spec_key: '34-3440x1440', brand: 'LG', model: 'UltraGear 34GS95QE', panel_type: 'WOLED', refresh_rate: '240Hz', price_range: '$800-1,000', features: ['FreeSync Premium', 'HDR True Black 400', 'Anti-Glare Low Reflection'], tags: ['gaming', 'productivity'], image_url: 'images/products/monitor/lg-ultragear-34gs95qe.jpg', link: '', year: 2024, sort_order: 2 },
    { spec_key: '34-3440x1440', brand: 'Dell', model: 'UltraSharp U3423WE', panel_type: 'IPS', refresh_rate: '60Hz', price_range: '$700-850', features: ['USB-C 90W', 'KVM Switch', 'HDR400', 'sRGB 98%'], tags: ['productivity'], image_url: 'images/products/monitor/dell-ultrasharp-u3423we.jpg', link: '', year: 2023, sort_order: 3 },
    // 38" 3840x1600 (Ultrawide)
    { spec_key: '38-3840x1600', brand: 'Dell', model: 'UltraSharp U3824DW', panel_type: 'IPS Black', refresh_rate: '60Hz', price_range: '$1,100-1,400', features: ['USB-C 140W', 'KVM Switch', 'HDR400', 'Thunderbolt 4'], tags: ['productivity'], image_url: 'images/products/monitor/dell-ultrasharp-u3824dw.jpg', link: '', year: 2024, sort_order: 1 },
    { spec_key: '38-3840x1600', brand: 'LG', model: '38WN95C-W', panel_type: 'IPS', refresh_rate: '144Hz', price_range: '$1,000-1,300', features: ['Thunderbolt 3', 'FreeSync', 'HDR600', 'sRGB 98%'], tags: ['gaming', 'productivity'], image_url: 'images/products/monitor/lg-38wn95c-w.jpg', link: '', year: 2023, sort_order: 2 },
    // 45" 3440x1440 (Ultrawide)
    { spec_key: '45-3440x1440', brand: 'LG', model: 'UltraGear 45GR95QE', panel_type: 'OLED', refresh_rate: '240Hz', price_range: '$1,200-1,500', features: ['800R Curvature', 'FreeSync Premium', 'HDR True Black 400'], tags: ['gaming'], image_url: 'images/products/monitor/lg-ultragear-45gr95qe.jpg', link: '', year: 2023, sort_order: 1 },
    // 45" 5120x2160 (Ultrawide)
    { spec_key: '45-5120x2160', brand: 'LG', model: 'UltraGear 45GX990A', panel_type: 'OLED', refresh_rate: '240Hz', price_range: '$1,500-1,800', features: ['Dual Mode (UW5K/WQHD)', 'FreeSync Premium', 'HDR True Black 400'], tags: ['gaming', 'productivity'], image_url: 'images/products/monitor/lg-ultragear-45gx990a.jpg', link: '', year: 2025, sort_order: 1 },
    { spec_key: '45-5120x2160', brand: 'ASUS', model: 'ROG Swift PG49WCD', panel_type: 'QD-OLED', refresh_rate: '144Hz', price_range: '$1,300-1,600', features: ['G-Sync Compatible', 'HDR True Black 400', 'USB-C 90W'], tags: ['gaming', 'productivity'], image_url: 'images/products/monitor/asus-rog-swift-pg49wcd.jpg', link: '', year: 2024, sort_order: 2 },
    // 49" 3840x1080 (Super Ultrawide)
    { spec_key: '49-3840x1080', brand: 'Samsung', model: 'Odyssey G9 C49RG90', panel_type: 'VA', refresh_rate: '120Hz', price_range: '$700-900', features: ['FreeSync Premium Pro', '1000R Curvature', 'HDR1000'], tags: ['gaming'], image_url: 'images/products/monitor/samsung-odyssey-g9-c49rg90.jpg', link: '', year: 2022, sort_order: 1 },
    // 49" 5120x1440 (Super Ultrawide)
    { spec_key: '49-5120x1440', brand: 'Samsung', model: 'Odyssey OLED G9 G95SC', panel_type: 'QD-OLED', refresh_rate: '240Hz', price_range: '$1,200-1,500', features: ['FreeSync Premium Pro', 'HDR True Black 400', '1800R Curvature'], tags: ['gaming', 'productivity'], image_url: 'images/products/monitor/samsung-odyssey-oled-g9-g95sc.jpg', link: '', year: 2024, sort_order: 1 },
    { spec_key: '49-5120x1440', brand: 'Dell', model: 'UltraSharp U4924DW', panel_type: 'IPS', refresh_rate: '60Hz', price_range: '$1,200-1,500', features: ['USB-C 90W', 'Dual QHD PBP', 'KVM Switch', 'VESA HDR 400'], tags: ['productivity'], image_url: 'images/products/monitor/dell-ultrasharp-u4924dw.jpg', link: '', year: 2023, sort_order: 2 },
    // 57" 7680x2160 (Super Ultrawide)
    { spec_key: '57-7680x2160', brand: 'Samsung', model: 'Odyssey Neo G9 57"', panel_type: 'Mini-LED', refresh_rate: '240Hz', price_range: '$2,500-3,000', features: ['Dual UHD', 'DisplayPort 2.1', 'HDR1000', '1000R Curvature'], tags: ['gaming', 'productivity'], image_url: 'images/products/monitor/samsung-odyssey-neo-g9-57.jpg', link: '', year: 2024, sort_order: 1 },
  ];

  for (const p of monitorProducts) {
    await db.insert(schema.monitorProducts).values({
      spec_key: p.spec_key,
      brand: p.brand,
      model: p.model,
      panel_type: p.panel_type,
      refresh_rate: p.refresh_rate,
      price_range: p.price_range,
      features: p.features,
      tags: p.tags,
      image_url: p.image_url,
      link: p.link,
      year: p.year,
      sort_order: p.sort_order,
    });
  }
  console.log(`  Inserted ${monitorProducts.length} Monitor products`);

  // 4. Seed Guides
  console.log('Seeding Guides...');
  const guidesData = [
    { slug: 'tv-size-buying-guide', title: 'TV Size Buying Guide', description: 'Learn how to choose the perfect TV size based on viewing distance', category: 'tv' as const, reading_time: 8, file_path: '01-tv-size-buying-guide.md', icon_name: 'tv', gradient_from: '#ef4444', gradient_to: '#dc2626', sort_order: 1 },
    { slug: 'cinema-experience-fov', title: 'Cinema Experience & Field of View', description: 'Understanding FOV standards for optimal viewing', category: 'tv' as const, reading_time: 8, file_path: '02-cinema-experience-fov.md', icon_name: 'eye', gradient_from: '#f59e0b', gradient_to: '#d97706', sort_order: 2 },
    { slug: 'tv-mounting-height', title: 'TV Mounting Height Guide', description: 'How to mount your TV at the perfect height', category: 'tv' as const, reading_time: 7, file_path: '03-tv-mounting-height.md', icon_name: 'ruler', gradient_from: '#10b981', gradient_to: '#059669', sort_order: 3 },
    { slug: 'aspect-ratios-explained', title: 'Aspect Ratios Explained', description: 'Understanding 16:9, 21:9 and other aspect ratios', category: 'general' as const, reading_time: 7, file_path: '04-aspect-ratios-explained.md', icon_name: 'layout', gradient_from: '#6366f1', gradient_to: '#4f46e5', sort_order: 4 },
    { slug: 'tv-size-comparison', title: 'TV Size Comparison', description: 'Compare different TV sizes visually', category: 'tv' as const, reading_time: 7, file_path: '05-tv-size-comparison.md', icon_name: 'compare', gradient_from: '#ec4899', gradient_to: '#db2777', sort_order: 5 },
    { slug: 'projector-vs-tv', title: 'Projector vs TV', description: 'Pros and cons of projectors and TVs', category: 'tv' as const, reading_time: 8, file_path: '06-projector-vs-tv.md', icon_name: 'projector', gradient_from: '#8b5cf6', gradient_to: '#7c3aed', sort_order: 6 },
    { slug: 'why-8k-is-unnecessary', title: 'Why 8K is Unnecessary', description: 'The truth about 8K resolution', category: 'tv' as const, reading_time: 10, file_path: '07-why-8k-is-unnecessary.md', icon_name: 'alert', gradient_from: '#f97316', gradient_to: '#ea580c', sort_order: 7 },
    { slug: 'monitor-ppi-explained', title: 'Monitor PPI Explained', description: 'Understanding pixel density for monitors', category: 'monitor' as const, reading_time: 9, file_path: '08-monitor-ppi-explained.md', icon_name: 'grid', gradient_from: '#06b6d4', gradient_to: '#0891b2', sort_order: 8 },
    { slug: 'refresh-rate-guide', title: 'Refresh Rate Guide', description: '60Hz, 120Hz, 144Hz and beyond', category: 'monitor' as const, reading_time: 10, file_path: '09-refresh-rate-guide.md', icon_name: 'zap', gradient_from: '#14b8a6', gradient_to: '#0d9488', sort_order: 9 },
    { slug: 'best-monitor-size-by-use-case', title: 'Best Monitor Size by Use Case', description: 'Gaming, work, and creative workflows', category: 'monitor' as const, reading_time: 10, file_path: '10-best-monitor-size-by-use-case.md', icon_name: 'target', gradient_from: '#3b82f6', gradient_to: '#2563eb', sort_order: 10 },
    { slug: 'ultrawide-vs-dual-monitor', title: 'Ultrawide vs Dual Monitors', description: 'Comparing ultrawide and dual setups', category: 'monitor' as const, reading_time: 9, file_path: '11-ultrawide-vs-dual-monitor.md', icon_name: 'columns', gradient_from: '#a855f7', gradient_to: '#9333ea', sort_order: 11 },
    { slug: '1080p-vs-1440p-vs-4k', title: '1080p vs 1440p vs 4K', description: 'Resolution comparison for monitors', category: 'monitor' as const, reading_time: 11, file_path: '12-1080p-vs-1440p-vs-4k.md', icon_name: 'image', gradient_from: '#f43f5e', gradient_to: '#e11d48', sort_order: 12 },
  ];

  for (const g of guidesData) {
    await db.insert(schema.guides).values({
      slug: g.slug,
      title: g.title,
      description: g.description,
      category: g.category,
      reading_time: g.reading_time,
      file_path: g.file_path,
      icon_name: g.icon_name,
      gradient_from: g.gradient_from,
      gradient_to: g.gradient_to,
      sort_order: g.sort_order,
      is_published: true,
    }).onConflictDoNothing();
  }
  console.log(`  Inserted ${guidesData.length} Guides`);

  console.log('Seeding complete!');
  await client.end();
  process.exit(0);
}

seed().catch((e) => {
  console.error('Seed failed:', e);
  process.exit(1);
});

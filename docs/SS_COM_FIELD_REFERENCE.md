# SS.COM Ad Field Reference — Complete Analysis

Reference document for implementing category-specific listing templates on sell.onfire.so.

## Universal Detail Page Structure

Every SS.COM listing follows this layout:

```
1. Breadcrumb (Category > Subcategory > ... > Transaction Type)
2. Photo Gallery (thumbnails strip, click-to-enlarge, 1-35 images)
3. Free-text Description (often bilingual LV/RU)
4. Structured Fields Table (key-value pairs, category-specific)
5. Price Block (EUR, sometimes with per-unit calculation)
6. Contact Block (phone masked, email form, location)
7. Metadata (date posted DD.MM.YYYY HH:MM, unique view count)
8. Action Buttons (Favorites, Print, Share, Remind, Report)
```

### Universal Fields (ALL categories)

| Field | Notes |
|-------|-------|
| Price (Cena) | Always EUR. Can be flat, per-m², per-unit, "Call for price" |
| Location (Vieta) | City + district text |
| Phone (Tālrunis) | Masked: (+371)XX-XX-***, click to reveal |
| Email | Contact form, never shown directly |
| Date Posted | DD.MM.YYYY HH:MM |
| View Count | Unique visitors |
| Description | Free-form HTML text |
| Photos | 0-35 images, thumbnail gallery |

### Transaction Types

| Latvian | English | Code |
|---------|---------|------|
| Pārdod | Sell | sell |
| Pērc | Buy (wanted) | buy |
| Izīrē | Rent out (offer) | hand_over |
| Īrē | Rent (wanted) | wanted |
| Maina | Exchange | exchange |
| Atdod | Give away | give |
| Remonts | Repair | repair |
| Pakalpojumi | Services | services |
| Dažādi | Miscellaneous | other |

### Condition Values

| Latvian | English |
|---------|---------|
| jaun. | New |
| lietota | Used |
| Mazlietots | Lightly used |
| Renew | Refurbished |

---

## Category: Transport / Automotive

### Cars

**Table Columns**: Model, Year, Engine (cc), Mileage (km), Price

**Detail Fields**:

| Field | Type | Example |
|-------|------|---------|
| Make (Marka) | text | BMW |
| Model (Modelis) | text | X3 |
| Body Type (Virsbūvestes tips) | enum | SUV, Sedan, Hatchback, Wagon, Coupe, Cabriolet, Minivan |
| Year (Izlaiduma gads) | number | 2021 |
| Engine Type (Motors) | text | 3.0 dizel |
| Engine Displacement (Motora tilpums) | text | 3.0L |
| Power (Jauda) | text | 210 kW / 286 hp |
| Transmission (Ātrumkārba) | enum | Manual/Automatic + speeds |
| Mileage (Nobraukums) | number+unit | 167,374 km |
| Color (Krāsa) | color swatch | White |
| Seats (Vietu skaits) | number | 5 |
| Technical Inspection (Tehniskā apskate) | date | DD.MM.YYYY |
| VIN Code | text (CAPTCHA protected) | WBAXXXXXXX |
| License Plate | text (masked) | XX-XXXX |

**Equipment Checkbox Groups** (unique to cars, ~80 items):
- General: A/C, cruise control, parking sensors, rear camera, keyless go, start-stop
- Exterior: roof rails, sunroof, panoramic roof, 4x4, alloy wheels
- Interior: leather, tinted windows, ISOFIX
- Steering: heated, multi-function, sport, memory
- Seats: heated, ventilated, massage, electric, memory
- Lighting: LED, xenon, bi-xenon, fog lights, adaptive
- Mirrors: heated, electric, folding, memory
- Safety: ABS, ESP, ASR, airbags, alarm, immobilizer
- Audio: navigation, bluetooth, USB, subwoofer, TV

**Cars-only features**: Compare button, insurance calculator link, VIN reveal with CAPTCHA

### Motorcycles

**Table Columns**: Date, Model, Year, Engine (cm³), Price

**Detail Fields**: Make, Model, Year, Engine Displacement (cm³), Price
*(Minimal structured fields — specs in free text)*

### Trucks / Vans

**Table Columns**: Date, Make, Year, Price

**Detail Fields**:

| Field | Type | Example |
|-------|------|---------|
| Type (Tips) | enum | Van, Truck, Bus |
| Make (Marka) | text | Ford |
| Model | text | Transit |
| Year | number | 2020 |
| Box Length (Kastes garums) | decimal+unit | 4.25m |
| Height (Augstums) | decimal+unit | 1.40m |
| Width (Platums) | decimal+unit | 2.10m |
| Total Mass (Pilna masa) | number+unit | 3,500 kg |
| License Category (Vadīšanas kategorija) | enum | B, C, CE |

### Motorboats / Water Transport

**Table Columns**: Make, Model, Year, Length, Power, Price

**Detail Fields**: Make, Model, Year, Length (meters), Engine Power (hp/ZS), Price

### Bicycles

**Table Columns**: Brand, Year, Condition, Price

**Detail Fields**: Brand, Year, Condition, Price *(minimal — 4 fields)*

### Spare Parts — Overview

10 generic accessory subcategories + 80+ brand-specific subcategories, each with model drill-downs into 169 part types organized into 4 sections.

**Generic Accessories**: Tires, Batteries, Audio/Video, Chargers, Rear-view cameras, Alarms, Spark plugs, Dash cameras, Crankcase protection, Radar detectors

**Brand-Model Parts** (169 types in 4 sections):
- Engine/Transmission/Aggregates (48 types): engines, gearboxes, turbines, radiators, fuel pumps, starters, generators, catalysts, etc.
- Electrical/Lighting (33 types): headlights, fog lights, ECUs, dashboards, A/C, navigation, parking sensors, wiring, etc.
- Body/Interior (54 types): bumpers, doors, fenders, seats, mirrors, windshields, hoods, trunk lids, airbags, steering wheels, etc.
- Running Gear/Suspension (33 types): shock absorbers, brake discs/pads, wheels/rims, CV joints, control arms, calipers, springs, etc.

### Spare Parts — Tires (Riepas)

**Table Columns**: Date, Manufacturer, Size (width/profile), Load/Speed Index, Condition, Price

**Detail Fields**:

| Field | Type | Example |
|-------|------|---------|
| Manufacturer (Ražotājs) | text | Good Year |
| Model (Modelis) | text | Ultragrip Ice |
| Diameter (R-size) | enum | R12–R22.5 |
| Width/Profile (Platums/Profils) | text | 215/65 |
| Load/Speed Index | text | 99T |
| Season (Sezona) | enum | Summer, Winter, Studded Winter, All-season |
| Condition (Stāvoklis) | enum | new / used |
| Tread Depth (Protektora atlikums) | number+unit | 5 mm |
| Manufacturing Date | text | August 2021 (3221) |
| Application (Pielietojums) | text | Passenger cars and minivans |
| Quantity (Daudzums) | number+unit | 2 pcs |

**Filters**: Manufacturer (40+ brands), Season, Diameter (R12–R22.5), Width/Profile, Load/Speed index, Condition, Price range

### Spare Parts — Batteries (Akumulatori)

**Table Columns**: Date, Brand, Ah (capacity), Current (A), Dimensions (WxHxD), Condition, Price

**Detail Fields**:

| Field | Type | Example |
|-------|------|---------|
| Brand (Marka) | text | A-Mega 5 |
| Capacity (Ah) | number+unit | 100 Ah |
| Starting Current (Strāva) | number+unit | 950 A |
| Voltage (Spriegums) | text | 12V |
| Dimensions (GxAxD) | text | 353x190x175 mm |
| Polarity (Polaritāte) | text | -/+ |
| Condition | enum | new / used |
| Warranty (Garantija) | text | 2 years |

### Spare Parts — Dash Cameras (Videoregistratori)

**Table Columns**: Date, Brand, Model, Price

**Detail Fields**:

| Field | Type | Example |
|-------|------|---------|
| Brand | text | Retoo |
| Model | text | M011 |
| Video Resolution | text | 1080P |
| Video Format | text | M-JPEG |
| Front Camera Angle | text | up to 170° |
| Rear Camera Angle | text | 120° |
| Display Size (Displeja diagonāle) | text | 4.3 inches |
| Photo Resolution | text | 500M |
| Memory Card | text | TF up to 32G |
| Power Source | text | 12-24 V/2A |
| Battery | text | built-in 450 mAh |
| Motion Detection | boolean | Yes |
| Night Recording | boolean | Yes |
| Loop Recording | boolean | Yes |
| G-Sensor | boolean | Yes |
| Package Contents | text | listed items |

### Spare Parts — Brand-Model Parts (single item)

**Table Columns**: Listing, Year, Engine (cc), Condition, Price

**Detail Fields**: Make, Model, Year, Engine, Transmission, Condition, Price, Part Number (filter only)

**Filters**: Year range, Engine type (Petrol/Diesel/Hybrid/Electric), Part number (text), Condition

### Spare Parts — Vehicle Parting Out (Categorized Catalog)

When a seller is dismantling an entire vehicle, the detail page shows:

**Header fields**: Make, Model, Year, Engine (code + kW), Transmission, Condition, Color Code

**Then a structured parts catalog with 4 sections, each listing individual parts with separate prices**:

| Section | English | Example Parts |
|---------|---------|---------------|
| Dzinējs, transmisija, agregāti | Engine, Transmission, Aggregates | Engine €1500, Gearbox €1000, Turbo €250, Starter €120, Generator €120, Catalyst €500, Radiator €50-200, Clutch €300 |
| Elektrika un apgaismojums | Electrical & Lighting | ECU €350, Dashboard €300, A/C €200, Headlight €200, Navigation €700, Heater €120 |
| Virsbūve un salons | Body & Interior | Bumper €250, Door €300, Seat €400, Fender €200-300, Steering wheel €200, Windshield €250, Full interior €600 |
| Ritošā daļa | Running Gear / Suspension | Shock absorber €15-55, Brake disc €25-30, Drive shaft €200, Half-axle €150, Axle €250-300 |

**Key pattern**: Each part has its own price. The listing's headline price is typically the most expensive single part. Buyers specify which part they need + their VIN for compatibility.

### Spare Parts — Other Accessories

**Alarms/Chargers/Cameras/Radar**: Table Columns: Date, Brand, Model, Price. Minimal detail fields (Brand, Model, Type, Price).

**Crankcase Protection**: Most minimal — just Date and Price columns

---

## Category: Real Estate

### Apartments / Flats

**Table Columns**: Street, Rooms, m², Floor (X/Y), Series, Price/m², Price

**Detail Fields**:

| Field | Type | Example |
|-------|------|---------|
| City (Pilsēta) | text | Rīga |
| District (Rajons) | text | centrs |
| Street (Iela) | text + map link | Brīvības iela 12 |
| Rooms (Istabas) | number | 3 |
| Area (Platība) | number+unit | 54 m² |
| Floor (Stāvs) | format | 5/9 or 5/9/lifts |
| Building Series (Sērija) | enum | Hrušč., P. kara, Jaun., Staļina, Renov., LT proj., Specpr., Čehu proj., 104. ser., 119. ser., 602. ser. |
| Building Type (Mājas tips) | enum | Brick (Ķieģeļu), Panel (Paneļu), Masonry (Mūra) |
| Amenities (Ērtības) | text | Parking |

**Price format**: Total EUR + EUR/m² (sell) or EUR/month + EUR/m² (rent)
**Map**: Present with GPS coordinates
**Transaction types**: Sell, Buy, Rent out, Rent wanted, Exchange, Misc

### Houses / Summer Residences

**Table Columns**: Street, m², Floors, Rooms, Land Area, Price

**Detail Fields**: City, District, Street, Building Area (m²), Land Area (m² or ha), Floors, Rooms, Price

### Rural Estates / Farms

**Table Columns**: Date, Parish, Floors, m², Land Area (ha), Price

**Detail Fields**: City/Region, Parish (Pagasts), Village (Ciems), Floors, Rooms, Building Area (m²), Land Area (ha), Price

### Offices

**Table Columns**: Street, m², Floor (X/Y), Price/m², Price

**Detail Fields**: City, District, Street, Area (m²), Floor, Price
*(No rooms, no series, no building type)*

### Land / Plots

**Table Columns**: Date, Street, m², Price/m², Price

**Detail Fields**:

| Field | Type | Example |
|-------|------|---------|
| City | text | Rīga |
| District | text | Āgenskalns |
| Street | text | Vienības gatve |
| Area (Platība) | number+unit | 1200 m² |
| Purpose (Pielietojums) | enum | Residential, Commercial, Other |
| Permitted Use (Atļautā izmantošana) | text | Office, residential, cultural |

### Garages

**Table Columns**: Date, Street, Dimensions (WxL), Price

**Detail Fields**: City, Street, Width x Length (m), Gate Height (m), Price

---

## Category: Work & Business

### Job Vacancies

**Table Columns**: Listing, Company, Work Schedule

**Detail Fields**:

| Field | Type | Example |
|-------|------|---------|
| Profession (Specialitāte) | enum (200+) | Programmer |
| Salary (Alga) | text | 2100 EUR brutto / 3500-7000 EUR |
| Education (Vēlamā izglītība) | enum | Higher, Secondary, Basic |
| Language (Valoda) | multi-select | English, Latvian |
| Work Schedule (Darba dienas) | enum | Workdays, Weekends, Shifts |
| Work Hours (Darba laiks) | text | 9:00-17:00 |
| Company (Kompānija) | text | SIA "Insynk" |
| Registration No. (Reģ. Nr.) | text | 40203235117 |
| Entity Type (Tips) | text | Legal entity |
| City | text | Rīga |
| Street | text | Duntes iela 6 |
| Website (Mājas lapa) | URL | link |

### Job Seekers (CVs)

**Table Columns**: Title, Location, Education, Languages, Work Schedule

**Detail Fields**: Profession, Experience (years), Education Level, Field of Study, Languages, Age, Work Schedule, Location

### Courses / Education

**Table Columns**: Date, Language, Price

**Detail Fields**: Language, Price (per lesson/hour), Location

### Business Contacts / B2B

**Table Columns**: Image, Title, Location, Company

**Detail Fields**: Company Name, Business Type, Location, Sale Price, Rental Price, Area (m²), Seats, Contact Person

---

## Category: Electronics

### Mobile Phones

**Table Columns**: Date, Model, Storage (GB), Condition, Price

**Detail Fields**: Brand, Model, Storage (GB), Condition, Price
**Filters**: Brand (pre-split pages), Model dropdown, Storage, Price range, Condition

### Desktop Computers

**Table Columns**: Date, Processor, RAM, HDD, Price

**Detail Fields**: Model, Processor (brand+model+cores+speed), RAM (size+type), Storage (size+type), Video Card, OS, PSU (watts), Network, Ports, DVD, Weight (kg), Condition, Warranty, Dimensions

### Laptops / Notebooks

**Table Columns**: Date, Brand, Display ("), HDD, RAM, Price

**Detail Fields**: Brand, Model, Display size, Processor, RAM, Storage, Resolution, Graphics, OS, Battery, Warranty

### Tablets

**Table Columns**: Date, Brand, Size ("), Storage, Price

### Monitors

**Table Columns**: Date, Brand, Size ("), Price

### Game Consoles

**Table Columns**: Date, Console, Condition, Price

### Games

**Table Columns**: Date, Platform, Title, Price

### Digital/SLR Cameras

**Table Columns**: Date, Brand, Megapixels, Price

### LED TVs

**Table Columns**: Date, Brand, Model, Diagonal ("), Condition, Price

### Audio - Headphones

**Table Columns**: Date, Brand, Condition, Price

### Audio - Amplifiers

**Table Columns**: Date, Brand, Power (W), Channels, Condition, Price

---

## Category: Home & Furniture

**Table Columns**: Date, Manufacturer, Size (dimensions), Condition, Price

**Detail Fields**: Manufacturer, Model, Dimensions, Height, Condition, Firmness (mattresses), Composition/Material, Max Load, Warranty

**Transaction Types**: Sell, Give away, Manufacturing, Buy, Repair

---

## Category: Fashion & Clothing

**Table Columns**: Date, Manufacturer/Brand, Size, Condition, Price

**Detail Fields**: Brand, Size (S/M/L/XL or numeric), Condition
*(Minimal structured fields — material, color, fabric in free text only)*

---

## Category: Animals / Pets

**Table Columns**: Date, Breed, Age, Price

**Detail Fields**:

| Field | Type | Example |
|-------|------|---------|
| Breed (Šķirne) | text | American Bully |
| Age (Vecums) | text | 2 months |
| Gender | text | Male |
| Birth Date | date | February 1, 2026 |
| Health Status | text | Dewormed, vaccinated |
| Dam ID | text | LV0440882 (microchip) |
| Sire ID | text | LV0406889 (microchip) |
| Microchip | text | 993011200031081 |
| Sterilized | boolean | Yes/No |

**Transaction Types**: Sell, Give away, Buy, Various

---

## Category: Children's Items

**Table Columns** (strollers): Date, Manufacturer, Model, Condition, Price
**Table Columns** (furniture): Manufacturer, Size, Condition, Price

**Detail Fields**: Type (2-in-1/3-in-1), Manufacturer, Model, Condition, Included accessories

**Transaction Types**: Sell, Give away, Repair, Various

---

## Category: Construction / Building Materials

**Table Columns**: Listing, Size (dimensions), m², Price

**Detail Fields**: Material type, Color, Quality grade, Dimensions, Available quantity, Unit price

**Price format**: UNIQUE — per-unit pricing: €/m², €/piece (€/gab.), €/ton
**Transaction Types**: Sell, Various

---

## Category: Agriculture

**Table Columns**: Date, Name/Title, Price

**Detail Fields**: Product name, Quantity (kg/tons), Price per unit, Parish-level location

**Price format**: Per weight — €/ton, €/kg, or flat
**Transaction Types**: Sell, Buy, Various

---

## Category: Leisure / Hobbies / Sports

**Table Columns**: Listing, Manufacturer, Condition, Price

**Detail Fields**: Manufacturer, Condition, Price
*(Minimal — most details in free text)*

**Transaction Types**: Sell, Services (unique to this category)

---

## Contact Block Variants

### Private Seller
- Phone: 1 number, masked
- Email: contact form
- Location: city name

### Business / Dealer
- Phone: 1-2 numbers, masked
- Email: contact form
- Company Name (SIA "...")
- Company Registration No.
- Address: full street address + map link
- Business Hours: Mon-Fri / Sat / Sun schedule
- Website: URL (via SS.COM redirect)
- Company Logo: image

---

## Cross-Category Column Comparison

| Column | Cars | Real Est. | Jobs | Electronics | Home | Fashion | Animals | Children | Construction | Agriculture | Leisure |
|--------|:----:|:---------:|:----:|:-----------:|:----:|:-------:|:-------:|:--------:|:------------:|:-----------:|:-------:|
| Date | - | - | - | x | x | x | x | x | - | x | - |
| Brand/Make | path | - | - | x | x | x | - | x | - | - | x |
| Model | x | - | - | x | - | - | - | x | - | - | - |
| Year | x | - | - | - | - | - | - | - | - | - | - |
| Size/Dimensions | - | x | - | x | x | x | - | x | x | - | - |
| Condition | - | - | - | x | x | x | - | x | - | - | x |
| Rooms | - | x | - | - | - | - | - | - | - | - | - |
| Floor | - | x | - | - | - | - | - | - | - | - | - |
| Series | - | x | - | - | - | - | - | - | - | - | - |
| Price/m² | - | x | - | - | - | - | - | - | - | - | - |
| Engine | x | - | - | - | - | - | - | - | - | - | - |
| Mileage | x | - | - | - | - | - | - | - | - | - | - |
| Company | - | - | x | - | - | - | - | - | - | - | - |
| Schedule | - | - | x | - | - | - | - | - | - | - | - |
| Breed | - | - | - | - | - | - | x | - | - | - | - |
| Age | - | - | - | - | - | - | x | - | - | - | - |
| m² area | - | - | - | - | - | - | - | - | x | - | - |
| **Price** | **x** | **x** | **x** | **x** | **x** | **x** | **x** | **x** | **x** | **x** | **x** |

*Price is the only truly universal column.*

---

## Key Design Patterns for sell.onfire.so

1. **Category-specific table columns** — each category needs its own column set
2. **Category-specific detail fields** — structured key-value pairs vary dramatically
3. **Equipment checkboxes** — only for cars (9 groups, ~80 items)
4. **Price formatting** — flat EUR, per-m², per-unit, per-weight, ranges, "Call"
5. **Contact block** — 2 tiers: private (phone+email+city) vs business (full company info)
6. **Map** — only for real estate and car dealers with addresses
7. **Phone masking** — last 3 digits hidden, click to reveal
8. **Free text description** — carries most details for simpler categories
9. **Transaction type tabs** — category-specific available types
10. **Compare feature** — cars only

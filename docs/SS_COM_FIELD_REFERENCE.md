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

### Spare Parts

**Table Columns**: Date, Year, Engine (cc), Condition, Price

**Detail Fields**: Vehicle Make/Model, Year, Engine, Transmission, Condition

**Unique**: Categorized parts pricing table with sections (Engine, Body, Suspension) — individual part names with per-item prices

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

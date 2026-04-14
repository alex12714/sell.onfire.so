# Gap Analysis: Current OnFire Product Model vs SS.COM-style Classifieds

## Current State Summary

### What the Flutter creation wizard captures (6 steps)

| Step | Fields | Reaches API? |
|------|--------|:------------:|
| Images | 1-10 photos | Yes (separate upload) |
| Category | Main category + subcategory | Yes (category_id) |
| Basic Info | Title, Price, Quantity/Condition | Title+Price: Yes. Condition/Quantity: **NO** |
| Details | Description, Brand, Model, Material, Color, Dimensions, Weight | Description+Brand: Yes. **Rest: NO** |
| Shipping | Shipping available, cost, delivery time, pickup, location, return policy, warranty | **ALL NO** |
| Review | Read-only preview | N/A |

### What actually reaches the `products` table

| Column | Source | Used? |
|--------|--------|:-----:|
| name | Title field | Yes |
| description | Description field | Yes |
| price | Price field | Yes |
| currency | Hardcoded "USD" | Yes (wrong — UI shows GBP) |
| category_id | Category selector | Yes |
| type | physical/service toggle | Yes |
| status | Hardcoded "active" | Yes |
| seller_id | Auth token | Yes |
| sku | Auto-generated | Yes |
| brand | Brand field | Yes |
| inventory | Quantity or 1 | Yes |
| detailed_description | — | Never set from creation |
| compare_at_price | — | Never set from creation |
| tags | — | Never set from creation |
| cover_image | — | Set after image upload |
| properties | — | Only from Shopify import |
| availability | — | Never used |
| latitude/longitude | — | Never set from creation |
| address/city/country_code | — | Never set from creation |
| is_featured | — | Admin only |
| is_luxury | — | Admin only |
| rating/review_count | — | Auto from reviews trigger |

**Key finding**: 18 of 32 product columns are never populated from the creation flow.

### Database categories vs Flutter categories

| Backend (87 categories) | Flutter (10 hardcoded) | Aligned? |
|--------------------------|----------------------|:--------:|
| Electronics & Technology (id=2) | Electronics | ~Partial |
| Vehicles (id=3) | Automotive | ~Partial |
| Home & Garden (id=4) | Home & Garden | Yes |
| Fashion & Accessories (id=5) | Fashion & Apparel | ~Yes |
| Baby & Kids (id=6) | Baby & Kids | Yes |
| Sports & Recreation (id=7) | Sports & Outdoors | ~Yes |
| Hobbies & Crafts (id=8) | Toys & Hobbies | ~Partial |
| Pet Supplies (id=9) | Pet Supplies | Yes |
| Health & Beauty (id=10) | Beauty & Personal Care | ~Yes |
| Services (id=12) | Services | Yes |
| Business & Industrial (id=11) | **MISSING** | No |
| General (id=1) | **MISSING** | No |

Flutter uses string slugs ("electronics"), backend uses integer IDs (1-87). The `fromApiJson()` factory converts but the hardcoded list is disconnected.

---

## What SS.COM Has That OnFire Lacks

### Category-Specific Dynamic Fields

SS.COM renders **completely different form fields per category**. OnFire always shows the same 6 optional fields (brand, model, material, color, dimensions, weight) regardless of category.

**Missing category-specific fields by domain:**

#### Transport / Automotive
| Field | SS.COM | OnFire | Gap |
|-------|:------:|:------:|-----|
| Body type | Yes | No | Need enum: Sedan, SUV, Hatchback, Wagon, Coupe, Cabriolet, Minivan |
| Year of manufacture | Yes | No | Need number field |
| Engine type | Yes | No | Need: petrol, diesel, hybrid, electric, LPG |
| Engine displacement | Yes | No | Need decimal + L/cc |
| Power (kW/hp) | Yes | No | Need number + unit |
| Transmission | Yes | No | Need enum: manual/automatic + speeds |
| Mileage (km) | Yes | No | Need number field |
| Color (with swatch) | Yes | Partial (text only) | Need color picker |
| VIN code | Yes | No | Need text field |
| Technical inspection date | Yes | No | Need date picker |
| Fuel type | Yes | No | Need enum |
| Equipment checkboxes (~80 items in 9 groups) | Yes | No | Need multi-select grouped checkboxes |

#### Real Estate
| Field | SS.COM | OnFire | Gap |
|-------|:------:|:------:|-----|
| Rooms | Yes | No | Need number field |
| Area (m²) | Yes | No | Need number field |
| Floor / Total floors | Yes | No | Need format X/Y |
| Building series | Yes | No | Need enum (12 types) |
| Building type | Yes | No | Need enum: Brick, Panel, Masonry |
| Land area | Yes | No | Need number + ha/m² |
| Amenities | Yes | No | Need multi-select |
| Purpose/Permitted use | Yes (land) | No | Need enum + text |
| Price per m² | Yes (auto-calc) | No | Need calculated field |

#### Jobs / Work
| Field | SS.COM | OnFire | Gap |
|-------|:------:|:------:|-----|
| Profession/Specialty | Yes (200+ enum) | No | Need searchable dropdown |
| Salary / Salary range | Yes | No | Need range fields |
| Education required | Yes | No | Need enum |
| Languages required | Yes | No | Need multi-select |
| Work schedule | Yes | No | Need enum: Workdays, Weekends, Shifts |
| Work hours | Yes | No | Need time range |
| Company name | Yes | No | Need text (exists as seller info) |
| Company reg. number | Yes | No | Need text field |

#### Electronics (category-specific columns)
| Field | SS.COM | OnFire | Gap |
|-------|:------:|:------:|-----|
| Storage (GB) | Yes | No | suggestedField exists but no UI |
| RAM (GB) | Yes | No | suggestedField exists but no UI |
| Processor | Yes | No | suggestedField exists but no UI |
| Screen size (") | Yes | No | suggestedField exists but no UI |
| Resolution | Yes | No | Need text field |
| Megapixels | Yes | No | Need number field |
| Channels (audio) | Yes | No | Need number field |
| Power (watts) | Yes | No | Need number field |

#### Spare Parts
| Field | SS.COM | OnFire | Gap |
|-------|:------:|:------:|-----|
| Fits vehicle (make/model/year) | Yes | No | Need vehicle reference fields |
| Part number | Yes | No | Need text field |
| Engine compatibility | Yes | No | Need text field |
| Season (tires) | Yes | No | Need enum |
| Diameter / Size (tires) | Yes | No | Need enum |
| Tread depth | Yes | No | Need number + mm |
| Capacity (Ah, batteries) | Yes | No | Need number fields |
| Categorized parts table | Yes | No | Need multi-item pricing |

#### Animals / Pets
| Field | SS.COM | OnFire | Gap |
|-------|:------:|:------:|-----|
| Breed | Yes | No | Need searchable text |
| Age | Yes | No | Need number + months/years |
| Gender | Yes | No | Need enum: Male/Female |
| Vaccinated / Health status | Yes | No | Need text/boolean |
| Microchip number | Yes | No | Need text field |
| Pedigree (Dam/Sire IDs) | Yes | No | Need text fields |

### Listing-Level Features

| Feature | SS.COM | OnFire | Gap |
|---------|:------:|:------:|-----|
| Transaction type per listing | Yes (Sell/Buy/Rent/Exchange/Give/Repair) | No | **Critical** — currently only "sell" implied |
| New vs Used condition | Yes | Partial (local only, never sent to API) | Need to persist to DB |
| Phone number display | Yes (masked, click-to-reveal) | No | Contact goes to app/admin |
| Map / Location on listing | Yes (real estate, dealers) | No (lat/lng columns exist but never populated) | Need location picker in creation |
| Business hours | Yes (for dealers) | No | Need for service providers |
| Company info (name, reg. no.) | Yes | No | Need business seller profile |
| Per-unit pricing (€/m², €/kg, €/piece) | Yes | No | Need unit + price format |
| Price range (min-max salary) | Yes | No | Need range fields |
| Compare feature | Yes (cars) | No | Could add later |

---

## Recommended Approach: How to Plug This In

### Strategy: Use `properties` JSONB for category-specific fields

The `properties` JSONB column on the `products` table is the **natural extension point**. It already has a GIN index. Instead of adding 50+ columns to the products table, store category-specific fields in `properties`:

```json
// Car listing
{
  "body_type": "suv",
  "year": 2021,
  "engine_type": "diesel",
  "engine_displacement": "3.0",
  "power_kw": 210,
  "transmission": "automatic_8",
  "mileage_km": 167374,
  "color": "#FFFFFF",
  "vin": "WBAXXXXXXX",
  "inspection_date": "2026-06-15",
  "equipment": ["ac", "cruise_control", "parking_sensors", "leather"]
}

// Apartment listing
{
  "rooms": 3,
  "area_m2": 54,
  "floor": 5,
  "total_floors": 9,
  "has_elevator": true,
  "building_type": "brick",
  "building_series": "new",
  "amenities": ["parking", "balcony"],
  "price_per_m2": 1388.52
}

// Job vacancy
{
  "profession": "programmer",
  "salary_min": 3500,
  "salary_max": 7000,
  "salary_currency": "EUR",
  "salary_type": "gross",
  "education": "higher",
  "languages": ["en", "lv"],
  "schedule": "workdays",
  "hours": "9:00-17:00",
  "company_reg_no": "40203235117"
}
```

### What needs to change

#### 1. Backend (PostgreSQL + PostgREST)

**Must do:**
- [ ] Add `condition` column (varchar 20) to products — CHECK: `new`, `like_new`, `good`, `fair`, `for_parts`
- [ ] Add `transaction_type` column (varchar 20) — CHECK: `sell`, `buy`, `rent`, `exchange`, `give`, `service`, `other`
- [ ] Add `listing_type` column (varchar 20) — CHECK: `new_product`, `second_hand`, `service`, `job_vacancy`, `job_seeker`, `rental`
- [ ] Populate existing unused columns: `address`, `city`, `country_code`, `latitude`, `longitude` from creation flow
- [ ] Fix currency — stop hardcoding "USD", detect from user locale or allow selection
- [ ] Create `category_field_definitions` table — defines which fields each category needs, their types, validation rules, and display order
- [ ] Add GIN index path queries on properties for common fields: `CREATE INDEX idx_products_props_year ON products ((properties->>'year'))` etc.

**Nice to have:**
- [ ] Add `image_urls` text[] column (the MCP tools already reference it but it doesn't exist)
- [ ] Add `is_active` boolean (or a view that computes it from status)
- [ ] Sync Flutter hardcoded categories with DB categories

#### 2. Flutter App (Product Creation)

**Must do:**
- [ ] **Dynamic form fields based on category** — when user picks a category, render the appropriate fields from `category_field_definitions` or a local schema map
- [ ] **Send all fields to API** — condition, material, color, dimensions, weight, shipping info → put in `properties` JSONB
- [ ] **Add transaction type selector** — Sell / Buy wanted / Rent / Exchange / Give away
- [ ] **Add location picker** — populate latitude, longitude, address, city, country_code
- [ ] **Fix currency** — use EUR or detect from locale

**Category-specific form schemas to implement:**

| Category | Required Fields | Optional Fields |
|----------|----------------|-----------------|
| Electronics | brand, model, condition | storage, ram, processor, screen_size, resolution, color |
| Automotive (vehicles) | make, model, year, fuel_type, transmission, mileage | body_type, engine_displacement, power, color, vin, inspection_date, equipment[] |
| Automotive (parts) | fits_make, fits_model, fits_year, condition | part_number, engine_compatibility |
| Real Estate (apartments) | rooms, area_m2, floor, total_floors | building_type, building_series, amenities[], has_elevator |
| Real Estate (houses) | rooms, area_m2, floors, land_area | building_type, amenities[] |
| Real Estate (land) | area_m2, purpose | permitted_use |
| Jobs (vacancy) | profession, salary_min | salary_max, education, languages[], schedule, hours |
| Fashion | size, condition | material, color, brand |
| Animals | species, breed, age, gender | vaccinated, microchip, pedigree_info |
| Home/Furniture | condition | material, dimensions, color |
| Children | condition, age_group | brand, size |
| Services | duration, availability | online/in_person, location |

#### 3. sell.onfire.so (Web Frontend)

**Must do:**
- [ ] Read `properties` JSONB from API and render category-specific fields on detail pages
- [ ] Category-specific table columns on listing pages (like SS.COM)
- [ ] Category-specific filter controls (year range for cars, rooms for real estate, etc.)
- [ ] Transaction type filter tabs (Sell / Rent / Buy wanted)
- [ ] Condition filter (New / Used)
- [ ] Location display + map for listings with coordinates

---

## New vs Second Hand: What Applies

### New Products (retail/vendor)
- Brand, Model required
- Condition = "new" (forced)
- Inventory/quantity matters
- Warranty info relevant
- Shipping/delivery details important
- No mileage, no "used" markers
- May have compare_at_price (sale pricing)
- Professional seller: company info, business hours, website

### Second Hand (classifieds)
- Condition is KEY differentiator (like_new / good / fair / for_parts)
- Single quantity (typically 1)
- Year of manufacture important (electronics, vehicles)
- Mileage / usage indicators important (vehicles)
- "Defects" or "wear" described in free text
- Location matters more (local pickup common)
- No warranty typically
- Private seller: just phone + city

### Both
- Title, Description, Price, Photos, Category
- Brand, Model (when applicable)
- Location (for local pickup or service area)
- Transaction type (sell is default, but both could rent/exchange)

---

## Priority Order for Implementation

### P0 — Critical (enable classifieds to work)
1. Add `condition` and `transaction_type` columns to products table
2. Fix the Flutter creation flow to send condition, color, material, weight, dimensions to `properties` JSONB
3. Add location picker to creation flow (populate lat/lng/address/city)
4. Dynamic category fields in Flutter creation wizard (use `suggestedFields` that already exist)
5. Update sell.onfire.so to render properties fields on detail pages

### P1 — High (SS.COM parity for key categories)
6. Automotive-specific fields (year, mileage, engine, transmission, fuel type, equipment)
7. Real estate fields (rooms, area, floor, building type)
8. Transaction type selector in creation flow (sell/buy/rent/exchange/give)
9. Category-specific table columns on sell.onfire.so
10. Category-specific filters on sell.onfire.so

### P2 — Medium (full classifieds experience)
11. Job/vacancy fields (profession, salary, education, schedule)
12. Animal/pet fields (breed, age, gender, health)
13. Spare parts fields (fits vehicle, part number, season)
14. Business seller profile (company info, business hours, website)
15. Per-unit pricing (€/m², €/piece, €/kg)
16. Phone number display with masking on sell.onfire.so

### P3 — Nice to have
17. Equipment checkbox groups for vehicles
18. Building series enum for apartments
19. Categorized parts pricing table for vehicle dismantlers
20. Compare feature for vehicles
21. Map integration on listing detail pages
22. Price per m² auto-calculation for real estate

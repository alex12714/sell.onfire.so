# OnFire Marketplace — Recommended Category Structure

Based on analysis of SS.COM (3,100+ categories), Craigslist (200+ categories), and current OnFire DB (87 categories).

## Proposed Top-Level Categories (15)

Merges SS.COM's 12 sections + Craigslist-unique categories into 15 top-level groups.

| # | Category | SS.COM Equivalent | Craigslist Equivalent | Current OnFire DB |
|---|----------|-------------------|----------------------|-------------------|
| 1 | Vehicles & Transport | Transport | cars+trucks, motorcycles, auto parts, boats, rvs | Vehicles (id=3) |
| 2 | Real Estate | Real estate | housing (all) | Home & Garden (id=4) — needs split |
| 3 | Electronics & Tech | Electronics | electronics, computers, cell phones, video gaming | Electronics & Technology (id=2) |
| 4 | Jobs & Work | Job and business | jobs (31 cats), gigs (9 cats), resumes | — MISSING |
| 5 | Home & Garden | For home + parts of Construction | household, furniture, farm+garden | Home & Garden (id=4) |
| 6 | Fashion & Apparel | Clothes, footwear | clothes+acc | Fashion & Accessories (id=5) |
| 7 | Services | parts of Job and business | services (21 cats) | Services (id=12) |
| 8 | Children & Baby | For children | baby+kid | Baby & Kids (id=6) |
| 9 | Animals & Pets | Animals | pets | Pet Supplies (id=9) |
| 10 | Sports & Outdoors | Rest, hobbies (sports part) | sporting, bikes | Sports & Recreation (id=7) |
| 11 | Hobbies & Leisure | Rest, hobbies (non-sports) | collectibles, antiques, books, tickets, music instr | Hobbies & Crafts (id=8) |
| 12 | Beauty & Health | For home > Health/beauty | beauty+hlth | Health & Beauty (id=10) |
| 13 | Construction & Industry | Construction + Production | tools, heavy equip, materials | Business & Industrial (id=11) |
| 14 | Agriculture & Farming | Agriculture | farm+garden (partial) | — MISSING |
| 15 | Free & Community | — MISSING | free, barter, garage sale, volunteers, lost+found | — MISSING |

### New categories not in current OnFire DB
- **Jobs & Work** — entire section missing
- **Agriculture & Farming** — entirely missing
- **Free & Community** — Craigslist's unique giving/community features
- **Real Estate** — currently lumped into "Home & Garden"

## Subcategory Breakdown Per Top-Level

### 1. Vehicles & Transport
```
├── Cars (+ 155 manufacturers from car_manufacturers_models.json)
├── Motorcycles & Scooters
├── Trucks & Commercial Vehicles
├── Bicycles & E-Scooters
├── Boats & Watercraft
├── RVs & Campers (from Craigslist)
├── ATVs & Snowmobiles (from Craigslist)
├── Spare Parts & Accessories
│   ├── By vehicle (make/model/year)
│   ├── Tires & Wheels
│   ├── Batteries
│   ├── Audio/Video
│   ├── Dash Cameras
│   ├── Alarm Systems
│   └── Other Parts
├── Vehicle Services
│   ├── Repair & Maintenance
│   ├── Car Wash & Detailing
│   ├── Towing & Evacuation
│   ├── Inspection
│   └── Insurance
├── Vehicle Rental
├── Transport Services (cargo, passenger, moving)
└── Other (trailers, aviation, go-karts)
```
Transaction types: sell, buy, exchange, rent, repair, other

### 2. Real Estate
```
├── Apartments / Flats
├── Houses & Cottages
├── Land & Plots
├── Offices
├── Commercial Premises (shops, warehouses, restaurants)
├── Garages & Parking
├── Farms & Rural Estates
├── Vacation Rentals (from Craigslist)
├── Rooms / Shared Housing (from Craigslist)
├── Storage Units (from Craigslist)
├── Broker Services
└── Other (modular houses, mobile homes, unfinished)
```
Transaction types: sell, buy, rent, exchange, other

### 3. Electronics & Tech
```
├── Phones & Accessories
│   ├── Mobile Phones (by brand)
│   ├── Smartwatches
│   ├── Phone Accessories
│   └── Fixed/Radio Phones
├── Computers & Tablets
│   ├── Desktop Computers
│   ├── Laptops / Notebooks
│   ├── Tablets
│   ├── Monitors
│   ├── PC Components (CPU, GPU, RAM, SSD, PSU, etc.)
│   ├── Peripherals (keyboards, mice, webcams)
│   ├── Printers & Scanners
│   └── Networking Equipment
├── Gaming
│   ├── Game Consoles
│   ├── Games
│   └── Gaming Accessories
├── TVs & Projectors
├── Audio Equipment (speakers, headphones, amplifiers, instruments)
├── Cameras & Photography (digital, SLR, lenses, drones)
├── Home Appliances (kitchen, laundry, cleaning, climate)
├── Smart Home & IoT
└── Other Electronics
```
Transaction types: sell, buy, exchange, repair, other

### 4. Jobs & Work
```
├── Job Vacancies (by profession — 175+ types from SS.COM)
├── Job Seekers / CVs
├── Gigs & Freelance (from Craigslist)
│   ├── Computer/Tech
│   ├── Creative
│   ├── Labor
│   ├── Events
│   ├── Writing
│   └── Other
├── Courses & Education
│   ├── Language Courses
│   ├── Professional Training
│   ├── Computer Courses
│   ├── Study Abroad
│   └── Other
├── Business Contacts
│   ├── Partners Search
│   ├── Business for Sale
│   ├── Investment Opportunities
│   └── Other
├── Legal Services
├── Financial Services
├── Translation Services
└── Internet / IT Services
```
Transaction types: offer, request, other

### 5. Home & Garden
```
├── Furniture (30+ types: sofas, beds, tables, chairs, etc.)
├── Kitchen & Dining
├── Home Decor (curtains, carpets, mirrors, clocks, lighting)
├── Garden & Outdoor
│   ├── Garden Furniture
│   ├── Garden Tools & Equipment
│   ├── Plants & Seeds
│   └── Pools & Accessories
├── Household Supplies
├── Antiques & Art
├── Gifts & Handmade
└── Other Household
```
Transaction types: sell, buy, give, exchange, other

### 6. Fashion & Apparel
```
├── Women's Clothing (40+ types from SS.COM)
├── Men's Clothing (26 types)
├── Children's Clothing
├── Women's Shoes
├── Men's Shoes
├── Children's Shoes
├── Bags & Accessories
├── Jewelry & Watches
├── Sunglasses & Eyewear
├── Workwear & Uniforms
├── Vintage & Collectible Fashion
└── Tailoring & Alterations (service)
```
Transaction types: sell, buy, give, other

### 7. Services
```
├── Home Services (cleaning, repair, plumbing, electrical)
├── Beauty & Wellness (hair, nails, massage, spa)
├── Automotive Services
├── Computer & IT Services
├── Tutoring & Lessons
├── Event Services (photography, catering, entertainment)
├── Moving & Transport
├── Legal & Financial
├── Pet Services (grooming, training, veterinary)
├── Real Estate Services
├── Creative Services (design, writing, translation)
├── Health & Medical
├── Skilled Trades (carpentry, welding, masonry)
├── Small Business Services (from Craigslist)
└── Other Services
```
Transaction types: service, other

### 8. Children & Baby
```
├── Baby & Toddler Clothing
├── Children's Toys (40+ types from SS.COM by age/type)
├── Strollers & Car Seats
├── Children's Furniture (beds, tables, storage)
├── School Supplies
├── Baby Accessories & Feeding
├── Kids' Activities & Classes
└── Other
```
Transaction types: sell, buy, give, other

### 9. Animals & Pets
```
├── Dogs (200+ breeds from SS.COM)
├── Cats (90+ breeds)
├── Birds & Parrots
├── Fish & Aquariums
├── Rodents (hamsters, rabbits, guinea pigs, chinchillas)
├── Exotic Animals (reptiles, amphibians)
├── Farm Animals (horses, goats, sheep, cattle, pigs)
├── Pet Supplies & Accessories
├── Veterinary Services
├── Pet Grooming
├── Lost & Found Pets
└── Other
```
Transaction types: sell, buy, give, lost, found, other

### 10. Sports & Outdoors
```
├── Fitness & Gym Equipment
├── Cycling (bikes, parts, accessories)
├── Winter Sports (skiing, snowboard, ice skating)
├── Water Sports (surfing, diving, kayaking, SUP)
├── Team Sports (football, basketball, hockey, volleyball)
├── Martial Arts & Boxing
├── Camping & Hiking
├── Hunting & Fishing
├── Running & Athletics
├── Yoga & Pilates
├── Outdoor Recreation
└── Other Sports
```
Transaction types: sell, buy, exchange, service, other

### 11. Hobbies & Leisure
```
├── Books & Magazines
├── Music & Instruments
├── Collectibles (coins, stamps, badges, military, models)
├── Art & Crafts Supplies
├── Board Games & Puzzles
├── RC Models & Drones
├── Tickets & Events
├── Photography & Film
├── Travel & Tourism
├── Other Hobbies
```
Transaction types: sell, buy, exchange, other

### 12. Beauty & Health
```
├── Skincare
├── Makeup & Cosmetics
├── Haircare
├── Fragrances
├── Health & Wellness Products
├── Medical Equipment
├── Massage Equipment
├── Fitness & Diet
└── Other
```
Transaction types: sell, buy, service, other

### 13. Construction & Industry
```
├── Building Materials
│   ├── Brick, Stone & Concrete
│   ├── Wood & Timber
│   ├── Doors, Windows & Stairs
│   ├── Finishing Materials (tiles, paint, flooring)
│   ├── Insulation
│   ├── Sand, Gravel & Fill
│   └── Other Materials
├── Construction Services (40+ types from SS.COM)
├── Tools & Equipment
│   ├── Power Tools (58 types from SS.COM)
│   ├── Hand Tools
│   ├── Safety Equipment
│   └── Equipment Rental
├── Plumbing & Heating
├── Electrical & Lighting
├── Industrial Equipment
├── Scrap Metal & Recycling
└── Other
```
Transaction types: sell, buy, service, rent, other

### 14. Agriculture & Farming
```
├── Livestock (cattle, sheep, goats, pigs, horses)
├── Poultry (chickens, ducks, geese, turkeys)
├── Agricultural Machinery (tractors, harvesters, tillers, etc.)
├── Seeds & Seedlings
├── Fertilizer & Chemicals
├── Crops & Produce (grains, vegetables, fruits)
├── Food Products (dairy, meat, honey, preserves)
├── Beekeeping / Apiary
├── Fish Farming
├── Farm Equipment & Supplies
├── Firewood & Fuel
└── Other
```
Transaction types: sell, buy, service, other

### 15. Free & Community
```
├── Free Stuff / Giveaway
├── Barter & Exchange
├── Garage Sales & Markets
├── Lost & Found (non-pet)
├── Volunteers & Community
├── Rideshare & Carpooling
└── Other
```
Transaction types: give, exchange, lost, found, other

## Data Files

- `car_manufacturers_models.json` — 155 manufacturers, 2,021 models (ready for DB seed)
- `SS_COM_FULL_CATEGORY_TREE.txt` — 3,269 lines, complete SS.COM tree (reference)
- `SS_COM_FIELD_REFERENCE.md` — per-category field definitions (reference)
- `GAP_ANALYSIS.md` — current vs target gap analysis

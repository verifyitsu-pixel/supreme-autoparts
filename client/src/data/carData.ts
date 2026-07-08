// ============================================================
// Supreme Autoparts – Complete Car Data for Kenya Market
// Brand → Model → Category → Parts flow
// ============================================================

export interface CarBrand {
  id: string;
  name: string;
  logo: string;
  heroImage: string;
  description: string;
  popular: boolean;
  country: string;
}

export interface CarModel {
  id: string;
  brandId: string;
  name: string;
  image: string;
  years: string;
  type: string;
  description: string;
}

export interface PartCategory {
  id: string;
  name: string;
  icon: string;
  image: string;
  description: string;
  subcategories: string[];
}

// ============================================================
// CAR BRANDS – Most popular in Kenya
// ============================================================
export const CAR_BRANDS: CarBrand[] = [
  {
    id: "toyota",
    name: "Toyota",
    logo: "/assets/images/brands/toyota.png",
    heroImage: "/assets/images/models/toyota-hilux.jpg",
    description: "Japan's most trusted brand. Toyota dominates Kenya's roads with reliable, fuel-efficient vehicles.",
    popular: true,
    country: "Japan",
  },
  {
    id: "nissan",
    name: "Nissan",
    logo: "/assets/images/brands/nissan.svg",
    heroImage: "/assets/images/models/nissan-navara.jpg",
    description: "Nissan offers a wide range of dependable vehicles popular across Kenya from the X-Trail to the Navara.",
    popular: true,
    country: "Japan",
  },
  {
    id: "mazda",
    name: "Mazda",
    logo: "/assets/images/brands/mazda.svg",
    heroImage: "/assets/images/models/toyota-fielder.jpg",
    description: "Mazda's KODO design and SkyActiv technology make it a favourite for style-conscious Kenyan drivers.",
    popular: true,
    country: "Japan",
  },
  {
    id: "honda",
    name: "Honda",
    logo: "/assets/images/brands/honda.png",
    heroImage: "/assets/images/models/honda-civic.jpg",
    description: "Honda's engineering excellence powers some of Kenya's most popular sedans and SUVs.",
    popular: true,
    country: "Japan",
  },
  {
    id: "subaru",
    name: "Subaru",
    logo: "/assets/images/brands/subaru.svg",
    heroImage: "/assets/images/models/hyundai-tucson.jpg",
    description: "Subaru's AWD capability and flat-four engines make it ideal for Kenya's diverse terrain.",
    popular: true,
    country: "Japan",
  },
  {
    id: "mitsubishi",
    name: "Mitsubishi",
    logo: "/assets/images/brands/mitsubishi.png",
    heroImage: "/assets/images/models/mitsubishi-pajero.jpg",
    description: "Mitsubishi's Pajero and L200 are legendary workhorses on Kenya's roads and off-road tracks.",
    popular: true,
    country: "Japan",
  },
  {
    id: "suzuki",
    name: "Suzuki",
    logo: "/assets/images/brands/suzuki.png",
    heroImage: "/assets/images/models/suzuki-swift.jpg",
    description: "Suzuki's compact and fuel-efficient vehicles are perfect for Nairobi's urban environment.",
    popular: true,
    country: "Japan",
  },
  {
    id: "bmw",
    name: "BMW",
    logo: "/assets/images/brands/bmw.png",
    heroImage: "/assets/images/models/bmw-3series.jpg",
    description: "The ultimate driving machine. BMW's precision engineering and luxury appeal to Kenya's premium market.",
    popular: true,
    country: "Germany",
  },
  {
    id: "mercedes-benz",
    name: "Mercedes-Benz",
    logo: "/assets/images/brands/mercedesbenz.png",
    heroImage: "/assets/images/models/mercedes-cclass.jpg",
    description: "Mercedes-Benz sets the standard for luxury and performance in Kenya's premium automotive segment.",
    popular: true,
    country: "Germany",
  },
  {
    id: "volkswagen",
    name: "Volkswagen",
    logo: "/assets/images/brands/volkswagen.svg",
    heroImage: "/assets/images/models/honda-civic-2.jpg",
    description: "Volkswagen's Golf, Polo and Tiguan are popular choices among Kenyan drivers seeking European quality.",
    popular: true,
    country: "Germany",
  },
  {
    id: "ford",
    name: "Ford",
    logo: "/assets/images/brands/ford.png",
    heroImage: "/assets/images/models/ford-ranger.jpg",
    description: "Ford's Ranger and Everest are top picks for Kenyan buyers who need rugged, capable vehicles.",
    popular: true,
    country: "USA",
  },
  {
    id: "hyundai",
    name: "Hyundai",
    logo: "/assets/images/brands/hyundai.png",
    heroImage: "/assets/images/models/hyundai-tucson.jpg",
    description: "Hyundai offers excellent value for money with modern styling and comprehensive warranty coverage.",
    popular: true,
    country: "South Korea",
  },
  {
    id: "kia",
    name: "Kia",
    logo: "/assets/images/brands/kia.svg",
    heroImage: "/assets/images/models/hyundai-tucson-2.jpg",
    description: "Kia's bold design and feature-packed models are gaining rapid popularity across Kenya.",
    popular: false,
    country: "South Korea",
  },
  {
    id: "isuzu",
    name: "Isuzu",
    logo: "/assets/images/brands/isuzu.svg",
    heroImage: "/assets/images/models/toyota-prado.jpg",
    description: "Isuzu's D-Max and commercial vehicles are workhorses of Kenya's transport and logistics industry.",
    popular: true,
    country: "Japan",
  },
  {
    id: "lexus",
    name: "Lexus",
    logo: "/assets/images/brands/lexus.png",
    heroImage: "/assets/images/models/hyundai-tucson-2.jpg",
    description: "Lexus delivers unmatched luxury and reliability for Kenya's most discerning drivers.",
    popular: false,
    country: "Japan",
  },
  {
    id: "land-rover",
    name: "Land Rover",
    logo: "/assets/images/brands/landrover.svg",
    heroImage: "/assets/images/models/toyota-prado.jpg",
    description: "Land Rover's legendary off-road capability makes it the vehicle of choice for Kenya's adventurous terrain.",
    popular: false,
    country: "UK",
  },
];

// ============================================================
// CAR MODELS per Brand
// ============================================================
export const CAR_MODELS: Record<string, CarModel[]> = {
  toyota: [
    { id: "toyota-hilux", brandId: "toyota", name: "Hilux (Vigo/Revo)", image: "/assets/images/models/toyota-hilux.jpg", years: "2005–2024", type: "Pickup Truck", description: "Kenya's most popular pickup truck. Legendary durability on any terrain." },
    { id: "toyota-prado", brandId: "toyota", name: "Land Cruiser Prado (J120/J150)", image: "/assets/images/models/toyota-prado.jpg", years: "2003–2024", type: "SUV", description: "Premium SUV combining off-road capability with luxury comfort." },
    { id: "toyota-landcruiser", brandId: "toyota", name: "Land Cruiser (V8/200/300)", image: "/assets/images/models/toyota-prado-2.jpg", years: "2007–2024", type: "Full-Size SUV", description: "The ultimate Land Cruiser — unstoppable on any surface." },
    { id: "toyota-vitz", brandId: "toyota", name: "Vitz / Yaris", image: "/assets/images/models/suzuki-swift.jpg", years: "2005–2024", type: "Hatchback", description: "Compact, fuel-efficient city car loved across Nairobi." },
    { id: "toyota-fielder", brandId: "toyota", name: "Fielder / Corolla Wagon", image: "/assets/images/models/toyota-fielder.jpg", years: "2006–2024", type: "Station Wagon", description: "Spacious and reliable family wagon popular in Kenya." },
    { id: "toyota-corolla", brandId: "toyota", name: "Corolla (E120/E150/E210)", image: "/assets/images/models/honda-civic.jpg", years: "2002–2024", type: "Sedan", description: "The world's best-selling car — reliable, affordable, and widely available." },
    { id: "toyota-rav4", brandId: "toyota", name: "RAV4", image: "/assets/images/models/hyundai-tucson.jpg", years: "2006–2024", type: "Compact SUV", description: "Versatile crossover SUV blending comfort with capability." },
    { id: "toyota-harrier", brandId: "toyota", name: "Harrier / Venza", image: "/assets/images/models/suzuki-swift.jpg", years: "2003–2024", type: "Luxury SUV", description: "Elegant and comfortable luxury crossover." },
    { id: "toyota-wish", brandId: "toyota", name: "Wish / Isis", image: "/assets/images/models/honda-civic-2.jpg", years: "2003–2017", type: "MPV", description: "Popular family MPV with sliding doors and spacious interior." },
    { id: "toyota-hiace", brandId: "toyota", name: "Hiace (Van/Minibus)", image: "/assets/images/models/ford-ranger.jpg", years: "2005–2024", type: "Van / Minibus", description: "Kenya's most popular matatu and cargo van." },
    { id: "toyota-camry", brandId: "toyota", name: "Camry", image: "/assets/images/models/toyota-fielder.jpg", years: "2006–2024", type: "Sedan", description: "Premium mid-size sedan with excellent comfort and reliability." },
    { id: "toyota-premio", brandId: "toyota", name: "Premio / Allion", image: "/assets/images/models/honda-civic-2.jpg", years: "2001–2021", type: "Sedan", description: "Comfortable and spacious Japanese domestic market sedan." },
  ],
  nissan: [
    { id: "nissan-xtrail", brandId: "nissan", name: "X-Trail (T30/T31/T32)", image: "/assets/images/models/hyundai-tucson-2.jpg", years: "2001–2024", type: "Compact SUV", description: "Kenya's favourite Nissan SUV — capable, comfortable, and practical." },
    { id: "nissan-navara", brandId: "nissan", name: "Navara (D40/D23)", image: "/assets/images/models/nissan-navara.jpg", years: "2005–2024", type: "Pickup Truck", description: "Rugged pickup truck competing with the Hilux on Kenya's tough roads." },
    { id: "nissan-note", brandId: "nissan", name: "Note / Tiida", image: "/assets/images/models/honda-civic.jpg", years: "2005–2020", type: "Hatchback", description: "Compact and fuel-efficient city hatchback." },
    { id: "nissan-patrol", brandId: "nissan", name: "Patrol (Y61/Y62)", image: "/assets/images/models/toyota-prado.jpg", years: "1998–2024", type: "Full-Size SUV", description: "Legendary off-road SUV built for Kenya's toughest terrains." },
    { id: "nissan-hardbody", brandId: "nissan", name: "Hardbody (D21/D22)", image: "/assets/images/models/ford-ranger.jpg", years: "1997–2015", type: "Pickup Truck", description: "Classic workhorse pickup truck still widely used in Kenya." },
    { id: "nissan-sylphy", brandId: "nissan", name: "Sylphy / Bluebird", image: "/assets/images/models/honda-civic.jpg", years: "2000–2024", type: "Sedan", description: "Comfortable and spacious family sedan." },
    { id: "nissan-murano", brandId: "nissan", name: "Murano", image: "/assets/images/models/nissan-navara-2.jpg", years: "2003–2024", type: "Mid-Size SUV", description: "Stylish and premium crossover SUV." },
  ],
  mazda: [
    { id: "mazda-demio", brandId: "mazda", name: "Demio / Mazda2", image: "/assets/images/models/toyota-fielder.jpg", years: "2002–2024", type: "Hatchback", description: "Stylish and fuel-efficient compact hatchback, very popular in Kenya." },
    { id: "mazda-cx5", brandId: "mazda", name: "CX-5", image: "/assets/images/models/hyundai-tucson.jpg", years: "2012–2024", type: "Compact SUV", description: "Award-winning SUV with stunning KODO design and SkyActiv technology." },
    { id: "mazda-cx3", brandId: "mazda", name: "CX-3", image: "/assets/images/models/suzuki-swift-2.jpg", years: "2015–2024", type: "Subcompact SUV", description: "Sporty subcompact crossover with premium interior." },
    { id: "mazda-atenza", brandId: "mazda", name: "Atenza / Mazda6", image: "/assets/images/models/honda-civic-2.jpg", years: "2002–2023", type: "Sedan/Wagon", description: "Premium mid-size sedan with elegant styling." },
    { id: "mazda-axela", brandId: "mazda", name: "Axela / Mazda3", image: "/assets/images/models/honda-civic-2.jpg", years: "2003–2024", type: "Sedan/Hatchback", description: "Sporty compact car with excellent handling." },
    { id: "mazda-bt50", brandId: "mazda", name: "BT-50", image: "/assets/images/models/nissan-navara.jpg", years: "2006–2024", type: "Pickup Truck", description: "Capable pickup truck built for work and adventure." },
    { id: "mazda-cx9", brandId: "mazda", name: "CX-9", image: "/assets/images/models/nissan-navara-2.jpg", years: "2007–2024", type: "Full-Size SUV", description: "Three-row family SUV with premium features." },
  ],
  honda: [
    { id: "honda-civic", brandId: "honda", name: "Civic (FD/FB/FC/FL)", image: "/assets/images/models/honda-civic.jpg", years: "2006–2024", type: "Sedan/Hatchback", description: "Sporty and reliable compact car with excellent fuel economy." },
    { id: "honda-crv", brandId: "honda", name: "CR-V", image: "/assets/images/models/hyundai-tucson.jpg", years: "2007–2024", type: "Compact SUV", description: "Honda's best-selling SUV — practical, spacious, and efficient." },
    { id: "honda-accord", brandId: "honda", name: "Accord (CL/CM/CU/CV)", image: "/assets/images/models/honda-civic.jpg", years: "2003��2024", type: "Sedan", description: "Premium mid-size sedan with refined performance." },
    { id: "honda-fit", brandId: "honda", name: "Fit / Jazz", image: "/assets/images/models/suzuki-swift.jpg", years: "2001–2024", type: "Hatchback", description: "Clever packaging and fuel efficiency make this a Nairobi favourite." },
    { id: "honda-hrv", brandId: "honda", name: "HR-V / Vezel", image: "/assets/images/models/suzuki-swift.jpg", years: "2014–2024", type: "Subcompact SUV", description: "Stylish subcompact crossover with Honda's Magic Seat." },
    { id: "honda-pilot", brandId: "honda", name: "Pilot", image: "/assets/images/models/toyota-prado.jpg", years: "2003–2024", type: "Full-Size SUV", description: "Three-row family SUV with Honda's legendary reliability." },
  ],
  subaru: [
    { id: "subaru-forester", brandId: "subaru", name: "Forester (SG/SH/SJ/SK)", image: "/assets/images/models/hyundai-tucson.jpg", years: "2002–2024", type: "Compact SUV", description: "Kenya's most popular Subaru — AWD capability with practical space." },
    { id: "subaru-outback", brandId: "subaru", name: "Outback (BP/BR/BS/BT)", image: "/assets/images/models/hyundai-tucson-2.jpg", years: "2003–2024", type: "Crossover Wagon", description: "Raised wagon with AWD for those who want more than a sedan." },
    { id: "subaru-impreza", brandId: "subaru", name: "Impreza / WRX", image: "/assets/images/models/honda-civic-2.jpg", years: "2000–2024", type: "Sedan/Hatchback", description: "Rally-bred performance car with iconic AWD system." },
    { id: "subaru-legacy", brandId: "subaru", name: "Legacy (BL/BP/BM/BN)", image: "/assets/images/models/honda-civic-2.jpg", years: "2003–2024", type: "Sedan/Wagon", description: "Comfortable family car with Subaru's signature AWD." },
    { id: "subaru-xv", brandId: "subaru", name: "XV / Crosstrek", image: "/assets/images/models/suzuki-swift-2.jpg", years: "2012–2024", type: "Subcompact SUV", description: "Raised Impreza hatchback with AWD for urban adventurers." },
    { id: "subaru-tribeca", brandId: "subaru", name: "Tribeca / B9", image: "/assets/images/models/nissan-navara-2.jpg", years: "2005–2014", type: "Mid-Size SUV", description: "Three-row SUV with Subaru's boxer engine and AWD." },
  ],
  mitsubishi: [
    { id: "mitsubishi-pajero", brandId: "mitsubishi", name: "Pajero (V60/V80/V90)", image: "/assets/images/models/mitsubishi-pajero.jpg", years: "1999–2024", type: "Full-Size SUV", description: "Legendary off-road SUV that has conquered Kenya's toughest roads." },
    { id: "mitsubishi-l200", brandId: "mitsubishi", name: "L200 / Triton (KB/KH/KL)", image: "/assets/images/models/ford-ranger.jpg", years: "2006–2024", type: "Pickup Truck", description: "Tough and versatile pickup truck for work and adventure." },
    { id: "mitsubishi-outlander", brandId: "mitsubishi", name: "Outlander (CU/CW/GF/GG)", image: "/assets/images/models/hyundai-tucson.jpg", years: "2003–2024", type: "Mid-Size SUV", description: "Family-friendly SUV with optional 4WD." },
    { id: "mitsubishi-colt", brandId: "mitsubishi", name: "Colt / Mirage", image: "/assets/images/models/suzuki-swift.jpg", years: "2004–2024", type: "Hatchback", description: "Compact and economical city car." },
    { id: "mitsubishi-galant", brandId: "mitsubishi", name: "Galant / Lancer", image: "/assets/images/models/honda-civic-2.jpg", years: "2003–2017", type: "Sedan", description: "Sporty sedan with excellent performance." },
    { id: "mitsubishi-pajero-sport", brandId: "mitsubishi", name: "Pajero Sport / Montero Sport", image: "/assets/images/models/hyundai-tucson-2.jpg", years: "2008–2024", type: "Mid-Size SUV", description: "Capable body-on-frame SUV for serious off-roading." },
  ],
  suzuki: [
    { id: "suzuki-swift", brandId: "suzuki", name: "Swift", image: "/assets/images/models/suzuki-swift.jpg", years: "2005–2024", type: "Hatchback", description: "Fun-to-drive compact hatchback popular in Nairobi." },
    { id: "suzuki-vitara", brandId: "suzuki", name: "Vitara / Escudo", image: "/assets/images/models/suzuki-swift-2.jpg", years: "2005–2024", type: "Compact SUV", description: "Compact SUV with optional 4WD for weekend adventures." },
    { id: "suzuki-jimny", brandId: "suzuki", name: "Jimny (JB43/JB74)", image: "/assets/images/models/mercedes-cclass.jpg", years: "1998–2024", type: "Mini SUV", description: "Iconic mini 4x4 with legendary off-road capability." },
    { id: "suzuki-alto", brandId: "suzuki", name: "Alto / Celerio", image: "/assets/images/models/suzuki-swift.jpg", years: "2009–2024", type: "City Car", description: "Ultra-compact and economical city car." },
    { id: "suzuki-sx4", brandId: "suzuki", name: "SX4 / S-Cross", image: "/assets/images/models/hyundai-tucson.jpg", years: "2006–2024", type: "Crossover", description: "Practical crossover combining hatchback and SUV traits." },
  ],
  bmw: [
    { id: "bmw-3series", brandId: "bmw", name: "3 Series (E90/F30/G20)", image: "/assets/images/models/bmw-3series.jpg", years: "2005–2024", type: "Sedan", description: "The benchmark sports sedan — precise handling and premium feel." },
    { id: "bmw-5series", brandId: "bmw", name: "5 Series (E60/F10/G30)", image: "/assets/images/models/hyundai-tucson.jpg", years: "2003–2024", type: "Luxury Sedan", description: "Executive sedan combining performance with luxury." },
    { id: "bmw-x3", brandId: "bmw", name: "X3 (E83/F25/G01)", image: "/assets/images/models/bmw-3series.jpg", years: "2004–2024", type: "Compact SUV", description: "BMW's best-selling SUV — sporty and practical." },
    { id: "bmw-x5", brandId: "bmw", name: "X5 (E70/F15/G05)", image: "/assets/images/models/bmw-3series-2.jpg", years: "2006–2024", type: "Mid-Size SUV", description: "Powerful and luxurious mid-size SUV." },
    { id: "bmw-7series", brandId: "bmw", name: "7 Series (E65/F01/G11)", image: "/assets/images/models/honda-civic-2.jpg", years: "2001–2024", type: "Luxury Sedan", description: "BMW's flagship luxury sedan." },
    { id: "bmw-x6", brandId: "bmw", name: "X6 (E71/F16/G06)", image: "/assets/images/models/bmw-3series-2.jpg", years: "2008–2024", type: "Sports SAV", description: "Distinctive sports activity vehicle combining coupe and SUV." },
  ],
  "mercedes-benz": [
    { id: "mb-cclass", brandId: "mercedes-benz", name: "C-Class (W204/W205/W206)", image: "/assets/images/models/mercedes-cclass.jpg", years: "2007–2024", type: "Sedan", description: "Entry-level Mercedes luxury sedan with premium features." },
    { id: "mb-eclass", brandId: "mercedes-benz", name: "E-Class (W212/W213)", image: "/assets/images/models/mercedes-cclass.jpg", years: "2009–2024", type: "Sedan/Wagon", description: "Executive sedan with advanced technology and comfort." },
    { id: "mb-sclass", brandId: "mercedes-benz", name: "S-Class (W221/W222/W223)", image: "/assets/images/models/mercedes-cclass-2.jpg", years: "2005–2024", type: "Luxury Sedan", description: "The pinnacle of Mercedes luxury and technology." },
    { id: "mb-glc", brandId: "mercedes-benz", name: "GLC-Class (X253/X254)", image: "/assets/images/models/hyundai-tucson.jpg", years: "2015–2024", type: "Compact SUV", description: "Compact luxury SUV with Mercedes' signature refinement." },
    { id: "mb-gle", brandId: "mercedes-benz", name: "GLE-Class / ML-Class", image: "/assets/images/models/honda-civic-2.jpg", years: "2011–2024", type: "Mid-Size SUV", description: "Premium mid-size SUV with powerful engine options." },
    { id: "mb-gclass", brandId: "mercedes-benz", name: "G-Class (W463/W464)", image: "/assets/images/models/toyota-prado.jpg", years: "1979–2024", type: "Full-Size SUV", description: "Iconic boxy SUV — the ultimate status symbol." },
  ],
  volkswagen: [
    { id: "vw-golf", brandId: "volkswagen", name: "Golf (Mk5/Mk6/Mk7/Mk8)", image: "/assets/images/models/honda-civic-2.jpg", years: "2004–2024", type: "Hatchback", description: "The world's most iconic hatchback — refined, practical, and fun." },
    { id: "vw-polo", brandId: "volkswagen", name: "Polo (9N/6R/AW)", image: "/assets/images/models/bmw-3series-2.jpg", years: "2002–2024", type: "Subcompact", description: "Premium compact car with VW's build quality." },
    { id: "vw-tiguan", brandId: "volkswagen", name: "Tiguan (5N/AD)", image: "/assets/images/models/suzuki-swift-2.jpg", years: "2007–2024", type: "Compact SUV", description: "VW's best-selling SUV with premium features." },
    { id: "vw-passat", brandId: "volkswagen", name: "Passat (B6/B7/B8)", image: "/assets/images/models/honda-civic-2.jpg", years: "2005–2024", type: "Sedan/Wagon", description: "Spacious and comfortable family car." },
    { id: "vw-touareg", brandId: "volkswagen", name: "Touareg (7L/7P/CR)", image: "/assets/images/models/nissan-navara-2.jpg", years: "2002–2024", type: "Mid-Size SUV", description: "Premium SUV with VW's engineering excellence." },
  ],
  ford: [
    { id: "ford-ranger", brandId: "ford", name: "Ranger (T6/T7/T8/T9)", image: "/assets/images/models/ford-ranger.jpg", years: "2011–2024", type: "Pickup Truck", description: "Kenya's top-selling Ford — tough, capable, and feature-rich." },
    { id: "ford-everest", brandId: "ford", name: "Everest (UA/UB)", image: "/assets/images/models/toyota-prado.jpg", years: "2015–2024", type: "Full-Size SUV", description: "Seven-seat SUV built on the Ranger platform." },
    { id: "ford-focus", brandId: "ford", name: "Focus (C307/C346)", image: "/assets/images/models/suzuki-swift.jpg", years: "2011–2022", type: "Hatchback/Sedan", description: "Sporty European hatchback with engaging driving dynamics." },
    { id: "ford-explorer", brandId: "ford", name: "Explorer (U502/U625)", image: "/assets/images/models/nissan-navara-2.jpg", years: "2011–2024", type: "Full-Size SUV", description: "Three-row family SUV with Ford's EcoBoost engines." },
    { id: "ford-ecosport", brandId: "ford", name: "EcoSport", image: "/assets/images/models/hyundai-tucson.jpg", years: "2013–2022", type: "Subcompact SUV", description: "Compact urban SUV with raised ground clearance." },
  ],
  hyundai: [
    { id: "hyundai-tucson", brandId: "hyundai", name: "Tucson (TL/NX4)", image: "/assets/images/models/hyundai-tucson.jpg", years: "2009–2024", type: "Compact SUV", description: "Stylish and feature-packed compact SUV." },
    { id: "hyundai-santafe", brandId: "hyundai", name: "Santa Fe (CM/DM/TM)", image: "/assets/images/models/hyundai-tucson-2.jpg", years: "2006–2024", type: "Mid-Size SUV", description: "Family SUV with excellent value and features." },
    { id: "hyundai-elantra", brandId: "hyundai", name: "Elantra (MD/AD/CN7)", image: "/assets/images/models/honda-civic.jpg", years: "2010–2024", type: "Sedan", description: "Sporty compact sedan with bold design." },
    { id: "hyundai-i10", brandId: "hyundai", name: "i10 / Grand i10", image: "/assets/images/models/suzuki-swift.jpg", years: "2013–2024", type: "City Car", description: "Economical city car perfect for Nairobi traffic." },
    { id: "hyundai-i20", brandId: "hyundai", name: "i20 (PB/GB/BC3)", image: "/assets/images/models/honda-civic-2.jpg", years: "2014–2024", type: "Supermini", description: "Premium supermini with European styling." },
    { id: "hyundai-creta", brandId: "hyundai", name: "Creta / ix25", image: "/assets/images/models/hyundai-tucson.jpg", years: "2015–2024", type: "Subcompact SUV", description: "Popular subcompact SUV with bold styling." },
  ],
  kia: [
    { id: "kia-sportage", brandId: "kia", name: "Sportage (QL/NQ5)", image: "/assets/images/models/hyundai-tucson.jpg", years: "2010–2024", type: "Compact SUV", description: "Stylish and practical compact SUV." },
    { id: "kia-sorento", brandId: "kia", name: "Sorento (XM/UM/MQ4)", image: "/assets/images/models/hyundai-tucson.jpg", years: "2009–2024", type: "Mid-Size SUV", description: "Three-row family SUV with premium features." },
    { id: "kia-rio", brandId: "kia", name: "Rio (UB/YB)", image: "/assets/images/models/toyota-fielder.jpg", years: "2011–2024", type: "Subcompact", description: "Affordable and stylish compact car." },
    { id: "kia-picanto", brandId: "kia", name: "Picanto (TA/JA)", image: "/assets/images/models/suzuki-swift.jpg", years: "2011–2024", type: "City Car", description: "Ultra-compact city car with big personality." },
  ],
  isuzu: [
    { id: "isuzu-dmax", brandId: "isuzu", name: "D-Max (TF/RT50)", image: "/assets/images/models/toyota-hilux.jpg", years: "2002–2024", type: "Pickup Truck", description: "Kenya's most popular commercial pickup truck." },
    { id: "isuzu-mux", brandId: "isuzu", name: "MU-X", image: "/assets/images/models/toyota-prado.jpg", years: "2013–2024", type: "Full-Size SUV", description: "Seven-seat SUV built on the D-Max platform." },
    { id: "isuzu-nkr", brandId: "isuzu", name: "NKR / NQR (Light Truck)", image: "/assets/images/models/ford-ranger.jpg", years: "2000–2024", type: "Light Truck", description: "Kenya's most popular commercial light truck." },
    { id: "isuzu-elf", brandId: "isuzu", name: "ELF / NPR", image: "/assets/images/models/ford-ranger.jpg", years: "2000–2024", type: "Medium Truck", description: "Reliable medium-duty truck for commercial use." },
  ],
  lexus: [
    { id: "lexus-rx", brandId: "lexus", name: "RX (RX300/RX350/RX450h)", image: "/assets/images/models/mercedes-cclass.jpg", years: "2003–2024", type: "Luxury SUV", description: "Lexus's best-selling luxury SUV with hybrid option." },
    { id: "lexus-lx", brandId: "lexus", name: "LX (LX470/LX570/LX600)", image: "/assets/images/models/toyota-prado-2.jpg", years: "1998–2024", type: "Full-Size Luxury SUV", description: "Lexus's flagship SUV based on Land Cruiser platform." },
    { id: "lexus-is", brandId: "lexus", name: "IS (IS250/IS300/IS350)", image: "/assets/images/models/bmw-3series.jpg", years: "2005–2024", type: "Luxury Sedan", description: "Sporty luxury compact sedan." },
    { id: "lexus-es", brandId: "lexus", name: "ES (ES250/ES300h/ES350)", image: "/assets/images/models/mercedes-cclass-2.jpg", years: "2006–2024", type: "Luxury Sedan", description: "Refined and comfortable executive sedan." },
    { id: "lexus-gx", brandId: "lexus", name: "GX (GX460/GX550)", image: "/assets/images/models/toyota-prado.jpg", years: "2009–2024", type: "Luxury SUV", description: "Body-on-frame luxury SUV with serious off-road capability." },
  ],
  "land-rover": [
    { id: "lr-discovery", brandId: "land-rover", name: "Discovery (TD5/Td6/D5)", image: "/assets/images/models/nissan-navara-2.jpg", years: "2004–2024", type: "Full-Size SUV", description: "Versatile seven-seat SUV with legendary off-road ability." },
    { id: "lr-defender", brandId: "land-rover", name: "Defender (90/110/130)", image: "/assets/images/models/mitsubishi-pajero.jpg", years: "1983–2024", type: "Off-Road SUV", description: "The original Land Rover — built for Africa's toughest terrain." },
    { id: "lr-freelander", brandId: "land-rover", name: "Freelander (L314/L359)", image: "/assets/images/models/suzuki-swift-2.jpg", years: "2003–2015", type: "Compact SUV", description: "Compact Land Rover with off-road capability." },
    { id: "lr-rangerover", brandId: "land-rover", name: "Range Rover (L322/L405)", image: "/assets/images/models/hyundai-tucson.jpg", years: "2002–2024", type: "Luxury SUV", description: "The ultimate luxury SUV — refined, powerful, and capable." },
    { id: "lr-sport", brandId: "land-rover", name: "Range Rover Sport (L320/L494)", image: "/assets/images/models/honda-civic-2.jpg", years: "2005–2024", type: "Luxury SUV", description: "Sporty Range Rover with dynamic performance." },
  ],
};

// ============================================================
// PART CATEGORIES
// ============================================================
export const PART_CATEGORIES: PartCategory[] = [
  {
    id: "braking",
    name: "Braking Systems",
    icon: "🛑",
    image: "/assets/images/categories/braking.jpg",
    description: "Brake pads, discs, drums, calipers, hoses, and master cylinders for safe stopping power.",
    subcategories: ["Brake Pads", "Brake Discs / Rotors", "Brake Drums", "Brake Calipers", "Brake Hoses & Lines", "Master Cylinders", "Brake Boosters", "ABS Sensors"],
  },
  {
    id: "engine",
    name: "Engine Components",
    icon: "⚙️",
    image: "/assets/images/categories/engine.jpg",
    description: "Filters, gaskets, timing belts, pistons, camshafts, and all engine internals.",
    subcategories: ["Oil Filters", "Air Filters", "Fuel Filters", "Timing Belts & Chains", "Gaskets & Seals", "Pistons & Rings", "Camshafts & Valves", "Engine Mounts", "Radiators", "Water Pumps", "Thermostats"],
  },
  {
    id: "suspension",
    name: "Suspension & Steering",
    icon: "🚗",
    image: "/assets/images/categories/suspension.jpg",
    description: "Shock absorbers, springs, control arms, tie rods, and steering components.",
    subcategories: ["Shock Absorbers", "Coil Springs", "Control Arms", "Tie Rod Ends", "Ball Joints", "Stabilizer Links", "Wheel Bearings", "Steering Racks", "Power Steering Pumps", "CV Joints & Axles"],
  },
  {
    id: "electrical",
    name: "Electrical & Sensors",
    icon: "⚡",
    image: "/assets/images/categories/electrical.jpg",
    description: "Alternators, starters, sensors, switches, and all electrical components.",
    subcategories: ["Alternators", "Starters", "Batteries", "Ignition Coils", "Spark Plugs", "Oxygen Sensors", "MAF Sensors", "Crankshaft Sensors", "Throttle Bodies", "Fuses & Relays", "Headlights & Bulbs"],
  },
  {
    id: "transmission",
    name: "Transmission & Gearbox",
    icon: "🔧",
    image: "/assets/images/categories/transmission.jpg",
    description: "Clutch kits, gearbox parts, differentials, and drivetrain components.",
    subcategories: ["Clutch Kits", "Clutch Discs", "Pressure Plates", "Flywheel", "Gearbox Mounts", "Differential Parts", "Transfer Case Parts", "Transmission Fluid", "Gear Selectors"],
  },
  {
    id: "body",
    name: "Body & Exterior",
    icon: "🚘",
    image: "/assets/images/categories/bodykits.jpg",
    description: "Bumpers, fenders, doors, mirrors, hoods, and all exterior body panels.",
    subcategories: ["Bumpers", "Fenders", "Hoods / Bonnets", "Doors & Panels", "Side Mirrors", "Grilles", "Headlights", "Tail Lights", "Windscreens", "Door Handles & Locks"],
  },
  {
    id: "tyres",
    name: "Tyres & Wheels",
    icon: "🔵",
    image: "/assets/images/categories/tyres.jpg",
    description: "Tyres, alloy rims, steel wheels, wheel nuts, and tyre accessories.",
    subcategories: ["Passenger Tyres", "SUV / 4x4 Tyres", "Commercial Tyres", "Alloy Rims", "Steel Wheels", "Wheel Nuts & Bolts", "Tyre Valves", "Wheel Spacers"],
  },
  {
    id: "lubricants",
    name: "Oils & Lubricants",
    icon: "🛢️",
    image: "/assets/images/categories/lubricants.jpg",
    description: "Engine oils, transmission fluids, brake fluids, and all automotive lubricants.",
    subcategories: ["Engine Oil", "Gear Oil", "Brake Fluid", "Power Steering Fluid", "Coolant / Antifreeze", "Grease & Lubricants", "Fuel Additives"],
  },
  {
    id: "glass",
    name: "Glass & Windscreens",
    icon: "🪟",
    image: "/assets/images/categories/glass.jpg",
    description: "Windscreens, door glass, rear windows, and mirrors.",
    subcategories: ["Windscreens", "Door Glass", "Rear Windscreens", "Sunroofs", "Side Mirrors", "Wiper Blades"],
  },
  {
    id: "alloys",
    name: "Alloys & Accessories",
    icon: "✨",
    image: "/assets/images/categories/alloys.jpg",
    description: "Alloy wheels, rims, wheel covers, and styling accessories.",
    subcategories: ["Alloy Wheels", "Wheel Covers", "Centre Caps", "Lug Nuts", "Wheel Locks"],
  },
];

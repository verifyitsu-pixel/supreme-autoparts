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
    heroImage: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?q=80&w=1600&auto=format",
    description: "Japan's most trusted brand. Toyota dominates Kenya's roads with reliable, fuel-efficient vehicles.",
    popular: true,
    country: "Japan",
  },
  {
    id: "nissan",
    name: "Nissan",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Nissan_logo.svg/2560px-Nissan_logo.svg.png",
    heroImage: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=1600&auto=format",
    description: "Nissan offers a wide range of dependable vehicles popular across Kenya from the X-Trail to the Navara.",
    popular: true,
    country: "Japan",
  },
  {
    id: "mazda",
    name: "Mazda",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Mazda_logo.svg/2560px-Mazda_logo.svg.png",
    heroImage: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=1600&auto=format",
    description: "Mazda's KODO design and SkyActiv technology make it a favourite for style-conscious Kenyan drivers.",
    popular: true,
    country: "Japan",
  },
  {
    id: "honda",
    name: "Honda",
    logo: "/assets/images/brands/honda.png",
    heroImage: "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?q=80&w=1600&auto=format",
    description: "Honda's engineering excellence powers some of Kenya's most popular sedans and SUVs.",
    popular: true,
    country: "Japan",
  },
  {
    id: "subaru",
    name: "Subaru",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Subaru_logo.svg/2560px-Subaru_logo.svg.png",
    heroImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1600&auto=format",
    description: "Subaru's AWD capability and flat-four engines make it ideal for Kenya's diverse terrain.",
    popular: true,
    country: "Japan",
  },
  {
    id: "mitsubishi",
    name: "Mitsubishi",
    logo: "/assets/images/brands/mitsubishi.png",
    heroImage: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=1600&auto=format",
    description: "Mitsubishi's Pajero and L200 are legendary workhorses on Kenya's roads and off-road tracks.",
    popular: true,
    country: "Japan",
  },
  {
    id: "suzuki",
    name: "Suzuki",
    logo: "/assets/images/brands/suzuki.png",
    heroImage: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?q=80&w=1600&auto=format",
    description: "Suzuki's compact and fuel-efficient vehicles are perfect for Nairobi's urban environment.",
    popular: true,
    country: "Japan",
  },
  {
    id: "bmw",
    name: "BMW",
    logo: "/assets/images/brands/bmw.png",
    heroImage: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1600&auto=format",
    description: "The ultimate driving machine. BMW's precision engineering and luxury appeal to Kenya's premium market.",
    popular: true,
    country: "Germany",
  },
  {
    id: "mercedes-benz",
    name: "Mercedes-Benz",
    logo: "/assets/images/brands/mercedesbenz.png",
    heroImage: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1600&auto=format",
    description: "Mercedes-Benz sets the standard for luxury and performance in Kenya's premium automotive segment.",
    popular: true,
    country: "Germany",
  },
  {
    id: "volkswagen",
    name: "Volkswagen",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Volkswagen_logo_2019.svg/2560px-Volkswagen_logo_2019.svg.png",
    heroImage: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1600&auto=format",
    description: "Volkswagen's Golf, Polo and Tiguan are popular choices among Kenyan drivers seeking European quality.",
    popular: true,
    country: "Germany",
  },
  {
    id: "ford",
    name: "Ford",
    logo: "/assets/images/brands/ford.png",
    heroImage: "https://images.unsplash.com/photo-1551830820-330a71b99659?q=80&w=1600&auto=format",
    description: "Ford's Ranger and Everest are top picks for Kenyan buyers who need rugged, capable vehicles.",
    popular: true,
    country: "USA",
  },
  {
    id: "hyundai",
    name: "Hyundai",
    logo: "/assets/images/brands/hyundai.png",
    heroImage: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=1600&auto=format",
    description: "Hyundai offers excellent value for money with modern styling and comprehensive warranty coverage.",
    popular: true,
    country: "South Korea",
  },
  {
    id: "kia",
    name: "Kia",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Kia-logo.svg/2560px-Kia-logo.svg.png",
    heroImage: "https://images.unsplash.com/photo-1617654112368-307921291f42?q=80&w=1600&auto=format",
    description: "Kia's bold design and feature-packed models are gaining rapid popularity across Kenya.",
    popular: false,
    country: "South Korea",
  },
  {
    id: "isuzu",
    name: "Isuzu",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Isuzu_logo.svg/2560px-Isuzu_logo.svg.png",
    heroImage: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=1600&auto=format",
    description: "Isuzu's D-Max and commercial vehicles are workhorses of Kenya's transport and logistics industry.",
    popular: true,
    country: "Japan",
  },
  {
    id: "lexus",
    name: "Lexus",
    logo: "/assets/images/brands/lexus.png",
    heroImage: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1600&auto=format",
    description: "Lexus delivers unmatched luxury and reliability for Kenya's most discerning drivers.",
    popular: false,
    country: "Japan",
  },
  {
    id: "land-rover",
    name: "Land Rover",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Land_Rover_logo.svg/2560px-Land_Rover_logo.svg.png",
    heroImage: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=1600&auto=format",
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
    { id: "toyota-hilux", brandId: "toyota", name: "Hilux (Vigo/Revo)", image: "https://images.unsplash.com/photo-1712067969115-2c764ea3d74e?q=80&w=800&auto=format", years: "2005–2024", type: "Pickup Truck", description: "Kenya's most popular pickup truck. Legendary durability on any terrain." },
    { id: "toyota-prado", brandId: "toyota", name: "Land Cruiser Prado (J120/J150)", image: "https://images.unsplash.com/photo-1593950315186-76a92975b60c?q=80&w=800&auto=format", years: "2003–2024", type: "SUV", description: "Premium SUV combining off-road capability with luxury comfort." },
    { id: "toyota-landcruiser", brandId: "toyota", name: "Land Cruiser (V8/200/300)", image: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?q=80&w=800&auto=format", years: "2007–2024", type: "Full-Size SUV", description: "The ultimate Land Cruiser — unstoppable on any surface." },
    { id: "toyota-vitz", brandId: "toyota", name: "Vitz / Yaris", image: "https://images.unsplash.com/photo-1636761428925-58b2ec94f2f5?q=80&w=800&auto=format", years: "2005–2024", type: "Hatchback", description: "Compact, fuel-efficient city car loved across Nairobi." },
    { id: "toyota-fielder", brandId: "toyota", name: "Fielder / Corolla Wagon", image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=800&auto=format", years: "2006–2024", type: "Station Wagon", description: "Spacious and reliable family wagon popular in Kenya." },
    { id: "toyota-corolla", brandId: "toyota", name: "Corolla (E120/E150/E210)", image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=800&auto=format", years: "2002–2024", type: "Sedan", description: "The world's best-selling car — reliable, affordable, and widely available." },
    { id: "toyota-rav4", brandId: "toyota", name: "RAV4", image: "https://images.unsplash.com/photo-1568844293986-8d0400bd4745?q=80&w=800&auto=format", years: "2006–2024", type: "Compact SUV", description: "Versatile crossover SUV blending comfort with capability." },
    { id: "toyota-harrier", brandId: "toyota", name: "Harrier / Venza", image: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?q=80&w=800&auto=format", years: "2003–2024", type: "Luxury SUV", description: "Elegant and comfortable luxury crossover." },
    { id: "toyota-wish", brandId: "toyota", name: "Wish / Isis", image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=800&auto=format", years: "2003–2017", type: "MPV", description: "Popular family MPV with sliding doors and spacious interior." },
    { id: "toyota-hiace", brandId: "toyota", name: "Hiace (Van/Minibus)", image: "https://images.unsplash.com/photo-1548186035-84f2ef70e1e5?q=80&w=800&auto=format", years: "2005–2024", type: "Van / Minibus", description: "Kenya's most popular matatu and cargo van." },
    { id: "toyota-camry", brandId: "toyota", name: "Camry", image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=800&auto=format", years: "2006–2024", type: "Sedan", description: "Premium mid-size sedan with excellent comfort and reliability." },
    { id: "toyota-premio", brandId: "toyota", name: "Premio / Allion", image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=800&auto=format", years: "2001–2021", type: "Sedan", description: "Comfortable and spacious Japanese domestic market sedan." },
  ],
  nissan: [
    { id: "nissan-xtrail", brandId: "nissan", name: "X-Trail (T30/T31/T32)", image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=800&auto=format", years: "2001–2024", type: "Compact SUV", description: "Kenya's favourite Nissan SUV — capable, comfortable, and practical." },
    { id: "nissan-navara", brandId: "nissan", name: "Navara (D40/D23)", image: "https://images.unsplash.com/photo-1674739351785-ae50ea6c4890?q=80&w=800&auto=format", years: "2005–2024", type: "Pickup Truck", description: "Rugged pickup truck competing with the Hilux on Kenya's tough roads." },
    { id: "nissan-note", brandId: "nissan", name: "Note / Tiida", image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=800&auto=format", years: "2005–2020", type: "Hatchback", description: "Compact and fuel-efficient city hatchback." },
    { id: "nissan-patrol", brandId: "nissan", name: "Patrol (Y61/Y62)", image: "https://images.unsplash.com/photo-1565043666747-69f6646db940?q=80&w=800&auto=format", years: "1998–2024", type: "Full-Size SUV", description: "Legendary off-road SUV built for Kenya's toughest terrains." },
    { id: "nissan-hardbody", brandId: "nissan", name: "Hardbody (D21/D22)", image: "https://images.unsplash.com/photo-1612543012547-50da27600640?q=80&w=800&auto=format", years: "1997–2015", type: "Pickup Truck", description: "Classic workhorse pickup truck still widely used in Kenya." },
    { id: "nissan-sylphy", brandId: "nissan", name: "Sylphy / Bluebird", image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=800&auto=format", years: "2000–2024", type: "Sedan", description: "Comfortable and spacious family sedan." },
    { id: "nissan-murano", brandId: "nissan", name: "Murano", image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=800&auto=format", years: "2003–2024", type: "Mid-Size SUV", description: "Stylish and premium crossover SUV." },
  ],
  mazda: [
    { id: "mazda-demio", brandId: "mazda", name: "Demio / Mazda2", image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=800&auto=format", years: "2002–2024", type: "Hatchback", description: "Stylish and fuel-efficient compact hatchback, very popular in Kenya." },
    { id: "mazda-cx5", brandId: "mazda", name: "CX-5", image: "https://images.unsplash.com/photo-1573950940509-d924ee3fd345?q=80&w=800&auto=format", years: "2012–2024", type: "Compact SUV", description: "Award-winning SUV with stunning KODO design and SkyActiv technology." },
    { id: "mazda-cx3", brandId: "mazda", name: "CX-3", image: "https://images.unsplash.com/photo-1596726026543-8c60efebe1e0?q=80&w=800&auto=format", years: "2015–2024", type: "Subcompact SUV", description: "Sporty subcompact crossover with premium interior." },
    { id: "mazda-atenza", brandId: "mazda", name: "Atenza / Mazda6", image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=800&auto=format", years: "2002–2023", type: "Sedan/Wagon", description: "Premium mid-size sedan with elegant styling." },
    { id: "mazda-axela", brandId: "mazda", name: "Axela / Mazda3", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format", years: "2003–2024", type: "Sedan/Hatchback", description: "Sporty compact car with excellent handling." },
    { id: "mazda-bt50", brandId: "mazda", name: "BT-50", image: "https://images.unsplash.com/photo-1674739351785-ae50ea6c4890?q=80&w=800&auto=format", years: "2006–2024", type: "Pickup Truck", description: "Capable pickup truck built for work and adventure." },
    { id: "mazda-cx9", brandId: "mazda", name: "CX-9", image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=800&auto=format", years: "2007–2024", type: "Full-Size SUV", description: "Three-row family SUV with premium features." },
  ],
  honda: [
    { id: "honda-civic", brandId: "honda", name: "Civic (FD/FB/FC/FL)", image: "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?q=80&w=800&auto=format", years: "2006–2024", type: "Sedan/Hatchback", description: "Sporty and reliable compact car with excellent fuel economy." },
    { id: "honda-crv", brandId: "honda", name: "CR-V", image: "https://images.unsplash.com/photo-1568844293986-8d0400bd4745?q=80&w=800&auto=format", years: "2007–2024", type: "Compact SUV", description: "Honda's best-selling SUV — practical, spacious, and efficient." },
    { id: "honda-accord", brandId: "honda", name: "Accord (CL/CM/CU/CV)", image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=800&auto=format", years: "2003–2024", type: "Sedan", description: "Premium mid-size sedan with refined performance." },
    { id: "honda-fit", brandId: "honda", name: "Fit / Jazz", image: "https://images.unsplash.com/photo-1636761428925-58b2ec94f2f5?q=80&w=800&auto=format", years: "2001–2024", type: "Hatchback", description: "Clever packaging and fuel efficiency make this a Nairobi favourite." },
    { id: "honda-hrv", brandId: "honda", name: "HR-V / Vezel", image: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?q=80&w=800&auto=format", years: "2014–2024", type: "Subcompact SUV", description: "Stylish subcompact crossover with Honda's Magic Seat." },
    { id: "honda-pilot", brandId: "honda", name: "Pilot", image: "https://images.unsplash.com/photo-1593950315186-76a92975b60c?q=80&w=800&auto=format", years: "2003–2024", type: "Full-Size SUV", description: "Three-row family SUV with Honda's legendary reliability." },
  ],
  subaru: [
    { id: "subaru-forester", brandId: "subaru", name: "Forester (SG/SH/SJ/SK)", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format", years: "2002–2024", type: "Compact SUV", description: "Kenya's most popular Subaru — AWD capability with practical space." },
    { id: "subaru-outback", brandId: "subaru", name: "Outback (BP/BR/BS/BT)", image: "https://images.unsplash.com/photo-1507297230445-ff678f10b524?q=80&w=800&auto=format", years: "2003–2024", type: "Crossover Wagon", description: "Raised wagon with AWD for those who want more than a sedan." },
    { id: "subaru-impreza", brandId: "subaru", name: "Impreza / WRX", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format", years: "2000–2024", type: "Sedan/Hatchback", description: "Rally-bred performance car with iconic AWD system." },
    { id: "subaru-legacy", brandId: "subaru", name: "Legacy (BL/BP/BM/BN)", image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=800&auto=format", years: "2003–2024", type: "Sedan/Wagon", description: "Comfortable family car with Subaru's signature AWD." },
    { id: "subaru-xv", brandId: "subaru", name: "XV / Crosstrek", image: "https://images.unsplash.com/photo-1596726026543-8c60efebe1e0?q=80&w=800&auto=format", years: "2012–2024", type: "Subcompact SUV", description: "Raised Impreza hatchback with AWD for urban adventurers." },
    { id: "subaru-tribeca", brandId: "subaru", name: "Tribeca / B9", image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=800&auto=format", years: "2005–2014", type: "Mid-Size SUV", description: "Three-row SUV with Subaru's boxer engine and AWD." },
  ],
  mitsubishi: [
    { id: "mitsubishi-pajero", brandId: "mitsubishi", name: "Pajero (V60/V80/V90)", image: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800&auto=format", years: "1999–2024", type: "Full-Size SUV", description: "Legendary off-road SUV that has conquered Kenya's toughest roads." },
    { id: "mitsubishi-l200", brandId: "mitsubishi", name: "L200 / Triton (KB/KH/KL)", image: "https://images.unsplash.com/photo-1612543012547-50da27600640?q=80&w=800&auto=format", years: "2006–2024", type: "Pickup Truck", description: "Tough and versatile pickup truck for work and adventure." },
    { id: "mitsubishi-outlander", brandId: "mitsubishi", name: "Outlander (CU/CW/GF/GG)", image: "https://images.unsplash.com/photo-1573950940509-d924ee3fd345?q=80&w=800&auto=format", years: "2003–2024", type: "Mid-Size SUV", description: "Family-friendly SUV with optional 4WD." },
    { id: "mitsubishi-colt", brandId: "mitsubishi", name: "Colt / Mirage", image: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?q=80&w=800&auto=format", years: "2004–2024", type: "Hatchback", description: "Compact and economical city car." },
    { id: "mitsubishi-galant", brandId: "mitsubishi", name: "Galant / Lancer", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format", years: "2003–2017", type: "Sedan", description: "Sporty sedan with excellent performance." },
    { id: "mitsubishi-pajero-sport", brandId: "mitsubishi", name: "Pajero Sport / Montero Sport", image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=800&auto=format", years: "2008–2024", type: "Mid-Size SUV", description: "Capable body-on-frame SUV for serious off-roading." },
  ],
  suzuki: [
    { id: "suzuki-swift", brandId: "suzuki", name: "Swift", image: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?q=80&w=800&auto=format", years: "2005–2024", type: "Hatchback", description: "Fun-to-drive compact hatchback popular in Nairobi." },
    { id: "suzuki-vitara", brandId: "suzuki", name: "Vitara / Escudo", image: "https://images.unsplash.com/photo-1596726026543-8c60efebe1e0?q=80&w=800&auto=format", years: "2005–2024", type: "Compact SUV", description: "Compact SUV with optional 4WD for weekend adventures." },
    { id: "suzuki-jimny", brandId: "suzuki", name: "Jimny (JB43/JB74)", image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800&auto=format", years: "1998–2024", type: "Mini SUV", description: "Iconic mini 4x4 with legendary off-road capability." },
    { id: "suzuki-alto", brandId: "suzuki", name: "Alto / Celerio", image: "https://images.unsplash.com/photo-1636761428925-58b2ec94f2f5?q=80&w=800&auto=format", years: "2009–2024", type: "City Car", description: "Ultra-compact and economical city car." },
    { id: "suzuki-sx4", brandId: "suzuki", name: "SX4 / S-Cross", image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=800&auto=format", years: "2006–2024", type: "Crossover", description: "Practical crossover combining hatchback and SUV traits." },
  ],
  bmw: [
    { id: "bmw-3series", brandId: "bmw", name: "3 Series (E90/F30/G20)", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800&auto=format", years: "2005–2024", type: "Sedan", description: "The benchmark sports sedan — precise handling and premium feel." },
    { id: "bmw-5series", brandId: "bmw", name: "5 Series (E60/F10/G30)", image: "https://images.unsplash.com/photo-1617654112368-307921291f42?q=80&w=800&auto=format", years: "2003–2024", type: "Luxury Sedan", description: "Executive sedan combining performance with luxury." },
    { id: "bmw-x3", brandId: "bmw", name: "X3 (E83/F25/G01)", image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=800&auto=format", years: "2004–2024", type: "Compact SUV", description: "BMW's best-selling SUV — sporty and practical." },
    { id: "bmw-x5", brandId: "bmw", name: "X5 (E70/F15/G05)", image: "https://images.unsplash.com/photo-1508974239320-0a029497e820?q=80&w=800&auto=format", years: "2006–2024", type: "Mid-Size SUV", description: "Powerful and luxurious mid-size SUV." },
    { id: "bmw-7series", brandId: "bmw", name: "7 Series (E65/F01/G11)", image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=800&auto=format", years: "2001–2024", type: "Luxury Sedan", description: "BMW's flagship luxury sedan." },
    { id: "bmw-x6", brandId: "bmw", name: "X6 (E71/F16/G06)", image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=800&auto=format", years: "2008–2024", type: "Sports SAV", description: "Distinctive sports activity vehicle combining coupe and SUV." },
  ],
  "mercedes-benz": [
    { id: "mb-cclass", brandId: "mercedes-benz", name: "C-Class (W204/W205/W206)", image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800&auto=format", years: "2007–2024", type: "Sedan", description: "Entry-level Mercedes luxury sedan with premium features." },
    { id: "mb-eclass", brandId: "mercedes-benz", name: "E-Class (W212/W213)", image: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=800&auto=format", years: "2009–2024", type: "Sedan/Wagon", description: "Executive sedan with advanced technology and comfort." },
    { id: "mb-sclass", brandId: "mercedes-benz", name: "S-Class (W221/W222/W223)", image: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=800&auto=format", years: "2005–2024", type: "Luxury Sedan", description: "The pinnacle of Mercedes luxury and technology." },
    { id: "mb-glc", brandId: "mercedes-benz", name: "GLC-Class (X253/X254)", image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=800&auto=format", years: "2015–2024", type: "Compact SUV", description: "Compact luxury SUV with Mercedes' signature refinement." },
    { id: "mb-gle", brandId: "mercedes-benz", name: "GLE-Class / ML-Class", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format", years: "2011–2024", type: "Mid-Size SUV", description: "Premium mid-size SUV with powerful engine options." },
    { id: "mb-gclass", brandId: "mercedes-benz", name: "G-Class (W463/W464)", image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=800&auto=format", years: "1979–2024", type: "Full-Size SUV", description: "Iconic boxy SUV — the ultimate status symbol." },
  ],
  volkswagen: [
    { id: "vw-golf", brandId: "volkswagen", name: "Golf (Mk5/Mk6/Mk7/Mk8)", image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=800&auto=format", years: "2004–2024", type: "Hatchback", description: "The world's most iconic hatchback — refined, practical, and fun." },
    { id: "vw-polo", brandId: "volkswagen", name: "Polo (9N/6R/AW)", image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=800&auto=format", years: "2002–2024", type: "Subcompact", description: "Premium compact car with VW's build quality." },
    { id: "vw-tiguan", brandId: "volkswagen", name: "Tiguan (5N/AD)", image: "https://images.unsplash.com/photo-1596726026543-8c60efebe1e0?q=80&w=800&auto=format", years: "2007–2024", type: "Compact SUV", description: "VW's best-selling SUV with premium features." },
    { id: "vw-passat", brandId: "volkswagen", name: "Passat (B6/B7/B8)", image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=800&auto=format", years: "2005–2024", type: "Sedan/Wagon", description: "Spacious and comfortable family car." },
    { id: "vw-touareg", brandId: "volkswagen", name: "Touareg (7L/7P/CR)", image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=800&auto=format", years: "2002–2024", type: "Mid-Size SUV", description: "Premium SUV with VW's engineering excellence." },
  ],
  ford: [
    { id: "ford-ranger", brandId: "ford", name: "Ranger (T6/T7/T8/T9)", image: "https://images.unsplash.com/photo-1612543012547-50da27600640?q=80&w=800&auto=format", years: "2011–2024", type: "Pickup Truck", description: "Kenya's top-selling Ford — tough, capable, and feature-rich." },
    { id: "ford-everest", brandId: "ford", name: "Everest (UA/UB)", image: "https://images.unsplash.com/photo-1593950315186-76a92975b60c?q=80&w=800&auto=format", years: "2015–2024", type: "Full-Size SUV", description: "Seven-seat SUV built on the Ranger platform." },
    { id: "ford-focus", brandId: "ford", name: "Focus (C307/C346)", image: "https://images.unsplash.com/photo-1636761428925-58b2ec94f2f5?q=80&w=800&auto=format", years: "2011–2022", type: "Hatchback/Sedan", description: "Sporty European hatchback with engaging driving dynamics." },
    { id: "ford-explorer", brandId: "ford", name: "Explorer (U502/U625)", image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=800&auto=format", years: "2011–2024", type: "Full-Size SUV", description: "Three-row family SUV with Ford's EcoBoost engines." },
    { id: "ford-ecosport", brandId: "ford", name: "EcoSport", image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=800&auto=format", years: "2013–2022", type: "Subcompact SUV", description: "Compact urban SUV with raised ground clearance." },
  ],
  hyundai: [
    { id: "hyundai-tucson", brandId: "hyundai", name: "Tucson (TL/NX4)", image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=800&auto=format", years: "2009–2024", type: "Compact SUV", description: "Stylish and feature-packed compact SUV." },
    { id: "hyundai-santafe", brandId: "hyundai", name: "Santa Fe (CM/DM/TM)", image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=800&auto=format", years: "2006–2024", type: "Mid-Size SUV", description: "Family SUV with excellent value and features." },
    { id: "hyundai-elantra", brandId: "hyundai", name: "Elantra (MD/AD/CN7)", image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=800&auto=format", years: "2010–2024", type: "Sedan", description: "Sporty compact sedan with bold design." },
    { id: "hyundai-i10", brandId: "hyundai", name: "i10 / Grand i10", image: "https://images.unsplash.com/photo-1636761428925-58b2ec94f2f5?q=80&w=800&auto=format", years: "2013–2024", type: "City Car", description: "Economical city car perfect for Nairobi traffic." },
    { id: "hyundai-i20", brandId: "hyundai", name: "i20 (PB/GB/BC3)", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format", years: "2014–2024", type: "Supermini", description: "Premium supermini with European styling." },
    { id: "hyundai-creta", brandId: "hyundai", name: "Creta / ix25", image: "https://images.unsplash.com/photo-1617654112368-307921291f42?q=80&w=800&auto=format", years: "2015–2024", type: "Subcompact SUV", description: "Popular subcompact SUV with bold styling." },
  ],
  kia: [
    { id: "kia-sportage", brandId: "kia", name: "Sportage (QL/NQ5)", image: "https://images.unsplash.com/photo-1617654112368-307921291f42?q=80&w=800&auto=format", years: "2010–2024", type: "Compact SUV", description: "Stylish and practical compact SUV." },
    { id: "kia-sorento", brandId: "kia", name: "Sorento (XM/UM/MQ4)", image: "https://images.unsplash.com/photo-1573950940509-d924ee3fd345?q=80&w=800&auto=format", years: "2009–2024", type: "Mid-Size SUV", description: "Three-row family SUV with premium features." },
    { id: "kia-rio", brandId: "kia", name: "Rio (UB/YB)", image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=800&auto=format", years: "2011–2024", type: "Subcompact", description: "Affordable and stylish compact car." },
    { id: "kia-picanto", brandId: "kia", name: "Picanto (TA/JA)", image: "https://images.unsplash.com/photo-1636761428925-58b2ec94f2f5?q=80&w=800&auto=format", years: "2011–2024", type: "City Car", description: "Ultra-compact city car with big personality." },
  ],
  isuzu: [
    { id: "isuzu-dmax", brandId: "isuzu", name: "D-Max (TF/RT50)", image: "https://images.unsplash.com/photo-1712067969115-2c764ea3d74e?q=80&w=800&auto=format", years: "2002–2024", type: "Pickup Truck", description: "Kenya's most popular commercial pickup truck." },
    { id: "isuzu-mux", brandId: "isuzu", name: "MU-X", image: "https://images.unsplash.com/photo-1593950315186-76a92975b60c?q=80&w=800&auto=format", years: "2013–2024", type: "Full-Size SUV", description: "Seven-seat SUV built on the D-Max platform." },
    { id: "isuzu-nkr", brandId: "isuzu", name: "NKR / NQR (Light Truck)", image: "https://images.unsplash.com/photo-1548186035-84f2ef70e1e5?q=80&w=800&auto=format", years: "2000–2024", type: "Light Truck", description: "Kenya's most popular commercial light truck." },
    { id: "isuzu-elf", brandId: "isuzu", name: "ELF / NPR", image: "https://images.unsplash.com/photo-1616079452945-f51d546e96e6?q=80&w=800&auto=format", years: "2000–2024", type: "Medium Truck", description: "Reliable medium-duty truck for commercial use." },
  ],
  lexus: [
    { id: "lexus-rx", brandId: "lexus", name: "RX (RX300/RX350/RX450h)", image: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=800&auto=format", years: "2003–2024", type: "Luxury SUV", description: "Lexus's best-selling luxury SUV with hybrid option." },
    { id: "lexus-lx", brandId: "lexus", name: "LX (LX470/LX570/LX600)", image: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?q=80&w=800&auto=format", years: "1998–2024", type: "Full-Size Luxury SUV", description: "Lexus's flagship SUV based on Land Cruiser platform." },
    { id: "lexus-is", brandId: "lexus", name: "IS (IS250/IS300/IS350)", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800&auto=format", years: "2005–2024", type: "Luxury Sedan", description: "Sporty luxury compact sedan." },
    { id: "lexus-es", brandId: "lexus", name: "ES (ES250/ES300h/ES350)", image: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=800&auto=format", years: "2006–2024", type: "Luxury Sedan", description: "Refined and comfortable executive sedan." },
    { id: "lexus-gx", brandId: "lexus", name: "GX (GX460/GX550)", image: "https://images.unsplash.com/photo-1565043666747-69f6646db940?q=80&w=800&auto=format", years: "2009–2024", type: "Luxury SUV", description: "Body-on-frame luxury SUV with serious off-road capability." },
  ],
  "land-rover": [
    { id: "lr-discovery", brandId: "land-rover", name: "Discovery (TD5/Td6/D5)", image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=800&auto=format", years: "2004–2024", type: "Full-Size SUV", description: "Versatile seven-seat SUV with legendary off-road ability." },
    { id: "lr-defender", brandId: "land-rover", name: "Defender (90/110/130)", image: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?q=80&w=800&auto=format", years: "1983–2024", type: "Off-Road SUV", description: "The original Land Rover — built for Africa's toughest terrain." },
    { id: "lr-freelander", brandId: "land-rover", name: "Freelander (L314/L359)", image: "https://images.unsplash.com/photo-1596726026543-8c60efebe1e0?q=80&w=800&auto=format", years: "2003–2015", type: "Compact SUV", description: "Compact Land Rover with off-road capability." },
    { id: "lr-rangerover", brandId: "land-rover", name: "Range Rover (L322/L405)", image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=800&auto=format", years: "2002–2024", type: "Luxury SUV", description: "The ultimate luxury SUV — refined, powerful, and capable." },
    { id: "lr-sport", brandId: "land-rover", name: "Range Rover Sport (L320/L494)", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format", years: "2005–2024", type: "Luxury SUV", description: "Sporty Range Rover with dynamic performance." },
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
    image: "/assets/images/categories/braking.png",
    description: "Brake pads, discs, drums, calipers, hoses, and master cylinders for safe stopping power.",
    subcategories: ["Brake Pads", "Brake Discs / Rotors", "Brake Drums", "Brake Calipers", "Brake Hoses & Lines", "Master Cylinders", "Brake Boosters", "ABS Sensors"],
  },
  {
    id: "engine",
    name: "Engine Components",
    icon: "⚙️",
    image: "/assets/images/categories/engine.png",
    description: "Filters, gaskets, timing belts, pistons, camshafts, and all engine internals.",
    subcategories: ["Oil Filters", "Air Filters", "Fuel Filters", "Timing Belts & Chains", "Gaskets & Seals", "Pistons & Rings", "Camshafts & Valves", "Engine Mounts", "Radiators", "Water Pumps", "Thermostats"],
  },
  {
    id: "suspension",
    name: "Suspension & Steering",
    icon: "🚗",
    image: "/assets/images/categories/suspension.png",
    description: "Shock absorbers, springs, control arms, tie rods, and steering components.",
    subcategories: ["Shock Absorbers", "Coil Springs", "Control Arms", "Tie Rod Ends", "Ball Joints", "Stabilizer Links", "Wheel Bearings", "Steering Racks", "Power Steering Pumps", "CV Joints & Axles"],
  },
  {
    id: "electrical",
    name: "Electrical & Sensors",
    icon: "⚡",
    image: "/assets/images/categories/electrical.png",
    description: "Alternators, starters, sensors, switches, and all electrical components.",
    subcategories: ["Alternators", "Starters", "Batteries", "Ignition Coils", "Spark Plugs", "Oxygen Sensors", "MAF Sensors", "Crankshaft Sensors", "Throttle Bodies", "Fuses & Relays", "Headlights & Bulbs"],
  },
  {
    id: "transmission",
    name: "Transmission & Gearbox",
    icon: "🔧",
    image: "/assets/images/categories/transmission.png",
    description: "Clutch kits, gearbox parts, differentials, and drivetrain components.",
    subcategories: ["Clutch Kits", "Clutch Discs", "Pressure Plates", "Flywheel", "Gearbox Mounts", "Differential Parts", "Transfer Case Parts", "Transmission Fluid", "Gear Selectors"],
  },
  {
    id: "body",
    name: "Body & Exterior",
    icon: "🚘",
    image: "/assets/images/categories/bodykits.png",
    description: "Bumpers, fenders, doors, mirrors, hoods, and all exterior body panels.",
    subcategories: ["Bumpers", "Fenders", "Hoods / Bonnets", "Doors & Panels", "Side Mirrors", "Grilles", "Headlights", "Tail Lights", "Windscreens", "Door Handles & Locks"],
  },
  {
    id: "tyres",
    name: "Tyres & Wheels",
    icon: "🔵",
    image: "/assets/images/categories/tyres.png",
    description: "Tyres, alloy rims, steel wheels, wheel nuts, and tyre accessories.",
    subcategories: ["Passenger Tyres", "SUV / 4x4 Tyres", "Commercial Tyres", "Alloy Rims", "Steel Wheels", "Wheel Nuts & Bolts", "Tyre Valves", "Wheel Spacers"],
  },
  {
    id: "lubricants",
    name: "Oils & Lubricants",
    icon: "🛢️",
    image: "/assets/images/categories/lubricants.png",
    description: "Engine oils, transmission fluids, brake fluids, and all automotive lubricants.",
    subcategories: ["Engine Oil", "Gear Oil", "Brake Fluid", "Power Steering Fluid", "Coolant / Antifreeze", "Grease & Lubricants", "Fuel Additives"],
  },
  {
    id: "glass",
    name: "Glass & Windscreens",
    icon: "🪟",
    image: "/assets/images/categories/glass.png",
    description: "Windscreens, door glass, rear windows, and mirrors.",
    subcategories: ["Windscreens", "Door Glass", "Rear Windscreens", "Sunroofs", "Side Mirrors", "Wiper Blades"],
  },
  {
    id: "alloys",
    name: "Alloys & Accessories",
    icon: "✨",
    image: "/assets/images/categories/alloys.png",
    description: "Alloy wheels, rims, wheel covers, and styling accessories.",
    subcategories: ["Alloy Wheels", "Wheel Covers", "Centre Caps", "Lug Nuts", "Wheel Locks"],
  },
];

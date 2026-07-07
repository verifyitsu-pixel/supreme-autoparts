// Country → Counties / Regions / States mapping
export interface CountryData {
  name: string;
  code: string;
  regionLabel: string; // "County", "Region", "State", "Province", etc.
  regions: string[];
}

export const COUNTRIES: CountryData[] = [
  {
    name: "Kenya",
    code: "KE",
    regionLabel: "County",
    regions: [
      "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu",
      "Garissa", "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho",
      "Kiambu", "Kilifi", "Kirinyaga", "Kisii", "Kisumu", "Kitui",
      "Kwale", "Laikipia", "Lamu", "Machakos", "Makueni", "Mandera",
      "Marsabit", "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi",
      "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua", "Nyeri",
      "Samburu", "Siaya", "Taita-Taveta", "Tana River", "Tharaka-Nithi",
      "Trans Nzoia", "Turkana", "Uasin Gishu", "Vihiga", "Wajir",
      "West Pokot",
    ],
  },
  {
    name: "Uganda",
    code: "UG",
    regionLabel: "District",
    regions: [
      "Abim", "Adjumani", "Agago", "Alebtong", "Amolatar", "Amudat",
      "Amuria", "Amuru", "Apac", "Arua", "Budaka", "Bududa", "Bugiri",
      "Buhweju", "Buikwe", "Bukedea", "Bukomansimbi", "Bukwa", "Bulambuli",
      "Buliisa", "Bundibugyo", "Bunyangabu", "Bushenyi", "Busia", "Butaleja",
      "Butebo", "Buvuma", "Buyende", "Dokolo", "Gomba", "Gulu", "Hoima",
      "Ibanda", "Iganga", "Isingiro", "Jinja", "Kaabong", "Kabale",
      "Kabarole", "Kaberamaido", "Kagadi", "Kakumiro", "Kalaki", "Kalangala",
      "Kaliro", "Kalungu", "Kampala", "Kamuli", "Kamwenge", "Kanungu",
      "Kapchorwa", "Kapelebyong", "Karenga", "Kasanda", "Kasese", "Katakwi",
      "Kayunga", "Kibaale", "Kiboga", "Kibuku", "Kikuube", "Kiruhura",
      "Kiryandongo", "Kisoro", "Kitagwenda", "Kitgum", "Koboko", "Kole",
      "Kotido", "Kumi", "Kwania", "Kween", "Kyankwanzi", "Kyegegwa",
      "Kyenjojo", "Kyotera", "Lamwo", "Lira", "Luuka", "Luwero",
      "Lwengo", "Lyantonde", "Madi-Okollo", "Manafwa", "Maracha", "Masaka",
      "Masindi", "Mayuge", "Mbale", "Mbarara", "Mitooma", "Mityana",
      "Moroto", "Moyo", "Mpigi", "Mubende", "Mukono", "Nabilatuk",
      "Nakapiripirit", "Nakaseke", "Nakasongola", "Namayingo", "Namisindwa",
      "Namutumba", "Napak", "Nebbi", "Ngora", "Ntoroko", "Ntungamo",
      "Nwoya", "Obongi", "Omoro", "Otuke", "Oyam", "Pader", "Pakwach",
      "Pallisa", "Rakai", "Rubanda", "Rubirizi", "Rukiga", "Rukungiri",
      "Rwampara", "Sembabule", "Serere", "Sheema", "Sironko", "Soroti",
      "Tororo", "Wakiso", "Yumbe", "Zombo",
    ],
  },
  {
    name: "Tanzania",
    code: "TZ",
    regionLabel: "Region",
    regions: [
      "Arusha", "Dar es Salaam", "Dodoma", "Geita", "Iringa", "Kagera",
      "Katavi", "Kigoma", "Kilimanjaro", "Lindi", "Manyara", "Mara",
      "Mbeya", "Morogoro", "Mtwara", "Mwanza", "Njombe", "Pemba North",
      "Pemba South", "Pwani", "Rukwa", "Ruvuma", "Shinyanga", "Simiyu",
      "Singida", "Songwe", "Tabora", "Tanga", "Zanzibar Central/South",
      "Zanzibar North", "Zanzibar Urban/West",
    ],
  },
  {
    name: "Rwanda",
    code: "RW",
    regionLabel: "Province",
    regions: ["Kigali City", "Eastern Province", "Northern Province", "Southern Province", "Western Province"],
  },
  {
    name: "Ethiopia",
    code: "ET",
    regionLabel: "Region",
    regions: [
      "Addis Ababa", "Afar", "Amhara", "Benishangul-Gumuz", "Dire Dawa",
      "Gambela", "Harari", "Oromia", "Sidama", "Somali",
      "South Ethiopia", "South West Ethiopia", "Tigray",
    ],
  },
  {
    name: "South Africa",
    code: "ZA",
    regionLabel: "Province",
    regions: [
      "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo",
      "Mpumalanga", "Northern Cape", "North West", "Western Cape",
    ],
  },
  {
    name: "Nigeria",
    code: "NG",
    regionLabel: "State",
    regions: [
      "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa",
      "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo",
      "Ekiti", "Enugu", "FCT - Abuja", "Gombe", "Imo", "Jigawa",
      "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
      "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
      "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
    ],
  },
  {
    name: "Ghana",
    code: "GH",
    regionLabel: "Region",
    regions: [
      "Ahafo", "Ashanti", "Bono", "Bono East", "Central", "Eastern",
      "Greater Accra", "North East", "Northern", "Oti", "Savannah",
      "Upper East", "Upper West", "Volta", "Western", "Western North",
    ],
  },
  {
    name: "United Kingdom",
    code: "GB",
    regionLabel: "Region",
    regions: [
      "East Midlands", "East of England", "London", "North East England",
      "North West England", "Northern Ireland", "Scotland", "South East England",
      "South West England", "Wales", "West Midlands", "Yorkshire and the Humber",
    ],
  },
  {
    name: "United States",
    code: "US",
    regionLabel: "State",
    regions: [
      "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
      "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
      "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
      "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
      "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
      "New Hampshire", "New Jersey", "New Mexico", "New York",
      "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
      "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
      "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
      "West Virginia", "Wisconsin", "Wyoming",
    ],
  },
  {
    name: "Canada",
    code: "CA",
    regionLabel: "Province",
    regions: [
      "Alberta", "British Columbia", "Manitoba", "New Brunswick",
      "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia",
      "Nunavut", "Ontario", "Prince Edward Island", "Quebec",
      "Saskatchewan", "Yukon",
    ],
  },
  {
    name: "Australia",
    code: "AU",
    regionLabel: "State",
    regions: [
      "Australian Capital Territory", "New South Wales", "Northern Territory",
      "Queensland", "South Australia", "Tasmania", "Victoria", "Western Australia",
    ],
  },
  {
    name: "India",
    code: "IN",
    regionLabel: "State",
    regions: [
      "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
      "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
      "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
      "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
      "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
      "Uttar Pradesh", "Uttarakhand", "West Bengal",
      "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli",
      "Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh",
      "Lakshadweep", "Puducherry",
    ],
  },
  {
    name: "Germany",
    code: "DE",
    regionLabel: "State",
    regions: [
      "Baden-Württemberg", "Bavaria", "Berlin", "Brandenburg", "Bremen",
      "Hamburg", "Hesse", "Lower Saxony", "Mecklenburg-Vorpommern",
      "North Rhine-Westphalia", "Rhineland-Palatinate", "Saarland",
      "Saxony", "Saxony-Anhalt", "Schleswig-Holstein", "Thuringia",
    ],
  },
  {
    name: "Other",
    code: "OT",
    regionLabel: "Region",
    regions: ["Please specify in address field"],
  },
];

export function getCountryData(name: string): CountryData | undefined {
  return COUNTRIES.find(c => c.name === name);
}

export const COUNTRY_NAMES = COUNTRIES.map(c => c.name);

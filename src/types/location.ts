export type Province =
  | "Bangkok"
  | "Samut Prakan"
  | "Nonthaburi"
  | "Pathum Thani"
  | "Samut Sakhon"
  | "Nakhon Pathom";

export interface LocationData {
  readonly [key: string]: readonly string[];
}

export const BANGKOK_DISTRICTS = [
  "Bang Rak",
  "Pathum Wan",
  "Sathon",
  "Bangkok Noi",
  "Bangkok Yai",
  "Din Daeng",
  "Huai Khwang",
  "Phra Nakhon",
  "Pom Prap Sattru Phai",
  "Samphanthawong",
  "Phaya Thai",
  "Ratchathewi",
  "Bang Sue",
  "Dusit",
  "Chatuchak",
  "Lat Phrao",
  "Lak Si",
  "Don Mueang",
  "Sai Mai",
  "Bang Khen",
  "Min Buri",
  "Khlong Sam Wa",
  "Nong Chok",
  "Lat Krabang",
  "Prawet",
  "Suan Luang",
  "Khan Na Yao",
  "Bang Kapi",
  "Wang Thonglang",
  "Bueng Kum",
  "Saphan Sung",
  "Bang Na",
  "Phra Khanong",
  "Watthana",
  "Khlong Toei",
  "Yan Nawa",
  "Bang Kho Laem",
  "Thon Buri",
  "Khlong San",
  "Chom Thong",
  "Rat Burana",
  "Thung Khru",
  "Bang Khun Thian",
  "Bang Bon",
  "Bang Khae",
  "Phasi Charoen",
  "Nong Khaem",
  "Taling Chan",
  "Thawi Watthana",
] as const;

export const PERIPHERAL_PROVINCES: LocationData = {
  "Samut Prakan": [
    "Mueang Samut Prakan",
    "Phra Pradaeng",
    "Phra Samut Chedi",
    "Bang Bo",
    "Bang Phli",
    "Bang Sao Thong",
  ],
  Nonthaburi: [
    "Mueang Nonthaburi",
    "Bang Kruai",
    "Bang Yai",
    "Bang Bua Thong",
    "Sai Noi",
    "Pak Kret",
  ],
  "Pathum Thani": [
    "Mueang Pathum Thani",
    "Khlong Luang",
    "Thanyaburi",
    "Lam Luk Ka",
    "Lat Lum Kaeo",
    "Sam Khok",
    "Nong Suea",
  ],
  "Samut Sakhon": ["Mueang Samut Sakhon", "Krathum Baen", "Ban Phaeo"],
  "Nakhon Pathom": [
    "Mueang Nakhon Pathom",
    "Kamphaeng Saen",
    "Nakhon Chai Si",
    "Don Tum",
    "Bang Len",
    "Sam Phran",
    "Phutthamonthon",
  ],
  Bangkok: BANGKOK_DISTRICTS,
} as const;

export type BangkokDistrict = (typeof BANGKOK_DISTRICTS)[number];

export const STORE_WHATSAPP = "2349072639842";

export const BANK = {
  bank: "Guaranty Trust Bank",
  accountName: "Fzmobile",
  accountNumber: "0123456789",
};

export function whatsappHref(orderId?: string) {
  const text = orderId
    ? `Hi Fzmobile, I need help with order ${orderId}`
    : "Hi Fzmobile, I have a question";
  return `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(text)}`;
}

export const NG_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

export const COUNTRIES = ["Nigeria", "Ghana", "United Kingdom", "United States", "Canada"];

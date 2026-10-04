export const PHONE_DISPLAY = "0755 563 098";
export const PHONE_TEL = "+94755563098";
export const WHATSAPP_NUMBER = "94755563098";

// Location
export const LOCATION_COORDS = "6.8895287,79.8725011";
export const LOCATION_URL = "https://www.google.com/maps?q=6.8895287,79.8725011";
export const LOCATION_EMBED_URL = "https://www.google.com/maps?q=6.8895287,79.8725011&z=17&output=embed";

export function whatsappLink(message) {
  const text = encodeURIComponent(
    message ||
      "Ayubowan! I'd like to pre-book a driver from Drive & Safe Drive Home."
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

export function mapsLink() {
  return LOCATION_URL;
}
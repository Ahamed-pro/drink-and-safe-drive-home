export const PHONE_DISPLAY = "0755 563 098";
export const PHONE_TEL = "+94755563098";
export const WHATSAPP_NUMBER = "94755563098";


export function whatsappLink(message) {
  const text = encodeURIComponent(
    message ||
      "Ayubowan! I'd like to pre-book a driver from Drive & Safe Drive Home."
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}


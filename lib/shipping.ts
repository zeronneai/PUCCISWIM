// Single source of truth for delivery. Two options now, not pickup only:
// shipping (the real charge is applied by Shopify at checkout, the site only
// displays the rates) and free local pickup at KISSLAB in El Paso.
//
// IMPORTANT: the free-shipping promise is product-neutral on purpose. Always
// say "items" or "pieces", never "swimsuits", "sets" or "bikinis", so the
// promise still holds when tees or other products are added. All shipping copy
// reads `freeLabel` from here instead of hardcoding it.
export const DELIVERY = {
  shipping: {
    standard: { label: "Standard shipping", price: 6 },
    priority: { label: "Priority shipping", price: 12 },
    freeAtItems: 2,
    freeThreshold: 78, // dollar equivalent while every item is $39
    freeLabel: "Free shipping on 2 or more items",
  },
  pickup: {
    storeName: "KISSLAB",
    price: 0,
    address: "344 Vin Rambla Dr B-1, El Paso, TX 79912",
    hours: [
      "Mon, Wed to Sat: 11:00 AM to 6:00 PM",
      "Sunday: 12:00 PM to 6:00 PM",
      "Closed Tuesdays",
    ],
    note: "El Paso only",
    // Operational data folded in from the old lib/pickup.ts so this stays the
    // one place to edit delivery info.
    storeLogo:
      "https://res.cloudinary.com/dsprn0ew4/image/upload/f_auto,q_auto,w_240/v1785272658/KISSLAB_jo3f4w.png",
    mapsUrl: "https://maps.google.com/?q=344+Vin+Rambla+Dr+B-1+El+Paso+TX+79912",
    holdDays: 7,
    contactIg: "@pucciiswim",
  },
};

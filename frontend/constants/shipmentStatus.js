/** Mirrors backend `ShipmentStatus` in `backend/src/models/shipmentsModel.ts` */
export const ShipmentStatus = {
  Pending: "Pending",
  Picked: "Picked",
  Shipped: "Shipped",
  Delivered: "Delivered",
  Received: "Received",
};

/** Chronological order — matches backend `ShipmentStatus` progression. */
export const STATES_ORDERED = [
  ShipmentStatus.Pending,
  ShipmentStatus.Picked,
  ShipmentStatus.Shipped,
  ShipmentStatus.Delivered,
  ShipmentStatus.Received,
];

export function coerceShipmentStatus(raw) {
  if (typeof raw !== "string") {
    return ShipmentStatus.Pending;
  }
  const allowed = Object.values(ShipmentStatus);
  return allowed.includes(raw) ? raw : ShipmentStatus.Pending;
}

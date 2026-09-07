import { doc, runTransaction } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Returns the required fields missing from a driver.
 *
 * Driver requirements:
 * - Full name
 * - Contact number
 * - National ID
 *
 * Profile picture is intentionally NOT required because
 * Firebase Storage is not being used.
 */
export function driverMissingFields(driver) {
  const missing = [];

  if (!driver?.fullName?.trim()) {
    missing.push("driver name");
  }

  if (!driver?.phone?.trim()) {
    missing.push("contact number");
  }

  if (!driver?.nationalId?.trim()) {
    missing.push("national ID number");
  }

  return missing;
}

/**
 * A driver is verified when all required information exists.
 */
export function isDriverVerified(driver) {
  return driverMissingFields(driver).length === 0;
}

/**
 * A driver can be assigned when:
 * - They are not deactivated
 * - Their status is available
 * - Their required information is complete
 */
export function isDriverAssignable(driver) {
  return (
    driver?.active !== false &&
    (driver?.status || "available") === "available" &&
    isDriverVerified(driver)
  );
}

/**
 * Assign a driver to a booking using a Firestore transaction.
 *
 * The transaction prevents two admins from assigning
 * the same driver at the same time.
 */
export async function assignDriverToBooking(bookingId, driverId) {
  const bookingRef = doc(db, "bookings", bookingId);
  const driverRef = doc(db, "drivers", driverId);

  await runTransaction(db, async (tx) => {
    const bookingSnap = await tx.get(bookingRef);
    const driverSnap = await tx.get(driverRef);

    if (!bookingSnap.exists()) {
      throw new Error("Booking no longer exists.");
    }

    if (!driverSnap.exists()) {
      throw new Error("Driver no longer exists.");
    }

    const booking = bookingSnap.data();
    const driver = driverSnap.data();

    // Driver must be active.
    if (driver.active === false) {
      throw new Error("This driver has been deactivated.");
    }

    // Driver must have the required information.
    const missing = driverMissingFields(driver);

    if (missing.length > 0) {
      throw new Error(
        `This driver's profile is incomplete (missing: ${missing.join(", ")}).`
      );
    }

    // Driver must be available unless they are already assigned
    // to this exact booking.
    if (
      (driver.status || "available") !== "available" &&
      booking.assignedDriverId !== driverId
    ) {
      throw new Error("This driver is currently busy with another ride.");
    }

    // If this booking already has another driver,
    // free that driver first.
    if (
      booking.assignedDriverId &&
      booking.assignedDriverId !== driverId
    ) {
      const previousDriverRef = doc(
        db,
        "drivers",
        booking.assignedDriverId
      );

      const previousDriverSnap = await tx.get(previousDriverRef);

      if (previousDriverSnap.exists()) {
        tx.update(previousDriverRef, {
          status: "available",
          currentBookingId: null,
        });
      }
    }

    // Mark the new driver as busy.
    tx.update(driverRef, {
      status: "busy",
      currentBookingId: bookingId,
    });

    // Confirm the booking.
    tx.update(bookingRef, {
      assignedDriverId: driverId,
      status: "confirmed",
    });
  });
}

/**
 * Remove the assigned driver from a booking
 * and make that driver available again.
 */
export async function unassignDriverFromBooking(bookingId) {
  const bookingRef = doc(db, "bookings", bookingId);

  await runTransaction(db, async (tx) => {
    const bookingSnap = await tx.get(bookingRef);

    if (!bookingSnap.exists()) {
      throw new Error("Booking no longer exists.");
    }

    const booking = bookingSnap.data();

    if (booking.assignedDriverId) {
      const driverRef = doc(
        db,
        "drivers",
        booking.assignedDriverId
      );

      const driverSnap = await tx.get(driverRef);

      if (driverSnap.exists()) {
        tx.update(driverRef, {
          status: "available",
          currentBookingId: null,
        });
      }
    }

    tx.update(bookingRef, {
      assignedDriverId: null,
      status: "pending",
    });
  });
}

/**
 * Complete or cancel a booking and free its driver.
 */
export async function finishBooking(bookingId, finalStatus) {
  if (!["completed", "cancelled"].includes(finalStatus)) {
    throw new Error(
      "finalStatus must be 'completed' or 'cancelled'."
    );
  }

  const bookingRef = doc(db, "bookings", bookingId);

  await runTransaction(db, async (tx) => {
    const bookingSnap = await tx.get(bookingRef);

    if (!bookingSnap.exists()) {
      throw new Error("Booking no longer exists.");
    }

    const booking = bookingSnap.data();

    if (booking.assignedDriverId) {
      const driverRef = doc(
        db,
        "drivers",
        booking.assignedDriverId
      );

      const driverSnap = await tx.get(driverRef);

      if (driverSnap.exists()) {
        tx.update(driverRef, {
          status: "available",
          currentBookingId: null,
        });
      }
    }

    tx.update(bookingRef, {
      status: finalStatus,
    });
  });
}

/**
 * Update an intermediate booking status without
 * changing the driver's assignment.
 *
 * Examples:
 * - on_the_way
 * - arrived
 * - started
 */
export async function setBookingStatus(bookingId, status) {
  const bookingRef = doc(db, "bookings", bookingId);

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(bookingRef);

    if (!snap.exists()) {
      throw new Error("Booking no longer exists.");
    }

    tx.update(bookingRef, {
      status,
    });
  });
}
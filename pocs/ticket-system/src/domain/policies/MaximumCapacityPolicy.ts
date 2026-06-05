import { Show } from "../Show";
import { SeatSelection } from "../SeatSelection";
import { CapacityPolicy } from "./CapacityPolicy";

export class MaximumCapacityPolicy implements CapacityPolicy {
  assertAllowed(show: Show, selections: SeatSelection[]): void {
    const remainingByZone = new Map(
      show
        .capacitySnapshots()
        .map((snapshot) => [snapshot.zone, snapshot.available]),
    );
    const requestedByZone = new Map<string, number>();

    for (const selection of selections) {
      const zone = selection.zone.asString();
      requestedByZone.set(zone, (requestedByZone.get(zone) ?? 0) + 1);
    }

    for (const [zone, requested] of requestedByZone.entries()) {
      const remaining = remainingByZone.get(zone);

      if (remaining === undefined) {
        throw new Error(`Zone ${zone} does not exist`);
      }

      if (requested > remaining) {
        throw new Error(
          `Zone ${zone} has only ${remaining} available seats but ${requested} were requested`,
        );
      }
    }
  }
}

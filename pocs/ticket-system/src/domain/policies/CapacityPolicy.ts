import { Show } from "../Show";
import { SeatSelection } from "../SeatSelection";

export interface CapacityPolicy {
  assertAllowed(show: Show, selections: SeatSelection[]): void;
}

import { Seat, SeatStatus } from "./types";

export function generateSeats(
  rows: number,
  seatsPerRow: number,
  availableCount: number,
  exitRows: number[],
  businessClassRows: number,
): Seat[] {
  const cols = ["A", "B", "C", "D", "E", "F"].slice(0, seatsPerRow);
  const seats: Seat[] = [];
  let availableRemaining = availableCount;
  const totalSeats = rows * seatsPerRow;
  const occupiedCount = totalSeats - availableCount;
  let occupiedAssigned = 0;

  for (let row = 1; row <= rows; row++) {
    for (const col of cols) {
      const id = `${row}${col}`;
      let status: SeatStatus;

      if (row <= businessClassRows) {
        status = "business";
      } else if (exitRows.includes(row)) {
        status = "exit";
      } else if (availableRemaining > 0) {
        const shouldBeAvailable =
          occupiedAssigned >= occupiedCount ||
          (availableRemaining /
            (availableRemaining + (occupiedCount - occupiedAssigned)) >
            0.5 &&
            (row + col.charCodeAt(0)) % 3 !== 0);

        if (shouldBeAvailable) {
          status = "available";
          availableRemaining--;
        } else {
          status = "occupied";
          occupiedAssigned++;
        }
      } else {
        status = "occupied";
        occupiedAssigned++;
      }

      seats.push({ id, row, col, status });
    }
  }
  return seats;
}

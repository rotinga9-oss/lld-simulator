import { useState, useEffect, useRef } from "react";

// ─── AD BANNER COMPONENT ─────────────────────────────────────────────────────
// Replace XXXXXXXXXX with your real AdSense publisher ID + slot IDs after approval.
// Until then, the placeholder boxes show where ads will appear.
const ADSENSE_ENABLED = false; // ← flip to true after AdSense approval
const PUBLISHER_ID = "ca-pub-XXXXXXXXXX"; // ← your publisher ID here

function AdBanner({ slot, label = "Advertisement", height = 90, format = "auto" }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ADSENSE_ENABLED) return;
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
  }, []);

  if (!ADSENSE_ENABLED) {
    // Visible placeholder — remove this block once AdSense is live
    return (
      <div style={{
        width: "100%", height, background: "#f1f5f9",
        border: "2px dashed #cbd5e1", borderRadius: 8,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#94a3b8", fontSize: 13, fontWeight: 500,
        margin: "16px 0", flexDirection: "column", gap: 4
      }}>
        <span>📢 {label}</span>
        <span style={{ fontSize: 11 }}>Ad slot {slot} — will show after AdSense approval</span>
      </div>
    );
  }

  return (
    <div style={{ margin: "16px 0", textAlign: "center", minHeight: height }}>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

// ─── PROBLEM BANK ────────────────────────────────────────────────────────────
const PROBLEMS = [
  {
    id: "parking",
    title: "Parking Lot System",
    difficulty: "Medium",
    tag: "Classic",
    minutes: 40,
    statement: `Design a multi-level Parking Lot system.

Requirements:
• Multiple floors, each with parking spots
• Support vehicle types: Bike, Car, Truck
• Each vehicle type maps to a spot type (Motorcycle / Compact / Large)
• Entry gate issues a ticket with entry time
• Exit gate calculates fee and processes payment (Cash or Card)
• Find the nearest available spot on entry`,
    interviewerAnswers: {
      "How many floors / spots?": "Assume up to 5 floors, ~200 spots each. Design should be configurable.",
      "Concurrency needed?": "Not required for this round — single-threaded is fine.",
      "Pricing model?": "Hourly rate, different per vehicle type. Keep it simple.",
      "Multiple gates?": "Yes, multiple entry and exit gates.",
      "Reservations?": "Out of scope for now.",
    },
    rubric: {
      clarify: {
        label: "Clarifying Questions",
        checks: [
          { text: "Asked about vehicle / spot types", keywords: ["vehicle", "type", "bike", "car", "truck", "spot"] },
          { text: "Asked about payment methods", keywords: ["payment", "cash", "card", "pay"] },
          { text: "Asked about number of floors / scale", keywords: ["floor", "scale", "how many", "size", "capacity"] },
          { text: "Asked about concurrency", keywords: ["concurrent", "concurrency", "parallel", "thread", "race"] },
          { text: "Asked about pricing model", keywords: ["price", "pricing", "hourly", "flat", "fee", "rate"] },
          { text: "Asked about multiple gates", keywords: ["gate", "entry", "exit", "multiple"] },
        ],
        tip: "A senior engineer always clarifies scope before touching the whiteboard. Aim for 4-5 focused questions.",
      },
      entities: {
        label: "Core Entities",
        checks: [
          { text: "ParkingLot (top-level container)", keywords: ["parkinglot", "parking lot", "lot"] },
          { text: "ParkingFloor / Level", keywords: ["floor", "level", "storey"] },
          { text: "ParkingSpot (with type)", keywords: ["spot", "space", "slot", "bay", "parkingspot"] },
          { text: "Vehicle (base + subtypes)", keywords: ["vehicle", "car", "bike", "truck"] },
          { text: "Ticket (entry record)", keywords: ["ticket", "token", "receipt"] },
          { text: "Payment abstraction", keywords: ["payment", "cash", "card"] },
        ],
        tip: "Extract entities from the nouns in your use cases. Gate and DisplayBoard are bonus entities.",
      },
      relationships: {
        label: "Relationships",
        checks: [
          { text: "ParkingLot has-many Floors (composition)", keywords: ["parkinglot", "floor", "has", "contain", "composit"] },
          { text: "Floor has-many Spots (composition)", keywords: ["floor", "spot", "has", "contain", "composit"] },
          { text: "Spot optionally has-a Vehicle (association)", keywords: ["spot", "vehicle", "associat", "optional", "assign"] },
          { text: "Ticket references Spot + Vehicle + time", keywords: ["ticket", "spot", "vehicle", "time"] },
          { text: "Mentioned is-a for Vehicle subtypes", keywords: ["extends", "inherits", "is-a", "subclass", "car", "bike"] },
        ],
        tip: "Always state composition vs aggregation explicitly. ParkingLot owns floors (composition) — if the lot is destroyed, floors go too.",
      },
      patterns: {
        label: "Design Patterns",
        checks: [
          { text: "Singleton for ParkingLot", keywords: ["singleton", "single instance", "one instance", "parkinglot"] },
          { text: "Strategy for Payment", keywords: ["strategy", "payment", "interchangeable", "pluggable"] },
          { text: "Factory for Vehicle or Spot creation", keywords: ["factory", "creat", "instantiat"] },
          { text: "State for Spot (AVAILABLE / OCCUPIED)", keywords: ["state", "available", "occupied", "status", "reserved"] },
          { text: "Explained *why* each pattern fits", keywords: ["because", "since", "allows", "enables", "reason", "swap", "runtime"] },
        ],
        tip: "Don't just list patterns — justify them. 'I'm using Strategy for payment because we need to swap Cash/Card at runtime.'",
      },
      design: {
        label: "Class Design / Interfaces",
        checks: [
          { text: "parkVehicle(vehicle) → Ticket", keywords: ["parkvehicle", "park", "vehicle", "ticket"] },
          { text: "unparkVehicle(ticket) → fee", keywords: ["unpark", "exit", "ticket", "fee", "payment"] },
          { text: "findAvailableSpot(vehicleType) → Spot", keywords: ["find", "available", "spot", "type"] },
          { text: "PaymentStrategy interface", keywords: ["calculatefee", "calculate", "processpayment", "process", "interface", "strategy"] },
          { text: "Spot: assignVehicle() + removeVehicle()", keywords: ["assign", "remove", "spot", "vehicle"] },
        ],
        tip: "Design the interface (contract) before the class internals.",
      },
      flow: {
        label: "Use Case: Vehicle Parks",
        checks: [
          { text: "Gate receives vehicle", keywords: ["gate", "entry", "arrive", "enter"] },
          { text: "System finds available spot matching type", keywords: ["find", "available", "spot", "type", "match"] },
          { text: "Spot is assigned to vehicle", keywords: ["assign", "reserve", "occupy"] },
          { text: "Ticket created with entry time + spot info", keywords: ["ticket", "time", "spot", "creat", "issu"] },
          { text: "Edge case: no spots available", keywords: ["full", "no spot", "exception", "error", "unavailable", "null", "optional"] },
        ],
        tip: "Always handle the unhappy path. What happens if the lot is full?",
      },
    },
    ideal: `// ── Enums ──────────────────────────────────────────────
enum VehicleType  { BIKE, CAR, TRUCK }
enum SpotType     { MOTORCYCLE, COMPACT, LARGE }
enum SpotStatus   { AVAILABLE, OCCUPIED, RESERVED }

// ── Vehicle hierarchy ───────────────────────────────────
abstract class Vehicle {
    String licensePlate;
    VehicleType type;
    abstract SpotType requiredSpotType();
}
class Car   extends Vehicle { SpotType requiredSpotType() { return COMPACT; } }
class Bike  extends Vehicle { SpotType requiredSpotType() { return MOTORCYCLE; } }
class Truck extends Vehicle { SpotType requiredSpotType() { return LARGE; } }

// ── Spot — State pattern ────────────────────────────────
class ParkingSpot {
    String spotId;
    SpotType type;
    SpotStatus status = AVAILABLE;
    Vehicle parkedVehicle;

    boolean isAvailable()         { return status == AVAILABLE; }
    void assignVehicle(Vehicle v) { parkedVehicle = v; status = OCCUPIED; }
    void removeVehicle()          { parkedVehicle = null; status = AVAILABLE; }
}

// ── Floor ───────────────────────────────────────────────
class ParkingFloor {
    int floorNumber;
    List<ParkingSpot> spots;

    Optional<ParkingSpot> findSpot(SpotType type) {
        return spots.stream()
            .filter(s -> s.type == type && s.isAvailable())
            .findFirst();
    }
}

// ── Ticket ──────────────────────────────────────────────
class Ticket {
    String ticketId;
    Vehicle vehicle;
    ParkingSpot spot;
    Instant entryTime;
    Instant exitTime;
}

// ── Payment — Strategy pattern ──────────────────────────
interface PaymentStrategy {
    double calculateFee(Ticket ticket, double hourlyRate);
    boolean processPayment(double amount);
}
class CashPayment implements PaymentStrategy { ... }
class CardPayment implements PaymentStrategy { ... }

// ── ParkingLot — Singleton ──────────────────────────────
class ParkingLot {
    private static ParkingLot instance;
    List<ParkingFloor> floors;
    Map<VehicleType, Double> hourlyRates;

    public static synchronized ParkingLot getInstance() { ... }

    Ticket parkVehicle(Vehicle vehicle) {
        for (ParkingFloor floor : floors) {
            Optional<ParkingSpot> spot = floor.findSpot(vehicle.requiredSpotType());
            if (spot.isPresent()) {
                spot.get().assignVehicle(vehicle);
                return new Ticket(vehicle, spot.get(), Instant.now());
            }
        }
        throw new ParkingLotFullException();
    }

    double unparkVehicle(Ticket ticket, PaymentStrategy payment) {
        ticket.exitTime = Instant.now();
        double fee = payment.calculateFee(ticket, hourlyRates.get(ticket.vehicle.type));
        payment.processPayment(fee);
        ticket.spot.removeVehicle();
        return fee;
    }
}`,
  },
  {
    id: "bookMyShow",
    title: "BookMyShow (Movie Tickets)",
    difficulty: "Hard",
    tag: "Concurrency",
    minutes: 45,
    statement: `Design a movie ticket booking system like BookMyShow.

Requirements:
• Users search for movies by city / genre / language
• View shows: theatre, screen, time, available seats
• Select seats and book them
• Prevent double-booking (two users can't book the same seat)
• Support cancellation with refund
• Multiple payment methods`,
    interviewerAnswers: {
      "Seat categories?": "Three: Silver, Gold, Platinum — each with different pricing.",
      "How to prevent double-booking?": "Use seat locking. Lock seats for 10 min while user pays.",
      "Cancellation policy?": "Full refund if cancelled 2+ hours before show. 50% otherwise.",
      "Notifications?": "Yes — email/SMS on booking confirmed or cancelled.",
    },
    rubric: {
      clarify: {
        label: "Clarifying Questions",
        checks: [
          { text: "Asked about seat categories / pricing", keywords: ["seat", "category", "tier", "gold", "silver", "platinum", "price"] },
          { text: "Asked about concurrent booking / double-booking", keywords: ["concurrent", "double", "lock", "race", "two users", "same seat"] },
          { text: "Asked about cancellation policy", keywords: ["cancel", "refund", "policy"] },
          { text: "Asked about scale", keywords: ["scale", "city", "how many", "users", "traffic"] },
          { text: "Asked about notifications", keywords: ["notif", "email", "sms", "alert"] },
          { text: "Asked about payment methods", keywords: ["payment", "upi", "card", "cash", "method"] },
        ],
        tip: "The concurrency question is the SDE2→SDE3 differentiator here.",
      },
      entities: {
        label: "Core Entities",
        checks: [
          { text: "Movie", keywords: ["movie", "film"] },
          { text: "Theatre + Screen (separate entities!)", keywords: ["theatre", "theater", "screen", "hall"] },
          { text: "Show (Movie + Screen + Time — the pivot)", keywords: ["show", "screening", "showtime"] },
          { text: "Seat (with category + status)", keywords: ["seat"] },
          { text: "Booking / Reservation", keywords: ["booking", "reservation", "ticket"] },
          { text: "User", keywords: ["user", "customer"] },
        ],
        tip: "A Show is NOT a Movie. Show = Movie × Screen × Time. This is the most common mistake.",
      },
      relationships: {
        label: "Relationships",
        checks: [
          { text: "Theatre has-many Screens", keywords: ["theatre", "screen", "has", "contain"] },
          { text: "Screen has-many Seats", keywords: ["screen", "seat", "has", "contain"] },
          { text: "Show references Movie + Screen + DateTime", keywords: ["show", "movie", "screen", "time"] },
          { text: "Booking references Show + User + List<Seat>", keywords: ["booking", "show", "user", "seat"] },
          { text: "Seat has a status (AVAILABLE/LOCKED/BOOKED)", keywords: ["seat", "status", "available", "locked", "booked"] },
        ],
        tip: "Show is the central pivot. Everything connects through it.",
      },
      patterns: {
        label: "Design Patterns",
        checks: [
          { text: "Strategy for Payment", keywords: ["strategy", "payment", "interchangeable"] },
          { text: "Observer for notifications", keywords: ["observer", "notif", "event", "listen", "subscriber"] },
          { text: "State for Seat (AVAILABLE → LOCKED → BOOKED)", keywords: ["state", "available", "locked", "booked", "seat"] },
          { text: "Singleton for BookingService", keywords: ["singleton", "bookingservice", "pricing"] },
          { text: "Explained seat-locking mechanism", keywords: ["lock", "timeout", "ttl", "expire", "10 min", "window"] },
        ],
        tip: "The seat-locking flow is an implicit State machine. Name it.",
      },
      design: {
        label: "Class Design / Interfaces",
        checks: [
          { text: "searchMovies(city, filters) → List<Movie>", keywords: ["search", "movie", "city", "filter"] },
          { text: "getAvailableShows(movieId, date) → List<Show>", keywords: ["show", "available", "get", "list"] },
          { text: "lockSeats(showId, seatIds, userId) → lockId", keywords: ["lock", "seat", "show"] },
          { text: "confirmBooking(lockId, payment) → Booking", keywords: ["confirm", "booking", "lock", "payment"] },
          { text: "cancelBooking(bookingId) → Refund", keywords: ["cancel", "booking", "refund"] },
        ],
        tip: "The two-step lock → confirm flow is the key insight. It prevents double-booking without holding DB locks during payment.",
      },
      flow: {
        label: "Use Case: User Books 2 Seats",
        checks: [
          { text: "User selects show and picks seats", keywords: ["select", "pick", "choose", "seat", "show"] },
          { text: "Seats are locked temporarily", keywords: ["lock", "temporary", "reserve", "unavailable"] },
          { text: "User completes payment within time window", keywords: ["payment", "time", "window", "timeout"] },
          { text: "On success: seats BOOKED, Booking created", keywords: ["success", "booked", "confirm", "booking"] },
          { text: "On timeout / failure: seats released", keywords: ["timeout", "fail", "release", "available", "expire"] },
        ],
        tip: "Always close the loop on the failure path — 3 failure modes: payment fails, timeout, seat unavailable.",
      },
    },
    ideal: `// ── Enums ──────────────────────────────────────────────
enum SeatCategory  { SILVER, GOLD, PLATINUM }
enum SeatStatus    { AVAILABLE, LOCKED, BOOKED, CANCELLED }
enum BookingStatus { PENDING, CONFIRMED, CANCELLED }

// ── Core entities ───────────────────────────────────────
class Movie   { String id, title, language, genre; int durationMin; }
class Theatre { String id, name; City city; List<Screen> screens; }
class Screen  { String id; List<Seat> seats; }
class Seat    { String id, row; int number; SeatCategory category; SeatStatus status; }

// Show = Movie × Screen × Time  (pivot entity)
class Show {
    String id;
    Movie movie; Screen screen;
    LocalDateTime startTime;
    Map<String, Seat> seats;
    Map<SeatCategory, Double> pricing;
}

class Booking {
    String id; User user; Show show;
    List<Seat> seats; BookingStatus status;
    Payment payment; LocalDateTime bookedAt;
}

// ── Two-step: lock → confirm ────────────────────────────
class BookingService {  // Singleton
    String lockSeats(String showId, List<String> seatIds, User user) {
        Show show = showRepo.findById(showId);
        synchronized(show) {
            for (String id : seatIds)
                if (show.seats.get(id).status != AVAILABLE)
                    throw new SeatsUnavailableException();
            seatIds.forEach(id -> show.seats.get(id).status = LOCKED);
        }
        // Store lockId in Redis with 10-min TTL
        return cache.set(lockId, new LockInfo(...), Duration.ofMinutes(10));
    }

    Booking confirmBooking(String lockId, PaymentStrategy payment) {
        LockInfo lock = cache.get(lockId);  // throws if expired
        payment.processPayment(calculateTotal(lock));
        lock.seats.forEach(s -> s.status = BOOKED);
        Booking b = new Booking(...);
        notifyObservers(new BookingConfirmedEvent(b));  // Observer
        return b;
    }
}

interface PaymentStrategy { boolean processPayment(double amount); }
interface BookingObserver  { void onEvent(BookingEvent e); }
class EmailNotifier implements BookingObserver { ... }
class SMSNotifier   implements BookingObserver { ... }`,
  },
  {
    id: "chess",
    title: "Chess",
    difficulty: "Hard",
    tag: "Patterns",
    minutes: 40,
    statement: `Design a two-player Chess game.

Requirements:
• Standard chess rules (all piece types, valid moves)
• Two human players take turns
• Detect check, checkmate, and stalemate
• Support move history with undo
• Display board after each move`,
    interviewerAnswers: {
      "AI opponent needed?": "No — two human players only.",
      "Which chess variant?": "Standard FIDE rules.",
      "Undo / redo?": "Yes, support undo of the last move.",
      "Persistence?": "Out of scope.",
    },
    rubric: {
      clarify: {
        label: "Clarifying Questions",
        checks: [
          { text: "Asked about AI vs human players", keywords: ["ai", "computer", "human", "player", "opponent"] },
          { text: "Asked about chess variant / rules", keywords: ["variant", "rules", "fide", "standard", "castling", "en passant"] },
          { text: "Asked about undo / move history", keywords: ["undo", "history", "replay", "move"] },
          { text: "Asked about persistence / save", keywords: ["save", "persist", "store", "load"] },
          { text: "Asked about game termination conditions", keywords: ["checkmate", "stalemate", "draw", "resign", "end"] },
        ],
        tip: "Asking about castling and en passant signals chess domain knowledge and thoroughness.",
      },
      entities: {
        label: "Core Entities",
        checks: [
          { text: "Game (orchestrator)", keywords: ["game"] },
          { text: "Board (8×8 grid)", keywords: ["board", "grid"] },
          { text: "Cell / Square", keywords: ["cell", "square", "position"] },
          { text: "Piece base class + 6 subtypes", keywords: ["piece", "king", "queen", "rook", "bishop", "knight", "pawn"] },
          { text: "Player (with color)", keywords: ["player", "white", "black", "color"] },
          { text: "Move (from, to, captured piece)", keywords: ["move", "from", "to"] },
        ],
        tip: "Move should be a first-class entity — it enables undo and history without extra effort.",
      },
      relationships: {
        label: "Relationships",
        checks: [
          { text: "Board has 8×8 Cells (composition)", keywords: ["board", "cell", "8x8", "composit", "grid"] },
          { text: "Cell optionally has-a Piece", keywords: ["cell", "piece", "has", "optional", "null"] },
          { text: "Piece is-a hierarchy (extends Piece)", keywords: ["extends", "inherit", "is-a", "piece", "abstract"] },
          { text: "Player has-many Pieces", keywords: ["player", "piece", "has", "own"] },
          { text: "Game has Board + 2 Players + Move history", keywords: ["game", "board", "player", "history", "move"] },
        ],
        tip: "Piece should be abstract with concrete subclasses — one of the few justified uses of deep inheritance.",
      },
      patterns: {
        label: "Design Patterns",
        checks: [
          { text: "Strategy for move validation per piece type", keywords: ["strategy", "move", "valid", "each piece", "per piece"] },
          { text: "Command for Move (enables undo)", keywords: ["command", "undo", "redo", "move", "history"] },
          { text: "Observer for check/checkmate detection", keywords: ["observer", "check", "checkmate", "event", "detect"] },
          { text: "Explained why Command enables undo", keywords: ["undo", "command", "execute", "reverse", "rollback"] },
        ],
        tip: "Command + Strategy together are the power combination here.",
      },
      design: {
        label: "Class Design / Interfaces",
        checks: [
          { text: "Piece: isValidMove(from, to, board)", keywords: ["valid", "move", "from", "to", "board", "isvalid"] },
          { text: "Game: makeMove(player, from, to)", keywords: ["makemove", "move", "player", "from", "to"] },
          { text: "Game: isCheck(player)", keywords: ["ischeck", "check", "king", "attack"] },
          { text: "Game: undoLastMove()", keywords: ["undo", "last", "move", "revert"] },
          { text: "Board: getPiece(pos) + placePiece()", keywords: ["board", "getpiece", "placepiece", "position"] },
        ],
        tip: "isValidMove() on the Piece class is the key method — each subclass overrides it (Strategy via polymorphism).",
      },
      flow: {
        label: "Use Case: Player Makes a Move",
        checks: [
          { text: "Player specifies from + to positions", keywords: ["from", "to", "position", "player", "input"] },
          { text: "Validate it's this player's turn", keywords: ["turn", "validate", "player", "whose"] },
          { text: "Validate piece belongs to player", keywords: ["piece", "belong", "own", "player", "color"] },
          { text: "Validate move using piece's isValidMove()", keywords: ["valid", "move", "isvalid", "piece"] },
          { text: "Check if move leaves own King in check", keywords: ["king", "check", "after", "own", "illegal", "leaves"] },
          { text: "Execute move, push to history, switch turn", keywords: ["execute", "history", "push", "switch", "turn", "next"] },
        ],
        tip: "'Does my move leave my King in check?' — mention this explicitly, it's the hardest validation.",
      },
    },
    ideal: `// ── Enums ──────────────────────────────────────────────
enum Color     { WHITE, BLACK }
enum GameStatus { ACTIVE, CHECK, CHECKMATE, STALEMATE }

class Position { int row, col; }

// ── Piece — Strategy via polymorphism ───────────────────
abstract class Piece {
    Color color; boolean hasMoved;
    abstract boolean isValidMove(Position from, Position to, Board board);
}
class King   extends Piece { ... }
class Queen  extends Piece { ... }
class Rook   extends Piece { ... }
class Bishop extends Piece { ... }
class Knight extends Piece { ... }
class Pawn   extends Piece { ... }

// ── Board ───────────────────────────────────────────────
class Board {
    Cell[][] grid = new Cell[8][8];
    Piece getPiece(Position p)             { return grid[p.row][p.col].piece; }
    void  placePiece(Piece pc, Position p) { grid[p.row][p.col].piece = pc; }
    void  removePiece(Position p)          { grid[p.row][p.col].piece = null; }
    Position findKing(Color color)         { /* scan */ }
}

// ── Move — Command pattern ──────────────────────────────
class Move {
    Piece piece; Position from, to; Piece capturedPiece;

    void execute(Board b) {
        capturedPiece = b.getPiece(to);
        b.placePiece(piece, to); b.removePiece(from);
    }
    void undo(Board b) {
        b.placePiece(piece, from);
        if (capturedPiece != null) b.placePiece(capturedPiece, to);
        else b.removePiece(to);
    }
}

// ── Game Orchestrator ───────────────────────────────────
class Game {
    Board board; Player[] players = new Player[2];
    int currentIdx = 0; Deque<Move> history = new ArrayDeque<>();

    void makeMove(Player player, Position from, Position to) {
        if (player != players[currentIdx]) throw new NotYourTurnException();
        Piece piece = board.getPiece(from);
        if (!piece.isValidMove(from, to, board)) throw new IllegalMoveException();

        Move move = new Move(piece, from, to);
        move.execute(board);
        if (isInCheck(player.color)) { move.undo(board); throw new LeavesKingInCheckException(); }

        history.push(move); currentIdx ^= 1;
    }

    void undoLastMove() { if (!history.isEmpty()) { history.pop().undo(board); currentIdx ^= 1; } }

    boolean isInCheck(Color color) {
        Position kingPos = board.findKing(color);
        return getAllPieces(opposite(color)).stream()
            .anyMatch(p -> p.isValidMove(p.position, kingPos, board));
    }
}`,
  },
  {
    id: "elevator",
    title: "Elevator System",
    difficulty: "Medium",
    tag: "State Machine",
    minutes: 35,
    statement: `Design an Elevator system for a building.

Requirements:
• Multiple elevators in a building
• Passengers press floor buttons (external) and cabin buttons (internal)
• System dispatches the best elevator for each request
• Each elevator has: current floor, direction, door state
• Display shows current floor inside and outside`,
    interviewerAnswers: {
      "How many elevators / floors?": "Up to 10 elevators, 100 floors. Configurable.",
      "Scheduling algorithm?": "Start with SCAN. Mention alternatives.",
      "Concurrency?": "Multiple requests can arrive simultaneously.",
      "Emergency modes?": "Out of scope.",
    },
    rubric: {
      clarify: {
        label: "Clarifying Questions",
        checks: [
          { text: "Asked about number of elevators and floors", keywords: ["how many", "elevator", "floor", "building", "count"] },
          { text: "Asked about scheduling algorithm", keywords: ["schedule", "algorithm", "dispatch", "assign", "nearest", "scan"] },
          { text: "Asked about internal vs external requests", keywords: ["internal", "external", "inside", "floor button", "cabin"] },
          { text: "Asked about concurrency", keywords: ["concurrent", "simultaneous", "multiple", "thread", "queue"] },
          { text: "Asked about edge cases", keywords: ["emergency", "overload", "weight", "capacity", "special"] },
        ],
        tip: "Asking about the scheduling algorithm upfront shows architectural thinking — it's the core design decision.",
      },
      entities: {
        label: "Core Entities",
        checks: [
          { text: "ElevatorSystem / Controller", keywords: ["system", "building", "controller", "elevatorcontroller"] },
          { text: "Elevator (with state)", keywords: ["elevator", "lift", "cab"] },
          { text: "Floor", keywords: ["floor", "level"] },
          { text: "Request / ElevatorRequest", keywords: ["request", "call"] },
          { text: "Button (internal + external)", keywords: ["button", "internal", "external", "panel"] },
          { text: "Door", keywords: ["door"] },
        ],
        tip: "Separate Request from Button — a Button creates a Request, but the scheduler operates on Requests.",
      },
      relationships: {
        label: "Relationships",
        checks: [
          { text: "ElevatorSystem manages multiple Elevators", keywords: ["system", "elevator", "manage", "has", "multiple"] },
          { text: "Elevator has Door, Display, and request queue", keywords: ["elevator", "door", "display", "queue", "request"] },
          { text: "Request has source floor, destination, direction", keywords: ["request", "source", "destination", "direction", "floor"] },
          { text: "ElevatorSystem uses a Scheduler/Dispatcher", keywords: ["scheduler", "dispatcher", "dispatch", "assign", "strategy"] },
        ],
        tip: "The Scheduler is a separate component — don't bake dispatching logic into the Elevator itself.",
      },
      patterns: {
        label: "Design Patterns",
        checks: [
          { text: "State for Elevator (IDLE/MOVING/DOOR_OPEN)", keywords: ["state", "idle", "moving", "door", "up", "down"] },
          { text: "Strategy for scheduling algorithm", keywords: ["strategy", "scan", "nearest", "algorithm", "scheduling"] },
          { text: "Observer for button press / display updates", keywords: ["observer", "event", "listener", "display", "button"] },
          { text: "Singleton for ElevatorSystem", keywords: ["singleton", "system", "one", "single"] },
          { text: "Command for elevator requests", keywords: ["command", "request", "queue", "enqueue"] },
        ],
        tip: "State + Strategy is the core pattern combo here.",
      },
      design: {
        label: "Class Design / Interfaces",
        checks: [
          { text: "requestElevator(floor, direction) — external", keywords: ["request", "floor", "direction", "external"] },
          { text: "selectFloor(floor) — internal", keywords: ["select", "floor", "internal", "inside", "destination"] },
          { text: "Elevator: moveToFloor(), openDoor(), closeDoor()", keywords: ["move", "floor", "door", "open", "close"] },
          { text: "Scheduler: assignElevator(request)", keywords: ["assign", "elevator", "scheduler", "dispatch"] },
          { text: "Elevator: getStatus()", keywords: ["status", "current", "floor", "direction", "state"] },
        ],
        tip: "Keep requestElevator() on the System — callers don't pick which elevator, the scheduler does.",
      },
      flow: {
        label: "Use Case: Passenger Requests Elevator",
        checks: [
          { text: "Passenger presses UP button on floor 5", keywords: ["button", "floor", "press", "up", "request"] },
          { text: "System creates Request, passes to Scheduler", keywords: ["request", "scheduler", "system", "creat"] },
          { text: "Scheduler picks best elevator", keywords: ["scheduler", "best", "nearest", "scan", "pick", "assign"] },
          { text: "Elevator moves to floor 5, door opens", keywords: ["move", "floor", "door", "open"] },
          { text: "Passenger selects floor 10 inside", keywords: ["inside", "10", "select", "move", "destination"] },
          { text: "Door closes, state transitions correctly", keywords: ["close", "door", "state", "idle", "moving"] },
        ],
        tip: "Walk the full round-trip: external request → dispatch → arrive → internal → arrive → idle.",
      },
    },
    ideal: `// ── Enums ──────────────────────────────────────────────
enum Direction     { UP, DOWN, IDLE }
enum ElevatorState { IDLE, MOVING, DOOR_OPEN }

class ElevatorRequest {
    int sourceFloor, destinationFloor;
    Direction direction; RequestType type;
}

// ── Elevator — State pattern ────────────────────────────
class Elevator {
    int id, currentFloor = 0;
    Direction direction = IDLE;
    ElevatorState state = IDLE;
    TreeSet<Integer> upRequests   = new TreeSet<>();
    TreeSet<Integer> downRequests = new TreeSet<>(Comparator.reverseOrder());

    void addRequest(ElevatorRequest req) {
        if (req.destinationFloor > currentFloor) upRequests.add(req.destinationFloor);
        else downRequests.add(req.destinationFloor);
    }

    // SCAN algorithm
    void processNext() {
        if (direction == UP && !upRequests.isEmpty())
            moveToFloor(upRequests.first());
        else if (!downRequests.isEmpty()) { direction = DOWN; moveToFloor(downRequests.first()); }
        else { direction = IDLE; state = IDLE; }
    }

    void moveToFloor(int floor) {
        state = MOVING;
        direction = (floor > currentFloor) ? UP : DOWN;
        currentFloor = floor;
        display.update(currentFloor);  // Observer
        openDoor();
    }
}

// ── Scheduler — Strategy pattern ───────────────────────
interface SchedulingStrategy {
    Elevator assign(ElevatorRequest req, List<Elevator> elevators);
}
class NearestElevator implements SchedulingStrategy {
    public Elevator assign(ElevatorRequest req, List<Elevator> elevators) {
        return elevators.stream()
            .min(Comparator.comparingInt(e -> Math.abs(e.currentFloor - req.sourceFloor)))
            .orElseThrow();
    }
}

// ── ElevatorSystem — Singleton ──────────────────────────
class ElevatorSystem {
    private static ElevatorSystem instance;
    List<Elevator> elevators;
    SchedulingStrategy scheduler = new NearestElevator();

    void requestElevator(int floor, Direction dir) {
        ElevatorRequest req = new ElevatorRequest(floor, dir, EXTERNAL);
        scheduler.assign(req, elevators).addRequest(req);
    }
    void selectFloor(Elevator e, int floor) {
        e.addRequest(new ElevatorRequest(e.currentFloor, floor, INTERNAL));
    }
}`,
  },
];

// ─── SCORING ─────────────────────────────────────────────────────────────────
function scoreStep(answer, checks) {
  const lower = answer.toLowerCase();
  return checks.map((c) => ({ ...c, passed: c.keywords.some((k) => lower.includes(k.toLowerCase())) }));
}
function totalScore(results) {
  return Object.values(results).reduce(
    (acc, r) => ({ passed: acc.passed + r.filter((x) => x.passed).length, total: acc.total + r.length }),
    { passed: 0, total: 0 }
  );
}

const STEPS = [
  { id: "clarify", label: "Clarify", icon: "❓" },
  { id: "entities", label: "Entities", icon: "📦" },
  { id: "relationships", label: "Relationships", icon: "🔗" },
  { id: "patterns", label: "Patterns", icon: "♟️" },
  { id: "design", label: "Class Design", icon: "🖊️" },
  { id: "flow", label: "Use Case", icon: "🔄" },
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
function Badge({ text }) {
  const colors = {
    Medium: { bg: "#fef3c7", color: "#92400e" }, Hard: { bg: "#fee2e2", color: "#991b1b" },
    Classic: { bg: "#ede9fe", color: "#5b21b6" }, Concurrency: { bg: "#fee2e2", color: "#991b1b" },
    Patterns: { bg: "#dbeafe", color: "#1e40af" }, "State Machine": { bg: "#d1fae5", color: "#065f46" },
  };
  const c = colors[text] || { bg: "#e5e7eb", color: "#374151" };
  return <span style={{ background: c.bg, color: c.color, padding: "2px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600 }}>{text}</span>;
}

function Timer({ seconds, total }) {
  const pct = seconds / total;
  const color = pct > 0.5 ? "#22c55e" : pct > 0.25 ? "#f59e0b" : "#ef4444";
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 160, height: 7, background: "#374151", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ width: `${pct * 100}%`, height: "100%", background: color, transition: "width 1s linear, background 1s" }} />
      </div>
      <span style={{ fontFamily: "monospace", fontSize: 17, fontWeight: 700, color, minWidth: 52, textAlign: "right" }}>
        {min}:{String(sec).padStart(2, "0")}
      </span>
    </div>
  );
}

// ─── SELECT SCREEN ────────────────────────────────────────────────────────────
function SelectScreen({ onSelect }) {
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {/* Site header */}
      <div style={{ background: "#1e293b", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span style={{ color: "#6366f1", fontWeight: 800, fontSize: 18 }}>LLD</span>
          <span style={{ color: "#f1f5f9", fontWeight: 600, fontSize: 18 }}> Interview Simulator</span>
        </div>
        <span style={{ color: "#94a3b8", fontSize: 13 }}>Free · No signup required</span>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
        {/* Top leaderboard ad slot */}
        <AdBanner slot="1234567890" label="Top Banner Ad" height={90} />

        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", marginBottom: 6 }}>
          Practice LLD Interviews — Like a Real SDE2/SDE3 Interview
        </h1>
        <p style={{ color: "#6b7280", marginBottom: 28, fontSize: 15, lineHeight: 1.6 }}>
          Timed mock interviews with step-by-step rubric scoring. Know exactly what you got right and what you missed.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 16, marginBottom: 16 }}>
          {PROBLEMS.slice(0, 2).map((p) => <ProblemCard key={p.id} p={p} onSelect={onSelect} />)}
        </div>

        {/* Mid-page ad between problem rows */}
        <AdBanner slot="0987654321" label="Middle Ad" height={280} format="rectangle" />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 16, marginBottom: 28 }}>
          {PROBLEMS.slice(2).map((p) => <ProblemCard key={p.id} p={p} onSelect={onSelect} />)}
        </div>

        {/* How it works */}
        <div style={{ padding: 20, background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#374151", marginBottom: 8 }}>📋 How it works</h3>
          <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
            Pick a problem and go through <strong>6 steps: Clarify → Entities → Relationships → Patterns → Class Design → Use Case flow.</strong> The timer runs throughout — just like a real interview. After submitting, you get a rubric score for each section, an interviewer tip, and the full ideal solution to compare against.
          </p>
        </div>
      </div>
    </div>
  );
}

function ProblemCard({ p, onSelect }) {
  return (
    <div
      onClick={() => onSelect(p)}
      style={{ background: "#fff", border: "2px solid #e5e7eb", borderRadius: 14, padding: 22, cursor: "pointer", transition: "all 0.15s" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(99,102,241,0.12)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>{p.title}</h2>
        <div style={{ display: "flex", gap: 6, marginLeft: 8, flexShrink: 0 }}>
          <Badge text={p.difficulty} /><Badge text={p.tag} />
        </div>
      </div>
      <p style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>
        {p.statement.split("\n").slice(0, 3).join(" ").slice(0, 110)}...
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: "#6366f1", fontWeight: 600, fontSize: 13 }}>⏱ {p.minutes} min</span>
        <span style={{ color: "#d1d5db" }}>·</span>
        <span style={{ color: "#6b7280", fontSize: 13 }}>6 steps</span>
        <span style={{ marginLeft: "auto", color: "#6366f1", fontWeight: 600, fontSize: 14 }}>Start →</span>
      </div>
    </div>
  );
}

// ─── INTERVIEW SCREEN ─────────────────────────────────────────────────────────
function InterviewScreen({ problem, onFinish }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(problem.minutes * 60);
  const [showClarif, setShowClarif] = useState(false);
  const textRef = useRef(null);
  const total = problem.minutes * 60;

  useEffect(() => {
    if (timeLeft <= 0) { onFinish(answers); return; }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  useEffect(() => { textRef.current?.focus(); }, [step]);

  const cur = STEPS[step];
  const rubric = problem.rubric[cur.id];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#0f172a" }}>
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", background: "#1e293b", borderBottom: "1px solid #334155", flexShrink: 0 }}>
        <div>
          <div style={{ color: "#94a3b8", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>LLD Interview</div>
          <div style={{ color: "#f1f5f9", fontSize: 16, fontWeight: 700 }}>{problem.title}</div>
        </div>
        <Timer seconds={timeLeft} total={total} />
        <button onClick={() => onFinish(answers)} style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
          Submit All →
        </button>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Step nav */}
        <div style={{ width: 190, background: "#1e293b", borderRight: "1px solid #334155", padding: "16px 0", overflowY: "auto", flexShrink: 0 }}>
          {STEPS.map((s, i) => (
            <div key={s.id} onClick={() => setStep(i)} style={{ padding: "10px 16px", cursor: "pointer", background: i === step ? "#312e81" : "transparent", borderLeft: `3px solid ${i === step ? "#6366f1" : "transparent"}`, display: "flex", alignItems: "center", gap: 8 }}>
              <span>{s.icon}</span>
              <div>
                <div style={{ color: i === step ? "#e0e7ff" : answers[s.id] ? "#86efac" : "#64748b", fontSize: 13, fontWeight: i === step ? 700 : 400 }}>{s.label}</div>
                {answers[s.id] && <div style={{ color: "#4ade80", fontSize: 10 }}>✓ done</div>}
              </div>
            </div>
          ))}
          <div style={{ padding: "16px 12px" }}>
            <button onClick={() => setShowClarif(!showClarif)} style={{ width: "100%", background: "#0f172a", color: "#94a3b8", border: "1px solid #334155", borderRadius: 7, padding: "7px 10px", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
              💬 Interviewer Answers
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          {step === 0 && (
            <div style={{ background: "#1e293b", borderRadius: 10, padding: 18, border: "1px solid #334155" }}>
              <div style={{ color: "#93c5fd", fontSize: 12, fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Problem Statement</div>
              <pre style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0 }}>{problem.statement}</pre>
            </div>
          )}

          {showClarif && (
            <div style={{ background: "#1c2e1c", borderRadius: 10, padding: 18, border: "1px solid #166534" }}>
              <div style={{ color: "#86efac", fontSize: 12, fontWeight: 700, marginBottom: 10 }}>💬 Interviewer Answers</div>
              {Object.entries(problem.interviewerAnswers).map(([q, a]) => (
                <div key={q} style={{ marginBottom: 8 }}>
                  <div style={{ color: "#4ade80", fontSize: 13, fontWeight: 600 }}>Q: {q}</div>
                  <div style={{ color: "#bbf7d0", fontSize: 13 }}>{a}</div>
                </div>
              ))}
            </div>
          )}

          <div style={{ background: "#1e293b", borderRadius: 10, padding: 18, border: "1px solid #334155" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 22 }}>{cur.icon}</span>
              <h3 style={{ color: "#f1f5f9", margin: 0, fontSize: 17, fontWeight: 700 }}>Step {step + 1}: {rubric.label}</h3>
            </div>
            <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 14, lineHeight: 1.6 }}>{rubric.tip}</p>
            <textarea
              ref={textRef}
              value={answers[cur.id] || ""}
              onChange={e => setAnswers(a => ({ ...a, [cur.id]: e.target.value }))}
              placeholder={`Write your answer for "${rubric.label}" here...\n\nBe as detailed as you would be at a real whiteboard. Bullet points, class names, method signatures — anything.`}
              style={{ width: "100%", minHeight: 200, background: "#0f172a", color: "#e2e8f0", border: "1px solid #334155", borderRadius: 8, padding: 14, fontSize: 14, lineHeight: 1.7, fontFamily: "monospace", resize: "vertical", boxSizing: "border-box", outline: "none" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 }}>
              <button onClick={() => step > 0 && setStep(s => s - 1)} disabled={step === 0} style={{ background: "transparent", color: step === 0 ? "#475569" : "#94a3b8", border: "1px solid #334155", borderRadius: 8, padding: "9px 18px", cursor: step === 0 ? "default" : "pointer", fontSize: 14 }}>
                ← Back
              </button>
              <button
                onClick={() => step < STEPS.length - 1 ? setStep(s => s + 1) : onFinish(answers)}
                style={{ background: step === STEPS.length - 1 ? "#16a34a" : "#6366f1", color: "#fff", border: "none", borderRadius: 8, padding: "9px 22px", cursor: "pointer", fontWeight: 700, fontSize: 14 }}
              >
                {step === STEPS.length - 1 ? "✅ Submit & See Results" : `Next: ${STEPS[step + 1].label} →`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── RESULTS SCREEN ───────────────────────────────────────────────────────────
function ResultsScreen({ problem, answers, onRetry, onHome }) {
  const [tab, setTab] = useState("score");
  const scored = {};
  for (const s of STEPS) scored[s.id] = scoreStep(answers[s.id] || "", problem.rubric[s.id].checks);
  const { passed, total } = totalScore(scored);
  const pct = Math.round((passed / total) * 100);
  const grade = pct >= 85 ? { label: "SDE3 Ready 🚀", color: "#22c55e" }
    : pct >= 65 ? { label: "Solid SDE2 👍", color: "#3b82f6" }
    : pct >= 45 ? { label: "Good Start ✨", color: "#f59e0b" }
    : { label: "Keep Practicing 💪", color: "#ef4444" };

  return (
    <div style={{ background: "#0f172a", minHeight: "100vh", padding: 20 }}>
      <div style={{ maxWidth: 840, margin: "0 auto" }}>
        {/* Score card */}
        <div style={{ background: "#1e293b", borderRadius: 14, padding: 24, marginBottom: 16, textAlign: "center", border: "1px solid #334155" }}>
          <div style={{ fontSize: 48, marginBottom: 6 }}>{pct >= 85 ? "🏆" : pct >= 65 ? "⭐" : pct >= 45 ? "📈" : "💪"}</div>
          <h1 style={{ color: "#f1f5f9", fontSize: 24, fontWeight: 800, margin: "0 0 4px" }}>{grade.label}</h1>
          <div style={{ color: grade.color, fontSize: 42, fontWeight: 900 }}>{pct}%</div>
          <div style={{ color: "#94a3b8", fontSize: 14 }}>{passed} / {total} rubric checks passed</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 16 }}>
            <button onClick={onRetry} style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>🔁 Retry</button>
            <button onClick={onHome} style={{ background: "transparent", color: "#94a3b8", border: "1px solid #334155", borderRadius: 8, padding: "9px 20px", cursor: "pointer", fontSize: 14 }}>🏠 New Problem</button>
          </div>
        </div>

        {/* Ad after score — user is engaged here */}
        <AdBanner slot="1122334455" label="Results Page Ad" height={250} />

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
          {[["score", "📊 Step-by-Step Feedback"], ["ideal", "💡 Ideal Solution"]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{ padding: "9px 18px", borderRadius: 8, border: "none", cursor: "pointer", background: tab === id ? "#6366f1" : "#1e293b", color: tab === id ? "#fff" : "#94a3b8", fontWeight: 600, fontSize: 14 }}>{label}</button>
          ))}
        </div>

        {tab === "score" && STEPS.map((s) => {
          const results = scored[s.id];
          const ok = results.filter(r => r.passed).length;
          return (
            <div key={s.id} style={{ background: "#1e293b", borderRadius: 10, padding: 18, marginBottom: 12, border: "1px solid #334155" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <h3 style={{ color: "#f1f5f9", margin: 0, fontSize: 15, fontWeight: 700 }}>{s.icon} {problem.rubric[s.id].label}</h3>
                <span style={{ color: ok === results.length ? "#22c55e" : ok > results.length / 2 ? "#f59e0b" : "#ef4444", fontWeight: 700, fontSize: 15 }}>{ok}/{results.length}</span>
              </div>
              {results.map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "6px 0", borderBottom: i < results.length - 1 ? "1px solid #0f172a" : "none" }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{r.passed ? "✅" : "❌"}</span>
                  <span style={{ color: r.passed ? "#86efac" : "#fca5a5", fontSize: 13 }}>{r.text}</span>
                </div>
              ))}
              <div style={{ marginTop: 12, padding: 10, background: "#0f172a", borderRadius: 7, borderLeft: "3px solid #6366f1" }}>
                <span style={{ color: "#818cf8", fontSize: 12, fontWeight: 700 }}>💡 </span>
                <span style={{ color: "#94a3b8", fontSize: 13 }}>{problem.rubric[s.id].tip}</span>
              </div>
              {(answers[s.id] || "") && (
                <details style={{ marginTop: 10 }}>
                  <summary style={{ color: "#475569", fontSize: 12, cursor: "pointer" }}>Your answer ▾</summary>
                  <pre style={{ background: "#0f172a", color: "#94a3b8", padding: 10, borderRadius: 7, fontSize: 12, whiteSpace: "pre-wrap", marginTop: 6, fontFamily: "monospace", lineHeight: 1.6 }}>{answers[s.id]}</pre>
                </details>
              )}
            </div>
          );
        })}

        {tab === "ideal" && (
          <div style={{ background: "#1e293b", borderRadius: 10, padding: 20, border: "1px solid #334155" }}>
            <h3 style={{ color: "#86efac", margin: "0 0 14px", fontSize: 15, fontWeight: 700 }}>💡 Ideal Solution — {problem.title}</h3>
            <pre style={{ background: "#0f172a", color: "#e2e8f0", padding: 18, borderRadius: 8, fontSize: 13, lineHeight: 1.7, overflowX: "auto", fontFamily: "'Fira Code', 'Cascadia Code', monospace", whiteSpace: "pre-wrap" }}>{problem.ideal}</pre>
          </div>
        )}

        {/* Footer ad */}
        <AdBanner slot="5566778899" label="Footer Ad" height={90} />

        <div style={{ textAlign: "center", color: "#475569", fontSize: 12, paddingTop: 20, paddingBottom: 16 }}>
          Built for SDE2/SDE3 interview prep · Free to use
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("select");
  const [problem, setProblem] = useState(null);
  const [answers, setAnswers] = useState({});

  if (screen === "select") return <SelectScreen onSelect={p => { setProblem(p); setScreen("interview"); }} />;
  if (screen === "interview") return <InterviewScreen problem={problem} onFinish={ans => { setAnswers(ans); setScreen("results"); }} />;
  if (screen === "results") return <ResultsScreen problem={problem} answers={answers} onRetry={() => { setAnswers({}); setScreen("interview"); }} onHome={() => { setProblem(null); setScreen("select"); }} />;
}

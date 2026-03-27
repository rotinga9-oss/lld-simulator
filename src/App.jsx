import { useState, useEffect, useRef } from "react";

// ─── AD BANNER COMPONENT ─────────────────────────────────────────────────────
const ADSENSE_ENABLED = false; // ← flip to true after AdSense approval
const PUBLISHER_ID = "ca-pub-XXXXXXXXXX"; // ← your publisher ID here

function AdBanner({ slot, label = "Advertisement", height = 90, format = "auto" }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ADSENSE_ENABLED) return;
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
  }, []);

  if (!ADSENSE_ENABLED) {
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
    statement: `Design a multi-level Parking Lot system.\n\nRequirements:\n• Multiple floors, each with parking spots\n• Support vehicle types: Bike, Car, Truck\n• Each vehicle type maps to a spot type (Motorcycle / Compact / Large)\n• Entry gate issues a ticket with entry time\n• Exit gate calculates fee and processes payment (Cash or Card)\n• Find the nearest available spot on entry`,
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
        tip: "Extract entities from the nouns in your use cases.",
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
        tip: "Always state composition vs aggregation explicitly.",
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
        tip: "Don't just list patterns — justify them.",
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
        tip: "Always handle the unhappy path.",
      },
    },
    ideal: `// Enums
enum VehicleType  { BIKE, CAR, TRUCK }
enum SpotType     { MOTORCYCLE, COMPACT, LARGE }
enum SpotStatus   { AVAILABLE, OCCUPIED }

abstract class Vehicle {
    String licensePlate; VehicleType type;
    abstract SpotType requiredSpotType();
}
class Bike extends Vehicle { SpotType requiredSpotType() { return MOTORCYCLE; } }
class Car  extends Vehicle { SpotType requiredSpotType() { return COMPACT; } }
class Truck extends Vehicle { SpotType requiredSpotType() { return LARGE; } }

class ParkingSpot {
    String id; SpotType type; SpotStatus status; Vehicle vehicle;
    boolean isAvailable() { return status == AVAILABLE; }
    void assignVehicle(Vehicle v) { vehicle = v; status = OCCUPIED; }
    void removeVehicle()          { vehicle = null; status = AVAILABLE; }
}

class Ticket {
    String id; Vehicle vehicle; ParkingSpot spot;
    LocalDateTime entryTime; double fee;
}

interface PaymentStrategy { double calculateFee(Ticket t); void processPayment(double amt); }
class CashPayment implements PaymentStrategy { ... }
class CardPayment implements PaymentStrategy { ... }

class ParkingFloor {
    int floorNum; List<ParkingSpot> spots;
    Optional<ParkingSpot> findSpot(SpotType t) { ... }
}

class ParkingLot {                       // Singleton
    private static ParkingLot instance;
    List<ParkingFloor> floors;
    public static ParkingLot getInstance() { ... }
    Ticket parkVehicle(Vehicle v) { spot = findAvailableSpot(v.requiredSpotType()); ... }
    double unparkVehicle(Ticket t, PaymentStrategy p) { ... }
}`,
  },

  {
    id: "bookmyshow",
    title: "BookMyShow — Movie Booking",
    difficulty: "Hard",
    tag: "Classic",
    minutes: 45,
    statement: `Design the core booking system for a movie-ticket platform like BookMyShow.\n\nRequirements:\n• Users search for movies by city / theatre / showtime\n• Select seats on a seat map, book and pay\n• Seat must be locked during payment to prevent double booking\n• Support seat categories: Silver, Gold, Platinum (different pricing)\n• Booking confirmation sent after successful payment\n• Cancellation support with partial refund`,
    interviewerAnswers: {
      "Concurrency?": "Yes — handle concurrent seat selection. Prevent double booking.",
      "Scale?": "Design for thousands of concurrent users on a blockbuster release.",
      "Payment provider?": "Treat as external — abstract it behind an interface.",
      "Seat lock duration?": "10 minutes. Release if payment not completed.",
      "Cancellation window?": "Up to 2 hours before showtime; 50% refund.",
    },
    rubric: {
      clarify: {
        label: "Clarifying Questions",
        checks: [
          { text: "Asked about concurrency / double booking", keywords: ["concurrent", "double book", "race", "lock", "simultaneous"] },
          { text: "Asked about seat categories / pricing tiers", keywords: ["category", "tier", "silver", "gold", "platinum", "price"] },
          { text: "Asked about cancellation policy", keywords: ["cancel", "refund", "policy"] },
          { text: "Asked about seat lock / hold duration", keywords: ["lock", "hold", "timeout", "expire", "10 min"] },
          { text: "Asked about payment abstraction", keywords: ["payment", "gateway", "external", "provider"] },
          { text: "Asked about search / discovery scope", keywords: ["search", "filter", "city", "theatre", "movie"] },
        ],
        tip: "Double-booking is the killer edge case here — always probe concurrency first.",
      },
      entities: {
        label: "Core Entities",
        checks: [
          { text: "Movie", keywords: ["movie", "film"] },
          { text: "Theatre / Screen", keywords: ["theatre", "screen", "cinema", "hall"] },
          { text: "Show (Movie + Screen + Time)", keywords: ["show", "showtime", "screening", "slot"] },
          { text: "Seat (with category)", keywords: ["seat", "silver", "gold", "platinum"] },
          { text: "Booking / Reservation", keywords: ["booking", "reservation", "ticket"] },
          { text: "User + Payment", keywords: ["user", "customer", "payment"] },
        ],
        tip: "'Show' is the pivot entity — it links Movie, Screen, and Time.",
      },
      relationships: {
        label: "Relationships",
        checks: [
          { text: "Theatre has-many Screens; Screen has-many Seats", keywords: ["theatre", "screen", "seat", "has"] },
          { text: "Show references Movie + Screen (many-to-many via Show)", keywords: ["show", "movie", "screen", "reference"] },
          { text: "Booking has-many Seats; Seat status tracks state", keywords: ["booking", "seat", "status", "available", "booked"] },
          { text: "Seat lock / hold relationship explained", keywords: ["lock", "hold", "expire", "timeout", "seat"] },
          { text: "User → Booking (one-to-many)", keywords: ["user", "booking", "many", "history"] },
        ],
        tip: "A Seat can be: AVAILABLE → LOCKED (during payment) → BOOKED or back to AVAILABLE.",
      },
      patterns: {
        label: "Design Patterns",
        checks: [
          { text: "State pattern for Seat (AVAILABLE/LOCKED/BOOKED)", keywords: ["state", "available", "locked", "booked", "status"] },
          { text: "Strategy for Payment gateway", keywords: ["strategy", "payment", "gateway", "pluggable"] },
          { text: "Observer / Event for booking confirmation", keywords: ["observer", "event", "notification", "email", "confirmation"] },
          { text: "Factory for Seat or Booking creation", keywords: ["factory", "creat", "build"] },
          { text: "Lock mechanism for concurrency (DB-level or optimistic)", keywords: ["lock", "optimistic", "pessimistic", "concurrent", "transaction"] },
        ],
        tip: "The seat-lock mechanism is what separates SDE2 from SDE3 answers.",
      },
      design: {
        label: "Class Design / Interfaces",
        checks: [
          { text: "searchShows(city, movie, date) → List<Show>", keywords: ["search", "show", "city", "movie", "date"] },
          { text: "lockSeats(showId, seatIds, userId) → LockToken", keywords: ["lock", "seat", "token", "hold"] },
          { text: "confirmBooking(lockToken, paymentInfo) → Booking", keywords: ["confirm", "booking", "payment", "token"] },
          { text: "cancelBooking(bookingId) → refundAmount", keywords: ["cancel", "booking", "refund"] },
          { text: "Seat status transitions clearly defined", keywords: ["status", "transition", "available", "locked", "booked"] },
        ],
        tip: "The lock → confirm two-phase pattern is the crux of this design.",
      },
      flow: {
        label: "Use Case: User Books Seats",
        checks: [
          { text: "User searches show and selects seats", keywords: ["search", "select", "seat", "show"] },
          { text: "System locks seats for N minutes", keywords: ["lock", "hold", "minute", "timer"] },
          { text: "User completes payment", keywords: ["payment", "pay", "complete"] },
          { text: "Booking confirmed, seats marked BOOKED", keywords: ["confirm", "booked", "ticket", "confirm"] },
          { text: "Handles expired lock / payment failure", keywords: ["expire", "fail", "timeout", "release", "error"] },
        ],
        tip: "Walk through the lock expiry scenario — it shows you've thought about concurrency.",
      },
    },
    ideal: `enum SeatStatus { AVAILABLE, LOCKED, BOOKED }
enum SeatCategory { SILVER, GOLD, PLATINUM }

class Seat {
    String id; SeatCategory category; SeatStatus status;
    String lockedByUserId; LocalDateTime lockExpiry;
    boolean isAvailable() { return status == AVAILABLE || lockExpired(); }
}

class Show {
    String id; Movie movie; Screen screen;
    LocalDateTime startTime; Map<String, Seat> seats;
    List<Seat> getAvailableSeats() { ... }
}

class SeatLockService {        // handles concurrency
    // DB-level: SELECT FOR UPDATE or optimistic locking
    LockToken lockSeats(Show show, List<String> seatIds, String userId) {
        // in transaction: check available → set LOCKED + expiry → return token
    }
    void releaseExpiredLocks() { /* scheduled job */ }
}

interface PaymentGateway { PaymentResult charge(PaymentInfo info, double amount); }

class BookingService {
    LockToken lockSeats(String showId, List<String> seatIds, String userId) { ... }
    Booking confirmBooking(LockToken token, PaymentInfo payment) {
        // validate lock not expired → charge payment → mark seats BOOKED → persist Booking
    }
    double cancelBooking(String bookingId) { /* refund logic */ }
}`,
  },

  {
    id: "chess",
    title: "Chess Game",
    difficulty: "Medium",
    tag: "Classic",
    minutes: 40,
    statement: `Design an object-oriented Chess game.\n\nRequirements:\n• Two players take turns moving pieces\n• All standard chess pieces: King, Queen, Rook, Bishop, Knight, Pawn\n• Validate moves according to chess rules\n• Detect check, checkmate, and stalemate\n• Track game history (move log)\n• Support resign / draw offer`,
    interviewerAnswers: {
      "AI opponent?": "No, just two human players.",
      "Online multiplayer?": "Out of scope — same machine for now.",
      "Full rule set?": "Yes: castling, en passant, pawn promotion.",
      "Persist game state?": "Nice to have — focus on in-memory first.",
      "Timer?": "Out of scope.",
    },
    rubric: {
      clarify: {
        label: "Clarifying Questions",
        checks: [
          { text: "Asked about AI vs human players", keywords: ["ai", "computer", "human", "player", "opponent"] },
          { text: "Asked about special moves (castling/en passant/promotion)", keywords: ["castling", "en passant", "promotion", "special", "rule"] },
          { text: "Asked about online vs local", keywords: ["online", "network", "local", "same machine", "multiplayer"] },
          { text: "Asked about persistence / save game", keywords: ["save", "persist", "database", "store", "resume"] },
          { text: "Asked about draw / resign", keywords: ["draw", "resign", "stalemate", "forfeit"] },
        ],
        tip: "Special moves like castling reveal depth — ask if they're in scope.",
      },
      entities: {
        label: "Core Entities",
        checks: [
          { text: "Board (8×8 grid)", keywords: ["board", "grid", "8x8", "cell", "square"] },
          { text: "Piece (abstract base)", keywords: ["piece", "abstract", "base"] },
          { text: "Concrete pieces (King, Queen, Rook, Bishop, Knight, Pawn)", keywords: ["king", "queen", "rook", "bishop", "knight", "pawn"] },
          { text: "Player (Color: WHITE/BLACK)", keywords: ["player", "white", "black", "color"] },
          { text: "Move (from, to, piece, captured)", keywords: ["move", "from", "to", "position"] },
          { text: "Game (manages state and turn)", keywords: ["game", "state", "turn", "status"] },
        ],
        tip: "Move as a first-class entity enables undo/redo and game history.",
      },
      relationships: {
        label: "Relationships",
        checks: [
          { text: "Board contains 64 Cells/Squares", keywords: ["board", "cell", "square", "64", "contain"] },
          { text: "Cell optionally holds a Piece", keywords: ["cell", "square", "piece", "optional", "hold"] },
          { text: "Piece has a Color and position", keywords: ["piece", "color", "position", "white", "black"] },
          { text: "Game has two Players and a Board", keywords: ["game", "player", "board", "has"] },
          { text: "Game has a list of Moves (history)", keywords: ["game", "move", "history", "log", "list"] },
        ],
        tip: "The Board→Cell→Piece chain is the core composition in chess.",
      },
      patterns: {
        label: "Design Patterns",
        checks: [
          { text: "Command pattern for Move (enables undo)", keywords: ["command", "move", "undo", "execute", "reverse"] },
          { text: "Strategy for move validation per piece type", keywords: ["strategy", "valid", "rule", "piece", "move"] },
          { text: "Observer for check/checkmate detection", keywords: ["observer", "event", "check", "detect", "notify"] },
          { text: "State for Game status (ACTIVE/CHECK/CHECKMATE)", keywords: ["state", "active", "check", "checkmate", "stalemate", "status"] },
          { text: "Iterator or Visitor for board traversal", keywords: ["iterator", "visitor", "traverse", "iterate", "board"] },
        ],
        tip: "Command pattern for moves is the SDE3 differentiator — it enables game replay and undo.",
      },
      design: {
        label: "Class Design / Interfaces",
        checks: [
          { text: "Piece.getValidMoves(board) → List<Position>", keywords: ["valid", "move", "position", "get", "list"] },
          { text: "Board.movePiece(from, to) or executeMove(move)", keywords: ["move", "execute", "board", "from", "to"] },
          { text: "Game.isInCheck(player) / isCheckmate(player)", keywords: ["check", "checkmate", "incheck", "detect"] },
          { text: "Game.makeMove(move) validates + applies", keywords: ["makemove", "make", "validate", "apply"] },
          { text: "MoveHistory / GameLog records all moves", keywords: ["history", "log", "record", "move", "list"] },
        ],
        tip: "isInCheck() is the most complex method — walk through its algorithm.",
      },
      flow: {
        label: "Use Case: Player Makes a Move",
        checks: [
          { text: "Player selects piece and target square", keywords: ["select", "piece", "square", "target", "choose"] },
          { text: "System validates move for that piece type", keywords: ["valid", "check", "move", "rule", "piece"] },
          { text: "System verifies move doesn't leave own King in check", keywords: ["king", "check", "own", "leave", "verify"] },
          { text: "Move is executed; captured piece removed", keywords: ["execute", "capture", "remove", "apply"] },
          { text: "System detects check/checkmate after move", keywords: ["detect", "check", "checkmate", "stalemate", "after"] },
        ],
        tip: "The 'doesn't leave own King in check' validation is often forgotten.",
      },
    },
    ideal: `enum Color { WHITE, BLACK }
enum GameStatus { ACTIVE, CHECK, CHECKMATE, STALEMATE, DRAW }

class Position { int row; int col; }

abstract class Piece {
    Color color; Position pos; boolean hasMoved;
    abstract List<Position> getValidMoves(Board board);
    boolean isValidMove(Position to, Board board) { return getValidMoves(board).contains(to); }
}
class King extends Piece { List<Position> getValidMoves(Board b) { /* 1 square any dir + castling */ } }
class Queen extends Piece { /* rook + bishop combined */ }
// ... Rook, Bishop, Knight, Pawn

class Cell { Position pos; Piece piece; /* nullable */ }

class Board {
    Cell[][] grid = new Cell[8][8];
    Piece getPiece(Position p) { return grid[p.row][p.col].piece; }
    void movePiece(Position from, Position to) { ... }
    boolean isUnderAttack(Position p, Color byColor) { ... }
}

class Move {             // Command pattern
    Piece piece; Position from; Position to; Piece captured;
    void execute(Board b) { b.movePiece(from, to); }
    void undo(Board b)    { b.movePiece(to, from); if (captured != null) b.place(captured, to); }
}

class Game {
    Board board; Player white; Player black;
    Player currentPlayer; GameStatus status;
    List<Move> history;
    boolean makeMove(Position from, Position to) {
        Move m = new Move(board.getPiece(from), from, to);
        m.execute(board);
        if (isInCheck(currentPlayer)) { m.undo(board); return false; } // illegal
        history.add(m);
        updateStatus();
        swapTurn();
        return true;
    }
    boolean isInCheck(Player p) { return board.isUnderAttack(p.kingPos, opponent(p).color); }
}`,
  },

  {
    id: "elevator",
    title: "Elevator Control System",
    difficulty: "Hard",
    tag: "Classic",
    minutes: 45,
    statement: `Design an Elevator Control System for a high-rise building.\n\nRequirements:\n• N elevators serving M floors\n• Users press UP/DOWN on floor panels; press destination inside elevator\n• Dispatch algorithm picks the best elevator for each request\n• Support emergency stop and door-open/close buttons\n• Track each elevator's state: IDLE, MOVING_UP, MOVING_DOWN, DOOR_OPEN`,
    interviewerAnswers: {
      "How many elevators / floors?": "10 elevators, 50 floors. Configurable.",
      "Dispatch algorithm?": "Start with nearest-car (SCAN/LOOK). Mention advanced options.",
      "Freight vs passenger?": "Passenger only for now.",
      "Emergency?": "Emergency button stops elevator and opens door at nearest floor.",
      "Overload sensor?": "Out of scope.",
    },
    rubric: {
      clarify: {
        label: "Clarifying Questions",
        checks: [
          { text: "Asked about number of elevators and floors", keywords: ["elevator", "floor", "how many", "number", "scale"] },
          { text: "Asked about dispatch algorithm preference", keywords: ["dispatch", "algorithm", "nearest", "scan", "schedule"] },
          { text: "Asked about emergency / special modes", keywords: ["emergency", "fire", "special", "stop", "alarm"] },
          { text: "Asked about passenger vs freight", keywords: ["passenger", "freight", "cargo", "type"] },
          { text: "Asked about door behavior / sensors", keywords: ["door", "sensor", "open", "close", "obstruct"] },
        ],
        tip: "The dispatch algorithm is the heart of this problem — always ask about it.",
      },
      entities: {
        label: "Core Entities",
        checks: [
          { text: "Elevator (with state + current floor)", keywords: ["elevator", "state", "floor", "current"] },
          { text: "ElevatorController / Dispatcher", keywords: ["controller", "dispatcher", "system", "coordinator"] },
          { text: "Request (floor + direction or destination)", keywords: ["request", "floor", "direction", "destination", "call"] },
          { text: "Door (state machine)", keywords: ["door", "open", "close", "state"] },
          { text: "Button (floor panel + car panel)", keywords: ["button", "panel", "floor", "car", "inside"] },
          { text: "Floor", keywords: ["floor", "level", "storey"] },
        ],
        tip: "ElevatorController is the brain — it's where the dispatch algorithm lives.",
      },
      relationships: {
        label: "Relationships",
        checks: [
          { text: "Controller manages N Elevators", keywords: ["controller", "elevator", "manage", "has", "list"] },
          { text: "Elevator has a Door and a list of Requests", keywords: ["elevator", "door", "request", "queue", "list"] },
          { text: "Each Floor has UP/DOWN buttons", keywords: ["floor", "button", "up", "down", "panel"] },
          { text: "Request associated with Elevator after dispatch", keywords: ["request", "dispatch", "assign", "elevator"] },
          { text: "Elevator state machine transitions defined", keywords: ["state", "idle", "moving", "door", "transition"] },
        ],
        tip: "Elevator's state machine (IDLE → MOVING → DOOR_OPEN → IDLE) must be explicit.",
      },
      patterns: {
        label: "Design Patterns",
        checks: [
          { text: "State pattern for Elevator (IDLE/MOVING_UP/MOVING_DOWN/DOOR_OPEN)", keywords: ["state", "idle", "moving", "door", "pattern"] },
          { text: "Strategy for dispatch algorithm (pluggable)", keywords: ["strategy", "dispatch", "algorithm", "pluggable", "swap"] },
          { text: "Observer for floor arrival / door events", keywords: ["observer", "event", "arrival", "notify", "listener"] },
          { text: "Command for button press requests", keywords: ["command", "button", "request", "queue"] },
          { text: "Singleton for ElevatorController", keywords: ["singleton", "controller", "single", "one instance"] },
        ],
        tip: "Strategy for dispatch algorithm is the key SDE3 pattern — justify it.",
      },
      design: {
        label: "Class Design / Interfaces",
        checks: [
          { text: "requestElevator(floor, direction) called from floor panel", keywords: ["request", "floor", "direction", "call", "panel"] },
          { text: "dispatchElevator(request) → Elevator", keywords: ["dispatch", "elevator", "request", "assign", "best"] },
          { text: "Elevator.addDestination(floor) / moveToNextFloor()", keywords: ["destination", "add", "move", "next", "floor"] },
          { text: "DispatchStrategy interface with selectElevator()", keywords: ["strategy", "interface", "select", "elevator", "dispatch"] },
          { text: "ElevatorState interface with handleRequest()", keywords: ["state", "interface", "handle", "request"] },
        ],
        tip: "Keep the dispatch algorithm behind an interface so you can swap SCAN → ML-based later.",
      },
      flow: {
        label: "Use Case: User Calls Elevator",
        checks: [
          { text: "User presses UP on floor 5", keywords: ["press", "button", "floor", "up", "user"] },
          { text: "Controller dispatches nearest suitable elevator", keywords: ["dispatch", "nearest", "suitable", "controller", "select"] },
          { text: "Elevator moves, stops at floor 5, opens door", keywords: ["move", "stop", "open", "door", "arrive"] },
          { text: "User enters and presses destination (floor 12)", keywords: ["enter", "destination", "press", "inside", "car"] },
          { text: "Elevator adds floor 12 to its queue and continues", keywords: ["queue", "add", "destination", "continue", "move"] },
        ],
        tip: "Trace the full request lifecycle — external call → dispatch → pickup → deliver.",
      },
    },
    ideal: `enum Direction    { UP, DOWN }
enum ElevatorStatus { IDLE, MOVING_UP, MOVING_DOWN, DOOR_OPEN }

class Request {
    int floor; Direction direction; // external request
}

interface ElevatorState {
    void handleRequest(Elevator e, Request r);
    void move(Elevator e);
}
class IdleState implements ElevatorState { ... }
class MovingUpState implements ElevatorState { ... }

interface DispatchStrategy {
    Elevator selectElevator(List<Elevator> elevators, Request request);
}
class NearestCarStrategy implements DispatchStrategy {
    Elevator selectElevator(List<Elevator> elevators, Request r) {
        return elevators.stream()
            .filter(e -> e.canServiceDirection(r.direction))
            .min(Comparator.comparingInt(e -> Math.abs(e.currentFloor - r.floor)))
            .orElse(findIdleElevator(elevators));
    }
}

class Elevator {
    int id; int currentFloor; ElevatorStatus status;
    TreeSet<Integer> destinations; // sorted for SCAN algorithm
    ElevatorState state; Door door;
    void addDestination(int floor) { destinations.add(floor); }
    void moveToNextFloor() { /* move toward nearest destination */ }
}

class ElevatorController {          // Singleton
    List<Elevator> elevators;
    DispatchStrategy strategy;
    void requestElevator(int floor, Direction dir) {
        Elevator e = strategy.selectElevator(elevators, new Request(floor, dir));
        e.addDestination(floor);
    }
}`,
  },

  {
    id: "splitwise",
    title: "Splitwise — Expense Sharing",
    difficulty: "Medium",
    tag: "Fintech",
    minutes: 40,
    statement: `Design an expense-sharing application like Splitwise.\n\nRequirements:\n• Users can create groups and add members\n• Record expenses: who paid, how much, split among whom\n• Split types: Equal, Exact, Percentage, Share-based\n• Track balances: who owes whom how much\n• Simplify debts: minimize the number of transactions to settle\n• Notifications when you're added to an expense`,
    interviewerAnswers: {
      "Currency support?": "Single currency for now — multi-currency is a follow-up.",
      "Group size?": "Up to 20 members per group.",
      "Debt simplification?": "Yes — implement the minimize-transactions algorithm.",
      "Recurring expenses?": "Out of scope for now.",
      "Payment integration?": "Track only — no actual payment processing needed.",
    },
    rubric: {
      clarify: {
        label: "Clarifying Questions",
        checks: [
          { text: "Asked about split types (equal/exact/percentage)", keywords: ["split", "equal", "exact", "percentage", "share", "type"] },
          { text: "Asked about debt simplification", keywords: ["simplify", "debt", "minimize", "transaction", "settle"] },
          { text: "Asked about groups vs. 1-1 expenses", keywords: ["group", "1-1", "individual", "member", "direct"] },
          { text: "Asked about currency / multi-currency", keywords: ["currency", "dollar", "rupee", "multi", "exchange"] },
          { text: "Asked about notifications", keywords: ["notification", "notify", "alert", "remind"] },
        ],
        tip: "Debt simplification is the algorithmic crux — always ask if it's in scope.",
      },
      entities: {
        label: "Core Entities",
        checks: [
          { text: "User", keywords: ["user", "member", "person"] },
          { text: "Group", keywords: ["group", "team", "circle"] },
          { text: "Expense (who paid, total amount)", keywords: ["expense", "paid", "amount", "cost"] },
          { text: "ExpenseSplit (per-user split detail)", keywords: ["split", "share", "portion", "user", "amount"] },
          { text: "Balance (net owed between two users)", keywords: ["balance", "owe", "debt", "net"] },
          { text: "SplitStrategy / SplitType", keywords: ["strategy", "split", "equal", "type", "interface"] },
        ],
        tip: "ExpenseSplit is often missed — it records each person's portion of a specific expense.",
      },
      relationships: {
        label: "Relationships",
        checks: [
          { text: "Group has-many Users (members)", keywords: ["group", "user", "member", "has", "list"] },
          { text: "Expense belongs-to Group (or is 1-1)", keywords: ["expense", "group", "belong", "associate", "link"] },
          { text: "Expense has-many ExpenseSplits", keywords: ["expense", "split", "has", "list", "many"] },
          { text: "Balance is derived from Expenses (or cached)", keywords: ["balance", "derive", "compute", "cache", "net"] },
          { text: "ExpenseSplit references User + amount owed", keywords: ["split", "user", "amount", "owed", "reference"] },
        ],
        tip: "Balance can be computed on-the-fly or cached — mention the trade-off.",
      },
      patterns: {
        label: "Design Patterns",
        checks: [
          { text: "Strategy for SplitType (Equal/Exact/Percentage)", keywords: ["strategy", "split", "equal", "exact", "percentage", "interface"] },
          { text: "Observer for expense notifications", keywords: ["observer", "notification", "event", "notify", "listener"] },
          { text: "Factory for creating correct SplitStrategy", keywords: ["factory", "create", "strategy", "split", "type"] },
          { text: "Facade for SplitwiseService (simplifies API)", keywords: ["facade", "service", "simplify", "api", "entry"] },
          { text: "Explained debt simplification algorithm", keywords: ["simplify", "minimize", "graph", "net", "algorithm", "greedy"] },
        ],
        tip: "Strategy pattern for split types is the primary pattern — explain why it's extensible.",
      },
      design: {
        label: "Class Design / Interfaces",
        checks: [
          { text: "addExpense(groupId, paidBy, amount, splits) → Expense", keywords: ["addexpense", "expense", "paid", "amount", "split"] },
          { text: "getBalance(userId) → Map<User, Double>", keywords: ["balance", "user", "get", "map", "owe"] },
          { text: "SplitStrategy.calculateSplits(amount, users, metadata)", keywords: ["calculate", "split", "amount", "strategy", "interface"] },
          { text: "simplifyDebts(groupId) → List<Transaction>", keywords: ["simplify", "debt", "transaction", "minimize", "settle"] },
          { text: "settleUp(from, to, amount)", keywords: ["settle", "pay", "from", "to", "amount"] },
        ],
        tip: "simplifyDebts() is the interview money shot — walk through the greedy algorithm.",
      },
      flow: {
        label: "Use Case: Add Expense & Simplify",
        checks: [
          { text: "User adds expense: A paid 300, split equally among A, B, C", keywords: ["add", "expense", "paid", "split", "equal"] },
          { text: "System creates ExpenseSplits: each owes 100", keywords: ["split", "100", "each", "create", "record"] },
          { text: "Balances updated: B owes A 100, C owes A 100", keywords: ["balance", "owe", "update", "net"] },
          { text: "Debt simplification explained (net balance graph)", keywords: ["simplify", "graph", "net", "minimize", "transaction"] },
          { text: "Edge case: circular debts resolved", keywords: ["circular", "cycle", "resolve", "simplify", "debt"] },
        ],
        tip: "Trace through a concrete example: A↔B↔C cycle collapsing to a single transaction.",
      },
    },
    ideal: `interface SplitStrategy {
    List<ExpenseSplit> calculateSplits(double amount, List<User> users, Map<String,Object> meta);
}
class EqualSplit implements SplitStrategy {
    List<ExpenseSplit> calculateSplits(double amt, List<User> users, ...) {
        double share = amt / users.size();
        return users.stream().map(u -> new ExpenseSplit(u, share)).collect(toList());
    }
}
class PercentageSplit implements SplitStrategy { ... }
class ExactSplit    implements SplitStrategy { ... }

class Expense {
    String id; User paidBy; double amount;
    List<ExpenseSplit> splits; Group group; LocalDateTime createdAt;
}

class ExpenseSplit { User user; double amountOwed; }

class BalanceService {
    // net balance: positive = owed to you, negative = you owe
    Map<User, Double> getNetBalances(Group group) {
        Map<User, Double> net = new HashMap<>();
        for (Expense e : group.expenses) {
            net.merge(e.paidBy, e.amount, Double::sum);
            for (ExpenseSplit s : e.splits)
                net.merge(s.user, -s.amountOwed, Double::sum);
        }
        return net;
    }

    // Debt simplification: greedy algorithm — O(N log N)
    List<Transaction> simplifyDebts(Group group) {
        Map<User, Double> net = getNetBalances(group);
        PriorityQueue<Pair> givers = new PriorityQueue<>(...);  // most negative first
        PriorityQueue<Pair> receivers = new PriorityQueue<>(...); // most positive first
        List<Transaction> result = new ArrayList<>();
        while (!givers.isEmpty()) {
            Pair giver = givers.poll(); Pair receiver = receivers.poll();
            double amount = Math.min(-giver.amount, receiver.amount);
            result.add(new Transaction(giver.user, receiver.user, amount));
            // requeue remainder if any
        }
        return result;
    }
}`,
  },

  {
    id: "atm",
    title: "ATM Machine",
    difficulty: "Medium",
    tag: "Banking",
    minutes: 35,
    statement: `Design an ATM (Automated Teller Machine) system.\n\nRequirements:\n• User inserts card → enters PIN → performs transactions\n• Operations: Check Balance, Withdraw Cash, Deposit, Transfer, Change PIN\n• Card locked after 3 wrong PIN attempts\n• Dispense exact cash using available denominations\n• Print receipt after each transaction\n• Session timeout after 2 minutes of inactivity`,
    interviewerAnswers: {
      "Multiple currencies?": "Single currency for now.",
      "How many denominations?": "100, 200, 500, 2000 notes. Dispense using fewest notes.",
      "Network to bank?": "Yes — ATM communicates with bank server for auth and transactions.",
      "Concurrent users?": "One user at a time per ATM.",
      "Receipt printer always available?": "No — handle printer failure gracefully.",
    },
    rubric: {
      clarify: {
        label: "Clarifying Questions",
        checks: [
          { text: "Asked about available denominations", keywords: ["denomination", "note", "bill", "100", "500", "cash"] },
          { text: "Asked about PIN lockout policy", keywords: ["pin", "lock", "attempt", "wrong", "block", "3"] },
          { text: "Asked about bank network / authorization", keywords: ["bank", "network", "auth", "server", "connect", "online"] },
          { text: "Asked about session timeout", keywords: ["timeout", "session", "inactivity", "expire", "idle"] },
          { text: "Asked about receipt / printer failure handling", keywords: ["receipt", "printer", "print", "fail", "error"] },
        ],
        tip: "The cash dispensing algorithm (fewest notes) is a classic greedy problem — confirm denominations.",
      },
      entities: {
        label: "Core Entities",
        checks: [
          { text: "ATM (top-level machine)", keywords: ["atm", "machine"] },
          { text: "Card / Account", keywords: ["card", "account", "user", "bank"] },
          { text: "CashDispenser / CashInventory", keywords: ["dispenser", "cash", "inventory", "note", "denomination"] },
          { text: "Transaction (Withdraw/Deposit/Transfer)", keywords: ["transaction", "withdraw", "deposit", "transfer"] },
          { text: "Session (authenticated user state)", keywords: ["session", "state", "auth", "login", "user"] },
          { text: "Receipt / Printer", keywords: ["receipt", "printer", "print", "slip"] },
        ],
        tip: "CashDispenser is its own entity — it manages inventory and the dispensing algorithm.",
      },
      relationships: {
        label: "Relationships",
        checks: [
          { text: "ATM has-a CashDispenser + Printer + CardReader", keywords: ["atm", "has", "dispenser", "printer", "reader", "composit"] },
          { text: "Session links Card to ATM for duration", keywords: ["session", "card", "atm", "link", "associate"] },
          { text: "Transaction references Account + amount + type", keywords: ["transaction", "account", "amount", "type", "reference"] },
          { text: "ATM communicates with BankService (external)", keywords: ["bank", "service", "external", "communicate", "network"] },
          { text: "ATM state machine (IDLE → AUTH → TRANSACTION → IDLE)", keywords: ["state", "idle", "auth", "transaction", "machine"] },
        ],
        tip: "ATM is a state machine at its core — the states drive the user flow.",
      },
      patterns: {
        label: "Design Patterns",
        checks: [
          { text: "State pattern for ATM states (Idle/Auth/Transaction)", keywords: ["state", "idle", "auth", "transaction", "pattern"] },
          { text: "Strategy for Transaction types (Withdraw/Deposit/Transfer)", keywords: ["strategy", "withdraw", "deposit", "transfer", "transaction"] },
          { text: "Chain of Responsibility for cash dispensing", keywords: ["chain", "responsibility", "denomination", "dispense", "handler"] },
          { text: "Singleton for ATM or BankService connection", keywords: ["singleton", "atm", "bank", "one", "instance"] },
          { text: "Facade for ATMService (hides complexity)", keywords: ["facade", "service", "simplify", "hide", "entry"] },
        ],
        tip: "Chain of Responsibility for denominations (2000→500→200→100) is the clean approach.",
      },
      design: {
        label: "Class Design / Interfaces",
        checks: [
          { text: "authenticateCard(card, pin) → Session", keywords: ["authenticate", "card", "pin", "session", "login"] },
          { text: "withdraw(session, amount) → CashBundle", keywords: ["withdraw", "session", "amount", "cash", "dispense"] },
          { text: "CashDispenser.dispense(amount) → Map<Denomination, Integer>", keywords: ["dispense", "denomination", "map", "amount", "note"] },
          { text: "BankService interface (checkBalance / debit / credit)", keywords: ["bank", "service", "interface", "balance", "debit", "credit"] },
          { text: "Receipt.print(transaction)", keywords: ["receipt", "print", "transaction"] },
        ],
        tip: "The dispense() algorithm (greedy, largest denomination first) is worth coding out.",
      },
      flow: {
        label: "Use Case: Withdraw Cash",
        checks: [
          { text: "User inserts card; system validates card", keywords: ["insert", "card", "valid", "read", "swipe"] },
          { text: "PIN entered; bank authenticates", keywords: ["pin", "auth", "verify", "bank", "check"] },
          { text: "User requests withdrawal amount", keywords: ["withdraw", "amount", "request", "select"] },
          { text: "System checks balance + dispenses cash (fewest notes)", keywords: ["balance", "dispense", "note", "fewest", "greedy"] },
          { text: "Receipt printed; session ended", keywords: ["receipt", "print", "session", "end", "log out"] },
        ],
        tip: "Mention what happens if the ATM runs out of a denomination mid-dispense.",
      },
    },
    ideal: `enum ATMState { IDLE, CARD_INSERTED, AUTHENTICATED, TRANSACTION, DISPENSING }

interface ATMStateMachine {
    void insertCard(Card card);
    boolean enterPin(String pin);
    void selectTransaction(TransactionType type);
    void processTransaction(double amount);
    void ejectCard();
}

interface BankService {
    boolean authenticateCard(String cardNum, String pin);
    double getBalance(String accountNum);
    boolean debit(String accountNum, double amount);
    boolean credit(String accountNum, double amount);
}

class CashDispenser {
    // Chain of Responsibility — denominations handled largest-first
    TreeMap<Integer, Integer> inventory; // denom → count, sorted descending

    Map<Integer, Integer> dispense(double amount) {
        Map<Integer, Integer> result = new LinkedHashMap<>();
        int remaining = (int) amount;
        for (Map.Entry<Integer, Integer> e : inventory.descendingMap().entrySet()) {
            int denom = e.getKey(), count = Math.min(remaining / denom, e.getValue());
            if (count > 0) { result.put(denom, count); remaining -= denom * count; }
        }
        if (remaining > 0) throw new InsufficientCashException();
        // deduct from inventory
        result.forEach((d, c) -> inventory.merge(d, -c, Integer::sum));
        return result;
    }
}

class Session { Card card; String accountNum; LocalDateTime startTime; boolean authenticated; }

class ATMMachine {
    CashDispenser cashDispenser; BankService bankService;
    Printer printer; ATMState state = ATMState.IDLE;
    Session currentSession;

    boolean authenticate(Card card, String pin) {
        if (bankService.authenticateCard(card.number, pin)) {
            currentSession = new Session(card); state = ATMState.AUTHENTICATED; return true;
        }
        card.incrementFailedAttempts();
        if (card.failedAttempts >= 3) bankService.lockCard(card.number);
        return false;
    }

    CashBundle withdraw(double amount) {
        bankService.debit(currentSession.accountNum, amount);
        Map<Integer,Integer> notes = cashDispenser.dispense(amount);
        printer.printReceipt(new Transaction(WITHDRAWAL, amount));
        return new CashBundle(notes);
    }
}`,
  },

  {
    id: "vending",
    title: "Vending Machine",
    difficulty: "Easy",
    tag: "State Machine",
    minutes: 30,
    statement: `Design a Vending Machine.\n\nRequirements:\n• Accepts coins and notes of various denominations\n• Displays available products with prices\n• User selects product; machine dispenses if sufficient funds\n• Returns change optimally (fewest coins)\n• Handles: out-of-stock, insufficient funds, exact-change-only mode\n• Admin can restock items and collect cash`,
    interviewerAnswers: {
      "Denominations accepted?": "Coins: 1, 2, 5, 10. Notes: 50, 100.",
      "How many product slots?": "20 slots, each holds up to 10 items.",
      "Exact change mode?": "Yes — if machine can't make change, refuse transaction.",
      "Admin interface?": "Simple — restock, collect money, set prices.",
      "Network connected?": "No — standalone machine.",
    },
    rubric: {
      clarify: {
        label: "Clarifying Questions",
        checks: [
          { text: "Asked about accepted denominations", keywords: ["denomination", "coin", "note", "accept", "value"] },
          { text: "Asked about number of slots / capacity", keywords: ["slot", "capacity", "item", "product", "how many"] },
          { text: "Asked about exact change / insufficient change handling", keywords: ["change", "exact", "insufficient", "refund", "return"] },
          { text: "Asked about out-of-stock behavior", keywords: ["stock", "empty", "out", "unavailable", "sold"] },
          { text: "Asked about admin / maintenance interface", keywords: ["admin", "restock", "maintenance", "collect", "refill"] },
        ],
        tip: "Exact-change-only mode and out-of-stock are the two key edge cases to probe.",
      },
      entities: {
        label: "Core Entities",
        checks: [
          { text: "VendingMachine (top-level)", keywords: ["vendingmachine", "vending", "machine"] },
          { text: "Slot / Product Slot (holds items + price)", keywords: ["slot", "product", "item", "row", "code"] },
          { text: "Product / Item", keywords: ["product", "item", "good", "snack"] },
          { text: "Coin / Note (inserted money)", keywords: ["coin", "note", "money", "denomination", "insert"] },
          { text: "Transaction / Purchase", keywords: ["transaction", "purchase", "sale", "buy"] },
          { text: "ChangeDispenser", keywords: ["change", "dispenser", "return", "coin"] },
        ],
        tip: "Slot and Product are distinct — a slot has a price, quantity, and holds a product type.",
      },
      relationships: {
        label: "Relationships",
        checks: [
          { text: "VendingMachine has-many Slots", keywords: ["machine", "slot", "has", "contain", "list"] },
          { text: "Slot has-a Product and quantity", keywords: ["slot", "product", "quantity", "count", "has"] },
          { text: "VendingMachine has current balance (inserted coins)", keywords: ["balance", "insert", "current", "amount", "coin"] },
          { text: "VendingMachine has CashInventory (for change)", keywords: ["inventory", "cash", "change", "coin", "stock"] },
          { text: "State machine transitions defined", keywords: ["state", "idle", "select", "dispense", "transition"] },
        ],
        tip: "The machine's coin inventory (for making change) is separate from inserted coins.",
      },
      patterns: {
        label: "Design Patterns",
        checks: [
          { text: "State pattern (IDLE → COIN_INSERTED → PRODUCT_SELECTED → DISPENSING)", keywords: ["state", "idle", "coin", "selected", "dispense", "pattern"] },
          { text: "Strategy for change-making algorithm", keywords: ["strategy", "change", "algorithm", "greedy", "fewest"] },
          { text: "Command for admin operations (restock/collect)", keywords: ["command", "admin", "restock", "collect", "operation"] },
          { text: "Observer for display updates", keywords: ["observer", "display", "update", "notify", "ui"] },
          { text: "Singleton for VendingMachine", keywords: ["singleton", "one", "instance", "machine"] },
        ],
        tip: "State pattern is the primary pattern here — the machine's behavior changes based on state.",
      },
      design: {
        label: "Class Design / Interfaces",
        checks: [
          { text: "insertCoin(denomination) / insertNote(denomination)", keywords: ["insert", "coin", "note", "denomination", "accept"] },
          { text: "selectProduct(slotCode) → dispenses or error", keywords: ["select", "product", "slot", "dispense", "choose"] },
          { text: "cancel() → returns all inserted money", keywords: ["cancel", "return", "refund", "inserted", "money"] },
          { text: "makeChange(amount) → Map<Denomination, Count>", keywords: ["change", "make", "denomination", "count", "return"] },
          { text: "Admin: restock(slotCode, product, qty) + collectCash()", keywords: ["restock", "admin", "collect", "cash", "slot"] },
        ],
        tip: "cancel() is often forgotten — always include it.",
      },
      flow: {
        label: "Use Case: Buy a Product",
        checks: [
          { text: "User inserts coins; balance accumulates", keywords: ["insert", "coin", "balance", "accumulate", "add"] },
          { text: "User selects product slot", keywords: ["select", "product", "slot", "code", "choose"] },
          { text: "System checks balance ≥ price and stock > 0", keywords: ["check", "balance", "price", "stock", "sufficient"] },
          { text: "Product dispensed; balance deducted", keywords: ["dispense", "deduct", "balance", "product", "release"] },
          { text: "Change returned using fewest coins", keywords: ["change", "return", "fewest", "coin", "greedy"] },
        ],
        tip: "Handle the case where machine cannot make exact change — refuse or use exact-change mode.",
      },
    },
    ideal: `enum MachineState { IDLE, COIN_INSERTED, PRODUCT_SELECTED, DISPENSING, CHANGE_RETURN }

interface VendingMachineState {
    void insertCoin(VendingMachine m, Coin c);
    void selectProduct(VendingMachine m, String slotCode);
    void cancel(VendingMachine m);
}

class IdleState implements VendingMachineState {
    void insertCoin(VendingMachine m, Coin c) { m.addBalance(c.value); m.setState(new CoinInsertedState()); }
    void selectProduct(VendingMachine m, String code) { m.showMessage("Please insert coins first"); }
    void cancel(VendingMachine m) { /* nothing to return */ }
}

class CoinInsertedState implements VendingMachineState {
    void selectProduct(VendingMachine m, String code) {
        Slot slot = m.getSlot(code);
        if (slot.isEmpty()) { m.showMessage("Out of stock"); return; }
        if (m.getBalance() < slot.getPrice()) { m.showMessage("Insufficient funds"); return; }
        m.dispenseProduct(slot);
        m.returnChange(m.getBalance() - slot.getPrice());
        m.setState(new IdleState());
    }
}

class Slot { String code; Product product; int quantity; double price; boolean isEmpty() {...} }

class ChangeDispenser {
    TreeMap<Integer, Integer> coinInventory; // sorted descending

    Map<Integer, Integer> makeChange(double amount) {
        // greedy: largest coin first (same algorithm as ATM)
        int remaining = (int)(amount * 100); // work in cents
        Map<Integer, Integer> change = new LinkedHashMap<>();
        for (Map.Entry<Integer, Integer> e : coinInventory.descendingMap().entrySet()) {
            int count = Math.min(remaining / e.getKey(), e.getValue());
            if (count > 0) { change.put(e.getKey(), count); remaining -= e.getKey() * count; }
        }
        if (remaining > 0) throw new CannotMakeChangeException();
        change.forEach((d, c) -> coinInventory.merge(d, -c, Integer::sum));
        return change;
    }
}

class VendingMachine {
    List<Slot> slots; double balance = 0;
    VendingMachineState state = new IdleState();
    ChangeDispenser changeDispenser;
    void insertCoin(Coin c) { state.insertCoin(this, c); }
    void selectProduct(String code) { state.selectProduct(this, code); }
    void cancel() { state.cancel(this); }
}`,
  },

  {
    id: "food-delivery",
    title: "Food Delivery — Swiggy/Zomato",
    difficulty: "Hard",
    tag: "Marketplace",
    minutes: 50,
    statement: `Design the core backend for a food delivery platform like Swiggy or Zomato.\n\nRequirements:\n• Customers browse restaurants by location, search menu items\n• Place orders with multiple items from a single restaurant\n• Real-time order tracking: PLACED → ACCEPTED → PREPARING → PICKED_UP → DELIVERED\n• Delivery agent assignment (nearest available)\n• Restaurant and customer can cancel (before pickup)\n• Rating system for restaurant and delivery agent`,
    interviewerAnswers: {
      "Payment?": "Abstract it — not the focus. Assume pre-authorized.",
      "Live location tracking?": "Yes for delivery agent after pickup.",
      "Multiple restaurants in one order?": "No — one restaurant per order.",
      "Surge pricing?": "Out of scope.",
      "Estimated delivery time?": "Show ETA — assume distance/speed calculation available.",
    },
    rubric: {
      clarify: {
        label: "Clarifying Questions",
        checks: [
          { text: "Asked about single vs. multi-restaurant orders", keywords: ["restaurant", "multiple", "single", "one", "cart"] },
          { text: "Asked about real-time tracking / location", keywords: ["track", "location", "real-time", "live", "gps"] },
          { text: "Asked about delivery agent assignment algorithm", keywords: ["agent", "assign", "nearest", "dispatch", "delivery"] },
          { text: "Asked about cancellation policy", keywords: ["cancel", "policy", "before", "pickup", "refund"] },
          { text: "Asked about rating / review system", keywords: ["rating", "review", "feedback", "star", "rate"] },
          { text: "Asked about payment handling", keywords: ["payment", "pay", "wallet", "gateway", "refund"] },
        ],
        tip: "Delivery agent dispatch is the hardest part — clarify the assignment algorithm early.",
      },
      entities: {
        label: "Core Entities",
        checks: [
          { text: "Customer + DeliveryAgent + Restaurant", keywords: ["customer", "user", "agent", "restaurant", "delivery"] },
          { text: "Menu + MenuItem (with price)", keywords: ["menu", "item", "menuitem", "price", "dish"] },
          { text: "Order + OrderItem", keywords: ["order", "orderitem", "cart", "item"] },
          { text: "OrderStatus (state machine)", keywords: ["status", "state", "placed", "preparing", "delivered"] },
          { text: "Location / Address", keywords: ["location", "address", "gps", "coordinate", "geolocation"] },
          { text: "Rating + Review", keywords: ["rating", "review", "star", "feedback"] },
        ],
        tip: "Order and Cart are separate — Cart is transient, Order is persisted.",
      },
      relationships: {
        label: "Relationships",
        checks: [
          { text: "Restaurant has-many MenuItems", keywords: ["restaurant", "menu", "item", "has", "list"] },
          { text: "Order has-many OrderItems (from one Restaurant)", keywords: ["order", "item", "restaurant", "has", "list"] },
          { text: "Order has-one DeliveryAgent (assigned after acceptance)", keywords: ["order", "agent", "assign", "delivery", "has"] },
          { text: "Order state machine transitions defined", keywords: ["state", "placed", "accepted", "preparing", "picked", "delivered"] },
          { text: "Rating references Order + Customer/Agent/Restaurant", keywords: ["rating", "order", "reference", "customer", "agent"] },
        ],
        tip: "The Order status transitions are the backbone of the system — map them all.",
      },
      patterns: {
        label: "Design Patterns",
        checks: [
          { text: "State pattern for Order lifecycle", keywords: ["state", "order", "lifecycle", "placed", "delivered", "pattern"] },
          { text: "Strategy for delivery agent dispatch (nearest/load-balanced)", keywords: ["strategy", "dispatch", "nearest", "agent", "algorithm"] },
          { text: "Observer for real-time status notifications", keywords: ["observer", "event", "notification", "push", "notify"] },
          { text: "Factory for Order or Rating creation", keywords: ["factory", "create", "order", "rating", "build"] },
          { text: "Facade for OrderService (hides complexity)", keywords: ["facade", "service", "order", "simplify", "hide"] },
        ],
        tip: "Observer pattern enables the real-time tracking feed — mention websockets as the transport.",
      },
      design: {
        label: "Class Design / Interfaces",
        checks: [
          { text: "placeOrder(customerId, restaurantId, items) → Order", keywords: ["place", "order", "customer", "restaurant", "item"] },
          { text: "assignDeliveryAgent(orderId) → Agent", keywords: ["assign", "agent", "order", "dispatch", "delivery"] },
          { text: "updateOrderStatus(orderId, status) with notifications", keywords: ["update", "status", "order", "notify", "push"] },
          { text: "cancelOrder(orderId) with eligibility check", keywords: ["cancel", "order", "eligible", "check", "before"] },
          { text: "rateOrder(orderId, rateeType, stars, comment)", keywords: ["rate", "order", "star", "comment", "feedback"] },
        ],
        tip: "updateOrderStatus() should trigger notifications automatically — use Observer here.",
      },
      flow: {
        label: "Use Case: Customer Places Order",
        checks: [
          { text: "Customer selects restaurant + adds items to cart", keywords: ["select", "restaurant", "add", "cart", "item"] },
          { text: "Order placed → status PLACED; payment pre-authorized", keywords: ["place", "order", "placed", "payment", "authorize"] },
          { text: "Restaurant accepts → ACCEPTED; nearest agent assigned", keywords: ["accept", "agent", "assign", "nearest", "accepted"] },
          { text: "Agent picks up → PICKED_UP; live tracking begins", keywords: ["pickup", "picked", "track", "live", "agent"] },
          { text: "Delivered → status DELIVERED; rating prompt sent", keywords: ["deliver", "delivered", "rate", "rating", "prompt"] },
        ],
        tip: "Trace all 5 status transitions with who triggers each one.",
      },
    },
    ideal: `enum OrderStatus { PLACED, ACCEPTED, PREPARING, PICKED_UP, OUT_FOR_DELIVERY, DELIVERED, CANCELLED }
enum AgentStatus  { AVAILABLE, ON_TRIP, OFFLINE }

class MenuItem { String id; String name; double price; boolean available; }
class Restaurant { String id; String name; Location loc; List<MenuItem> menu; }

class OrderItem { MenuItem item; int quantity; double subtotal(); }

class Order {
    String id; Customer customer; Restaurant restaurant;
    List<OrderItem> items; OrderStatus status;
    DeliveryAgent agent; LocalDateTime placedAt;
    double totalAmount();
}

// Observer for status updates
interface OrderStatusListener { void onStatusChange(Order order, OrderStatus newStatus); }
class PushNotificationService implements OrderStatusListener { ... }
class ETAService implements OrderStatusListener { ... }

interface DispatchStrategy {
    DeliveryAgent selectAgent(List<DeliveryAgent> available, Location restaurantLoc);
}
class NearestAgentStrategy implements DispatchStrategy {
    DeliveryAgent selectAgent(List<DeliveryAgent> agents, Location loc) {
        return agents.stream()
            .filter(a -> a.status == AVAILABLE)
            .min(Comparator.comparingDouble(a -> distance(a.currentLoc, loc)))
            .orElseThrow(() -> new NoAgentAvailableException());
    }
}

class OrderService {
    DispatchStrategy dispatchStrategy;
    List<OrderStatusListener> listeners;

    Order placeOrder(String customerId, String restaurantId, List<CartItem> items) {
        Order order = new Order(customerId, restaurantId, items, PLACED);
        notifyListeners(order, PLACED);
        return orderRepo.save(order);
    }

    void updateStatus(String orderId, OrderStatus newStatus) {
        Order order = orderRepo.findById(orderId);
        if (newStatus == ACCEPTED) {
            order.agent = dispatchStrategy.selectAgent(availableAgents, order.restaurant.loc);
        }
        order.status = newStatus;
        notifyListeners(order, newStatus);
    }

    boolean cancelOrder(String orderId) {
        Order o = orderRepo.findById(orderId);
        if (o.status == PLACED || o.status == ACCEPTED) {
            updateStatus(orderId, CANCELLED); return true;
        }
        return false; // cannot cancel after PREPARING
    }
}`,
  },

  {
    id: "hotel",
    title: "Hotel Booking System",
    difficulty: "Hard",
    tag: "Reservation",
    minutes: 45,
    statement: `Design a Hotel Room Booking System.\n\nRequirements:\n• Hotels have multiple room types (Single, Double, Suite) with different prices\n• Search available rooms by location, dates, and type\n• Book a room: hold → payment → confirm\n• Support cancellation with dynamic refund policy\n• Manage amenities: WiFi, breakfast, parking (add-ons)\n• Hotel admin can manage rooms, pricing, and availability`,
    interviewerAnswers: {
      "Multiple hotels?": "Yes — the system manages a chain / marketplace of hotels.",
      "Concurrent bookings?": "Yes — prevent double-booking for the same room + dates.",
      "Dynamic pricing?": "Base price + seasonal multiplier. Keep simple.",
      "Cancellation?": "Full refund >48 hrs before check-in; 50% within 48 hrs; no refund on day.",
      "Reviews?": "Yes — customer can rate after checkout.",
    },
    rubric: {
      clarify: {
        label: "Clarifying Questions",
        checks: [
          { text: "Asked about room types and pricing tiers", keywords: ["room", "type", "single", "double", "suite", "price"] },
          { text: "Asked about concurrent booking / double-booking prevention", keywords: ["concurrent", "double", "book", "conflict", "lock"] },
          { text: "Asked about cancellation policy", keywords: ["cancel", "refund", "policy", "48", "hour"] },
          { text: "Asked about add-ons / amenities", keywords: ["amenity", "add-on", "wifi", "breakfast", "parking", "extra"] },
          { text: "Asked about search scope (single hotel vs. chain)", keywords: ["hotel", "chain", "multiple", "search", "location"] },
          { text: "Asked about dynamic pricing", keywords: ["price", "seasonal", "dynamic", "rate", "surge"] },
        ],
        tip: "Double-booking prevention is the core concurrency challenge — always probe it.",
      },
      entities: {
        label: "Core Entities",
        checks: [
          { text: "Hotel + Room + RoomType", keywords: ["hotel", "room", "type", "single", "suite"] },
          { text: "Booking / Reservation (dates + room + guest)", keywords: ["booking", "reservation", "date", "room", "guest"] },
          { text: "Guest / User", keywords: ["guest", "user", "customer", "person"] },
          { text: "Payment + Invoice", keywords: ["payment", "invoice", "bill", "charge"] },
          { text: "Amenity / AddOn", keywords: ["amenity", "addon", "wifi", "breakfast", "extra"] },
          { text: "RoomAvailability (date-range index)", keywords: ["availability", "available", "date", "calendar", "schedule"] },
        ],
        tip: "RoomAvailability as an explicit entity (or table) solves the double-booking problem cleanly.",
      },
      relationships: {
        label: "Relationships",
        checks: [
          { text: "Hotel has-many Rooms; Room has-a RoomType", keywords: ["hotel", "room", "type", "has", "list"] },
          { text: "Booking references Room + Guest + DateRange", keywords: ["booking", "room", "guest", "date", "reference"] },
          { text: "Booking has-many Amenities (add-ons)", keywords: ["booking", "amenity", "addon", "has", "list"] },
          { text: "RoomAvailability prevents double-booking (unique constraint)", keywords: ["availability", "unique", "constraint", "double", "conflict"] },
          { text: "Booking has-one Payment; Payment has Invoice", keywords: ["booking", "payment", "invoice", "has", "one"] },
        ],
        tip: "A unique DB constraint on (roomId, date) in RoomAvailability prevents double-booking at the DB level.",
      },
      patterns: {
        label: "Design Patterns",
        checks: [
          { text: "Strategy for cancellation refund policy", keywords: ["strategy", "cancel", "refund", "policy", "pluggable"] },
          { text: "Builder for Booking (many optional fields)", keywords: ["builder", "booking", "optional", "construct", "amenity"] },
          { text: "Observer for booking confirmation notifications", keywords: ["observer", "notification", "confirm", "email", "notify"] },
          { text: "Decorator for Amenity add-ons (price stacking)", keywords: ["decorator", "amenity", "addon", "price", "stack", "wrap"] },
          { text: "Template Method for booking flow", keywords: ["template", "method", "flow", "step", "hook", "booking"] },
        ],
        tip: "Decorator for amenities (WiFi wraps base room, Breakfast wraps WiFi...) is elegant.",
      },
      design: {
        label: "Class Design / Interfaces",
        checks: [
          { text: "searchRooms(location, checkIn, checkOut, type) → List<Room>", keywords: ["search", "room", "location", "date", "type"] },
          { text: "holdRoom(roomId, dates, guestId) → HoldToken", keywords: ["hold", "room", "token", "reserve", "lock"] },
          { text: "confirmBooking(holdToken, paymentInfo) → Booking", keywords: ["confirm", "booking", "payment", "token"] },
          { text: "cancelBooking(bookingId) → refundAmount", keywords: ["cancel", "booking", "refund", "amount"] },
          { text: "CancellationPolicy interface with calculateRefund()", keywords: ["cancel", "policy", "interface", "refund", "calculate"] },
        ],
        tip: "The hold → confirm two-phase flow (same as BookMyShow) prevents double-booking.",
      },
      flow: {
        label: "Use Case: Guest Books a Room",
        checks: [
          { text: "Guest searches available rooms for dates", keywords: ["search", "available", "date", "room", "guest"] },
          { text: "System holds room (prevents others from booking)", keywords: ["hold", "lock", "prevent", "concurrent", "reserve"] },
          { text: "Guest selects add-ons and confirms payment", keywords: ["addon", "amenity", "payment", "confirm", "select"] },
          { text: "Booking confirmed; room marked unavailable for dates", keywords: ["confirm", "unavailable", "booked", "date", "block"] },
          { text: "Cancellation flow with correct refund calculation", keywords: ["cancel", "refund", "48", "hours", "policy", "calculate"] },
        ],
        tip: "Walk through a cancellation scenario — it shows you've thought about the full lifecycle.",
      },
    },
    ideal: `enum RoomType   { SINGLE, DOUBLE, SUITE }
enum BookingStatus { HELD, CONFIRMED, CANCELLED, COMPLETED }

class Room {
    String id; RoomType type; Hotel hotel;
    double basePrice; List<String> amenities;
    double getPrice(LocalDate checkIn, LocalDate checkOut) { /* base × seasonal multiplier */ }
}

// Decorator pattern for add-ons
abstract class RoomBookingDecorator {
    RoomBooking wrappee; double additionalCost();
}
class BreakfastAddon extends RoomBookingDecorator { double additionalCost() { return 300 * nights; } }
class ParkingAddon  extends RoomBookingDecorator { double additionalCost() { return 100 * nights; } }

interface CancellationPolicy {
    double calculateRefund(Booking booking, LocalDate cancelDate);
}
class FlexiblePolicy implements CancellationPolicy {
    double calculateRefund(Booking b, LocalDate cancelDate) {
        long hoursToCheckIn = ChronoUnit.HOURS.between(cancelDate.atStartOfDay(), b.checkIn.atStartOfDay());
        if (hoursToCheckIn > 48) return b.totalAmount;
        if (hoursToCheckIn > 0)  return b.totalAmount * 0.5;
        return 0;
    }
}

class RoomAvailability {  // unique constraint on (roomId, date) prevents double-booking
    String roomId; LocalDate date; boolean isAvailable;
}

class BookingService {
    HoldToken holdRoom(String roomId, LocalDate in, LocalDate out, String guestId) {
        // DB transaction: check availability → insert RoomAvailability rows → return token
    }

    Booking confirmBooking(HoldToken token, PaymentInfo payment) {
        // validate hold not expired → process payment → set status=CONFIRMED
    }

    double cancelBooking(String bookingId, CancellationPolicy policy) {
        Booking b = bookingRepo.findById(bookingId);
        double refund = policy.calculateRefund(b, LocalDate.now());
        b.status = CANCELLED;
        releaseRoomAvailability(b);
        paymentService.refund(b.paymentId, refund);
        return refund;
    }
}`,
  },
];

// ─── STEP ORDER ───────────────────────────────────────────────────────────────
const STEP_ORDER = ["clarify", "entities", "relationships", "patterns", "design", "flow"];

// ─── KEYWORD SCORER (fallback) ────────────────────────────────────────────────
function keywordScore(answer = "", checks = []) {
  const lower = answer.toLowerCase();
  return checks.map((c) => ({
    ...c,
    passed: c.keywords.some((kw) => lower.includes(kw.toLowerCase())),
  }));
}

// ─── AI EVALUATION ────────────────────────────────────────────────────────────
async function fetchAIEvaluation(problem, steps) {
  const stepsPayload = STEP_ORDER.map((id) => ({
    id,
    label: problem.rubric[id].label,
    checks: problem.rubric[id].checks.map((c) => ({ text: c.text })),
    answer: steps[id] || "",
  }));

  const response = await fetch("/api/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ problemTitle: problem.title, steps: stepsPayload }),
  });

  if (!response.ok) throw new Error(`API error ${response.status}`);
  return response.json();
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = {
  app: { fontFamily: "'Segoe UI', system-ui, sans-serif", maxWidth: 860, margin: "0 auto", padding: "20px 16px", color: "#1e293b" },
  header: { textAlign: "center", marginBottom: 32 },
  h1: { fontSize: 28, fontWeight: 700, color: "#0f172a", marginBottom: 6 },
  sub: { color: "#64748b", fontSize: 15 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 16, marginTop: 8 },
  card: (selected) => ({
    border: `2px solid ${selected ? "#6366f1" : "#e2e8f0"}`,
    borderRadius: 12, padding: 20, cursor: "pointer",
    background: selected ? "#eef2ff" : "#fff",
    transition: "all 0.15s", boxShadow: selected ? "0 0 0 3px #c7d2fe" : "0 1px 3px rgba(0,0,0,0.07)",
  }),
  cardTitle: { fontWeight: 700, fontSize: 16, marginBottom: 4 },
  badge: (color) => ({
    display: "inline-block", fontSize: 11, fontWeight: 600,
    padding: "2px 8px", borderRadius: 20,
    background: color === "Hard" ? "#fee2e2" : color === "Medium" ? "#fef3c7" : "#dcfce7",
    color: color === "Hard" ? "#991b1b" : color === "Medium" ? "#92400e" : "#166534",
    marginRight: 6,
  }),
  tagBadge: { display: "inline-block", fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "#f1f5f9", color: "#475569" },
  btn: (variant = "primary") => ({
    padding: "10px 22px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14,
    background: variant === "primary" ? "#6366f1" : variant === "danger" ? "#ef4444" : "#f1f5f9",
    color: variant === "primary" ? "#fff" : variant === "danger" ? "#fff" : "#374151",
    transition: "opacity 0.15s",
  }),
  stepBar: { display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" },
  stepPill: (active, done) => ({
    padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none",
    background: active ? "#6366f1" : done ? "#86efac" : "#e2e8f0",
    color: active ? "#fff" : done ? "#14532d" : "#64748b",
  }),
  questionBox: { background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: 16, marginBottom: 16 },
  textarea: {
    width: "100%", minHeight: 160, padding: 12, borderRadius: 8,
    border: "1.5px solid #e2e8f0", fontSize: 14, fontFamily: "inherit",
    resize: "vertical", outline: "none", boxSizing: "border-box",
  },
  tip: { background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#78350f", marginTop: 12 },
  resultCard: (pct) => ({
    borderRadius: 12, padding: 24, marginBottom: 16, textAlign: "center",
    background: pct >= 80 ? "#f0fdf4" : pct >= 55 ? "#fffbeb" : "#fef2f2",
    border: `2px solid ${pct >= 80 ? "#86efac" : pct >= 55 ? "#fcd34d" : "#fca5a5"}`,
  }),
  checkRow: (passed) => ({
    display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0",
    borderBottom: "1px solid #f1f5f9",
  }),
  aiBox: { background: "#f0f4ff", border: "1px solid #c7d2fe", borderRadius: 10, padding: 16, marginTop: 12 },
};

// ─── TIMER ────────────────────────────────────────────────────────────────────
function Timer({ seconds }) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  const isLow = seconds < 120;
  return (
    <span style={{ fontVariantNumeric: "tabular-nums", color: isLow ? "#ef4444" : "#475569", fontWeight: 700, fontSize: 18 }}>
      ⏱ {mins}:{secs}
    </span>
  );
}

// ─── SELECT SCREEN ────────────────────────────────────────────────────────────
function SelectScreen({ onStart }) {
  const [sel, setSel] = useState(null);

  return (
    <div style={S.app}>
      <div style={S.header}>
        <h1 style={S.h1}>🎯 LLD Interview Simulator</h1>
        <p style={S.sub}>Practice Low-Level Design the way interviewers actually test it.</p>
      </div>

      <AdBanner slot="1234567890" label="Top Banner Ad" height={90} />

      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Choose a Problem</h2>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: 12 }}>
        {PROBLEMS.length} problems · Step-by-step rubric · AI-powered feedback
      </p>

      <div style={S.grid}>
        {PROBLEMS.slice(0, Math.ceil(PROBLEMS.length / 2)).map((p) => (
          <div key={p.id} style={S.card(sel === p.id)} onClick={() => setSel(p.id)}>
            <div style={S.cardTitle}>{p.title}</div>
            <div style={{ marginBottom: 8 }}>
              <span style={S.badge(p.difficulty)}>{p.difficulty}</span>
              <span style={S.tagBadge}>{p.tag}</span>
            </div>
            <div style={{ fontSize: 13, color: "#64748b" }}>⏱ {p.minutes} min</div>
          </div>
        ))}
      </div>

      <AdBanner slot="0987654321" label="Mid-Page Ad" height={120} />

      <div style={S.grid}>
        {PROBLEMS.slice(Math.ceil(PROBLEMS.length / 2)).map((p) => (
          <div key={p.id} style={S.card(sel === p.id)} onClick={() => setSel(p.id)}>
            <div style={S.cardTitle}>{p.title}</div>
            <div style={{ marginBottom: 8 }}>
              <span style={S.badge(p.difficulty)}>{p.difficulty}</span>
              <span style={S.tagBadge}>{p.tag}</span>
            </div>
            <div style={{ fontSize: 13, color: "#64748b" }}>⏱ {p.minutes} min</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, textAlign: "center" }}>
        <button
          style={{ ...S.btn("primary"), opacity: sel ? 1 : 0.4, padding: "12px 32px", fontSize: 15 }}
          disabled={!sel}
          onClick={() => sel && onStart(PROBLEMS.find((p) => p.id === sel))}
        >
          Start Interview →
        </button>
      </div>
    </div>
  );
}

// ─── INTERVIEW SCREEN ─────────────────────────────────────────────────────────
function InterviewScreen({ problem, onFinish }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showQ, setShowQ] = useState(false);
  const [timeLeft, setTimeLeft] = useState(problem.minutes * 60);

  useEffect(() => {
    const t = setInterval(() => setTimeLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const stepId = STEP_ORDER[step];
  const rubricStep = problem.rubric[stepId];

  return (
    <div style={S.app}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <span style={{ fontWeight: 700, fontSize: 18 }}>{problem.title}</span>
          <span style={{ ...S.badge(problem.difficulty), marginLeft: 8 }}>{problem.difficulty}</span>
        </div>
        <Timer seconds={timeLeft} />
      </div>

      {/* Step pills */}
      <div style={S.stepBar}>
        {STEP_ORDER.map((id, i) => (
          <button key={id} style={S.stepPill(i === step, i < step)} onClick={() => setStep(i)}>
            {i < step ? "✓ " : ""}{problem.rubric[id].label}
          </button>
        ))}
      </div>

      {/* Problem statement (step 0 only) */}
      {step === 0 && (
        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: 16, marginBottom: 16 }}>
          <strong>Problem Statement</strong>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: 14, color: "#334155", marginTop: 8 }}>{problem.statement}</pre>
        </div>
      )}

      {/* Interviewer Q&A toggle */}
      {step === 0 && (
        <div style={{ marginBottom: 16 }}>
          <button style={S.btn("secondary")} onClick={() => setShowQ(!showQ)}>
            {showQ ? "▲ Hide" : "▼ Show"} Interviewer Answers
          </button>
          {showQ && (
            <div style={{ ...S.questionBox, marginTop: 10 }}>
              {Object.entries(problem.interviewerAnswers).map(([q, a]) => (
                <div key={q} style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Q: {q}</div>
                  <div style={{ color: "#475569", fontSize: 14 }}>A: {a}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Prompt */}
      <div style={S.questionBox}>
        <strong style={{ fontSize: 15 }}>Step {step + 1} of 6: {rubricStep.label}</strong>
        <ul style={{ marginTop: 8, paddingLeft: 18, color: "#475569", fontSize: 14 }}>
          {rubricStep.checks.map((c, i) => <li key={i}>{c.text}</li>)}
        </ul>
      </div>

      <textarea
        style={S.textarea}
        placeholder={`Write your ${rubricStep.label.toLowerCase()} here...`}
        value={answers[stepId] || ""}
        onChange={(e) => setAnswers({ ...answers, [stepId]: e.target.value })}
      />

      <div style={S.tip}>💡 {rubricStep.tip}</div>

      <div style={{ display: "flex", gap: 10, marginTop: 16, justifyContent: "flex-end" }}>
        {step > 0 && <button style={S.btn("secondary")} onClick={() => setStep(step - 1)}>← Back</button>}
        {step < STEP_ORDER.length - 1
          ? <button style={S.btn()} onClick={() => setStep(step + 1)}>Next →</button>
          : <button style={S.btn()} onClick={() => onFinish(answers)}>Submit & See Results →</button>}
      </div>
    </div>
  );
}

// ─── RESULTS SCREEN ───────────────────────────────────────────────────────────
function ResultsScreen({ problem, answers, onRetry, onHome }) {
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(true);
  const [aiError, setAiError] = useState(false);
  const [showIdeal, setShowIdeal] = useState(false);

  // Keyword fallback scoring
  const kwScores = {};
  STEP_ORDER.forEach((id) => {
    kwScores[id] = keywordScore(answers[id], problem.rubric[id].checks);
  });
  const totalChecks = STEP_ORDER.reduce((s, id) => s + kwScores[id].length, 0);
  const totalPassed = STEP_ORDER.reduce((s, id) => s + kwScores[id].filter((c) => c.passed).length, 0);
  const pct = Math.round((totalPassed / totalChecks) * 100);
  const level = pct >= 80 ? "SDE3" : pct >= 55 ? "SDE2" : "SDE1";

  useEffect(() => {
    fetchAIEvaluation(problem, answers)
      .then((r) => { setAiResult(r); setAiLoading(false); })
      .catch(() => { setAiError(true); setAiLoading(false); });
  }, []);

  const displayLevel = aiResult?.finalLevel || level;
  const displayPct = pct;

  return (
    <div style={S.app}>
      <div style={{ ...S.resultCard(displayPct), marginBottom: 24 }}>
        <div style={{ fontSize: 48, marginBottom: 4 }}>
          {displayPct >= 80 ? "🏆" : displayPct >= 55 ? "📈" : "💪"}
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#0f172a" }}>{displayPct}%</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: displayLevel === "SDE3" ? "#166534" : displayLevel === "SDE2" ? "#92400e" : "#991b1b", marginBottom: 4 }}>
          {displayLevel} Level
        </div>
        <div style={{ color: "#475569", fontSize: 14 }}>{totalPassed}/{totalChecks} rubric criteria met (keyword check)</div>

        {/* AI Global Feedback */}
        {aiLoading && (
          <div style={{ ...S.aiBox, marginTop: 16, textAlign: "left" }}>
            <div style={{ color: "#6366f1", fontWeight: 600 }}>🤖 AI is evaluating your answers...</div>
            <div style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>This takes about 10 seconds</div>
          </div>
        )}
        {aiResult?.globalFeedback && (
          <div style={{ ...S.aiBox, marginTop: 16, textAlign: "left" }}>
            <div style={{ fontWeight: 700, color: "#4338ca", marginBottom: 6 }}>🤖 AI Feedback (Claude)</div>
            <div style={{ fontSize: 14, color: "#1e293b", lineHeight: 1.6 }}>{aiResult.globalFeedback}</div>
          </div>
        )}
        {aiError && (
          <div style={{ ...S.aiBox, background: "#fff7ed", border: "1px solid #fed7aa", marginTop: 16, textAlign: "left" }}>
            <div style={{ color: "#9a3412", fontSize: 13 }}>⚠️ AI evaluation unavailable — showing keyword-based scoring only.</div>
          </div>
        )}
      </div>

      <AdBanner slot="1122334455" label="Results Page Ad" height={90} />

      {/* Per-step results */}
      {STEP_ORDER.map((id) => {
        const rubricStep = problem.rubric[id];
        const kwChecks = kwScores[id];
        const aiStep = aiResult?.steps?.[id];
        const stepPassed = kwChecks.filter((c) => c.passed).length;
        const stepTotal = kwChecks.length;

        return (
          <div key={id} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 20, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <strong style={{ fontSize: 16 }}>{rubricStep.label}</strong>
              <span style={{ fontWeight: 700, color: stepPassed / stepTotal >= 0.7 ? "#16a34a" : "#dc2626" }}>
                {stepPassed}/{stepTotal}
              </span>
            </div>

            {/* Keyword check rows */}
            {kwChecks.map((c, i) => {
              const aiCheck = aiStep?.checkResults?.[i];
              return (
                <div key={i} style={S.checkRow(c.passed)}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{c.passed ? "✅" : "❌"}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14 }}>{c.text}</div>
                    {aiCheck?.comment && (
                      <div style={{ fontSize: 12, color: "#6366f1", marginTop: 2, fontStyle: "italic" }}>
                        🤖 {aiCheck.comment}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* AI step assessment */}
            {aiStep?.assessment && (
              <div style={{ background: "#f5f3ff", borderRadius: 8, padding: "10px 12px", marginTop: 12 }}>
                <div style={{ fontSize: 13, color: "#5b21b6", fontWeight: 600 }}>AI Assessment:</div>
                <div style={{ fontSize: 13, color: "#4c1d95", marginTop: 2 }}>{aiStep.assessment}</div>
                {aiStep.topMiss && (
                  <div style={{ fontSize: 12, color: "#7c3aed", marginTop: 4 }}>
                    ⚠️ Top miss: {aiStep.topMiss}
                  </div>
                )}
              </div>
            )}

            {/* Candidate's answer */}
            {answers[id] && (
              <details style={{ marginTop: 12 }}>
                <summary style={{ cursor: "pointer", fontSize: 13, color: "#64748b" }}>Your answer</summary>
                <pre style={{ background: "#f8fafc", borderRadius: 6, padding: 10, fontSize: 12, whiteSpace: "pre-wrap", marginTop: 6 }}>
                  {answers[id]}
                </pre>
              </details>
            )}
          </div>
        );
      })}

      {/* Ideal solution */}
      <div style={{ marginBottom: 24 }}>
        <button style={S.btn("secondary")} onClick={() => setShowIdeal(!showIdeal)}>
          {showIdeal ? "▲ Hide" : "▼ Show"} Ideal Solution
        </button>
        {showIdeal && (
          <pre style={{ background: "#0f172a", color: "#e2e8f0", borderRadius: 10, padding: 20, fontSize: 13, overflowX: "auto", marginTop: 10, whiteSpace: "pre-wrap" }}>
            {problem.ideal}
          </pre>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        <button style={S.btn("secondary")} onClick={onHome}>← All Problems</button>
        <button style={S.btn()} onClick={onRetry}>↺ Retry This Problem</button>
      </div>

      <AdBanner slot="5566778899" label="Footer Ad" height={90} />
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("select");
  const [problem, setProblem] = useState(null);
  const [answers, setAnswers] = useState(null);

  if (screen === "select") {
    return <SelectScreen onStart={(p) => { setProblem(p); setAnswers(null); setScreen("interview"); }} />;
  }
  if (screen === "interview") {
    return (
      <InterviewScreen
        problem={problem}
        onFinish={(a) => { setAnswers(a); setScreen("results"); }}
      />
    );
  }
  return (
    <ResultsScreen
      problem={problem}
      answers={answers}
      onRetry={() => { setAnswers(null); setScreen("interview"); }}
      onHome={() => setScreen("select")}
    />
  );
}

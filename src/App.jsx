import { useState, useEffect, useRef } from "react";

// ─── GLOBAL STYLES INJECTION ──────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
    background: #0a0a0f;
    color: #e2e8f0;
    min-height: 100vh;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; } to { opacity: 1; }
  }
  @keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
    70%  { box-shadow: 0 0 0 16px rgba(99,102,241,0); }
    100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes spin {
    from { transform: rotate(0deg); } to { transform: rotate(360deg); }
  }
  @keyframes countUp {
    from { opacity: 0; transform: scale(0.5); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes gradientShift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes floatBadge {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-6px); }
  }

  .fade-up  { animation: fadeUp  0.5s ease both; }
  .fade-in  { animation: fadeIn  0.4s ease both; }

  .problem-card {
    background: linear-gradient(135deg, #13131f 0%, #1a1a2e 100%);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 24px;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    position: relative;
    overflow: hidden;
  }
  .problem-card::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(99,102,241,0.08) 0%, transparent 60%);
    opacity: 0; transition: opacity 0.2s;
  }
  .problem-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.4); border-color: rgba(99,102,241,0.4); }
  .problem-card:hover::before { opacity: 1; }
  .problem-card.selected {
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99,102,241,0.3), 0 20px 40px rgba(99,102,241,0.2);
    transform: translateY(-4px);
  }
  .problem-card.selected::before { opacity: 1; }

  .btn-primary {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: #fff; border: none; border-radius: 12px;
    padding: 14px 32px; font-size: 15px; font-weight: 700;
    cursor: pointer; transition: all 0.2s ease;
    box-shadow: 0 4px 20px rgba(99,102,241,0.4);
    letter-spacing: 0.02em;
  }
  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(99,102,241,0.6);
  }
  .btn-primary:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }

  .btn-ghost {
    background: rgba(255,255,255,0.06); color: #94a3b8;
    border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
    padding: 10px 20px; font-size: 14px; font-weight: 600;
    cursor: pointer; transition: all 0.2s ease;
  }
  .btn-ghost:hover { background: rgba(255,255,255,0.1); color: #e2e8f0; border-color: rgba(255,255,255,0.2); }

  .step-pill {
    padding: 8px 16px; border-radius: 24px; font-size: 13px; font-weight: 600;
    cursor: pointer; border: none; transition: all 0.2s ease; white-space: nowrap;
  }
  .step-pill.done     { background: rgba(52,211,153,0.15); color: #34d399; border: 1px solid rgba(52,211,153,0.3); }
  .step-pill.active   { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; box-shadow: 0 4px 12px rgba(99,102,241,0.4); }
  .step-pill.pending  { background: rgba(255,255,255,0.05); color: #64748b; border: 1px solid rgba(255,255,255,0.07); }
  .step-pill:hover    { opacity: 0.85; }

  textarea.answer-box {
    width: 100%; min-height: 200px; padding: 16px;
    background: rgba(255,255,255,0.04);
    border: 1.5px solid rgba(255,255,255,0.1);
    border-radius: 14px; color: #e2e8f0; font-size: 14px;
    font-family: 'Inter', sans-serif; resize: vertical; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    line-height: 1.7;
  }
  textarea.answer-box:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
  }
  textarea.answer-box::placeholder { color: #475569; }

  .check-row {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
    transition: background 0.2s;
  }
  .check-row:last-child { border-bottom: none; }

  .score-ring {
    animation: countUp 0.6s cubic-bezier(0.34,1.56,0.64,1) both;
  }

  .gradient-text {
    background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-gradient {
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
    background-size: 200% 200%;
    animation: gradientShift 6s ease infinite;
  }

  .glass {
    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
  }

  .ai-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2));
    border: 1px solid rgba(99,102,241,0.4);
    border-radius: 20px; padding: 4px 12px;
    font-size: 12px; font-weight: 600; color: #a5b4fc;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }

  details > summary { list-style: none; cursor: pointer; }
  details > summary::-webkit-details-marker { display: none; }
`;

function StyleInjector() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
  return null;
}

// ─── AD BANNER ────────────────────────────────────────────────────────────────
const ADSENSE_ENABLED = false;
const PUBLISHER_ID = "ca-pub-XXXXXXXXXX";

function AdBanner({ slot, height = 90 }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ADSENSE_ENABLED) return;
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
  }, []);
  if (!ADSENSE_ENABLED) return null; // hide placeholder in production UI
  return (
    <div style={{ margin: "16px 0", textAlign: "center", minHeight: height }}>
      <ins ref={ref} className="adsbygoogle" style={{ display: "block" }}
        data-ad-client={PUBLISHER_ID} data-ad-slot={slot}
        data-ad-format="auto" data-full-width-responsive="true" />
    </div>
  );
}

// ─── PROBLEM BANK ────────────────────────────────────────────────────────────
const STEP_PROMPTS = {
  clarify: {
    icon: "🎯",
    heading: "Ask your clarifying questions",
    prompt: "You're talking to the interviewer. What do you need to know before you start designing? Ask about requirements, scale, constraints, edge cases, and any assumptions you're making. Aim for 4–6 focused questions.",
  },
  entities: {
    icon: "📦",
    heading: "Identify core entities",
    prompt: "List the main classes and objects in your system. Think about the nouns in the requirements — what things exist in your domain? Include their key attributes.",
  },
  relationships: {
    icon: "🔗",
    heading: "Define relationships",
    prompt: "How do your entities relate to each other? Describe associations, compositions, aggregations, and inheritance hierarchies. Be explicit about cardinality (one-to-many, etc.).",
  },
  patterns: {
    icon: "🧩",
    heading: "Apply design patterns",
    prompt: "Which design patterns fit this problem? Name the patterns you'd use and — crucially — explain *why* each one applies. Don't just list them; justify the choice.",
  },
  design: {
    icon: "🏗️",
    heading: "Class design & interfaces",
    prompt: "Define the key interfaces, classes, and method signatures. What does the public API look like? Show the contracts between your components.",
  },
  flow: {
    icon: "🌊",
    heading: "Walk through the use case",
    prompt: "Trace through the primary use case step by step — who calls what, in what order, and what changes in state. Include at least one error or edge case.",
  },
};

const PROBLEMS = [
  {
    id: "parking",
    title: "Parking Lot System",
    difficulty: "Medium",
    tag: "Classic",
    minutes: 40,
    emoji: "🚗",
    description: "Multi-level parking with vehicle types, ticketing & payments",
    statement: `Design a multi-level Parking Lot system.\n\nRequirements:\n• Multiple floors, each with parking spots\n• Support vehicle types: Bike, Car, Truck\n• Each vehicle type maps to a spot type (Motorcycle / Compact / Large)\n• Entry gate issues a ticket with entry time\n• Exit gate calculates fee and processes payment (Cash or Card)\n• Find the nearest available spot on entry`,
    interviewerAnswers: {
      "How many floors / spots?": "Assume up to 5 floors, ~200 spots each. Design should be configurable.",
      "Concurrency needed?": "Not required for this round — single-threaded is fine.",
      "Pricing model?": "Hourly rate, different per vehicle type. Keep it simple.",
      "Multiple gates?": "Yes, multiple entry and exit gates.",
      "Reservations?": "Out of scope for now.",
    },
    rubric: {
      clarify: { label: "Clarifying Questions", checks: [
        { text: "Asked about vehicle / spot types", keywords: ["vehicle","type","bike","car","truck","spot"] },
        { text: "Asked about payment methods", keywords: ["payment","cash","card","pay"] },
        { text: "Asked about number of floors / scale", keywords: ["floor","scale","how many","size","capacity"] },
        { text: "Asked about concurrency", keywords: ["concurrent","concurrency","parallel","thread","race"] },
        { text: "Asked about pricing model", keywords: ["price","pricing","hourly","flat","fee","rate"] },
        { text: "Asked about multiple gates", keywords: ["gate","entry","exit","multiple"] },
      ], tip: "A senior engineer always clarifies scope before touching the whiteboard." },
      entities: { label: "Core Entities", checks: [
        { text: "ParkingLot (top-level container)", keywords: ["parkinglot","parking lot","lot"] },
        { text: "ParkingFloor / Level", keywords: ["floor","level","storey"] },
        { text: "ParkingSpot (with type)", keywords: ["spot","space","slot","bay","parkingspot"] },
        { text: "Vehicle (base + subtypes)", keywords: ["vehicle","car","bike","truck"] },
        { text: "Ticket (entry record)", keywords: ["ticket","token","receipt"] },
        { text: "Payment abstraction", keywords: ["payment","cash","card"] },
      ], tip: "Extract entities from the nouns in your use cases." },
      relationships: { label: "Relationships", checks: [
        { text: "ParkingLot has-many Floors (composition)", keywords: ["parkinglot","floor","has","contain","composit"] },
        { text: "Floor has-many Spots (composition)", keywords: ["floor","spot","has","contain","composit"] },
        { text: "Spot optionally has-a Vehicle (association)", keywords: ["spot","vehicle","associat","optional","assign"] },
        { text: "Ticket references Spot + Vehicle + time", keywords: ["ticket","spot","vehicle","time"] },
        { text: "Mentioned is-a for Vehicle subtypes", keywords: ["extends","inherits","is-a","subclass","car","bike"] },
      ], tip: "Always state composition vs aggregation explicitly." },
      patterns: { label: "Design Patterns", checks: [
        { text: "Singleton for ParkingLot", keywords: ["singleton","single instance","one instance","parkinglot"] },
        { text: "Strategy for Payment", keywords: ["strategy","payment","interchangeable","pluggable"] },
        { text: "Factory for Vehicle or Spot creation", keywords: ["factory","creat","instantiat"] },
        { text: "State for Spot (AVAILABLE / OCCUPIED)", keywords: ["state","available","occupied","status","reserved"] },
        { text: "Explained *why* each pattern fits", keywords: ["because","since","allows","enables","reason","swap","runtime"] },
      ], tip: "Don't just list patterns — justify them." },
      design: { label: "Class Design / Interfaces", checks: [
        { text: "parkVehicle(vehicle) → Ticket", keywords: ["parkvehicle","park","vehicle","ticket"] },
        { text: "unparkVehicle(ticket) → fee", keywords: ["unpark","exit","ticket","fee","payment"] },
        { text: "findAvailableSpot(vehicleType) → Spot", keywords: ["find","available","spot","type"] },
        { text: "PaymentStrategy interface", keywords: ["calculatefee","calculate","processpayment","process","interface","strategy"] },
        { text: "Spot: assignVehicle() + removeVehicle()", keywords: ["assign","remove","spot","vehicle"] },
      ], tip: "Design the interface (contract) before the class internals." },
      flow: { label: "Use Case: Vehicle Parks", checks: [
        { text: "Gate receives vehicle", keywords: ["gate","entry","arrive","enter"] },
        { text: "System finds available spot matching type", keywords: ["find","available","spot","type","match"] },
        { text: "Spot is assigned to vehicle", keywords: ["assign","reserve","occupy"] },
        { text: "Ticket created with entry time + spot info", keywords: ["ticket","time","spot","creat","issu"] },
        { text: "Edge case: no spots available", keywords: ["full","no spot","exception","error","unavailable","null","optional"] },
      ], tip: "Always handle the unhappy path." },
    },
    ideal: `// Enums
enum VehicleType  { BIKE, CAR, TRUCK }
enum SpotType     { MOTORCYCLE, COMPACT, LARGE }
enum SpotStatus   { AVAILABLE, OCCUPIED }

abstract class Vehicle {
    String licensePlate; VehicleType type;
    abstract SpotType requiredSpotType();
}
class Bike extends Vehicle  { SpotType requiredSpotType() { return MOTORCYCLE; } }
class Car  extends Vehicle  { SpotType requiredSpotType() { return COMPACT; } }
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
    Ticket parkVehicle(Vehicle v) { ... }
    double unparkVehicle(Ticket t, PaymentStrategy p) { ... }
}`,
  },
  {
    id: "bookmyshow", title: "BookMyShow — Movie Booking", difficulty: "Hard", tag: "Classic", minutes: 45, emoji: "🎬",
    description: "Seat selection, concurrent booking locks & payment flow",
    statement: `Design the core booking system for a movie-ticket platform like BookMyShow.\n\nRequirements:\n• Users search for movies by city / theatre / showtime\n• Select seats on a seat map, book and pay\n• Seat must be locked during payment to prevent double booking\n• Support seat categories: Silver, Gold, Platinum (different pricing)\n• Booking confirmation sent after successful payment\n• Cancellation support with partial refund`,
    interviewerAnswers: {
      "Concurrency?": "Yes — handle concurrent seat selection. Prevent double booking.",
      "Scale?": "Design for thousands of concurrent users on a blockbuster release.",
      "Payment provider?": "Treat as external — abstract it behind an interface.",
      "Seat lock duration?": "10 minutes. Release if payment not completed.",
      "Cancellation window?": "Up to 2 hours before showtime; 50% refund.",
    },
    rubric: {
      clarify: { label: "Clarifying Questions", checks: [
        { text: "Asked about concurrency / double booking", keywords: ["concurrent","double book","race","lock","simultaneous"] },
        { text: "Asked about seat categories / pricing tiers", keywords: ["category","tier","silver","gold","platinum","price"] },
        { text: "Asked about cancellation policy", keywords: ["cancel","refund","policy"] },
        { text: "Asked about seat lock / hold duration", keywords: ["lock","hold","timeout","expire","10 min"] },
        { text: "Asked about payment abstraction", keywords: ["payment","gateway","external","provider"] },
        { text: "Asked about search / discovery scope", keywords: ["search","filter","city","theatre","movie"] },
      ], tip: "Double-booking is the killer edge case — always probe concurrency first." },
      entities: { label: "Core Entities", checks: [
        { text: "Movie", keywords: ["movie","film"] },
        { text: "Theatre / Screen", keywords: ["theatre","screen","cinema","hall"] },
        { text: "Show (Movie + Screen + Time)", keywords: ["show","showtime","screening","slot"] },
        { text: "Seat (with category)", keywords: ["seat","silver","gold","platinum"] },
        { text: "Booking / Reservation", keywords: ["booking","reservation","ticket"] },
        { text: "User + Payment", keywords: ["user","customer","payment"] },
      ], tip: "'Show' is the pivot entity — it links Movie, Screen, and Time." },
      relationships: { label: "Relationships", checks: [
        { text: "Theatre has-many Screens; Screen has-many Seats", keywords: ["theatre","screen","seat","has"] },
        { text: "Show references Movie + Screen", keywords: ["show","movie","screen","reference"] },
        { text: "Booking has-many Seats; Seat tracks state", keywords: ["booking","seat","status","available","booked"] },
        { text: "Seat lock / hold relationship explained", keywords: ["lock","hold","expire","timeout","seat"] },
        { text: "User → Booking (one-to-many)", keywords: ["user","booking","many","history"] },
      ], tip: "A Seat can be: AVAILABLE → LOCKED → BOOKED or back to AVAILABLE." },
      patterns: { label: "Design Patterns", checks: [
        { text: "State pattern for Seat", keywords: ["state","available","locked","booked","status"] },
        { text: "Strategy for Payment gateway", keywords: ["strategy","payment","gateway","pluggable"] },
        { text: "Observer for booking confirmation", keywords: ["observer","event","notification","email","confirmation"] },
        { text: "Factory for Seat or Booking creation", keywords: ["factory","creat","build"] },
        { text: "Lock mechanism for concurrency", keywords: ["lock","optimistic","pessimistic","concurrent","transaction"] },
      ], tip: "The seat-lock mechanism separates SDE2 from SDE3 answers." },
      design: { label: "Class Design / Interfaces", checks: [
        { text: "searchShows(city, movie, date) → List<Show>", keywords: ["search","show","city","movie","date"] },
        { text: "lockSeats(showId, seatIds, userId) → LockToken", keywords: ["lock","seat","token","hold"] },
        { text: "confirmBooking(lockToken, paymentInfo) → Booking", keywords: ["confirm","booking","payment","token"] },
        { text: "cancelBooking(bookingId) → refundAmount", keywords: ["cancel","booking","refund"] },
        { text: "Seat status transitions clearly defined", keywords: ["status","transition","available","locked","booked"] },
      ], tip: "The lock → confirm two-phase pattern is the crux of this design." },
      flow: { label: "Use Case: User Books Seats", checks: [
        { text: "User searches show and selects seats", keywords: ["search","select","seat","show"] },
        { text: "System locks seats for N minutes", keywords: ["lock","hold","minute","timer"] },
        { text: "User completes payment", keywords: ["payment","pay","complete"] },
        { text: "Booking confirmed, seats marked BOOKED", keywords: ["confirm","booked","ticket"] },
        { text: "Handles expired lock / payment failure", keywords: ["expire","fail","timeout","release","error"] },
      ], tip: "Walk through the lock expiry scenario — it shows you've thought about concurrency." },
    },
    ideal: `enum SeatStatus { AVAILABLE, LOCKED, BOOKED }
enum SeatCategory { SILVER, GOLD, PLATINUM }

class Seat {
    String id; SeatCategory category; SeatStatus status;
    String lockedByUserId; LocalDateTime lockExpiry;
    boolean isAvailable() { return status == AVAILABLE || lockExpired(); }
}

class SeatLockService {   // handles concurrency via DB transaction
    LockToken lockSeats(Show show, List<String> seatIds, String userId) { ... }
    void releaseExpiredLocks() { /* scheduled job */ }
}

interface PaymentGateway { PaymentResult charge(PaymentInfo info, double amount); }

class BookingService {
    LockToken lockSeats(String showId, List<String> seatIds, String userId) { ... }
    Booking confirmBooking(LockToken token, PaymentInfo payment) { ... }
    double cancelBooking(String bookingId) { ... }
}`,
  },
  {
    id: "chess", title: "Chess Game", difficulty: "Medium", tag: "Classic", minutes: 40, emoji: "♟️",
    description: "OOP chess with move validation, check & checkmate detection",
    statement: `Design an object-oriented Chess game.\n\nRequirements:\n• Two players take turns moving pieces\n• All standard chess pieces: King, Queen, Rook, Bishop, Knight, Pawn\n• Validate moves according to chess rules\n• Detect check, checkmate, and stalemate\n• Track game history (move log)\n• Support resign / draw offer`,
    interviewerAnswers: {
      "AI opponent?": "No, just two human players.",
      "Online multiplayer?": "Out of scope — same machine for now.",
      "Full rule set?": "Yes: castling, en passant, pawn promotion.",
      "Persist game state?": "Nice to have — focus on in-memory first.",
      "Timer?": "Out of scope.",
    },
    rubric: {
      clarify: { label: "Clarifying Questions", checks: [
        { text: "Asked about AI vs human players", keywords: ["ai","computer","human","player","opponent"] },
        { text: "Asked about special moves", keywords: ["castling","en passant","promotion","special","rule"] },
        { text: "Asked about online vs local", keywords: ["online","network","local","same machine","multiplayer"] },
        { text: "Asked about persistence / save game", keywords: ["save","persist","database","store","resume"] },
        { text: "Asked about draw / resign", keywords: ["draw","resign","stalemate","forfeit"] },
      ], tip: "Special moves like castling reveal depth — ask if they're in scope." },
      entities: { label: "Core Entities", checks: [
        { text: "Board (8×8 grid)", keywords: ["board","grid","8x8","cell","square"] },
        { text: "Piece (abstract base)", keywords: ["piece","abstract","base"] },
        { text: "Concrete pieces (King, Queen, Rook, Bishop, Knight, Pawn)", keywords: ["king","queen","rook","bishop","knight","pawn"] },
        { text: "Player (Color: WHITE/BLACK)", keywords: ["player","white","black","color"] },
        { text: "Move (from, to, piece, captured)", keywords: ["move","from","to","position"] },
        { text: "Game (manages state and turn)", keywords: ["game","state","turn","status"] },
      ], tip: "Move as a first-class entity enables undo/redo and game history." },
      relationships: { label: "Relationships", checks: [
        { text: "Board contains 64 Cells/Squares", keywords: ["board","cell","square","64","contain"] },
        { text: "Cell optionally holds a Piece", keywords: ["cell","square","piece","optional","hold"] },
        { text: "Piece has a Color and position", keywords: ["piece","color","position","white","black"] },
        { text: "Game has two Players and a Board", keywords: ["game","player","board","has"] },
        { text: "Game has a list of Moves (history)", keywords: ["game","move","history","log","list"] },
      ], tip: "The Board→Cell→Piece chain is the core composition in chess." },
      patterns: { label: "Design Patterns", checks: [
        { text: "Command pattern for Move (enables undo)", keywords: ["command","move","undo","execute","reverse"] },
        { text: "Strategy for move validation per piece type", keywords: ["strategy","valid","rule","piece","move"] },
        { text: "Observer for check/checkmate detection", keywords: ["observer","event","check","detect","notify"] },
        { text: "State for Game status", keywords: ["state","active","check","checkmate","stalemate","status"] },
        { text: "Iterator or Visitor for board traversal", keywords: ["iterator","visitor","traverse","iterate","board"] },
      ], tip: "Command pattern for moves is the SDE3 differentiator — it enables replay and undo." },
      design: { label: "Class Design / Interfaces", checks: [
        { text: "Piece.getValidMoves(board) → List<Position>", keywords: ["valid","move","position","get","list"] },
        { text: "Board.movePiece(from, to)", keywords: ["move","execute","board","from","to"] },
        { text: "Game.isInCheck(player) / isCheckmate(player)", keywords: ["check","checkmate","incheck","detect"] },
        { text: "Game.makeMove(move) validates + applies", keywords: ["makemove","make","validate","apply"] },
        { text: "MoveHistory / GameLog records all moves", keywords: ["history","log","record","move","list"] },
      ], tip: "isInCheck() is the most complex method — walk through its algorithm." },
      flow: { label: "Use Case: Player Makes a Move", checks: [
        { text: "Player selects piece and target square", keywords: ["select","piece","square","target","choose"] },
        { text: "System validates move for that piece type", keywords: ["valid","check","move","rule","piece"] },
        { text: "System verifies move doesn't leave own King in check", keywords: ["king","check","own","leave","verify"] },
        { text: "Move is executed; captured piece removed", keywords: ["execute","capture","remove","apply"] },
        { text: "System detects check/checkmate after move", keywords: ["detect","check","checkmate","stalemate","after"] },
      ], tip: "The 'doesn't leave own King in check' validation is often forgotten." },
    },
    ideal: `enum Color { WHITE, BLACK }
enum GameStatus { ACTIVE, CHECK, CHECKMATE, STALEMATE, DRAW }

class Position { int row; int col; }

abstract class Piece {
    Color color; Position pos; boolean hasMoved;
    abstract List<Position> getValidMoves(Board board);
}
class King extends Piece { /* 1 square any dir + castling */ }
class Queen extends Piece { /* rook + bishop combined */ }

class Cell { Position pos; Piece piece; /* nullable */ }

class Board {
    Cell[][] grid = new Cell[8][8];
    void movePiece(Position from, Position to) { ... }
    boolean isUnderAttack(Position p, Color byColor) { ... }
}

class Move {             // Command pattern
    Piece piece; Position from; Position to; Piece captured;
    void execute(Board b) { ... }
    void undo(Board b)    { ... }
}

class Game {
    Board board; Player white; Player black;
    Player currentPlayer; GameStatus status; List<Move> history;

    boolean makeMove(Position from, Position to) {
        Move m = new Move(board.getPiece(from), from, to);
        m.execute(board);
        if (isInCheck(currentPlayer)) { m.undo(board); return false; }
        history.add(m); updateStatus(); swapTurn(); return true;
    }
    boolean isInCheck(Player p) { return board.isUnderAttack(p.kingPos, opponent(p).color); }
}`,
  },
  {
    id: "elevator", title: "Elevator Control System", difficulty: "Hard", tag: "Classic", minutes: 45, emoji: "🛗",
    description: "Multi-elevator dispatch with pluggable scheduling algorithms",
    statement: `Design an Elevator Control System for a high-rise building.\n\nRequirements:\n• N elevators serving M floors\n• Users press UP/DOWN on floor panels; press destination inside elevator\n• Dispatch algorithm picks the best elevator for each request\n• Support emergency stop and door-open/close buttons\n• Track each elevator's state: IDLE, MOVING_UP, MOVING_DOWN, DOOR_OPEN`,
    interviewerAnswers: {
      "How many elevators / floors?": "10 elevators, 50 floors. Configurable.",
      "Dispatch algorithm?": "Start with nearest-car (SCAN/LOOK). Mention advanced options.",
      "Freight vs passenger?": "Passenger only for now.",
      "Emergency?": "Emergency button stops elevator and opens door at nearest floor.",
      "Overload sensor?": "Out of scope.",
    },
    rubric: {
      clarify: { label: "Clarifying Questions", checks: [
        { text: "Asked about number of elevators and floors", keywords: ["elevator","floor","how many","number","scale"] },
        { text: "Asked about dispatch algorithm preference", keywords: ["dispatch","algorithm","nearest","scan","schedule"] },
        { text: "Asked about emergency / special modes", keywords: ["emergency","fire","special","stop","alarm"] },
        { text: "Asked about passenger vs freight", keywords: ["passenger","freight","cargo","type"] },
        { text: "Asked about door behavior / sensors", keywords: ["door","sensor","open","close","obstruct"] },
      ], tip: "The dispatch algorithm is the heart of this problem — always ask about it." },
      entities: { label: "Core Entities", checks: [
        { text: "Elevator (with state + current floor)", keywords: ["elevator","state","floor","current"] },
        { text: "ElevatorController / Dispatcher", keywords: ["controller","dispatcher","system","coordinator"] },
        { text: "Request (floor + direction or destination)", keywords: ["request","floor","direction","destination","call"] },
        { text: "Door (state machine)", keywords: ["door","open","close","state"] },
        { text: "Button (floor panel + car panel)", keywords: ["button","panel","floor","car","inside"] },
        { text: "Floor", keywords: ["floor","level","storey"] },
      ], tip: "ElevatorController is the brain — it's where the dispatch algorithm lives." },
      relationships: { label: "Relationships", checks: [
        { text: "Controller manages N Elevators", keywords: ["controller","elevator","manage","has","list"] },
        { text: "Elevator has a Door and a list of Requests", keywords: ["elevator","door","request","queue","list"] },
        { text: "Each Floor has UP/DOWN buttons", keywords: ["floor","button","up","down","panel"] },
        { text: "Request associated with Elevator after dispatch", keywords: ["request","dispatch","assign","elevator"] },
        { text: "Elevator state machine transitions defined", keywords: ["state","idle","moving","door","transition"] },
      ], tip: "Elevator's state machine (IDLE → MOVING → DOOR_OPEN → IDLE) must be explicit." },
      patterns: { label: "Design Patterns", checks: [
        { text: "State pattern for Elevator", keywords: ["state","idle","moving","door","pattern"] },
        { text: "Strategy for dispatch algorithm (pluggable)", keywords: ["strategy","dispatch","algorithm","pluggable","swap"] },
        { text: "Observer for floor arrival / door events", keywords: ["observer","event","arrival","notify","listener"] },
        { text: "Command for button press requests", keywords: ["command","button","request","queue"] },
        { text: "Singleton for ElevatorController", keywords: ["singleton","controller","single","one instance"] },
      ], tip: "Strategy for dispatch algorithm is the key SDE3 pattern — justify it." },
      design: { label: "Class Design / Interfaces", checks: [
        { text: "requestElevator(floor, direction) from floor panel", keywords: ["request","floor","direction","call","panel"] },
        { text: "dispatchElevator(request) → Elevator", keywords: ["dispatch","elevator","request","assign","best"] },
        { text: "Elevator.addDestination(floor) / moveToNextFloor()", keywords: ["destination","add","move","next","floor"] },
        { text: "DispatchStrategy interface with selectElevator()", keywords: ["strategy","interface","select","elevator","dispatch"] },
        { text: "ElevatorState interface with handleRequest()", keywords: ["state","interface","handle","request"] },
      ], tip: "Keep the dispatch algorithm behind an interface so you can swap algorithms later." },
      flow: { label: "Use Case: User Calls Elevator", checks: [
        { text: "User presses UP on floor 5", keywords: ["press","button","floor","up","user"] },
        { text: "Controller dispatches nearest suitable elevator", keywords: ["dispatch","nearest","suitable","controller","select"] },
        { text: "Elevator moves, stops at floor 5, opens door", keywords: ["move","stop","open","door","arrive"] },
        { text: "User enters and presses destination (floor 12)", keywords: ["enter","destination","press","inside","car"] },
        { text: "Elevator adds floor 12 to queue and continues", keywords: ["queue","add","destination","continue","move"] },
      ], tip: "Trace the full request lifecycle — external call → dispatch → pickup → deliver." },
    },
    ideal: `interface DispatchStrategy {
    Elevator selectElevator(List<Elevator> elevators, Request request);
}
class NearestCarStrategy implements DispatchStrategy { ... }

interface ElevatorState {
    void handleRequest(Elevator e, Request r);
    void move(Elevator e);
}
class IdleState    implements ElevatorState { ... }
class MovingUpState implements ElevatorState { ... }

class Elevator {
    int id; int currentFloor;
    TreeSet<Integer> destinations; // sorted for SCAN
    ElevatorState state; Door door;
    void addDestination(int floor) { destinations.add(floor); }
}

class ElevatorController {   // Singleton
    List<Elevator> elevators; DispatchStrategy strategy;
    void requestElevator(int floor, Direction dir) {
        Elevator e = strategy.selectElevator(elevators, new Request(floor, dir));
        e.addDestination(floor);
    }
}`,
  },
  {
    id: "splitwise", title: "Splitwise — Expense Sharing", difficulty: "Medium", tag: "Fintech", minutes: 40, emoji: "💸",
    description: "Split types, net balances & debt simplification algorithm",
    statement: `Design an expense-sharing application like Splitwise.\n\nRequirements:\n• Users can create groups and add members\n• Record expenses: who paid, how much, split among whom\n• Split types: Equal, Exact, Percentage, Share-based\n• Track balances: who owes whom how much\n• Simplify debts: minimize the number of transactions to settle\n• Notifications when you're added to an expense`,
    interviewerAnswers: {
      "Currency support?": "Single currency for now.",
      "Group size?": "Up to 20 members per group.",
      "Debt simplification?": "Yes — implement the minimize-transactions algorithm.",
      "Recurring expenses?": "Out of scope for now.",
      "Payment integration?": "Track only — no actual payment processing needed.",
    },
    rubric: {
      clarify: { label: "Clarifying Questions", checks: [
        { text: "Asked about split types", keywords: ["split","equal","exact","percentage","share","type"] },
        { text: "Asked about debt simplification", keywords: ["simplify","debt","minimize","transaction","settle"] },
        { text: "Asked about groups vs. 1-1 expenses", keywords: ["group","1-1","individual","member","direct"] },
        { text: "Asked about currency", keywords: ["currency","dollar","rupee","multi","exchange"] },
        { text: "Asked about notifications", keywords: ["notification","notify","alert","remind"] },
      ], tip: "Debt simplification is the algorithmic crux — always ask if it's in scope." },
      entities: { label: "Core Entities", checks: [
        { text: "User", keywords: ["user","member","person"] },
        { text: "Group", keywords: ["group","team","circle"] },
        { text: "Expense (who paid, total amount)", keywords: ["expense","paid","amount","cost"] },
        { text: "ExpenseSplit (per-user split detail)", keywords: ["split","share","portion","user","amount"] },
        { text: "Balance (net owed between two users)", keywords: ["balance","owe","debt","net"] },
        { text: "SplitStrategy / SplitType", keywords: ["strategy","split","equal","type","interface"] },
      ], tip: "ExpenseSplit is often missed — it records each person's portion of an expense." },
      relationships: { label: "Relationships", checks: [
        { text: "Group has-many Users (members)", keywords: ["group","user","member","has","list"] },
        { text: "Expense belongs-to Group (or is 1-1)", keywords: ["expense","group","belong","associate","link"] },
        { text: "Expense has-many ExpenseSplits", keywords: ["expense","split","has","list","many"] },
        { text: "Balance is derived from Expenses (or cached)", keywords: ["balance","derive","compute","cache","net"] },
        { text: "ExpenseSplit references User + amount owed", keywords: ["split","user","amount","owed","reference"] },
      ], tip: "Balance can be computed on-the-fly or cached — mention the trade-off." },
      patterns: { label: "Design Patterns", checks: [
        { text: "Strategy for SplitType", keywords: ["strategy","split","equal","exact","percentage","interface"] },
        { text: "Observer for expense notifications", keywords: ["observer","notification","event","notify","listener"] },
        { text: "Factory for creating correct SplitStrategy", keywords: ["factory","create","strategy","split","type"] },
        { text: "Facade for SplitwiseService", keywords: ["facade","service","simplify","api","entry"] },
        { text: "Explained debt simplification algorithm", keywords: ["simplify","minimize","graph","net","algorithm","greedy"] },
      ], tip: "Strategy pattern for split types is the primary pattern — explain why it's extensible." },
      design: { label: "Class Design / Interfaces", checks: [
        { text: "addExpense(groupId, paidBy, amount, splits)", keywords: ["addexpense","expense","paid","amount","split"] },
        { text: "getBalance(userId) → Map<User, Double>", keywords: ["balance","user","get","map","owe"] },
        { text: "SplitStrategy.calculateSplits(amount, users)", keywords: ["calculate","split","amount","strategy","interface"] },
        { text: "simplifyDebts(groupId) → List<Transaction>", keywords: ["simplify","debt","transaction","minimize","settle"] },
        { text: "settleUp(from, to, amount)", keywords: ["settle","pay","from","to","amount"] },
      ], tip: "simplifyDebts() is the interview money shot — walk through the greedy algorithm." },
      flow: { label: "Use Case: Add Expense & Simplify", checks: [
        { text: "User adds expense: A paid 300, split equally among A, B, C", keywords: ["add","expense","paid","split","equal"] },
        { text: "System creates ExpenseSplits: each owes 100", keywords: ["split","100","each","create","record"] },
        { text: "Balances updated: B owes A 100, C owes A 100", keywords: ["balance","owe","update","net"] },
        { text: "Debt simplification explained", keywords: ["simplify","graph","net","minimize","transaction"] },
        { text: "Edge case: circular debts resolved", keywords: ["circular","cycle","resolve","simplify","debt"] },
      ], tip: "Trace through a concrete example: A↔B↔C cycle collapsing to a single transaction." },
    },
    ideal: `interface SplitStrategy {
    List<ExpenseSplit> calculateSplits(double amount, List<User> users, Map<String,Object> meta);
}
class EqualSplit      implements SplitStrategy { ... }
class PercentageSplit implements SplitStrategy { ... }
class ExactSplit      implements SplitStrategy { ... }

class BalanceService {
    Map<User, Double> getNetBalances(Group group) { ... }

    // Greedy debt simplification — O(N log N)
    List<Transaction> simplifyDebts(Group group) {
        Map<User, Double> net = getNetBalances(group);
        PriorityQueue<Pair> givers    = new PriorityQueue<>(...); // most negative
        PriorityQueue<Pair> receivers = new PriorityQueue<>(...); // most positive
        while (!givers.isEmpty()) {
            double amount = Math.min(-giver.amount, receiver.amount);
            result.add(new Transaction(giver.user, receiver.user, amount));
        }
        return result;
    }
}`,
  },
  {
    id: "atm", title: "ATM Machine", difficulty: "Medium", tag: "Banking", minutes: 35, emoji: "🏧",
    description: "State machine, PIN lockout & greedy cash dispensing",
    statement: `Design an ATM (Automated Teller Machine) system.\n\nRequirements:\n• User inserts card → enters PIN → performs transactions\n• Operations: Check Balance, Withdraw Cash, Deposit, Transfer, Change PIN\n• Card locked after 3 wrong PIN attempts\n• Dispense exact cash using available denominations (fewest notes)\n• Print receipt after each transaction\n• Session timeout after 2 minutes of inactivity`,
    interviewerAnswers: {
      "Multiple currencies?": "Single currency for now.",
      "Denominations?": "100, 200, 500, 2000 notes. Dispense using fewest notes.",
      "Network to bank?": "Yes — ATM communicates with bank server for auth and transactions.",
      "Concurrent users?": "One user at a time per ATM.",
      "Receipt printer failures?": "Handle printer failure gracefully.",
    },
    rubric: {
      clarify: { label: "Clarifying Questions", checks: [
        { text: "Asked about available denominations", keywords: ["denomination","note","bill","100","500","cash"] },
        { text: "Asked about PIN lockout policy", keywords: ["pin","lock","attempt","wrong","block","3"] },
        { text: "Asked about bank network / authorization", keywords: ["bank","network","auth","server","connect","online"] },
        { text: "Asked about session timeout", keywords: ["timeout","session","inactivity","expire","idle"] },
        { text: "Asked about receipt / printer failure", keywords: ["receipt","printer","print","fail","error"] },
      ], tip: "The cash dispensing algorithm (fewest notes) is a classic greedy problem — confirm denominations." },
      entities: { label: "Core Entities", checks: [
        { text: "ATM (top-level machine)", keywords: ["atm","machine"] },
        { text: "Card / Account", keywords: ["card","account","user","bank"] },
        { text: "CashDispenser / CashInventory", keywords: ["dispenser","cash","inventory","note","denomination"] },
        { text: "Transaction (Withdraw/Deposit/Transfer)", keywords: ["transaction","withdraw","deposit","transfer"] },
        { text: "Session (authenticated user state)", keywords: ["session","state","auth","login","user"] },
        { text: "Receipt / Printer", keywords: ["receipt","printer","print","slip"] },
      ], tip: "CashDispenser is its own entity — it manages inventory and the dispensing algorithm." },
      relationships: { label: "Relationships", checks: [
        { text: "ATM has-a CashDispenser + Printer + CardReader", keywords: ["atm","has","dispenser","printer","reader","composit"] },
        { text: "Session links Card to ATM for duration", keywords: ["session","card","atm","link","associate"] },
        { text: "Transaction references Account + amount + type", keywords: ["transaction","account","amount","type","reference"] },
        { text: "ATM communicates with BankService (external)", keywords: ["bank","service","external","communicate","network"] },
        { text: "ATM state machine (IDLE → AUTH → TRANSACTION → IDLE)", keywords: ["state","idle","auth","transaction","machine"] },
      ], tip: "ATM is a state machine at its core — the states drive the user flow." },
      patterns: { label: "Design Patterns", checks: [
        { text: "State pattern for ATM states", keywords: ["state","idle","auth","transaction","pattern"] },
        { text: "Strategy for Transaction types", keywords: ["strategy","withdraw","deposit","transfer","transaction"] },
        { text: "Chain of Responsibility for cash dispensing", keywords: ["chain","responsibility","denomination","dispense","handler"] },
        { text: "Singleton for ATM or BankService", keywords: ["singleton","atm","bank","one","instance"] },
        { text: "Facade for ATMService", keywords: ["facade","service","simplify","hide","entry"] },
      ], tip: "Chain of Responsibility for denominations (2000→500→200→100) is the clean approach." },
      design: { label: "Class Design / Interfaces", checks: [
        { text: "authenticateCard(card, pin) → Session", keywords: ["authenticate","card","pin","session","login"] },
        { text: "withdraw(session, amount) → CashBundle", keywords: ["withdraw","session","amount","cash","dispense"] },
        { text: "CashDispenser.dispense(amount) → Map<Denomination, Integer>", keywords: ["dispense","denomination","map","amount","note"] },
        { text: "BankService interface (checkBalance / debit / credit)", keywords: ["bank","service","interface","balance","debit","credit"] },
        { text: "Receipt.print(transaction)", keywords: ["receipt","print","transaction"] },
      ], tip: "The dispense() algorithm (greedy, largest denomination first) is worth coding out." },
      flow: { label: "Use Case: Withdraw Cash", checks: [
        { text: "User inserts card; system validates card", keywords: ["insert","card","valid","read","swipe"] },
        { text: "PIN entered; bank authenticates", keywords: ["pin","auth","verify","bank","check"] },
        { text: "User requests withdrawal amount", keywords: ["withdraw","amount","request","select"] },
        { text: "System checks balance + dispenses cash (fewest notes)", keywords: ["balance","dispense","note","fewest","greedy"] },
        { text: "Receipt printed; session ended", keywords: ["receipt","print","session","end","log out"] },
      ], tip: "Mention what happens if the ATM runs out of a denomination mid-dispense." },
    },
    ideal: `interface ATMStateMachine {
    void insertCard(Card card); boolean enterPin(String pin);
    void selectTransaction(TransactionType type);
    void processTransaction(double amount); void ejectCard();
}

class CashDispenser {
    TreeMap<Integer, Integer> inventory; // descending by denomination
    Map<Integer, Integer> dispense(double amount) {
        int remaining = (int) amount;
        for (Map.Entry<Integer, Integer> e : inventory.descendingMap().entrySet()) {
            int count = Math.min(remaining / e.getKey(), e.getValue());
            if (count > 0) { result.put(e.getKey(), count); remaining -= e.getKey() * count; }
        }
        if (remaining > 0) throw new InsufficientCashException();
        return result;
    }
}

interface BankService {
    boolean authenticateCard(String cardNum, String pin);
    double getBalance(String accountNum);
    boolean debit(String accountNum, double amount);
}

class ATMMachine {
    CashDispenser cashDispenser; BankService bankService;
    Printer printer; ATMState state = ATMState.IDLE; Session session;

    boolean authenticate(Card card, String pin) { ... }
    CashBundle withdraw(double amount) {
        bankService.debit(session.accountNum, amount);
        Map<Integer,Integer> notes = cashDispenser.dispense(amount);
        printer.printReceipt(new Transaction(WITHDRAWAL, amount));
        return new CashBundle(notes);
    }
}`,
  },
  {
    id: "vending", title: "Vending Machine", difficulty: "Easy", tag: "State Machine", minutes: 30, emoji: "🥤",
    description: "Coin acceptance, state transitions & change-making algorithm",
    statement: `Design a Vending Machine.\n\nRequirements:\n• Accepts coins and notes of various denominations\n• Displays available products with prices\n• User selects product; machine dispenses if sufficient funds\n• Returns change optimally (fewest coins)\n• Handles: out-of-stock, insufficient funds, exact-change-only mode\n• Admin can restock items and collect cash`,
    interviewerAnswers: {
      "Denominations accepted?": "Coins: 1, 2, 5, 10. Notes: 50, 100.",
      "How many product slots?": "20 slots, each holds up to 10 items.",
      "Exact change mode?": "Yes — if machine can't make change, refuse transaction.",
      "Admin interface?": "Simple — restock, collect money, set prices.",
      "Network connected?": "No — standalone machine.",
    },
    rubric: {
      clarify: { label: "Clarifying Questions", checks: [
        { text: "Asked about accepted denominations", keywords: ["denomination","coin","note","accept","value"] },
        { text: "Asked about number of slots / capacity", keywords: ["slot","capacity","item","product","how many"] },
        { text: "Asked about change handling", keywords: ["change","exact","insufficient","refund","return"] },
        { text: "Asked about out-of-stock behavior", keywords: ["stock","empty","out","unavailable","sold"] },
        { text: "Asked about admin / maintenance interface", keywords: ["admin","restock","maintenance","collect","refill"] },
      ], tip: "Exact-change-only mode and out-of-stock are the two key edge cases to probe." },
      entities: { label: "Core Entities", checks: [
        { text: "VendingMachine (top-level)", keywords: ["vendingmachine","vending","machine"] },
        { text: "Slot / Product Slot", keywords: ["slot","product","item","row","code"] },
        { text: "Product / Item", keywords: ["product","item","good","snack"] },
        { text: "Coin / Note (inserted money)", keywords: ["coin","note","money","denomination","insert"] },
        { text: "Transaction / Purchase", keywords: ["transaction","purchase","sale","buy"] },
        { text: "ChangeDispenser", keywords: ["change","dispenser","return","coin"] },
      ], tip: "Slot and Product are distinct — a slot has a price, quantity, and holds a product type." },
      relationships: { label: "Relationships", checks: [
        { text: "VendingMachine has-many Slots", keywords: ["machine","slot","has","contain","list"] },
        { text: "Slot has-a Product and quantity", keywords: ["slot","product","quantity","count","has"] },
        { text: "VendingMachine has current balance (inserted coins)", keywords: ["balance","insert","current","amount","coin"] },
        { text: "VendingMachine has CashInventory (for change)", keywords: ["inventory","cash","change","coin","stock"] },
        { text: "State machine transitions defined", keywords: ["state","idle","select","dispense","transition"] },
      ], tip: "The machine's coin inventory (for making change) is separate from inserted coins." },
      patterns: { label: "Design Patterns", checks: [
        { text: "State pattern (IDLE → COIN_INSERTED → PRODUCT_SELECTED)", keywords: ["state","idle","coin","selected","dispense","pattern"] },
        { text: "Strategy for change-making algorithm", keywords: ["strategy","change","algorithm","greedy","fewest"] },
        { text: "Command for admin operations", keywords: ["command","admin","restock","collect","operation"] },
        { text: "Observer for display updates", keywords: ["observer","display","update","notify","ui"] },
        { text: "Singleton for VendingMachine", keywords: ["singleton","one","instance","machine"] },
      ], tip: "State pattern is the primary pattern here — behavior changes based on state." },
      design: { label: "Class Design / Interfaces", checks: [
        { text: "insertCoin(denomination) / insertNote(denomination)", keywords: ["insert","coin","note","denomination","accept"] },
        { text: "selectProduct(slotCode) → dispenses or error", keywords: ["select","product","slot","dispense","choose"] },
        { text: "cancel() → returns all inserted money", keywords: ["cancel","return","refund","inserted","money"] },
        { text: "makeChange(amount) → Map<Denomination, Count>", keywords: ["change","make","denomination","count","return"] },
        { text: "Admin: restock(slotCode, qty) + collectCash()", keywords: ["restock","admin","collect","cash","slot"] },
      ], tip: "cancel() is often forgotten — always include it." },
      flow: { label: "Use Case: Buy a Product", checks: [
        { text: "User inserts coins; balance accumulates", keywords: ["insert","coin","balance","accumulate","add"] },
        { text: "User selects product slot", keywords: ["select","product","slot","code","choose"] },
        { text: "System checks balance ≥ price and stock > 0", keywords: ["check","balance","price","stock","sufficient"] },
        { text: "Product dispensed; balance deducted", keywords: ["dispense","deduct","balance","product","release"] },
        { text: "Change returned using fewest coins", keywords: ["change","return","fewest","coin","greedy"] },
      ], tip: "Handle the case where machine cannot make exact change." },
    },
    ideal: `interface VendingMachineState {
    void insertCoin(VendingMachine m, Coin c);
    void selectProduct(VendingMachine m, String slotCode);
    void cancel(VendingMachine m);
}
class IdleState         implements VendingMachineState { ... }
class CoinInsertedState implements VendingMachineState { ... }

class ChangeDispenser {
    TreeMap<Integer, Integer> coinInventory;
    Map<Integer, Integer> makeChange(double amount) {
        // greedy: largest coin first
        int remaining = (int)(amount * 100);
        for (Map.Entry<Integer, Integer> e : coinInventory.descendingMap().entrySet()) {
            int count = Math.min(remaining / e.getKey(), e.getValue());
            if (count > 0) { change.put(e.getKey(), count); remaining -= e.getKey() * count; }
        }
        if (remaining > 0) throw new CannotMakeChangeException();
        return change;
    }
}

class VendingMachine {
    List<Slot> slots; double balance = 0;
    VendingMachineState state = new IdleState();
    ChangeDispenser changeDispenser;
    void insertCoin(Coin c)       { state.insertCoin(this, c); }
    void selectProduct(String id) { state.selectProduct(this, id); }
    void cancel()                 { state.cancel(this); }
}`,
  },
  {
    id: "food-delivery", title: "Food Delivery — Swiggy/Zomato", difficulty: "Hard", tag: "Marketplace", minutes: 50, emoji: "🍔",
    description: "Order lifecycle, agent dispatch & real-time tracking",
    statement: `Design the core backend for a food delivery platform like Swiggy or Zomato.\n\nRequirements:\n• Customers browse restaurants by location, search menu items\n• Place orders with multiple items from a single restaurant\n• Real-time order tracking: PLACED → ACCEPTED → PREPARING → PICKED_UP → DELIVERED\n• Delivery agent assignment (nearest available)\n• Restaurant and customer can cancel (before pickup)\n• Rating system for restaurant and delivery agent`,
    interviewerAnswers: {
      "Payment?": "Abstract it — not the focus. Assume pre-authorized.",
      "Live location tracking?": "Yes for delivery agent after pickup.",
      "Multiple restaurants in one order?": "No — one restaurant per order.",
      "Surge pricing?": "Out of scope.",
      "ETA?": "Show ETA — assume distance/speed calculation available.",
    },
    rubric: {
      clarify: { label: "Clarifying Questions", checks: [
        { text: "Asked about single vs. multi-restaurant orders", keywords: ["restaurant","multiple","single","one","cart"] },
        { text: "Asked about real-time tracking / location", keywords: ["track","location","real-time","live","gps"] },
        { text: "Asked about delivery agent assignment algorithm", keywords: ["agent","assign","nearest","dispatch","delivery"] },
        { text: "Asked about cancellation policy", keywords: ["cancel","policy","before","pickup","refund"] },
        { text: "Asked about rating / review system", keywords: ["rating","review","feedback","star","rate"] },
        { text: "Asked about payment handling", keywords: ["payment","pay","wallet","gateway","refund"] },
      ], tip: "Delivery agent dispatch is the hardest part — clarify the assignment algorithm early." },
      entities: { label: "Core Entities", checks: [
        { text: "Customer + DeliveryAgent + Restaurant", keywords: ["customer","user","agent","restaurant","delivery"] },
        { text: "Menu + MenuItem (with price)", keywords: ["menu","item","menuitem","price","dish"] },
        { text: "Order + OrderItem", keywords: ["order","orderitem","cart","item"] },
        { text: "OrderStatus (state machine)", keywords: ["status","state","placed","preparing","delivered"] },
        { text: "Location / Address", keywords: ["location","address","gps","coordinate","geolocation"] },
        { text: "Rating + Review", keywords: ["rating","review","star","feedback"] },
      ], tip: "Order and Cart are separate — Cart is transient, Order is persisted." },
      relationships: { label: "Relationships", checks: [
        { text: "Restaurant has-many MenuItems", keywords: ["restaurant","menu","item","has","list"] },
        { text: "Order has-many OrderItems (from one Restaurant)", keywords: ["order","item","restaurant","has","list"] },
        { text: "Order has-one DeliveryAgent (assigned after acceptance)", keywords: ["order","agent","assign","delivery","has"] },
        { text: "Order state machine transitions defined", keywords: ["state","placed","accepted","preparing","picked","delivered"] },
        { text: "Rating references Order + Customer/Agent/Restaurant", keywords: ["rating","order","reference","customer","agent"] },
      ], tip: "The Order status transitions are the backbone of the system — map them all." },
      patterns: { label: "Design Patterns", checks: [
        { text: "State pattern for Order lifecycle", keywords: ["state","order","lifecycle","placed","delivered","pattern"] },
        { text: "Strategy for delivery agent dispatch", keywords: ["strategy","dispatch","nearest","agent","algorithm"] },
        { text: "Observer for real-time status notifications", keywords: ["observer","event","notification","push","notify"] },
        { text: "Factory for Order or Rating creation", keywords: ["factory","create","order","rating","build"] },
        { text: "Facade for OrderService", keywords: ["facade","service","order","simplify","hide"] },
      ], tip: "Observer pattern enables the real-time tracking feed — mention websockets." },
      design: { label: "Class Design / Interfaces", checks: [
        { text: "placeOrder(customerId, restaurantId, items) → Order", keywords: ["place","order","customer","restaurant","item"] },
        { text: "assignDeliveryAgent(orderId) → Agent", keywords: ["assign","agent","order","dispatch","delivery"] },
        { text: "updateOrderStatus(orderId, status) with notifications", keywords: ["update","status","order","notify","push"] },
        { text: "cancelOrder(orderId) with eligibility check", keywords: ["cancel","order","eligible","check","before"] },
        { text: "rateOrder(orderId, rateeType, stars, comment)", keywords: ["rate","order","star","comment","feedback"] },
      ], tip: "updateOrderStatus() should trigger notifications automatically — use Observer here." },
      flow: { label: "Use Case: Customer Places Order", checks: [
        { text: "Customer selects restaurant + adds items to cart", keywords: ["select","restaurant","add","cart","item"] },
        { text: "Order placed → status PLACED; payment pre-authorized", keywords: ["place","order","placed","payment","authorize"] },
        { text: "Restaurant accepts → ACCEPTED; nearest agent assigned", keywords: ["accept","agent","assign","nearest","accepted"] },
        { text: "Agent picks up → PICKED_UP; live tracking begins", keywords: ["pickup","picked","track","live","agent"] },
        { text: "Delivered → status DELIVERED; rating prompt sent", keywords: ["deliver","delivered","rate","rating","prompt"] },
      ], tip: "Trace all 5 status transitions with who triggers each one." },
    },
    ideal: `interface DispatchStrategy {
    DeliveryAgent selectAgent(List<DeliveryAgent> available, Location restaurantLoc);
}
class NearestAgentStrategy implements DispatchStrategy { ... }

interface OrderStatusListener { void onStatusChange(Order order, OrderStatus newStatus); }
class PushNotificationService implements OrderStatusListener { ... }

class OrderService {
    DispatchStrategy dispatchStrategy; List<OrderStatusListener> listeners;

    Order placeOrder(String customerId, String restaurantId, List<CartItem> items) { ... }

    void updateStatus(String orderId, OrderStatus newStatus) {
        Order order = orderRepo.findById(orderId);
        if (newStatus == ACCEPTED)
            order.agent = dispatchStrategy.selectAgent(availableAgents, order.restaurant.loc);
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
    id: "hotel", title: "Hotel Booking System", difficulty: "Hard", tag: "Reservation", minutes: 45, emoji: "🏨",
    description: "Room availability, booking hold flow & refund policies",
    statement: `Design a Hotel Room Booking System.\n\nRequirements:\n• Hotels have multiple room types (Single, Double, Suite) with different prices\n• Search available rooms by location, dates, and type\n• Book a room: hold → payment → confirm\n• Support cancellation with dynamic refund policy\n• Manage amenities: WiFi, breakfast, parking (add-ons)\n• Hotel admin can manage rooms, pricing, and availability`,
    interviewerAnswers: {
      "Multiple hotels?": "Yes — the system manages a chain / marketplace of hotels.",
      "Concurrent bookings?": "Yes — prevent double-booking for the same room + dates.",
      "Dynamic pricing?": "Base price + seasonal multiplier. Keep simple.",
      "Cancellation?": "Full refund >48 hrs before check-in; 50% within 48 hrs; no refund on day.",
      "Reviews?": "Yes — customer can rate after checkout.",
    },
    rubric: {
      clarify: { label: "Clarifying Questions", checks: [
        { text: "Asked about room types and pricing tiers", keywords: ["room","type","single","double","suite","price"] },
        { text: "Asked about concurrent booking prevention", keywords: ["concurrent","double","book","conflict","lock"] },
        { text: "Asked about cancellation policy", keywords: ["cancel","refund","policy","48","hour"] },
        { text: "Asked about add-ons / amenities", keywords: ["amenity","add-on","wifi","breakfast","parking","extra"] },
        { text: "Asked about search scope", keywords: ["hotel","chain","multiple","search","location"] },
        { text: "Asked about dynamic pricing", keywords: ["price","seasonal","dynamic","rate","surge"] },
      ], tip: "Double-booking prevention is the core concurrency challenge — always probe it." },
      entities: { label: "Core Entities", checks: [
        { text: "Hotel + Room + RoomType", keywords: ["hotel","room","type","single","suite"] },
        { text: "Booking / Reservation", keywords: ["booking","reservation","date","room","guest"] },
        { text: "Guest / User", keywords: ["guest","user","customer","person"] },
        { text: "Payment + Invoice", keywords: ["payment","invoice","bill","charge"] },
        { text: "Amenity / AddOn", keywords: ["amenity","addon","wifi","breakfast","extra"] },
        { text: "RoomAvailability (date-range index)", keywords: ["availability","available","date","calendar","schedule"] },
      ], tip: "RoomAvailability as an explicit entity solves the double-booking problem cleanly." },
      relationships: { label: "Relationships", checks: [
        { text: "Hotel has-many Rooms; Room has-a RoomType", keywords: ["hotel","room","type","has","list"] },
        { text: "Booking references Room + Guest + DateRange", keywords: ["booking","room","guest","date","reference"] },
        { text: "Booking has-many Amenities (add-ons)", keywords: ["booking","amenity","addon","has","list"] },
        { text: "RoomAvailability prevents double-booking (unique constraint)", keywords: ["availability","unique","constraint","double","conflict"] },
        { text: "Booking has-one Payment; Payment has Invoice", keywords: ["booking","payment","invoice","has","one"] },
      ], tip: "A unique DB constraint on (roomId, date) in RoomAvailability prevents double-booking at the DB level." },
      patterns: { label: "Design Patterns", checks: [
        { text: "Strategy for cancellation refund policy", keywords: ["strategy","cancel","refund","policy","pluggable"] },
        { text: "Builder for Booking (many optional fields)", keywords: ["builder","booking","optional","construct","amenity"] },
        { text: "Observer for booking confirmation notifications", keywords: ["observer","notification","confirm","email","notify"] },
        { text: "Decorator for Amenity add-ons (price stacking)", keywords: ["decorator","amenity","addon","price","stack","wrap"] },
        { text: "Template Method for booking flow", keywords: ["template","method","flow","step","hook","booking"] },
      ], tip: "Decorator for amenities (WiFi wraps base room, Breakfast wraps WiFi...) is elegant." },
      design: { label: "Class Design / Interfaces", checks: [
        { text: "searchRooms(location, checkIn, checkOut, type)", keywords: ["search","room","location","date","type"] },
        { text: "holdRoom(roomId, dates, guestId) → HoldToken", keywords: ["hold","room","token","reserve","lock"] },
        { text: "confirmBooking(holdToken, paymentInfo) → Booking", keywords: ["confirm","booking","payment","token"] },
        { text: "cancelBooking(bookingId) → refundAmount", keywords: ["cancel","booking","refund","amount"] },
        { text: "CancellationPolicy interface with calculateRefund()", keywords: ["cancel","policy","interface","refund","calculate"] },
      ], tip: "The hold → confirm two-phase flow prevents double-booking." },
      flow: { label: "Use Case: Guest Books a Room", checks: [
        { text: "Guest searches available rooms for dates", keywords: ["search","available","date","room","guest"] },
        { text: "System holds room (prevents others from booking)", keywords: ["hold","lock","prevent","concurrent","reserve"] },
        { text: "Guest selects add-ons and confirms payment", keywords: ["addon","amenity","payment","confirm","select"] },
        { text: "Booking confirmed; room marked unavailable for dates", keywords: ["confirm","unavailable","booked","date","block"] },
        { text: "Cancellation flow with correct refund calculation", keywords: ["cancel","refund","48","hours","policy","calculate"] },
      ], tip: "Walk through a cancellation scenario — it shows you've thought about the full lifecycle." },
    },
    ideal: `interface CancellationPolicy {
    double calculateRefund(Booking booking, LocalDate cancelDate);
}
class FlexiblePolicy implements CancellationPolicy {
    double calculateRefund(Booking b, LocalDate cancelDate) {
        long hours = ChronoUnit.HOURS.between(cancelDate, b.checkIn);
        if (hours > 48) return b.totalAmount;
        if (hours > 0)  return b.totalAmount * 0.5;
        return 0;
    }
}

// Decorator pattern for add-ons
abstract class RoomBookingDecorator { RoomBooking wrappee; double additionalCost(); }
class BreakfastAddon extends RoomBookingDecorator { double additionalCost() { return 300 * nights; } }
class ParkingAddon   extends RoomBookingDecorator { double additionalCost() { return 100 * nights; } }

class BookingService {
    HoldToken holdRoom(String roomId, LocalDate in, LocalDate out, String guestId) {
        // DB transaction: check RoomAvailability → insert rows → return token
    }
    Booking confirmBooking(HoldToken token, PaymentInfo payment) { ... }
    double cancelBooking(String bookingId, CancellationPolicy policy) {
        Booking b = bookingRepo.findById(bookingId);
        double refund = policy.calculateRefund(b, LocalDate.now());
        b.status = CANCELLED; releaseRoomAvailability(b);
        paymentService.refund(b.paymentId, refund); return refund;
    }
}`,
  },
];

const STEP_ORDER = ["clarify","entities","relationships","patterns","design","flow"];

function keywordScore(answer = "", checks = []) {
  const lower = answer.toLowerCase();
  return checks.map((c) => ({ ...c, passed: c.keywords.some((kw) => lower.includes(kw)) }));
}

async function fetchAIEvaluation(problem, answers) {
  const steps = STEP_ORDER.map((id) => ({
    id, label: problem.rubric[id].label,
    checks: problem.rubric[id].checks.map((c) => ({ text: c.text })),
    answer: answers[id] || "",
  }));
  const res = await fetch("/api/evaluate", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ problemTitle: problem.title, steps }),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

// ─── DIFFICULTY COLOR ─────────────────────────────────────────────────────────
const diffColor = { Hard: ["#fee2e2","#991b1b"], Medium: ["#fef3c7","#92400e"], Easy: ["#dcfce7","#166534"] };

// ─── CIRCULAR PROGRESS ────────────────────────────────────────────────────────
function CircularProgress({ pct, size = 120, stroke = 10 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const color = pct >= 80 ? "#34d399" : pct >= 55 ? "#fbbf24" : "#f87171";
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
    </svg>
  );
}

// ─── TIMER ────────────────────────────────────────────────────────────────────
function Timer({ seconds, total }) {
  const pct = seconds / total;
  const color = pct < 0.25 ? "#f87171" : pct < 0.5 ? "#fbbf24" : "#34d399";
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8,
      background:"rgba(255,255,255,0.05)", borderRadius:12, padding:"8px 16px",
      border:"1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ width:8, height:8, borderRadius:"50%", background:color,
        boxShadow:`0 0 8px ${color}`, animation: pct < 0.25 ? "pulse-ring 1.5s infinite" : "none" }} />
      <span style={{ fontVariantNumeric:"tabular-nums", fontWeight:700, fontSize:18, color }}>
        {mins}:{secs}
      </span>
    </div>
  );
}

// ─── SELECT SCREEN ────────────────────────────────────────────────────────────
function SelectScreen({ onStart }) {
  const [sel, setSel] = useState(null);
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0f" }}>
      {/* Hero */}
      <div style={{ position:"relative", overflow:"hidden", padding:"80px 24px 60px", textAlign:"center" }}>
        {/* Background glow blobs */}
        <div style={{ position:"absolute", top:-100, left:"20%", width:400, height:400,
          background:"radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
          borderRadius:"50%", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:-60, right:"15%", width:300, height:300,
          background:"radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
          borderRadius:"50%", pointerEvents:"none" }} />

        <div className="fade-up" style={{ marginBottom:16 }}>
          <span style={{ display:"inline-flex", alignItems:"center", gap:8,
            background:"rgba(99,102,241,0.12)", border:"1px solid rgba(99,102,241,0.3)",
            borderRadius:24, padding:"6px 16px", fontSize:13, fontWeight:600, color:"#a5b4fc" }}>
            ✨ AI-Powered Feedback · 9 Problems · SDE1→SDE3
          </span>
        </div>

        <h1 className="fade-up" style={{ fontSize:"clamp(36px,6vw,64px)", fontWeight:900,
          lineHeight:1.1, marginBottom:16, animationDelay:"0.05s" }}>
          <span className="gradient-text">LLD Interview</span>
          <br />Simulator
        </h1>

        <p className="fade-up" style={{ fontSize:18, color:"#94a3b8", maxWidth:520, margin:"0 auto 40px",
          lineHeight:1.6, animationDelay:"0.1s" }}>
          Practice Low-Level Design the way real interviewers test it — step by step, with AI-powered feedback on every answer.
        </p>

        {/* Stats row */}
        <div className="fade-up" style={{ display:"flex", justifyContent:"center", gap:32,
          flexWrap:"wrap", animationDelay:"0.15s" }}>
          {[["9", "Problems"], ["6", "Steps Each"], ["AI", "Evaluation"]].map(([val, label]) => (
            <div key={label} style={{ textAlign:"center" }}>
              <div style={{ fontSize:28, fontWeight:800, background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{val}</div>
              <div style={{ fontSize:13, color:"#64748b", fontWeight:500 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Problem grid */}
      <div style={{ maxWidth:920, margin:"0 auto", padding:"0 20px 80px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))", gap:16 }}>
          {PROBLEMS.map((p, i) => {
            const [bgColor, textColor] = diffColor[p.difficulty] || diffColor.Medium;
            const isSelected = sel === p.id;
            return (
              <div key={p.id}
                className={`problem-card fade-up ${isSelected ? "selected" : ""}`}
                style={{ animationDelay: `${i * 0.04}s` }}
                onClick={() => setSel(p.id)}
                onMouseEnter={() => setHovered(p.id)}
                onMouseLeave={() => setHovered(null)}>
                {/* Emoji + title */}
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:12 }}>
                  <span style={{ fontSize:28, lineHeight:1 }}>{p.emoji}</span>
                  {isSelected && (
                    <span style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
                      borderRadius:"50%", width:22, height:22, display:"flex",
                      alignItems:"center", justifyContent:"center", fontSize:12 }}>✓</span>
                  )}
                </div>
                <div style={{ fontWeight:700, fontSize:16, color:"#f1f5f9", marginBottom:6, lineHeight:1.3 }}>
                  {p.title}
                </div>
                <div style={{ fontSize:13, color:"#64748b", marginBottom:14, lineHeight:1.5 }}>
                  {p.description}
                </div>
                <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
                  <span style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20,
                    background: `${bgColor}22`, color: textColor, border:`1px solid ${bgColor}44` }}>
                    {p.difficulty}
                  </span>
                  <span style={{ fontSize:11, padding:"3px 10px", borderRadius:20,
                    background:"rgba(255,255,255,0.05)", color:"#64748b", border:"1px solid rgba(255,255,255,0.08)" }}>
                    {p.tag}
                  </span>
                  <span style={{ fontSize:11, color:"#475569", marginLeft:"auto" }}>⏱ {p.minutes}m</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ textAlign:"center", marginTop:40 }}>
          <button className="btn-primary" disabled={!sel}
            onClick={() => sel && onStart(PROBLEMS.find(p => p.id === sel))}
            style={{ fontSize:16, padding:"16px 48px", borderRadius:14 }}>
            {sel ? `Start: ${PROBLEMS.find(p=>p.id===sel)?.title} →` : "Select a problem to begin"}
          </button>
          {sel && (
            <p style={{ color:"#475569", fontSize:13, marginTop:12 }}>
              You have {PROBLEMS.find(p=>p.id===sel)?.minutes} minutes · 6 steps · AI feedback at the end
            </p>
          )}
        </div>
      </div>
      <AdBanner slot="1234567890" />
    </div>
  );
}

// ─── INTERVIEW SCREEN ─────────────────────────────────────────────────────────
function InterviewScreen({ problem, onFinish }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showQ, setShowQ] = useState(false);
  const [timeLeft, setTimeLeft] = useState(problem.minutes * 60);
  const total = problem.minutes * 60;
  const textareaRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => { textareaRef.current?.focus(); }, [step]);

  const stepId = STEP_ORDER[step];
  const prompt = STEP_PROMPTS[stepId];
  const wordCount = (answers[stepId] || "").trim().split(/\s+/).filter(Boolean).length;

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0f", padding:"0 0 60px" }}>
      {/* Top bar */}
      <div style={{ background:"rgba(255,255,255,0.03)", borderBottom:"1px solid rgba(255,255,255,0.07)",
        padding:"16px 24px", display:"flex", alignItems:"center", justifyContent:"space-between",
        position:"sticky", top:0, zIndex:10, backdropFilter:"blur(12px)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:20 }}>{problem.emoji}</span>
          <div>
            <div style={{ fontWeight:700, fontSize:15, color:"#f1f5f9" }}>{problem.title}</div>
            <div style={{ fontSize:12, color:"#475569" }}>Step {step+1} of 6</div>
          </div>
        </div>
        <Timer seconds={timeLeft} total={total} />
      </div>

      {/* Progress bar */}
      <div style={{ height:3, background:"rgba(255,255,255,0.05)" }}>
        <div style={{ height:"100%", width:`${((step+1)/6)*100}%`,
          background:"linear-gradient(90deg,#6366f1,#8b5cf6)",
          transition:"width 0.4s ease", borderRadius:"0 2px 2px 0" }} />
      </div>

      <div style={{ maxWidth:780, margin:"0 auto", padding:"32px 20px" }}>
        {/* Step pills */}
        <div style={{ display:"flex", gap:8, marginBottom:28, flexWrap:"wrap" }}>
          {STEP_ORDER.map((id, i) => (
            <button key={id}
              className={`step-pill ${i === step ? "active" : i < step ? "done" : "pending"}`}
              onClick={() => setStep(i)}>
              {i < step ? "✓ " : ""}{problem.rubric[id].label}
            </button>
          ))}
        </div>

        {/* Problem statement (step 0 only) */}
        {step === 0 && (
          <div className="glass fade-up" style={{ padding:20, marginBottom:20 }}>
            <div style={{ fontWeight:700, color:"#94a3b8", fontSize:12, textTransform:"uppercase",
              letterSpacing:"0.08em", marginBottom:10 }}>Problem Statement</div>
            <pre style={{ whiteSpace:"pre-wrap", fontSize:14, color:"#cbd5e1", lineHeight:1.7, fontFamily:"inherit" }}>
              {problem.statement}
            </pre>
          </div>
        )}

        {/* Interviewer Q&A */}
        {step === 0 && (
          <div style={{ marginBottom:20 }}>
            <button className="btn-ghost" onClick={() => setShowQ(!showQ)} style={{ fontSize:13 }}>
              {showQ ? "▲ Hide" : "▼ Reveal"} Interviewer Answers
            </button>
            {showQ && (
              <div className="glass fade-in" style={{ padding:20, marginTop:10 }}>
                {Object.entries(problem.interviewerAnswers).map(([q, a]) => (
                  <div key={q} style={{ marginBottom:14 }}>
                    <div style={{ fontWeight:600, fontSize:14, color:"#a5b4fc", marginBottom:2 }}>Q: {q}</div>
                    <div style={{ color:"#94a3b8", fontSize:14 }}>→ {a}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step prompt */}
        <div className="fade-up" key={stepId} style={{ marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
            <span style={{ fontSize:24 }}>{prompt.icon}</span>
            <h2 style={{ fontSize:20, fontWeight:800, color:"#f1f5f9" }}>{prompt.heading}</h2>
          </div>
          <p style={{ color:"#94a3b8", fontSize:15, lineHeight:1.7, marginBottom:16 }}>
            {prompt.prompt}
          </p>
        </div>

        {/* Textarea */}
        <div style={{ position:"relative" }}>
          <textarea ref={textareaRef}
            className="answer-box fade-up"
            placeholder={`Write your ${prompt.heading.toLowerCase()} here...`}
            value={answers[stepId] || ""}
            onChange={e => setAnswers({ ...answers, [stepId]: e.target.value })}
          />
          <div style={{ position:"absolute", bottom:10, right:14,
            fontSize:12, color:"#334155", pointerEvents:"none" }}>
            {wordCount} words
          </div>
        </div>

        {/* Tip */}
        <div style={{ display:"flex", gap:10, alignItems:"flex-start", marginTop:12,
          background:"rgba(251,191,36,0.06)", border:"1px solid rgba(251,191,36,0.15)",
          borderRadius:10, padding:"10px 14px" }}>
          <span style={{ fontSize:16, flexShrink:0 }}>💡</span>
          <span style={{ fontSize:13, color:"#d97706", lineHeight:1.5 }}>
            {problem.rubric[stepId].tip}
          </span>
        </div>

        {/* Navigation */}
        <div style={{ display:"flex", gap:10, marginTop:24, justifyContent:"space-between", alignItems:"center" }}>
          <div>
            {step > 0 && (
              <button className="btn-ghost" onClick={() => setStep(step - 1)}>← Back</button>
            )}
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <span style={{ fontSize:13, color:"#334155" }}>{step + 1} / 6</span>
            {step < STEP_ORDER.length - 1
              ? <button className="btn-primary" onClick={() => setStep(step + 1)}>Next Step →</button>
              : <button className="btn-primary" onClick={() => onFinish(answers)}
                  style={{ background:"linear-gradient(135deg,#059669,#10b981)" }}>
                  Submit & Get Feedback ✓
                </button>
            }
          </div>
        </div>
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
  const [expandedStep, setExpandedStep] = useState(null);

  const kwScores = {};
  STEP_ORDER.forEach(id => { kwScores[id] = keywordScore(answers[id], problem.rubric[id].checks); });
  const totalChecks = STEP_ORDER.reduce((s, id) => s + kwScores[id].length, 0);
  const totalPassed = STEP_ORDER.reduce((s, id) => s + kwScores[id].filter(c=>c.passed).length, 0);
  const pct = Math.round((totalPassed / totalChecks) * 100);
  const level = pct >= 80 ? "SDE3" : pct >= 55 ? "SDE2" : "SDE1";
  const displayLevel = aiResult?.finalLevel || level;

  const levelColor = displayLevel === "SDE3" ? "#34d399" : displayLevel === "SDE2" ? "#fbbf24" : "#f87171";
  const levelBg = displayLevel === "SDE3" ? "rgba(52,211,153,0.1)" : displayLevel === "SDE2" ? "rgba(251,191,36,0.1)" : "rgba(248,113,113,0.1)";

  useEffect(() => {
    fetchAIEvaluation(problem, answers)
      .then(r => { setAiResult(r); setAiLoading(false); })
      .catch(() => { setAiError(true); setAiLoading(false); });
  }, []);

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0f", padding:"0 0 80px" }}>
      {/* Header */}
      <div style={{ background:"rgba(255,255,255,0.03)", borderBottom:"1px solid rgba(255,255,255,0.07)",
        padding:"16px 24px", display:"flex", alignItems:"center", gap:12 }}>
        <span style={{ fontSize:20 }}>{problem.emoji}</span>
        <div style={{ fontWeight:700, color:"#f1f5f9" }}>{problem.title} — Results</div>
      </div>

      <div style={{ maxWidth:780, margin:"0 auto", padding:"40px 20px" }}>
        {/* Score hero */}
        <div className="fade-up" style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ position:"relative", display:"inline-block", marginBottom:20 }}>
            <CircularProgress pct={pct} size={140} stroke={12} />
            <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center" }}>
              <span className="score-ring" style={{ fontSize:28, fontWeight:900, color:"#f1f5f9" }}>{pct}%</span>
              <span style={{ fontSize:11, color:"#475569", fontWeight:600 }}>SCORE</span>
            </div>
          </div>

          <div style={{ display:"inline-flex", alignItems:"center", gap:10, padding:"10px 24px",
            borderRadius:14, background:levelBg, border:`1px solid ${levelColor}44`, marginBottom:12 }}>
            <span style={{ fontSize:24 }}>
              {displayLevel === "SDE3" ? "🏆" : displayLevel === "SDE2" ? "📈" : "💪"}
            </span>
            <span style={{ fontSize:22, fontWeight:800, color:levelColor }}>{displayLevel} Level</span>
          </div>

          <p style={{ color:"#64748b", fontSize:14 }}>
            {totalPassed} of {totalChecks} criteria met (keyword analysis)
          </p>

          {/* AI Feedback card */}
          {aiLoading && (
            <div className="glass fade-in" style={{ marginTop:20, padding:"16px 20px",
              display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:20, height:20, border:"2px solid #6366f1",
                borderTopColor:"transparent", borderRadius:"50%",
                animation:"spin 0.7s linear infinite", flexShrink:0 }} />
              <div style={{ textAlign:"left" }}>
                <div style={{ fontWeight:600, color:"#a5b4fc", fontSize:14 }}>Claude AI is reading your answers…</div>
                <div style={{ color:"#475569", fontSize:12, marginTop:2 }}>Takes about 10 seconds</div>
              </div>
            </div>
          )}
          {aiResult?.globalFeedback && (
            <div className="fade-in" style={{ marginTop:20, background:"rgba(99,102,241,0.08)",
              border:"1px solid rgba(99,102,241,0.25)", borderRadius:14, padding:"20px 24px", textAlign:"left" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                <span className="ai-badge">🤖 Claude AI</span>
                <span style={{ fontSize:14, fontWeight:600, color:"#a5b4fc" }}>Overall Assessment</span>
              </div>
              <p style={{ fontSize:15, color:"#cbd5e1", lineHeight:1.7 }}>{aiResult.globalFeedback}</p>
              {aiResult.finalLevel && (
                <div style={{ marginTop:12, fontSize:13, color:"#6366f1", fontWeight:600 }}>
                  AI-assessed level: {aiResult.finalLevel}
                </div>
              )}
            </div>
          )}
          {aiError && (
            <div style={{ marginTop:16, padding:"10px 16px", background:"rgba(251,191,36,0.06)",
              border:"1px solid rgba(251,191,36,0.2)", borderRadius:10, fontSize:13, color:"#d97706" }}>
              ⚠️ AI evaluation unavailable — showing keyword-based scores only.
            </div>
          )}
        </div>

        {/* Per-step accordion */}
        <div style={{ marginBottom:32 }}>
          <h3 style={{ fontSize:18, fontWeight:700, color:"#f1f5f9", marginBottom:16 }}>
            Step-by-Step Breakdown
          </h3>
          {STEP_ORDER.map((id, idx) => {
            const rubricStep = problem.rubric[id];
            const kwChecks = kwScores[id];
            const aiStep = aiResult?.steps?.[id];
            const stepPassed = kwChecks.filter(c=>c.passed).length;
            const stepTotal = kwChecks.length;
            const stepPct = Math.round((stepPassed/stepTotal)*100);
            const isOpen = expandedStep === id;
            const prompt = STEP_PROMPTS[id];

            return (
              <div key={id} className="fade-up" style={{ animationDelay:`${idx*0.05}s`,
                border:"1px solid rgba(255,255,255,0.07)", borderRadius:14,
                marginBottom:10, overflow:"hidden",
                background:"rgba(255,255,255,0.02)" }}>
                {/* Accordion header */}
                <button onClick={() => setExpandedStep(isOpen ? null : id)}
                  style={{ width:"100%", background:"none", border:"none", cursor:"pointer",
                    padding:"16px 20px", display:"flex", alignItems:"center", gap:12, textAlign:"left" }}>
                  <span style={{ fontSize:20 }}>{prompt.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600, color:"#f1f5f9", fontSize:15 }}>{rubricStep.label}</div>
                    {aiStep?.assessment && !isOpen && (
                      <div style={{ fontSize:12, color:"#6366f1", marginTop:2, whiteSpace:"nowrap",
                        overflow:"hidden", textOverflow:"ellipsis", maxWidth:400 }}>
                        🤖 {aiStep.assessment}
                      </div>
                    )}
                  </div>
                  {/* Mini score bar */}
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                    <div style={{ width:60, height:6, background:"rgba(255,255,255,0.08)", borderRadius:3 }}>
                      <div style={{ height:"100%", width:`${stepPct}%`, borderRadius:3,
                        background: stepPct >= 70 ? "#34d399" : stepPct >= 45 ? "#fbbf24" : "#f87171",
                        transition:"width 0.5s ease" }} />
                    </div>
                    <span style={{ fontSize:13, fontWeight:700,
                      color: stepPct >= 70 ? "#34d399" : stepPct >= 45 ? "#fbbf24" : "#f87171" }}>
                      {stepPassed}/{stepTotal}
                    </span>
                    <span style={{ color:"#475569", fontSize:14 }}>{isOpen ? "▲" : "▼"}</span>
                  </div>
                </button>

                {/* Accordion body */}
                {isOpen && (
                  <div className="fade-in" style={{ borderTop:"1px solid rgba(255,255,255,0.06)", padding:"16px 20px" }}>
                    {/* Keyword checks */}
                    <div style={{ marginBottom:16 }}>
                      {kwChecks.map((c, i) => {
                        const aiCheck = aiStep?.checkResults?.[i];
                        return (
                          <div key={i} className="check-row">
                            <span style={{ fontSize:16, flexShrink:0, marginTop:1 }}>{c.passed ? "✅" : "❌"}</span>
                            <div style={{ flex:1 }}>
                              <div style={{ fontSize:14, color: c.passed ? "#e2e8f0" : "#94a3b8" }}>{c.text}</div>
                              {aiCheck?.comment && (
                                <div style={{ fontSize:12, color:"#818cf8", marginTop:3, fontStyle:"italic" }}>
                                  🤖 {aiCheck.comment}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* AI step summary */}
                    {aiStep?.assessment && (
                      <div style={{ background:"rgba(99,102,241,0.08)", border:"1px solid rgba(99,102,241,0.2)",
                        borderRadius:10, padding:"12px 14px", marginBottom:12 }}>
                        <div style={{ fontSize:13, color:"#818cf8", fontWeight:600, marginBottom:4 }}>AI Assessment</div>
                        <div style={{ fontSize:14, color:"#c7d2fe", lineHeight:1.6 }}>{aiStep.assessment}</div>
                        {aiStep.topMiss && (
                          <div style={{ marginTop:8, fontSize:13, color:"#f87171" }}>
                            ⚡ Key miss: {aiStep.topMiss}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Your answer */}
                    {answers[id] ? (
                      <details style={{ marginTop:8 }}>
                        <summary style={{ fontSize:13, color:"#475569", padding:"6px 0", userSelect:"none" }}>
                          ▶ Your answer ({(answers[id]||"").trim().split(/\s+/).filter(Boolean).length} words)
                        </summary>
                        <pre style={{ background:"rgba(0,0,0,0.3)", borderRadius:8, padding:"12px 14px",
                          fontSize:13, color:"#94a3b8", whiteSpace:"pre-wrap", marginTop:8,
                          border:"1px solid rgba(255,255,255,0.05)", lineHeight:1.7 }}>
                          {answers[id]}
                        </pre>
                      </details>
                    ) : (
                      <div style={{ fontSize:13, color:"#334155", fontStyle:"italic" }}>No answer provided</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Ideal solution */}
        <div style={{ marginBottom:32 }}>
          <button className="btn-ghost" onClick={() => setShowIdeal(!showIdeal)}
            style={{ width:"100%", justifyContent:"center", display:"flex", gap:8 }}>
            {showIdeal ? "▲ Hide" : "▼ Show"} Ideal Solution
          </button>
          {showIdeal && (
            <div className="fade-in" style={{ marginTop:12, position:"relative" }}>
              <pre style={{ background:"#0d1117", border:"1px solid rgba(255,255,255,0.08)",
                borderRadius:14, padding:"24px 20px", fontSize:13, color:"#e6edf3",
                overflowX:"auto", whiteSpace:"pre-wrap", lineHeight:1.7 }}>
                {problem.ideal}
              </pre>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
          <button className="btn-ghost" onClick={onHome} style={{ padding:"12px 24px" }}>
            ← All Problems
          </button>
          <button className="btn-primary" onClick={onRetry} style={{ padding:"12px 28px" }}>
            ↺ Try Again
          </button>
        </div>
      </div>
      <AdBanner slot="5566778899" />
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("select");
  const [problem, setProblem] = useState(null);
  const [answers, setAnswers] = useState(null);

  return (
    <>
      <StyleInjector />
      {screen === "select" && (
        <SelectScreen onStart={p => { setProblem(p); setAnswers(null); setScreen("interview"); }} />
      )}
      {screen === "interview" && (
        <InterviewScreen problem={problem}
          onFinish={a => { setAnswers(a); setScreen("results"); }} />
      )}
      {screen === "results" && (
        <ResultsScreen problem={problem} answers={answers}
          onRetry={() => { setAnswers(null); setScreen("interview"); }}
          onHome={() => setScreen("select")} />
      )}
    </>
  );
}

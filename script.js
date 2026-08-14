import java.util.*;

// ==========================================
// 1. DOMAIN MODELS (OOP ENTITIES)
// ==========================================

class Match {
    private int id;
    private String teams;
    private String venue;
    private String dateTime;

    public Match(int id, String teams, String venue, String dateTime) {
        this.id = id;
        this.teams = teams;
        this.venue = venue;
        this.dateTime = dateTime;
    }

    public int getId() { return id; }
    public String getTeams() { return teams; }
    public String getVenue() { return venue; }
    public String getDateTime() { return dateTime; }
}

class Stand {
    private String name;
    private double basePrice;

    public Stand(String name, double basePrice) {
        this.name = name;
        this.basePrice = basePrice;
    }

    public String getName() { return name; }
    public double getBasePrice() { return basePrice; }
}

class Booking {
    private String bookingId;
    private Match match;
    private Stand stand;
    private List<String> seatNumbers;
    private double totalAmount;

    public Booking(String bookingId, Match match, Stand stand, List<String> seatNumbers, double totalAmount) {
        this.bookingId = bookingId;
        this.match = match;
        this.stand = stand;
        this.seatNumbers = seatNumbers;
        this.totalAmount = totalAmount;
    }

    public void printTicket() {
        System.out.println("\n+------------------------------------------------------+");
        System.out.println("|               IPL OFFICIAL MATCH E-PASS              |");
        System.out.println("+------------------------------------------------------+");
        System.out.printf("| Booking ID : %-39s |\n", bookingId);
        System.out.printf("| Match      : %-39s |\n", match.getTeams());
        System.out.printf("| Venue      : %-39s |\n", match.getVenue());
        System.out.printf("| Date & Time: %-39s |\n", match.getDateTime());
        System.out.printf("| Stand      : %-39s |\n", stand.getName());
        System.out.printf("| Seats      : %-39s |\n", String.join(", ", seatNumbers));
        System.out.printf("| Total Paid : INR %-35.2f |\n", totalAmount);
        System.out.println("+------------------------------------------------------+");
    }
}

// ==========================================
// 2. STADIUM ENGINE & CONTROLLER
// ==========================================

class StadiumManager {
    public static final char[] ROWS = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'};
    public static final int SEATS_PER_ROW = 10;

    // Registry format: "matchId-StandName-RowSeat" (e.g., "1-North-A3")
    private Set<String> occupiedRegistry = new HashSet<>();

    public StadiumManager() {
        // Pre-occupied demo seats
        occupiedRegistry.add("1-North-A3");
        occupiedRegistry.add("1-North-A4");
        occupiedRegistry.add("1-VIP Lounge-A1");
        occupiedRegistry.add("2-North-B5");
    }

    public boolean isOccupied(int matchId, String standName, String seatCode) {
        return occupiedRegistry.contains(matchId + "-" + standName + "-" + seatCode);
    }

    public void bookSeat(int matchId, String standName, String seatCode) {
        occupiedRegistry.add(matchId + "-" + standName + "-" + seatCode);
    }

    // Prints realistic stadium layout with central walkway aisle
    public void displaySeatingLayout(int matchId, String standName) {
        System.out.println("\n========================================================");
        System.out.println("            [ " + standName.toUpperCase() + " SEATING ARENA ]            ");
        System.out.println("========================================================");
        System.out.println("                 [ CRICKET PITCH / FIELD ]              ");
        System.out.println("--------------------------------------------------------");
        System.out.println("    1  2  3  4  5    [AISLE]    6  7  8  9  10");

        for (char row : ROWS) {
            System.out.print(row + "  ");
            for (int num = 1; num <= SEATS_PER_ROW; num++) {
                if (num == 6) {
                    System.out.print("   | |   ");
                }
                String seatCode = "" + row + num;
                if (isOccupied(matchId, standName, seatCode)) {
                    System.out.print("[X]"); // Occupied
                } else {
                    System.out.print("[O]"); // Available
                }
            }
            System.out.println("  " + row);
        }
        System.out.println("--------------------------------------------------------");
        System.out.println("Legend: [O] Available   [X] Occupied/Booked");
        System.out.println("========================================================");
    }
}

// ==========================================
// 3. MAIN CONSOLE INTERFACE
// ==========================================

public class IPLBoxOffice {
    private static Scanner scanner = new Scanner(System.in);
    private static StadiumManager stadiumManager = new StadiumManager();
    
    private static List<Match> matches = new ArrayList<>();
    private static List<Stand> stands = new ArrayList<>();
    private static List<Booking> myBookings = new ArrayList<>();

    public static void main(String[] args) {
        initializeData();

        while (true) {
            System.out.println("\n=============================================");
            System.out.println("       🏏 IPL BOX OFFICE TICKETING 2026      ");
            System.out.println("=============================================");
            System.out.println("1. 🏟️  Book Stadium Seats");
            System.out.println("2. 📅  View Official Match Fixtures");
            System.out.println("3. 🏆  Tournament Points Table");
            System.out.println("4. 🎟️  My Booked Passes (" + myBookings.size() + ")");
            System.out.println("5. 🚪  Exit");
            System.out.print("Enter choice (1-5): ");

            String choice = scanner.nextLine().trim();

            switch (choice) {
                case "1" -> processBookingFlow();
                case "2" -> displayFixtures();
                case "3" -> displayStandings();
                case "4" -> displayMyBookings();
                case "5" -> {
                    System.out.println("\nThank you for using IPL Box Office. Enjoy the match!");
                    System.exit(0);
                }
                default -> System.out.println("Invalid option. Please try again.");
            }
        }
    }

    private static void initializeData() {
        matches.add(new Match(1, "CSK vs RCB", "M. A. Chidambaram Stadium, Chennai", "Apr 18, 2026 | 7:30 PM"));
        matches.add(new Match(2, "MI vs KKR", "Wankhede Stadium, Mumbai", "Apr 20, 2026 | 7:30 PM"));
        matches.add(new Match(3, "GT vs RR", "Narendra Modi Stadium, Ahmedabad", "Apr 22, 2026 | 7:30 PM"));

        stands.add(new Stand("North Stand", 1500.0));
        stands.add(new Stand("East Stand", 2800.0));
        stands.add(new Stand("South Pavilion", 4500.0));
        stands.add(new Stand("VIP Lounge", 9500.0));
    }

    private static void processBookingFlow() {
        // Step 1: Select Match
        System.out.println("\n--- Step 1: Select Match ---");
        for (int i = 0; i < matches.size(); i++) {
            Match m = matches.get(i);
            System.out.printf("%d. %s (%s) - %s\n", (i + 1), m.getTeams(), m.getVenue(), m.getDateTime());
        }
        System.out.print("Choose Match Number: ");
        int matchIdx = Integer.parseInt(scanner.nextLine()) - 1;
        if (matchIdx < 0 || matchIdx >= matches.size()) {
            System.out.println("Invalid match selection!");
            return;
        }
        Match selectedMatch = matches.get(matchIdx);

        // Step 2: Select Stand
        System.out.println("\n--- Step 2: Choose Stadium Stand ---");
        for (int i = 0; i < stands.size(); i++) {
            Stand s = stands.get(i);
            System.out.printf("%d. %s - INR %.2f\n", (i + 1), s.getName(), s.getBasePrice());
        }
        System.out.print("Choose Stand Number: ");
        int standIdx = Integer.parseInt(scanner.nextLine()) - 1;
        if (standIdx < 0 || standIdx >= stands.size()) {
            System.out.println("Invalid stand selection!");
            return;
        }
        Stand selectedStand = stands.get(standIdx);

        // Step 3: Show Seating Matrix
        stadiumManager.displaySeatingLayout(selectedMatch.getId(), selectedStand.getName());

        // Step 4: Choose Seats
        System.out.print("\nEnter seat codes separated by spaces (e.g., A1 A2 C5): ");
        String[] seatInputs = scanner.nextLine().toUpperCase().split("\\s+");

        List<String> chosenSeats = new ArrayList<>();
        for (String seatCode : seatInputs) {
            seatCode = seatCode.trim();
            if (seatCode.isEmpty()) continue;

            if (stadiumManager.isOccupied(selectedMatch.getId(), selectedStand.getName(), seatCode)) {
                System.out.println("❌ Seat " + seatCode + " is already occupied! Transaction aborted.");
                return;
            }
            chosenSeats.add(seatCode);
        }

        if (chosenSeats.isEmpty()) {
            System.out.println("No valid seats selected.");
            return;
        }

        // Step 5: Price & Billing Breakdown
        double subtotal = chosenSeats.size() * selectedStand.getBasePrice();
        double gst = subtotal * 0.18; // 18% GST
        double grandTotal = subtotal + gst;

        System.out.println("\n--- Order Summary ---");
        System.out.println("Selected Seats: " + String.join(", ", chosenSeats));
        System.out.printf("Subtotal      : INR %.2f\n", subtotal);
        System.out.printf("GST (18%%)     : INR %.2f\n", gst);
        System.out.printf("Grand Total   : INR %.2f\n", grandTotal);
        System.out.print("\nConfirm payment and book? (Y/N): ");
        
        String confirm = scanner.nextLine().trim();
        if (confirm.equalsIgnoreCase("Y")) {
            // Reserve seats
            for (String seatCode : chosenSeats) {
                stadiumManager.bookSeat(selectedMatch.getId(), selectedStand.getName(), seatCode);
            }

            String refId = "IPL-" + (100000 + new Random().nextInt(900000));
            Booking newBooking = new Booking(refId, selectedMatch, selectedStand, chosenSeats, grandTotal);
            myBookings.add(newBooking);

            System.out.println("\n Payment Successful! Here is your ticket:");
            newBooking.printTicket();
        } else {
            System.out.println("Booking Cancelled.");
        }
    }

    private static void displayFixtures() {
        System.out.println("\n=========================================================================");
        System.out.println("                        OFFICIAL MATCH FIXTURES                          ");
        System.out.println("=========================================================================");
        System.out.printf("%-10s %-15s %-35s %-20s\n", "Match ID", "Teams", "Venue", "Schedule");
        System.out.println("-------------------------------------------------------------------------");
        for (Match m : matches) {
            System.out.printf("%-10d %-15s %-35s %-20s\n", m.getId(), m.getTeams(), m.getVenue(), m.getDateTime());
        }
        System.out.println("=========================================================================");
    }

    private static void displayStandings() {
        System.out.println("\n========================================================");
        System.out.println("                   IPL 2026 POINTS TABLE                ");
        System.out.println("========================================================");
        System.out.printf("%-4s %-30s %-5s %-5s %-6s\n", "Pos", "Team", "P", "W", "Pts");
        System.out.println("--------------------------------------------------------");
        System.out.printf("%-4d %-30s %-5d %-5d %-6d\n", 1, "Chennai Super Kings (CSK)", 0, 0, 0);
        System.out.printf("%-4d %-30s %-5d %-5d %-6d\n", 2, "Royal Challengers Bengaluru (RCB)", 0, 0, 0);
        System.out.printf("%-4d %-30s %-5d %-5d %-6d\n", 3, "Mumbai Indians (MI)", 0, 0, 0);
        System.out.printf("%-4d %-30s %-5d %-5d %-6d\n", 4, "Kolkata Knight Riders (KKR)", 0, 0, 0);
        System.out.println("========================================================");
    }

    private static void displayMyBookings() {
        if (myBookings.isEmpty()) {
            System.out.println("\nYou have no active bookings yet.");
            return;
        }
        for (Booking booking : myBookings) {
            booking.printTicket();
        }
    }
}
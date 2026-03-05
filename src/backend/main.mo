import Time "mo:core/Time";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";



actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Data Models
  public type Client = {
    id : Nat;
    name : Text;
    mobile : Text;
    address : Text;
    billingNumber : Text;
    createdAt : Int;
  };

  public type Invoice = {
    id : Nat;
    clientId : Nat;
    billingNumber : Text;
    createdAt : Int;
    grandTotal : Float;
  };

  public type Room = {
    id : Nat;
    invoiceId : Nat;
    name : Text;
    subtotal : Float;
  };

  public type Item = {
    id : Nat;
    roomId : Nat;
    description : Text;
    quantity : Float;
    unit : Text;
    rate : Float;
    amount : Float;
  };

  module Client {
    public func compare(client1 : Client, client2 : Client) : Order.Order {
      Text.compare(client1.name, client2.name);
    };
  };

  module Invoice {
    public func compare(invoice1 : Invoice, invoice2 : Invoice) : Order.Order {
      let clientComparison = Text.compare(invoice1.billingNumber, invoice2.billingNumber);
      let idComparison = Nat.compare(invoice1.id, invoice2.id);
      switch (clientComparison, idComparison) {
        case (#equal, other) { other };
        case (other, _) { other };
      };
    };
  };

  module Room {
    public func compare(room1 : Room, room2 : Room) : Order.Order {
      let invoiceComparison = Nat.compare(room1.invoiceId, room2.invoiceId);
      let nameComparison = Text.compare(room1.name, room2.name);
      switch (invoiceComparison, nameComparison) {
        case (#equal, other) { other };
        case (other, _) { other };
      };
    };
  };

  module Item {
    public func compare(item1 : Item, item2 : Item) : Order.Order {
      let roomComparison = Nat.compare(item1.roomId, item2.roomId);
      let descriptionComparison = Text.compare(item1.description, item2.description);
      switch (roomComparison, descriptionComparison) {
        case (#equal, other) { other };
        case (other, _) { other };
      };
    };
  };

  // Stable Maps
  let clients = Map.empty<Nat, Client>();
  let invoices = Map.empty<Nat, Invoice>();
  let rooms = Map.empty<Nat, Room>();
  let items = Map.empty<Nat, Item>();

  // ID Counter
  var lastIdCounter = 0;

  // User Profile Operations
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  // Billing Number Generator
  func generateBillingNumber(prefix : Text) : Text {
    prefix.concat(lastIdCounter.toText());
  };

  // Client Operations
  public shared ({ caller }) func createClient(name : Text, mobile : Text, address : Text) : async Nat {
    if (name == "") { Runtime.trap("Name cannot be empty") };
    lastIdCounter += 1;
    let id = lastIdCounter;
    let client : Client = {
      id;
      name;
      mobile;
      address;
      billingNumber = generateBillingNumber("CLIENT-");
      createdAt = Time.now();
    };
    clients.add(id, client);
    id;
  };

  public shared ({ caller }) func updateClient(id : Nat, name : Text, mobile : Text, address : Text) : async () {
    if (name == "") { Runtime.trap("Name cannot be empty") };
    switch (clients.get(id)) {
      case (null) { Runtime.trap("Client not found") };
      case (?client) {
        let updatedClient : Client = {
          id;
          name;
          mobile;
          address;
          billingNumber = client.billingNumber;
          createdAt = client.createdAt;
        };
        clients.add(id, updatedClient);
      };
    };
  };

  public shared ({ caller }) func deleteClient(id : Nat) : async () {
    switch (clients.get(id)) {
      case (null) { Runtime.trap("Client not found") };
      case (?_) {
        clients.remove(id);
      };
    };
  };

  public query ({ caller }) func getClient(id : Nat) : async Client {
    switch (clients.get(id)) {
      case (null) { Runtime.trap("Client not found") };
      case (?client) { client };
    };
  };

  public query ({ caller }) func getAllClients() : async [Client] {
    clients.values().toArray().sort();
  };

  // Invoice Operations
  public shared ({ caller }) func createInvoice(clientId : Nat) : async Nat {
    switch (clients.get(clientId)) {
      case (null) { Runtime.trap("Client does not exist") };
      case (?_) {
        lastIdCounter += 1;
        let id = lastIdCounter;
        let invoice : Invoice = {
          id;
          clientId;
          billingNumber = generateBillingNumber("INV-");
          createdAt = Time.now();
          grandTotal = 0.0;
        };
        invoices.add(id, invoice);
        id;
      };
    };
  };

  public shared ({ caller }) func updateInvoice(id : Nat, clientId : Nat) : async () {
    switch (invoices.get(id)) {
      case (null) { Runtime.trap("Invoice not found") };
      case (?invoice) {
        switch (clients.get(clientId)) {
          case (null) { Runtime.trap("Client not found") };
          case (?_) {
            let updatedInvoice : Invoice = {
              id;
              clientId;
              billingNumber = invoice.billingNumber;
              createdAt = invoice.createdAt;
              grandTotal = invoice.grandTotal;
            };
            invoices.add(id, updatedInvoice);
          };
        };
      };
    };
  };

  public shared ({ caller }) func deleteInvoice(id : Nat) : async () {
    switch (invoices.get(id)) {
      case (null) { Runtime.trap("Invoice not found") };
      case (?_) {
        invoices.remove(id);
      };
    };
  };

  public query ({ caller }) func getInvoice(id : Nat) : async Invoice {
    switch (invoices.get(id)) {
      case (null) { Runtime.trap("Invoice not found") };
      case (?invoice) { invoice };
    };
  };

  public query ({ caller }) func getAllInvoices() : async [Invoice] {
    invoices.values().toArray().sort();
  };

  public query ({ caller }) func getInvoicesByClientId(clientId : Nat) : async [Invoice] {
    switch (clients.get(clientId)) {
      case (null) { Runtime.trap("Client does not exist") };
      case (?_) {
        invoices.values().toArray().filter(func(inv) { inv.clientId == clientId }).sort();
      };
    };
  };

  // Room Operations
  public shared ({ caller }) func createRoom(invoiceId : Nat, name : Text) : async Nat {
    if (name == "") { Runtime.trap("Name cannot be empty") };
    switch (invoices.get(invoiceId)) {
      case (null) { Runtime.trap("Invoice does not exist") };
      case (?_) {
        lastIdCounter += 1;
        let id = lastIdCounter;
        let room : Room = {
          id;
          invoiceId;
          name;
          subtotal = 0.0;
        };
        rooms.add(id, room);
        id;
      };
    };
  };

  public shared ({ caller }) func updateRoom(id : Nat, name : Text) : async () {
    if (name == "") { Runtime.trap("Name cannot be empty") };
    switch (rooms.get(id)) {
      case (null) { Runtime.trap("Room not found") };
      case (?room) {
        let updatedRoom : Room = {
          id;
          invoiceId = room.invoiceId;
          name;
          subtotal = room.subtotal;
        };
        rooms.add(id, updatedRoom);
      };
    };
  };

  public shared ({ caller }) func deleteRoom(id : Nat) : async () {
    switch (rooms.get(id)) {
      case (null) { Runtime.trap("Room not found") };
      case (?_) {
        rooms.remove(id);
      };
    };
  };

  public query ({ caller }) func getRoom(id : Nat) : async Room {
    switch (rooms.get(id)) {
      case (null) { Runtime.trap("Room not found") };
      case (?room) { room };
    };
  };

  public query ({ caller }) func getRoomsByInvoiceId(invoiceId : Nat) : async [Room] {
    switch (invoices.get(invoiceId)) {
      case (null) { Runtime.trap("Invoice does not exist") };
      case (?_) {
        rooms.values().toArray().filter(func(room) { room.invoiceId == invoiceId }).sort();
      };
    };
  };

  // Item Operations
  public shared ({ caller }) func createItem(roomId : Nat, description : Text, quantity : Float, unit : Text, rate : Float) : async Nat {
    if (description == "") { Runtime.trap("Description cannot be empty") };
    switch (rooms.get(roomId)) {
      case (null) { Runtime.trap("Room does not exist") };
      case (?_) {
        lastIdCounter += 1;
        let id = lastIdCounter;
        let amount = rate * quantity;
        let item : Item = {
          id;
          roomId;
          description;
          quantity;
          unit;
          rate;
          amount;
        };
        items.add(id, item);
        id;
      };
    };
  };

  public shared ({ caller }) func updateItem(id : Nat, description : Text, quantity : Float, unit : Text, rate : Float) : async () {
    if (description == "") { Runtime.trap("Description cannot be empty") };
    switch (items.get(id)) {
      case (null) { Runtime.trap("Item not found") };
      case (?item) {
        let amount = rate * quantity;
        let updatedItem : Item = {
          id;
          roomId = item.roomId;
          description;
          quantity;
          unit;
          rate;
          amount;
        };
        items.add(id, updatedItem);
      };
    };
  };

  public shared ({ caller }) func deleteItem(id : Nat) : async () {
    switch (items.get(id)) {
      case (null) { Runtime.trap("Item not found") };
      case (?_) {
        items.remove(id);
      };
    };
  };

  public query ({ caller }) func getItem(id : Nat) : async Item {
    switch (items.get(id)) {
      case (null) { Runtime.trap("Item not found") };
      case (?item) { item };
    };
  };

  public query ({ caller }) func getItemsByRoomId(roomId : Nat) : async [Item] {
    switch (rooms.get(roomId)) {
      case (null) { Runtime.trap("Room does not exist") };
      case (?_) {
        items.values().toArray().filter(func(item) { item.roomId == roomId }).sort();
      };
    };
  };

  // Dashboard Stats
  public query ({ caller }) func getDashboardStats() : async {
    totalClients : Nat;
    totalInvoices : Nat;
    totalBillingAmount : Float;
  } {
    {
      totalClients = clients.size();
      totalInvoices = invoices.size();
      totalBillingAmount = invoices.values().toArray().foldLeft(0.0, func(acc, inv) { acc + inv.grandTotal });
    };
  };
};

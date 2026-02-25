
import MixinStorage "blob-storage/Mixin";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";


actor {
  include MixinStorage();

  // --- TIPOS ---
  type Lead = {
    name : Text;
    whatsapp : Text;
    timestamp : Int;
  };

  type LeadStats = {
    total : Nat;
    today : Nat;
    thisWeek : Nat;
  };

  public type UserProfile = {
    name : Text;
  };

  type ObjectType = {
    #phone;
    #bike;
    #notebook;
    #other : Text;
  };

  type ObjectStatus = {
    #safe;
    #stolen : TheftInfo;
  };

  type TheftInfo = {
    boNumber : Text;
    latitude : Int;
    longitude : Int;
    date : Int;
    reportDate : Int;
    location : Text;
    stolenPlace : ?Text;
    latitudeStart : ?Int;
    longitudeStart : ?Int;
  };

  type PersonalObject = {
    id : Nat;
    owner : Principal;
    objType : ObjectType;
    brand : Text;
    model : Text;
    identifier : Text;
    status : ObjectStatus;
    createdAt : Int;
  };

  type FoundObject = {
    id : Nat;
    description : Text;
    location : Text;
    finder : Principal;
    status : {
      #available;
      #claimed;
    };
    createdAt : Int;
  };

  type PublicStats = {
    totalObjects : Nat;
    totalStolen : Nat;
    totalRecovered : Nat;
  };

  type SubscriptionPlan = {
    #free;
    #premiumMonthly;
    #premiumAnnual;
  };

  type UserSubscription = {
    plan : SubscriptionPlan;
    expirationDate : ?Int;
    stripeCustomerId : ?Text;
  };

  type StripeSessionStatus = {
    #failed : { error : Text };
    #completed : { response : Text; userPrincipal : ?Text };
  };

  type SubscriptionInfo = {
    plan : SubscriptionPlan;
    objectCount : Nat;
    objectLimit : Nat;
    expirationDate : ?Int;
    isExpired : Bool;
  };

  // --- VARIAVEIS DE ESTADO ---
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Leads
  let leads = List.empty<Lead>();

  // Users e acesso
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Elementos de objetos
  var objectCounter = 0;
  var foundObjectCounter = 0;
  let personalObjects = Map.empty<Nat, PersonalObject>();
  let foundObjects = Map.empty<Nat, FoundObject>();

  // Subscriptions
  let userSubscriptions = Map.empty<Principal, UserSubscription>();
  let systemStats = Map.empty<Text, Nat>();

  var lastFreeObjectId = 0;
  var lastFreemiumObjectId = 0;

  // Stripe config
  var stripeConfiguration : ?Stripe.StripeConfiguration = null;

  // --- LEADS ---
  public shared ({ caller }) func submitLead(name : Text, whatsapp : Text) : async () {
    if (name.size() == 0 or whatsapp.size() == 0) {
      Runtime.trap("Both name and WhatsApp number must be provided.");
    };

    let lead : Lead = {
      name;
      whatsapp;
      timestamp = Int.abs(Time.now());
    };

    leads.add(lead);
  };

  public query ({ caller }) func getAllLeads() : async [Lead] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can retrieve leads data");
    };
    leads.toArray();
  };

  public query ({ caller }) func getStats() : async LeadStats {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can retrieve statistics");
    };

    let now = Int.abs(Time.now());
    let dayInNanos = 86_400_000_000_000;
    let weekInNanos = 7 * dayInNanos;

    var todayCount = 0;
    var weekCount = 0;
    var totalCount = 0;

    for (lead in leads.values()) {
      totalCount += 1;
      if (now - lead.timestamp < dayInNanos) {
        todayCount += 1;
        weekCount += 1;
      } else if (now - lead.timestamp < weekInNanos) {
        weekCount += 1;
      };
    };

    {
      total = totalCount;
      today = todayCount;
      thisWeek = weekCount;
    };
  };

  public shared ({ caller }) func promoteToAdmin(user : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    AccessControl.assignRole(accessControlState, caller, user, #admin);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // --- SUBSCRIPTION MANAGEMENT ---
  public query ({ caller }) func getMySubscription() : async SubscriptionInfo {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view their subscription");
    };

    let subscription = switch (userSubscriptions.get(caller)) {
      case (null) {
        { plan = #free; expirationDate = null; stripeCustomerId = null };
      };
      case (?subscription) { subscription };
    };

    let objectCount = countUserObjects(caller);
    let objectLimit = getObjectLimit(subscription.plan);

    {
      plan = subscription.plan;
      objectCount;
      objectLimit;
      expirationDate = subscription.expirationDate;
      isExpired = isPremiumExpired(subscription);
    };
  };

  public query ({ caller }) func canRegisterMoreObjects() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check registration limits");
    };

    let subscription = switch (userSubscriptions.get(caller)) {
      case (null) {
        { plan = #free; expirationDate = null; stripeCustomerId = null };
      };
      case (?subscription) { subscription };
    };

    // Free plan universally supports up to 2 objects
    let objectCount = countUserObjects(caller);
    let objectLimit = getObjectLimit(subscription.plan);

    // Check if premium is expired
    if (isPremiumExpired(subscription)) {
      return objectCount < 2; // fallback to free limit
    };

    objectCount < objectLimit;
  };

  public shared ({ caller }) func upgradeToPremium(plan : SubscriptionPlan, stripeCustomerId : Text, expirationDate : Int) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can upgrade subscriptions");
    };

    // This function should be called after successful stripe payment webhook
    // In production, verify the payment with Stripe before upgrading
    switch (plan) {
      case (#free) {
        Runtime.trap("Cannot upgrade to free plan");
      };
      case (#premiumMonthly or #premiumAnnual) {
        // Find user by stripeCustomerId or use a mapping
        // For now, this is a simplified version
        // In production, maintain a stripeCustomerId -> Principal mapping
      };
    };
  };

  func getObjectLimit(plan : SubscriptionPlan) : Nat {
    switch (plan) {
      case (#free) { 2 };
      case (#premiumMonthly or #premiumAnnual) { 10 };
    };
  };

  func isPremiumExpired(subscription : UserSubscription) : Bool {
    switch (subscription.plan) {
      case (#free) { false };
      case (#premiumMonthly or #premiumAnnual) {
        switch (subscription.expirationDate) {
          case (null) { true };
          case (?expDate) {
            let now = Int.abs(Time.now());
            now > expDate;
          };
        };
      };
    };
  };

  func countUserObjects(user : Principal) : Nat {
    personalObjects.values().toArray().filter(
      func(obj) { Principal.equal(obj.owner, user) }
    ).size();
  };

  // --- OBJETOS PESSOAIS ---
  public shared ({ caller }) func registerObject(brand : Text, model : Text, identifier : Text, objType : ObjectType) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can register objects");
    };

    authorizeRegisterObject(caller);

    let newId = objectCounter + 1;
    objectCounter := newId;

    let newPersonalObject : PersonalObject = {
      id = newId;
      owner = caller;
      objType;
      brand;
      model;
      identifier;
      status = #safe;
      createdAt = Int.abs(Time.now());
    };

    personalObjects.add(newId, newPersonalObject);
    newId;
  };

  func authorizeRegisterObject(caller : Principal) : () {
    let subscription = switch (userSubscriptions.get(caller)) {
      case (null) {
        { plan = #free; expirationDate = null; stripeCustomerId = null };
      };
      case (?subscription) { subscription };
    };

    let objectCount = countUserObjects(caller);

    let isExpired = isPremiumExpired(subscription);

    // If premium is expired, fallback to free limits
    if (isExpired and subscription.plan != #free) {
      if (objectCount >= 2) {
        Runtime.trap("Sua assinatura premium expirou. Você está limitado a 2 objetos no plano gratuito. Renove sua assinatura para continuar.");
      };
      return;
    };

    let limit = getObjectLimit(subscription.plan);
    if (objectCount >= limit) {
      switch (subscription.plan) {
        case (#free) {
          Runtime.trap("Limite da conta gratuita atingido (2 objetos). Faça um upgrade para continuar cadastrando novos objetos.");
        };
        case (#premiumMonthly or #premiumAnnual) {
          Runtime.trap("Limite de 10 objetos atingido para o plano premium. Exclua objetos antigos para continuar cadastrando novos");
        };
      };
    };
  };

  public query ({ caller }) func getMyObjects() : async [PersonalObject] {
    personalObjects.values().toArray().filter(
      func(obj) { obj.owner == caller }
    );
  };

  public query ({ caller }) func getPublicStats() : async PublicStats {
    var totalObjects = 0;
    var totalStolen = 0;
    var totalRecovered = 0;

    for (personalObject in personalObjects.values()) {
      totalObjects += 1;
      switch (personalObject.status) {
        case (#stolen(_)) { totalStolen += 1 };
        case (#safe) {};
      };
    };

    for (foundObject in foundObjects.values()) {
      switch (foundObject.status) {
        case (#claimed) { totalRecovered += 1 };
        case (#available) {};
      };
    };

    {
      totalObjects;
      totalStolen;
      totalRecovered;
    };
  };

  public query ({ caller }) func getObjectById(objectId : Nat) : async ?PersonalObject {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view personalObject details");
    };

    switch (personalObjects.get(objectId)) {
      case (null) { null };
      case (?personalObject) {
        if (
          Principal.equal(personalObject.owner, caller) or
          AccessControl.isAdmin(accessControlState, caller)
        ) {
          ?personalObject;
        } else {
          Runtime.trap("Unauthorized: Can only view your own objects");
        };
      };
    };
  };

  public shared ({ caller }) func claimFoundObject(foundObjectId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can claim found objects");
    };

    switch (foundObjects.get(foundObjectId)) {
      case (null) { Runtime.trap("Objeto encontrado nao encontrado") };
      case (?foundObject) {
        if (foundObject.status == #claimed) {
          Runtime.trap("Objeto encontrado ja foi reivindicado");
        };

        let updatedFoundObject = {
          foundObject with
          status = #claimed;
        };
        foundObjects.add(foundObjectId, updatedFoundObject);
      };
    };
  };

  public query ({ caller }) func findMoreObjects(_objectType : Text) : async [PersonalObject] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can search objects");
    };
    personalObjects.values().toArray();
  };

  public query ({ caller }) func getAvailableFoundObjects() : async [FoundObject] {
    foundObjects.values().toArray().filter(func(obj) { obj.status == #available });
  };

  public query ({ caller }) func publicObjectSearch(identifier : Text) : async Text {
    let found = personalObjects.values().toArray().find(
      func(obj) { obj.identifier == identifier }
    );

    switch (found) {
      case (null) { "Sem restricoes" };
      case (?personalObject) {
        switch (personalObject.status) {
          case (#safe) { "Sem restricoes" };
          case (#stolen(theftInfo)) {
            let location = switch (theftInfo.stolenPlace) {
              case (null) { "Local desconhecido" };
              case (?place) { place };
            };
            "{ \"status\": \"roubado\", \"local\": \"" # location # "\" }";
          };
        };
      };
    };
  };

  // FILTRAR POR STATUS
  public query ({ caller }) func getObjectsByStatus(status : ObjectStatus) : async [PersonalObject] {
    personalObjects.values().toArray().filter(func(obj) { obj.status == status });
  };

  // FILTRAR POR TIPO
  public query ({ caller }) func getObjectsByType(_objType : ObjectType) : async [PersonalObject] {
    personalObjects.values().toArray();
  };

  public shared ({ caller }) func reportTheft(objectId : Nat, boNumber : Text, latitude : Int, longitude : Int, date : Int, location : Text, stolenPlace : ?Text, latitudeStart : ?Int, longitudeStart : ?Int) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can report theft");
    };

    switch (personalObjects.get(objectId)) {
      case (null) { Runtime.trap("Objeto nao encontrado") };
      case (?personalObject) {
        if (not Principal.equal(personalObject.owner, caller)) {
          Runtime.trap("Unauthorized: This personalObject does not belong to you");
        };

        switch (personalObject.status) {
          case (#stolen(_)) { Runtime.trap("PersonalObject is already marked as stolen") };
          case (#safe) {
            let theftInfo : TheftInfo = {
              boNumber;
              latitude;
              longitude;
              date;
              location;
              reportDate = Int.abs(Time.now());
              stolenPlace;
              latitudeStart;
              longitudeStart;
            };

            let updatedPersonalObject = {
              personalObject with
              status = #stolen(theftInfo);
            };
            personalObjects.add(objectId, updatedPersonalObject);
          };
        };
      };
    };
  };

  public shared ({ caller }) func addFoundObject(description : Text, location : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add found objects");
    };

    let newId = foundObjectCounter + 1;
    foundObjectCounter := newId;

    let foundObject : FoundObject = {
      id = newId;
      description;
      location;
      finder = caller;
      status = #available;
      createdAt = Int.abs(Time.now());
    };

    foundObjects.add(newId, foundObject);
    newId;
  };

  // --- INTEGRACAO COM STRIPE ---
  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public query ({ caller }) func isStripeConfigured() : async Bool {
    stripeConfiguration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    stripeConfiguration := ?config;
  };

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public type ShoppingItem = {
    currency : Text;
    productName : Text;
    productDescription : Text;
    priceInCents : Nat;
    quantity : Nat;
  };

  public shared ({ caller }) func createCheckoutSession(items : [ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };
};

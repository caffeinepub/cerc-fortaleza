import Time "mo:core/Time";
import Text "mo:core/Text";
import List "mo:core/List";
import Runtime "mo:core/Runtime";

actor {
  type Lead = {
    name : Text;
    whatsapp : Text;
    timestamp : Int;
  };

  let leads = List.empty<Lead>();

  public shared ({ caller }) func submitLead(name : Text, whatsapp : Text) : async () {
    if (name.size() == 0 or whatsapp.size() == 0) {
      Runtime.trap("Both name and WhatsApp number are required.");
    };
    let lead : Lead = {
      name;
      whatsapp;
      timestamp = Time.now();
    };
    leads.add(lead);
  };

  public query ({ caller }) func getAllLeads() : async [Lead] {
    leads.toArray();
  };
};

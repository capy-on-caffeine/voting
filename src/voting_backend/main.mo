import RBTree "mo:base/RBTree";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Int "mo:base/Int";
import Char "mo:base/Char";
import Nat32 "mo:base/Nat32";
import Option "mo:base/Option";
import Buffer "mo:base/Buffer";
import Time "mo:base/Time";


actor {
  let psk : Text = "theorywillonlytakeyousofar";

  var electionPool : [Text] = [
    "abhinavs.ec.23@nitj.ac.in",
    "abhinavt.ec.23@nitj.ac.in",
    "adityas.ec.23@nitj.ac.in",
    "amanc.ec.23@nitj.ac.in",
    "amank.vl.23@nitj.ac.in",
    "ananyaag.ec.23@nitj.ac.in",
    "ankushm.ec.23@nitj.ac.in",
    "anmols.ec.23@nitj.ac.in",
    "anshs.ec.23@nitj.ac.in",
    "anup.ec.23@nitj.ac.in",
    "aparaa.ec.23@nitj.ac.in",
    "aradhyaa.ec.23@nitj.ac.in",
    "arpitag.ec.23@nitj.ac.in",
    "arshnoork.ec.23@nitj.ac.in",
    "avneeshc.ec.23@nitj.ac.in",
    "ayushkk.ec.23@nitj.ac.in",
    "ayushks.ec.23@nitj.ac.in",
    "bashaboinaa.ec.23@nitj.ac.in",
    "bhavyag.ec.23@nitj.ac.in",
    "bhupendrak.ec.23@nitj.ac.in",
    "binjut.ec.23@nitj.ac.in",
    "davinders.ec.23@nitj.ac.in",
    "deepakk.ec.23@nitj.ac.in",
    "deepikas.ec.23@nitj.ac.in",
    "dharmendrak.ec.23@nitj.ac.in",
    "dhruvk.ec.23@nitj.ac.in",
    "drishti.ec.23@nitj.ac.in",
    "ekampreetk.ec.23@nitj.ac.in",
    "gp.ec.23@nitj.ac.in",
    "ganpatm.ec.23@nitj.ac.in",
    "gokulrajr.ec.23@nitj.ac.in",
    "guthulavs.ec.23@nitj.ac.in",
    "hardishd.ec.23@nitj.ac.in",
    "harijanac.ec.23@nitj.ac.in",
    "harshmt.ec.23@nitj.ac.in",
    "hartikr.ec.23@nitj.ac.in",
    "irfank.ec.23@nitj.ac.in",
    "ishaanrb.ec.23@nitj.ac.in",
    "ishitag.ec.23@nitj.ac.in",
    "jagjits.ec.23@nitj.ac.in",
    "jastic.ec.23@nitj.ac.in",
    "jatink.ec.23@nitj.ac.in",
    "kajals.ec.23@nitj.ac.in",
    "kapils.ec.23@nitj.ac.in",
    "kaushleshb.ec.23@nitj.ac.in",
    "kavya.ec.23@nitj.ac.in",
    "koyelr.ec.23@nitj.ac.in",
    "krishk.ec.23@nitj.ac.in",
    "krishivk.vl.23@nitj.ac.in",
    "kundea.ec.23@nitj.ac.in",
    "lakshyaks.ec.23@nitj.ac.in",
    "lovishg.ec.23@nitj.ac.in",
    "mohdi.ec.23@nitj.ac.in",
    "mridulj.ec.23@nitj.ac.in",
    "navjots.ec.23@nitj.ac.in",
    "neerajy.ec.23@nitj.ac.in",
    "nishchals.ec.23@nitj.ac.in",
    "pabbojus.ec.23@nitj.ac.in",
    "prabhdeepr.ec.23@nitj.ac.in",
    "prajjwalpj.ec.23@nitj.ac.in",
    "pratiks.ec.23@nitj.ac.in",
    "preets.ec.23@nitj.ac.in",
    "premalg.ec.23@nitj.ac.in",
    "priyankaa.ec.23@nitj.ac.in",
    "raghunandanj.ec.23@nitj.ac.in",
    "rajank.ec.23@nitj.ac.in",
    "rajanpreets.ec.23@nitj.ac.in",
    "ramandeeps.ec.23@nitj.ac.in",
    "rimanshug.ec.23@nitj.ac.in",
    "riteshs.ec.23@nitj.ac.in",
    "sagarb.ec.23@nitj.ac.in",
    "sahilv.ec.23@nitj.ac.in",
    "donavalliss.ec.23@nitj.ac.in",
    "sakshij.ec.23@nitj.ac.in",
    "sampellihr.ec.23@nitj.ac.in",
    "samridhis.ec.23@nitj.ac.in",
    "sandeepc.ec.23@nitj.ac.in",
    "nichatsa.ec.23@nitj.ac.in",
    "shikhars.ec.23@nitj.ac.in",
    "shivanin.ec.23@nitj.ac.in",
    "shrejaly.ec.23@nitj.ac.in",
    "shubham.ec.23@nitj.ac.in",
    "shubhamg.ec.23@nitj.ac.in",
    "tusharps.ec.23@nitj.ac.in",
    "vanshika.ec.23@nitj.ac.in",
    "vardaang.ec.23@nitj.ac.in",
    "vatsalk.ec.23@nitj.ac.in",
    "vikasj.ec.23@nitj.ac.in",
    "vyomika.ec.23@nitj.ac.in"
];

  var votedList = Buffer.Buffer<Text>(120);

  var votes : RBTree.RBTree<Text, Nat> = RBTree.RBTree(Text.compare);

  // func textToNat(t : Text) : Nat {
  //   var n : Nat = 0;
  //   for (c in t.chars()) {
  //     if (Char.isDigit(c)) {
  //       let charAsNat : Nat = Nat32.toNat(Char.toNat32(c) - 48);
  //       n := n * 10 + charAsNat;
  //     }
  //   };
  //   return n;
  // };

  func personExistsVoters(e : Text) : Bool {
    for(p in votedList.vals()) {
      if (p == e) return true;
    };
    return false;
  };

  public query func getVotes() : async [(Text, Nat)] {
    Iter.toArray(votes.entries());
  };

  public query func verify(email : Text) : async Bool {
    for(mail in electionPool.vals()) {
      if (mail == email) return true;
    };
    return false;
  };

  public func vote(voterMail : Text, entry : Text) : async [(Text, Nat)] {
    if (not personExistsVoters(voterMail)) {
    let votes_for_entry : ?Nat = votes.get(entry);

    let current_votes_for_entry : Nat = switch votes_for_entry {
      case null 0;
      case (?Nat) Nat;
    };

    votes.put(entry, current_votes_for_entry + 1);

    votedList.add(voterMail);

    Iter.toArray(votes.entries());
    } else return Iter.toArray(votes.entries());
  };

  public func resetVotes(passkey : Text) : async () {
    if (passkey == psk){
       votes := RBTree.RBTree(Text.compare);
       votedList.clear()
    };
  };

};
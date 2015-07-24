var Common = {

generateUUID: function (){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
},
getEligiblePositionsForFormationLayer: function(formationDepth, formationLayer) {
  switch(formationLayer) {
      case 1:
          return ['G'];
      case 2:
          return ['D', 'M'];
      case 3:
          return ['M', 'F'];
      case 4:
          return formationDepth == 4 ? ['F', 'M'] : ['M', 'F'];
      case 5:
          return ['F', 'M'];
      default:
          return ['G', 'D', 'M', 'F'];
  }
},

generatePlayerGroups: function(formation) {
  // Goalie
  var formation = '1-' + formation;
  var formationLayers = formation.split('-');
  var groups = [];
  for (var i=0; i<formationLayers.length; i++) {
    var players = [];
    for (var j=0; j<parseInt(formationLayers[i]); j++) {
      players.push(
        {
          key: Common.generateUUID(),
          name: ''
        }
      );
    }
    groups.push(
      {
        groupType: Common.generateUUID(),
        players: players,
        eligiblePositions: Common.getEligiblePositionsForFormationLayer(formationLayers.length, i+1)
      }
    );
  }
  return groups;
},
PitchActions:  {
  loadPitchData: function(key) {
    Common.PitchStore.loadPitchData(key);
  },
  removePlayer: function(player) {
    Common.PitchStore.removePlayer(player);
  },
  addPlayer: function(player) {
    Common.PitchStore.addPlayer(player);
  },
  fillPosition: function(player) {
    Common.PitchStore.fillPosition(player);
  },
  setFormation: function(formation) {
    Common.PitchStore.setFormation(formation);
  },
  getFormation: function() {
    return Common.PitchStore.getFormation();
  },
  savePitch: function() {
    Common.PitchStore.savePitch();
  },
  getPitchData: function() {
    return Common.PitchStore.getPitchData();
  }
},
PitchStore:  {
  _state: {
    data: {pitch: {}, currentlyEditing: null}
  },

  getState: function() {
    return this._state;
  },

  loadPitchData: function(key) {
    var url = "https://zarar.firebaseio.com/lineups/" + key;
    console.log(url);
    var fire = new Firebase(url);
    fire.on("value", function(snapshot) {
      if (snapshot.val() != null) {
        that._state.data.pitch = snapshot.val();
        console.log(snapshot.val());
        console.log("about to call onchange inside firebase success", that._state.data.pitch);
      } else {
        console.log("shoudl load from 442");
        PitchActions.setFormation('4-4-2');
        console.log("fa is ", PitchActions.getPitchData());
      }
    }, function (errorObject) {
      alert("The read failed: " + errorObject.code);
    });
  },
  getPitchData: function() {
    console.log("in pitch data", this._state.data.pitch);
    return this._state.data.pitch;
  },
  removePlayer: function(player) {
    var playerGroups = this._state.data.pitch.playerGroups;
    for (var i=0; i<playerGroups.length; i++) {
      for (var j=0; j<playerGroups[i].players.length; j++) {
        if (playerGroups[i].players[j].name == player.name) {
          playerGroups[i].players[j].name = "";
        }
      }
    }
    this.onChange();
  },
  isPlayerAlreadyAdded: function(playerKey) {
    var playerGroups = this._state.data.pitch.playerGroups;
    for (var i=0; i<playerGroups.length; i++) {
      for (var j=0; j<playerGroups[i].players.length; j++) {
        if (playerGroups[i].players[j].key == playerKey) {
          return true;
        }
      }
    }
    return false;
  },
  addPlayer: function(player) {
    var playerGroups = this._state.data.pitch.playerGroups;
    // We're targeting a specific spot
    if (this.isPlayerAlreadyAdded(player.key)) {
      return;
    }
    if (this._state.data.currentlyEditing != null) {
      for (var i=0; i<playerGroups.length; i++) {
        for (var j=0; j<playerGroups[i].players.length; j++) {
          if (playerGroups[i].players[j].key == this._state.data.currentlyEditing) {
            playerGroups[i].players[j] = JSON.parse(JSON.stringify(player));
          }
        }
      }
      this._state.data.currentlyEditing = null;

    // Figure out best place to put player
    } else {
      var highestRank = null;
      var targetI = -1, targetJ = -1;
      for (var i=0; i<playerGroups.length; i++) {
        var rank = playerGroups[i].eligiblePositions.indexOf(player.position);
        if (rank == -1) {
          continue;
        }
        for (var j=0; j<playerGroups[i].players.length; j++) {
          if (playerGroups[i].players[j].name == "") {
            if (highestRank == null || rank < highestRank) {
              targetI = i;
              targetJ = j;
              highestRank = rank;
            }
          }
        }
      }
      if (targetI != -1 && targetJ != -1) {
        playerGroups[targetI].players[targetJ] = JSON.parse(JSON.stringify(player));
      }
    }
    this.onChange();
  },
  fillPosition: function(player) {
    this._state.data.currentlyEditing = player.key;
    this.onChange();
  },
  setFormation: function(formation) {
    this._state.data.pitch.formation = formation;
    this._state.data.pitch.playerGroups = Common.generatePlayerGroups(formation);
    this.onChange();
  },
  getFormation: function() {
    return this._state.data.pitch.formation;
    this.onChange();
  },
  savePitch: function() {
    var fire = new Firebase("https://zarar.firebaseio.com/");
    var lineups = fire.child("lineups");
    this._state.data.pitch.key = generateUUID();
    lineups = lineups.child(this._state.data.pitch.key);
    lineups.set(this._state.data.pitch, function(error) {
      if (error) {
        alert("Data could not be saved." + error);
      }
      this.onChange();
    });
  },
  onChange: function() {}
}};

module.exports = Common;

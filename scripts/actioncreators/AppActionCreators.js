var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var AppActions = require('../actions/AppActions');


function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}

function getEligiblePositionsForFormationLayer(formationDepth, formationLayer) {
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
}




function generatePlayerGroups(formation) {
  // Goalie
  var formation = '1-' + formation;
  var formationLayers = formation.split('-');
  var groups = [];
  for (var i=0; i<formationLayers.length; i++) {
    var players = [];
    for (var j=0; j<parseInt(formationLayers[i]); j++) {
      players.push(
        {
          key: generateUUID(),
          name: ''
        }
      );
    }
    groups.push(
      {
        groupType: generateUUID(),
        players: players,
        eligiblePositions: getEligiblePositionsForFormationLayer(formationLayers.length, i+1)
      }
    );
  }
  return groups;
}
var AppActionCreator = {

  saveLineup: function(lineup) {
    lineup.key = generateUUID();
    var fire = new Firebase("https://zarar.firebaseio.com/");
    var lineups = fire.child("lineups");
    lineups = lineups.child(lineup.key);
    lineups.set(lineup, function(error) {
      if (error) {
        alert("Data could not be saved." + error);
      } else {
        AppActions.lineupSaved(lineup);
      }

    });
  },

  getPlayers: function() {
    $.get( "https://api.thescore.com/epl/teams/56/players", function( data ) {
        data.sort(function(a, b) {
          return ((a.last_name < b.last_name) ? -1 : ((a.last_name > b.last_name) ? 1 : 0));
        });        
        AppActions.setPlayers(data);
     });
  },
  getLineup: function(key) {
    var url = "https://zarar.firebaseio.com/lineups/" + key;
    var fire = new Firebase(url);
    fire.on("value", function(snapshot) {
      if (snapshot.val() != null) {
        AppActions.setLineup(snapshot.val());
      } else {
        AppDispatcher.dispatch({
          actionType: AppConstants.LINEUP_NOT_FOUND
        });
      }
    }, function (errorObject) {
      alert("The read failed: " + errorObject.code);
    });
  },
  setFormation: function(formation) {
    if (!formation)
      return;
    var playerGroups = generatePlayerGroups(formation);
    AppActions.setFormation(formation, playerGroups);
  },
  addPlayer: function(player) {
    AppActions.addPlayer(player);
  },
  removePlayer: function(player) {
    AppActions.removePlayer(player);
  },
  markForReplacement: function(playerKey) {
    AppActions.markForReplacement(playerKey);
  },
  setMessage: function(message) {
    AppActions.setMessage(message);
  }

}

module.exports = AppActionCreator;
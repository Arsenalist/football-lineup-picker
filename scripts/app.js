function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};
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

var referenceData = {
  players: [
    {name: 'Bellerin', position: 'D'},
    {name: 'Mertesacker', position: 'D'},
    {name: 'Ramsey', position: 'M'},
    {name: 'Giroud', position: 'F'}
  ],
  positions: [
    {name: 'Defenders', code: 'D'},
    {name: 'Midfielders', code: 'M'},
    {name: 'Forwards', code: 'F'}
  ]
}



var PitchActions = {
  loadPitchData: function(key, version) {
    PitchStore.loadPitchData(key, version);
  },
  removePlayer: function(player) {
    PitchStore.removePlayer(player);
  },
  addPlayer: function(player) {
    PitchStore.addPlayer(player);
  },
  fillPosition: function(player) {
    PitchStore.fillPosition(player);
  },
  setFormation: function(formation) {
    PitchStore.setFormation(formation);
  },
  getFormation: function() {
    return PitchStore.getFormation();
  },
  savePitch: function() {
    PitchStore.savePitch();
  },
  getPitchData: function() {
    return PitchStore.getPitchData();
  }
};
var PitchStore = {
  _state: {
    data: {pitch: {}, reference: referenceData, currentlyEditing: null}
  },

  getState: function() {
    return this._state;
  },

  loadPitchData: function(key, version) {
    var that = this;
    console.log(key, version);
    var url = "https://zarar.firebaseio.com/lineups/" + key + version;
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
      that.onChange();
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
  addPlayer: function(player) {
    var playerGroups = this._state.data.pitch.playerGroups;
    // We're targeting a specific spot
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
    this._state.data.pitch.playerGroups = generatePlayerGroups(formation);
    this.onChange();
  },
  getFormation: function() {
    return this._state.data.pitch.formation;
    this.onChange();
  },
  savePitch: function() {
    console.log("savePitch");
    var fire = new Firebase("https://zarar.firebaseio.com/");
    var lineups = fire.child("lineups");
    console.log("we are", this._state.data.pitch);
    this._state.data.pitch.key = this._state.data.pitch.key ? this._state.data.pitch.key : generateUUID();
    this._state.data.pitch.version = this._state.data.pitch.version ? this._state.data.pitch.version : 1;
    console.log("afe key thing");
    lineups = lineups.child(this._state.data.pitch.key+this._state.data.pitch.version);
    lineups.set(this._state.data.pitch, function(error) {
  if (error) {
    alert("Data could not be saved." + error);
  } else {
    alert("Data saved successfully.");
  }});
    console.log("done");
    this.onChange();
  },
  onChange: function() {}
};

var Pitch = React.createClass({
  getStateFromStore: function() {
    return PitchStore.getState();
  },

  getInitialState: function() {
    var key = this.props.params.key;
    var version = this.props.params.version;
    if (key && version) {
      console.log("loading from URls");
      PitchActions.loadPitchData(key, version);
    } else {
      PitchActions.setFormation('4-4-2');
    }
    console.log("initial state in pitch is ", this.getStateFromStore());

    return this.getStateFromStore();
  },

  componentDidMount: function() {
    // when the assignment store says its data changed, we update
    console.log("Pitch component mounted");
    PitchStore.onChange = this.onChange;
  },

  onChange: function() {
    console.log("onChange in Pitch, calling setState");
    this.setState(this.getStateFromStore());
  },

  render: function() {
    if (!this.state.data){
      return <div className="spinner"></div>
    }
    return (
      <div class="row">
      <FormationSelector />
      <UserActions />
      <div className="col-xs-6 pitch">
        <PlayerGroupList />
      </div>
      <div className="col-xs-6">
        <PlayerFinder data={this.state.data.reference}/>
      </div>
      </div>
    );
  }
});

var UserActions = React.createClass({
  handleSave: function(e) {
    e.preventDefault();
    PitchActions.savePitch();
  },
  render: function() {
    return (
      <div className="userActions">
        <input onClick={this.handleSave} type="button" className="btn btn-success" value="Save"/>
      </div>
    );
  }
});


var FormationSelector = React.createClass({
  componentDidMount: function() {
    React.findDOMNode(this.refs.formation).value = PitchActions.getFormation();
  },
  handleFormationChange: function(e) {
    e.preventDefault();
    PitchActions.setFormation(e.target.value);
  },
  render: function() {
    return (
      <div className="formationSelector">
        <select ref="formation" onChange={this.handleFormationChange}>
          <option value="4-4-2">4-4-2</option>
          <option value="4-1-3-1">4-1-3-1</option>
        </select>
      </div>
    );
  }
});


var PlayerGroupList = React.createClass({
  render: function() {
    if (jQuery.isEmptyObject(PitchActions.getPitchData())) {
      console.log("compareing == true");
      return <div>Loading</div>;
    }
    var playerGroups = PitchActions.getPitchData().playerGroups.map(function (playerGroup) {
      return (
        <PlayerGroup key={playerGroup.groupType} data={playerGroup} />
      );
    });
    return (
      <div className="playerGroups">
        {playerGroups}
      </div>
    );
  }
});

var PlayerGroup = React.createClass({
  render: function() {
    var numPlayers = this.props.data.players.length;
    var colClass;
    switch(numPlayers) {
        case 1:
            colClass = 'col-xs-12';
            break;
        case 2:
            colClass = 'col-xs-6';
            break;
        case 3:
            colClass = 'col-xs-4';
            break;
        case 4:
            colClass = 'col-xs-3';
            break;
        case 5:
            colClass = 'col-xs-2';
            break;
        default:
            colClass = 'col-xs-12';
    }
    colClass = colClass;
    var players = this.props.data.players.map(function (player) {
      var playerOrEmpty = player.name == "" ? <EmptyPlayer key={player.key} data={player}/> : <Player key={player.key} onRemovePlayer={this.removePlayer} key={player.name} data={player}/>;
      return (
        <div className={colClass}>
          {playerOrEmpty}
        </div>
      );
    }.bind(this));
    return (
      <div className="playerGroup row">
      {players}
      </div>
    );
  }
});


var Player = React.createClass({
  handleRemove: function() {
    PitchActions.removePlayer(this.props.data);
  },
  render: function() {
    return (
      <div className="player">
        <img className="shirt" src="http://cdn.ismfg.net/static/plfpl/img/shirts/shirt_1.png"/>
        {this.props.data.name}
        <div>
          <img onClick={this.handleRemove} src="http://cdn.ismfg.net/static/plfpl/img/icons/out.png"/>
        </div>
      </div>
    );
  }
});

var EmptyPlayer = React.createClass({
  handleReplacePlayer: function() {
    PitchActions.fillPosition(this.props.data);
  },
  render: function() {
    return (
      <div className="player">
        <img onClick={this.handleReplacePlayer} className="shirt" src="http://cdn.ismfg.net/static/plfpl/img/shirts/shirt_0.png"/>
      </div>
    );
  }
});

var SelectablePlayer = React.createClass({
  handlePlayerSelection: function(e){
    e.preventDefault();
    PitchActions.addPlayer(this.props.data);
  },
  render: function() {
    return(
      <tr>
        <td><a href="#" onClick={this.handlePlayerSelection}>{this.props.data.name}</a></td>
        <td>{this.props.data.position}</td>
      </tr>
    );
  }
});

var PlayerFinder = React.createClass({
  render: function() {
    var selectablePlayers = this.props.data.players.map(function (player) {
      return (
        <SelectablePlayer data={player}/>
      );
    }.bind(this));

    return (
      <div>
      <div>
        <select>
          <option value="">Show All Positions</option>
          <option value="D">Show Defenders</option>
          <option value="M">Show Midfielders</option>
          <option value="F">Show Forwards</option>
        </select>
      </div>
      <div>
        <table>
        <tr>
          <th>Name</th>
          <th>Position</th>
        </tr>
          {selectablePlayers}
        </table>
      </div>
      </div>
    );
  }
});

var Route = ReactRouter.Route;

// declare our routes and their hierarchy
var routes = (
  <Route handler={App}>
    <Route path="/pitch/:key/:version" handler={Pitch}/>
    <Route path="/pitch" handler={Pitch}/>
  </Route>
);

var RouteHandler = ReactRouter.RouteHandler;

var App = React.createClass({
  render () {
    return (
      <div>
        <RouteHandler/>
      </div>
    )
  }
});

ReactRouter.run(routes, ReactRouter.HashLocation, (Root) => {
  React.render(<Root/>, document.getElementById('content'));
});

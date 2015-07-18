function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

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

var pitchData = {
  playerGroups: [
    {
      groupType: 'D',
      players: [
        {
          key: generateUUID(),
          name: 'Bellerin'
        },
        {
          key: generateUUID(),
          name: 'Mertesacker'
        },
        {
          key: generateUUID(),
          name: ''
        },
        {
          key: generateUUID(),
          name: ''
        }
      ]
    },
    {
      groupType: 'M',
      players: [
        {
          name: 'Ramsey'
        },
        {
          name: 'Wilshere'
        }

      ]
    }

  ]
};

var PitchActions = {
  removePlayer: function(player) {
    PitchStore.removePlayer(player);
  },
  addPlayer: function(player) {
    PitchStore.addPlayer(player);
  },
  fillPosition: function(player) {
    PitchStore.fillPosition(player);
  }
};
var PitchStore = {
  _state: {
    data: {pitch: pitchData, reference: referenceData, currentlyEditing: ''}
  },

  getState: function() {
    return this._state;
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
    for (var i=0; i<playerGroups.length; i++) {
      for (var j=0; j<playerGroups[i].players.length; j++) {
        if (playerGroups[i].players[j].key ==this._state.data.currentlyEditing) {
          playerGroups[i].players[j] = player;
        }
      }
    }
    this.onChange();
  },
  fillPosition: function(player) {
    this._state.data.currentlyEditing = player.key;
  },
  onChange: function() {}
};

var Pitch = React.createClass({
  getStateFromStore: function() {
    return PitchStore.getState();
  },

  getInitialState: function() {
    return this.getStateFromStore();
  },

  componentDidMount: function() {
    // when the assignment store says its data changed, we update
    PitchStore.onChange = this.onChange;
  },

  onChange: function() {
    this.setState(this.getStateFromStore());
  },

  render: function() {
    return (
      <div class="row">
      <div className="col-xs-6 pitch">
        <PlayerGroupList data={this.state.data.pitch.playerGroups}/>
      </div>
      <div className="col-xs-6">
        <PlayerFinder data={this.state.data.reference}/>
      </div>
      </div>
    );
  }
});

var PlayerGroupList = React.createClass({
  render: function() {
    var playerGroups = this.props.data.map(function (playerGroup) {
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
    var players = this.props.data.players.map(function (player) {
      var playerOrEmpty = player.name == "" ? <EmptyPlayer data={player}/> : <Player onRemovePlayer={this.removePlayer} key={player.name} data={player}/>;
      return (
        <div className="col-sm-2">
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
  handlePlayerSelection: function(){
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


React.render(
  <Pitch />,
  document.getElementById('content')
);

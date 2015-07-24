var React = require('react');
var SelectablePlayer = require('./SelectablePlayer.react.js');
var AppStore = require('../stores/AppStore.js');
var AppActionCreator = require('../actioncreators/AppActionCreators.js');

var PlayerFinder = React.createClass({

  getInitialState: function() {
    return {
      players: [],
      filterPosition: ''
    };
  },
  handleFilterPosition: function(e) {
    e.preventDefault();
    this.setState({filterPosition: e.target.value});
  },

  componentWillUnmount: function() {
    AppStore.removeChangeListener(this._onChange);
  },

  componentDidMount: function() {
    console.log("componentDidMount");
    AppStore.addChangeListener(this._onChange);
    AppActionCreator.getPlayers();
  },

  _onChange: function() {
    this.setState({
      players: AppStore.getPlayers()
    });
  },

  render: function() {
    var filteredPlayers = [];
    if (this.state.filterPosition == '') {            
      filteredPlayers = this.state.players;
    } else {
      for (var i=0; i<this.state.players.length; i++) {        
        if (this.state.players[i].position_abbreviation == this.state.filterPosition) {
          filteredPlayers.push(this.state.players[i]);
        }
      }
    } 

    var selectablePlayers = filteredPlayers.map(function (p) {
      var player = {
        key: p.id,
        name: p.first_initial_and_last_name,
        position: p.position_abbreviation,
        lastName: p.last_name,
      }
      return (
        <SelectablePlayer data={player}/>
      );
    });

    return (
      <div>
        <select onChange={this.handleFilterPosition} ref="position">
          <option value="">Show All</option>
          <option value="D">Show Defenders</option>
          <option value="M">Show Midfielders</option>
          <option value="F">Show Forwards</option>
        </select>
        <table className="table table-striped table-condensed table-bordered">
        <tr>
          <th>Name</th>
          <th>Position</th>
        </tr>
          {selectablePlayers}
        </table>
      </div>
    );
  }
});

module.exports = PlayerFinder;

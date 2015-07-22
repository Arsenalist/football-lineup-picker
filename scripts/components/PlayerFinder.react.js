var React = require('react');
var SelectablePlayer = require('./SelectablePlayer.react.js');
var PlayerFinder = React.createClass({
  getInitialState: function() {
    return {};
  },
  handleFilterPosition: function(e) {
    e.preventDefault();
    var position = React.findDOMNode(this.refs.position).value;
    var selectablePlayers = [];
    if (position == "") {
      this.setState({selectablePlayers: this.state.allPlayers});
      return;
    }
    for (var i=0; i<this.state.allPlayers.length; i++) {
      console.log(this.state.allPlayers[i]);
      if (this.state.allPlayers[i].props.data.position == position) {
        selectablePlayers.push(this.state.allPlayers[i]);
      }
    }
    this.setState({selectablePlayers: selectablePlayers});
  },
  componentDidMount: function() {
    var that = this;
    $.get( "http://api.thescore.com/epl/teams/56/players", function( data ) {
      data.sort(function(a, b) {
        return ((a.last_name < b.last_name) ? -1 : ((a.last_name > b.last_name) ? 1 : 0));
      });
      var selectablePlayers = data.map(function (p) {
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
      that.setState({selectablePlayers: selectablePlayers, allPlayers: selectablePlayers});
    });
  },
  render: function() {

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
          {this.state.selectablePlayers}
        </table>
      </div>
    );
  }
});

module.exports = PlayerFinder;

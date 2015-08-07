
var React = require('react');
var AppStore = require('../stores/AppStore.js');
var AppActionCreator = require('../actioncreators/AppActionCreators.js');
var Navigation = require('react-router').Navigation;


var ActivePlayer = React.createClass({
  mixins: [Navigation],

  handleSelectTeam: function(e) {
    e.preventDefault();
    this.transitionTo('/new/' + e.target.value);

  },
  getInitialState: function() {
    return {teams: []}
  },

  componentWillUnmount: function() {
    AppStore.removeChangeListener(this._onChange);
  },

  componentDidMount: function() {
    AppStore.addChangeListener(this._onChange);
    AppActionCreator.getTeams();
  },

  _onChange: function() {
    this.setState({
      teams: AppStore.getTeams()
    });
  },

  render: function() {
    var options = [];
    for (var i=0; i<this.state.teams.length; i++) {
      options.push(<option value={this.state.teams[i].id}>{this.state.teams[i].full_name}</option>);
    }

    return (
      <div className="teamSelector">
        <select onChange={this.handleSelectTeam} ref="team">
          {options}
        </select>
      </div>
    );
  }
});
module.exports = ActivePlayer;

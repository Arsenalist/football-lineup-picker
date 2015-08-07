var React = require('react');
var AppActionCreator = require('../actioncreators/AppActionCreators.js');
var AppStore = require('../stores/AppStore.js');

var Player = React.createClass({
  getInitialState: function() {
    return {team: {}};
  },
  componentDidMount: function() {
    this.setState({
      team: AppStore.getLineup().team
    });
  },
  handleRemove: function() {
    AppActionCreator.removePlayer(this.props.data);
  },
  render: function() {
    return (
      <div className="player">
        <img key={this.props.key} className="shirt" src={this.state.team.logo}/>
        {this.props.data.name}
        <div>
          <img onClick={this.handleRemove} src="http://cdn.ismfg.net/static/plfpl/img/icons/out.png"/>
        </div>
      </div>
    );
  }
});
module.exports = Player;

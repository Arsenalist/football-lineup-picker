var PlayerGroup = require('./PlayerGroup.react.js');

var React = require('react');
var PlayerGroupList = React.createClass({
  render: function() {
    if (jQuery.isEmptyObject(this.props.lineup)) {
      return <div>Loading</div>;
    }
    var pitch = this.props.pitch;
    var playerGroups = this.props.lineup.playerGroups.map(function (playerGroup) {
      return (
        <PlayerGroup pitch={pitch} key={playerGroup.groupType} data={playerGroup} />
      );
    });
    return (
        <span>{playerGroups}</span>
    );
  }
});
module.exports = PlayerGroupList;

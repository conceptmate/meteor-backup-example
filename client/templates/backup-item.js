/* global Session */
/* global Template */
/* global _ */
var EDITING_KEY = 'EDITING_TODO_ID';

Template.backupItem.helpers({
  editingClass: function() {
    return Session.equals(EDITING_KEY, this._id) && 'editing';
  }
});

Template.backupItem.events({
  
  'focus input[type=text]': function(event) {
    Session.set(EDITING_KEY, this._id);
  },
  
  'blur input[type=text]': function(event) {
    if (Session.equals(EDITING_KEY, this._id))
      Session.set(EDITING_KEY, null);
  },
  
  'keydown input[type=text]': function(event) {
    // ESC or ENTER
    if (event.which === 27 || event.which === 13) {
      event.preventDefault();
      event.target.blur();
    }
  },
  
  // // update the text of the item on keypress but throttle the event to ensure
  // // we don't flood the server with updates (handles the event at most once 
  // // every 300ms)
  // 'keyup input[type=text]': _.throttle(function(event) {
  //   this.name(event.target.value);
  // }, 300),
  
  'mousedown .js-import-backup-item, click .js-import-backup-item': function(event, template) {
    event.preventDefault();
    event.stopImmediatePropagation();
    Meteor.call('importBackup', this._id);
  },
  
  // handle mousedown otherwise the blur handler above will swallow the click
  // on iOS, we still require the click event so handle both
  'mousedown .js-delete-backup-item, click .js-delete-backup-item': function(event, template) {
    event.preventDefault();
    event.stopImmediatePropagation();
    Meteor.call('deleteBackup', this._id);
  }
});
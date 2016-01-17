/* global Tracker */
/* global ConceptMate */
var EDITING_KEY = 'editingList';
Session.setDefault(EDITING_KEY, false);

// Track if this is the first time the list template is rendered
var firstRender = true;
var listRenderHold = LaunchScreen.hold();
listFadeInHold = null;

Template.backupCollectionsShow.onRendered(function () {
  if (firstRender) {
    // Released in app-body.js
    listFadeInHold = LaunchScreen.hold();

    // Handle for launch screen defined in app-body.js
    listRenderHold.release();

    firstRender = false;
  }

  this.find('.js-title-nav')._uihooks = {
    insertElement: function (node, next) {
      $(node)
        .hide()
        .insertBefore(next)
        .fadeIn();
    },
    removeElement: function (node) {
      $(node).fadeOut(function () {
        this.remove();
      });
    }
  };
});

Template.backupCollectionsShow.helpers({
  editing: function () {
    return Session.get(EDITING_KEY);
  },

  backupCollections: function () {
    return ConceptMate.Collections.BackupCollections.find({}, { sort: { order: 1, _id: 1 } });
  },
  
  backupCollectionsCount: function() {
    return ConceptMate.Collections.BackupCollections.find({}).count();
  }
});

var editList = function (list, template) {
  Session.set(EDITING_KEY, true);

  // force the template to redraw based on the reactive change
  Tracker.flush();
  template.$('.js-edit-form input[type=text]').focus();
};

Template.backupCollectionsShow.events({
  'click .js-cancel': function () {
    Session.set(EDITING_KEY, false);
  },

  'keydown input[type=text]': function (event) {
    // ESC
    if (27 === event.which) {
      event.preventDefault();
      $(event.target).blur();
    }
  },

  // handle mousedown otherwise the blur handler above will swallow the click
  // on iOS, we still require the click event so handle both
  'mousedown .js-cancel, click .js-cancel': function (event) {
    event.preventDefault();
    Session.set(EDITING_KEY, false);
  },

  'click .js-backup-collection-add': function (event, template) {
    template.$('.js-backup-collection-new input').focus();
  },

  'submit .js-backup-collection-new': function (event) {
    event.preventDefault();

    var $input = $(event.target).find('[type=text]');
    if (!$input.val())
      return;

    Meteor.call('addBackupCollection', $input.val());

    $input.val('');
  }
});

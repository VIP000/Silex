//////////////////////////////////////////////////
// Silex, live web creation
// http://projects.silexlabs.org/?/silex/
//
// Copyright (c) 2012 Silex Labs
// http://www.silexlabs.org/
//
// Silex is available under the GPL license
// http://www.silexlabs.org/silex/silex-licensing/
//////////////////////////////////////////////////


/**
 * @fileoverview This file defines the entry point of Silex
 *
 * a view holds a reference to the controllers so that it can order changes on the models
 * a controller holds a reference to the models so that it can change them
 * a model holds a reference to the views so that it can update them
 *
 */


'use strict';

goog.provide('silex.App');

// google closure
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.style');

// service qos
goog.require('silex.service.Tracker');

// utils / helpers
goog.require('silex.utils.Polyfills');

// types
goog.require('silex.types.Model');
goog.require('silex.types.View');
goog.require('silex.types.Controller');

// model
goog.require('silex.Config');
goog.require('silex.model.File');
goog.require('silex.model.Element');
goog.require('silex.model.Head');
goog.require('silex.model.Body');
goog.require('silex.model.Page');

// controller
goog.require('silex.controller.MenuController');
goog.require('silex.controller.StageController');
goog.require('silex.controller.PageToolController');
goog.require('silex.controller.PropertyToolController');
goog.require('silex.controller.SettingsDialogController');
goog.require('silex.controller.HtmlEditorController');
goog.require('silex.controller.CssEditorController');
goog.require('silex.controller.JsEditorController');
goog.require('silex.controller.TextEditorController');

// display
goog.require('silex.view.Menu');
goog.require('silex.view.Stage');
goog.require('silex.view.Workspace');

// tool boxes
goog.require('silex.view.PageTool');
goog.require('silex.view.PropertyTool');

// editors
goog.require('silex.view.dialog.HTMLEditor');
goog.require('silex.view.dialog.CssEditor');
goog.require('silex.view.dialog.JsEditor');
goog.require('silex.view.dialog.TextEditor');

// dialogs
goog.require('silex.view.dialog.FileExplorer');
goog.require('silex.view.dialog.SettingsDialog');


/**
 * @constructor
 * Entry point of Silex client application
 * create all views and models and controllers
 *
 */
silex.App = function() {

  // **
  // general inits
  // **
  // tracker / qos
  silex.service.Tracker.getInstance().trackAction('app-events', 'start', null, 2);

  // polyfills
  silex.utils.Polyfills.init();

  // remove hash added by cloud explorer
  window.location.hash = '';

  // handle the "prevent leave page" mechanism
  // TODO: move this to workspace? and prevent quit only when dirty?
  if(!silex.Config.debug.debugMode || silex.Config.debug.preventQuit){
    function closeEditorWarning() {
      return 'Are you sure you want to leave Silex?';
    }
    window.onbeforeunload = closeEditorWarning;
  }
  // warning when IE
  if (navigator.appName === "Microsoft Internet Explorer" || (navigator.appName === "Netscape" && navigator.userAgent.indexOf('Trident') >= 0)) {
    silex.utils.Notification.alert('Your browser is not supported yet.<br>Considere using chrome or firefox instead of Internet Explorer.',
      goog.bind(function() {
      }, this));
  }
  // **
  // creation of the main MVC structures
  // **
  // create the models to be passed to the controllers and the views
  this.model = new silex.types.Model();
  // create the view class wich references all the views
  this.view = new silex.types.View();
  // create the controllers, and give them access to the views and the models
  this.controller = new silex.types.Controller();

  // **
  // creation of the view instances
  // **
  // create Stage
  var stageElement = goog.dom.getElementByClass('silex-stage');
  /** @type {silex.view.Stage} */
  var stage = new silex.view.Stage(stageElement, this.view, this.controller);

  // create Menu
  var menuElement = goog.dom.getElementByClass('silex-menu');
  /** @type {silex.view.Menu} */
  var menu = new silex.view.Menu(menuElement, this.view, this.controller);

  // create PageTool
  var pageToolElement = goog.dom.getElementByClass('silex-page-tool');
  /** @type {silex.view.PageTool} */
  var pageTool = new silex.view.PageTool(pageToolElement, this.view, this.controller);

  // create HTMLEditor
  var htmlEditorElement = goog.dom.getElementByClass('silex-html-editor');
  /** @type {silex.view.dialog.HTMLEditor} */
  var htmlEditor = new silex.view.dialog.HTMLEditor(htmlEditorElement, this.view, this.controller);

  // create CssEditor
  var cssEditorElement = goog.dom.getElementByClass('silex-css-editor');
  /** @type {silex.view.dialog.CssEditor} */
  var cssEditor = new silex.view.dialog.CssEditor(cssEditorElement, this.view, this.controller);

  // create JsEditor
  var jsEditorElement = goog.dom.getElementByClass('silex-js-editor');
  /** @type {silex.view.dialog.JsEditor} */
  var jsEditor = new silex.view.dialog.JsEditor(jsEditorElement, this.view, this.controller);

  // create TextEditor
  var textEditorElement = goog.dom.getElementByClass('silex-texteditor');
  /** @type {silex.view.dialog.TextEditor} */
  var textEditor = new silex.view.dialog.TextEditor(textEditorElement, this.view, this.controller);

  // create SettingsDialog
  var settingsDialogElement = goog.dom.getElementByClass('silex-settings-dialog');
  /** @type {silex.view.dialog.SettingsDialog} */
  var settingsDialog = new silex.view.dialog.SettingsDialog(settingsDialogElement, this.view, this.controller);

  // create SettingsDialog
  var fileExplorerElement = document.getElementById('silex-file-explorer');
  /** @type {silex.view.dialog.FileExplorer} */
  var fileExplorer = new silex.view.dialog.FileExplorer(fileExplorerElement, this.view, this.controller);

  // create PropertyTool
  var propertyToolElement = goog.dom.getElementByClass('silex-property-tool');
  /** @type {silex.view.PropertyTool} */
  var propertyTool = new silex.view.PropertyTool(propertyToolElement, this.view, this.controller);

  // create PropertyTool
  var workspaceElement = goog.dom.getElementByClass('silex-workspace');
  /** @type {silex.view.Workspace} */
  var workspace = new silex.view.Workspace(workspaceElement, this.view, this.controller);

  this.view.init(
    menu
    , stage
    , pageTool
    , propertyTool
    , htmlEditor
    , cssEditor
    , jsEditor
    , textEditor
    , fileExplorer
    , settingsDialog
    , workspace
  );
  // **
  // creation of the model classes
  // **
  // init the model class wich references all the views
  this.model.init(
    new silex.model.File(this.model, this.view)
    , new silex.model.Head(this.model, this.view)
    , new silex.model.Body(this.model, this.view)
    , new silex.model.Page(this.model, this.view)
    , new silex.model.Element(this.model, this.view)
  );

  // **
  // creation of the controller classes
  // **
  // init the controller class with references to the views and the models
  this.controller.init(
    new silex.controller.MenuController(this.controller, this.model, this.view)
    , new silex.controller.StageController(this.controller, this.model, this.view)
    , new silex.controller.PageToolController(this.controller, this.model, this.view)
    , new silex.controller.PropertyToolController(this.controller, this.model, this.view)
    , new silex.controller.SettingsDialogController(this.controller, this.model, this.view)
    , new silex.controller.HtmlEditorController(this.controller, this.model, this.view)
    , new silex.controller.CssEditorController(this.controller, this.model, this.view)
    , new silex.controller.JsEditorController(this.controller, this.model, this.view)
    , new silex.controller.TextEditorController(this.controller, this.model, this.view)
  );

  // **
  // application start, open a new empty file
  // **
  // now create an empty file to let the user start using Silex
  this.controller.menuController.newFile();
  if(silex.Config.debug.debugMode && silex.Config.debug.doAfterReady) {
    silex.Config.debug.doAfterReady(this.model, this.view, this.controller);
  }
};

/**
 * store the main structures to ease debugging in browser console
 * @type {silex.types.Model}
 */
silex.App.prototype.model = null;

/**
 * store the main structures to ease debugging in browser console
 * @type {silex.types.View}
 */
silex.App.prototype.view = null;

/**
 * store the main structures to ease debugging in browser console
 * @type {silex.types.Controller}
 */
silex.App.prototype.controller = null;

/**
 * store the main structures to ease debugging in browser console
 * @type {silex.types.Controller}
 */
silex.App.prototype.controller = null;

// Ensures the symbol will be visible after compiler renaming.
goog.exportSymbol('silex.App', silex.App);

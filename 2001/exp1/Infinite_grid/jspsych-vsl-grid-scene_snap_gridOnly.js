/**
 * adopted from plugin by "Josh de Leeuw"
 * change 1. new parameter allowing to change the thicknes of the grid lines.
 * change 2. removed padding as my images have that already (see line 96).
 * drawing implemented with snap.svg
 *
 * Dominik Garber
 *
 * ORIGINAL HEAD:
 * jsPsych plugin for showing scenes that mimic the experiments described in
 *
 * Fiser, J., & Aslin, R. N. (2001). Unsupervised statistical learning of
 * higher-order spatial structures from visual scenes. Psychological science,
 * 12(6), 499-504.
 *
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 *
 * Marton Nagy:
 * Only for showing empty grid before images.
 */

var jsPsychVslGridSceneSnapGridOnly = (function(jspsych) {

  
  'use strict';

  const info = {
      name: "vsl-grid-scene-snap-grid-only",

      parameters: {
        image_size: {
          type: jspsych.ParameterType.INT,
          pretty_name: 'Image size',
          array: true,
          default: [100,100],
          description: 'Array specifying the width and height of the grid cells.'
        },
        trial_duration: {
          type: jspsych.ParameterType.INT,
          pretty_name: 'Trial duration',
          default: 1000,
          description: 'How long to show the grids for in milliseconds.'
        },
        line_px: {
          type: jspsych.ParameterType.INT,
          pretty_name: 'Line pixel',
          default: 1,
          description: 'How thick should the grid lines be in pixel.'  
        },
        grid_size: {
          type: jspsych.ParameterType.INT,
          pretty_name: 'Grid size',
          default: [20,20],
          description: 'Size of the large grid'
        },
       
    },
}


class VslGridSceneSnapPlugin {
  constructor(jsPsych) {
      this.jsPsych = jsPsych;
  }
  trial(display_element, trial) {

  jsPsych.pluginAPI.setTimeout(function() {
      endTrial();
    }, trial.trial_duration);

    function endTrial() {

      display_element.innerHTML = '';

      var trial_data = {
        "stimulus": 'justgrid'//JSON.stringify(trial.stimuli)
      };

       jsPsych.finishTrial(trial_data);
    }

  

    var nrows_grid = trial.grid_size[0];
    var ncols_grid = trial.grid_size[1];
    

    display_element.innerHTML = "<svg id='jspsych-vsl-grid-scene-snap-grid-only-canvas' x='0' y='0' width=" + (trial.image_size[0]*nrows_grid) + " height=" + (trial.image_size[1]*ncols_grid) + "></svg>";

    var paper = Snap("#jspsych-vsl-grid-scene-snap-grid-only-canvas");


   

    
    for (var row = 0; row < nrows_grid; row++) {
      for (var col = 0; col < ncols_grid; col++) {
        var cell = paper.rect(trial.image_size[0]*(col), trial.image_size[1]*(row), trial.image_size[0], trial.image_size[1]).attr({"fill-opacity": 0,  
                                                                                                                           stroke: 'black',
                                                                                                                           strokeWidth: trial.line_px});
      };
    };
    var outline = paper.rect(0, 0, trial.image_size[0]*nrows_grid, trial.image_size[1]*ncols_grid).attr({"fill-opacity": 0,  
                                                                                                                           stroke: 'black',
                                                                                                                           strokeWidth: trial.line_px*2});
  
  };

}
  VslGridSceneSnapPlugin.info = info;

  return VslGridSceneSnapPlugin;

})(jsPsychModule);

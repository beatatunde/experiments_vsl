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
 */

var jsPsychVslGridSceneSnap = (function(jspsych) {

  
  'use strict';

  const info = {
      name: "vsl-grid-scene-snap",

      parameters: {
        stimuli: {
          type: jspsych.ParameterType.IMAGE,
          pretty_name: 'Stimuli',
          array: true,
          default: undefined,
          description: 'An array that defines a grid.'
        },
        image_size: {
          type: jspsych.ParameterType.INT,
          pretty_name: 'Image size',
          array: true,
          default: [100,100],
          description: 'Array specifying the width and height of the images to show.'
        },
        trial_duration: {
          type: jspsych.ParameterType.INT,
          pretty_name: 'Trial duration',
          default: 2000,
          description: 'How long to show the stimulus for in milliseconds.'
        },
        line_px: {
          type: jspsych.ParameterType.INT,
          pretty_name: 'Line pixel',
          default: 1,
          description: 'How thick should the grid lines be in pixel.'  
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
        "stimulus": JSON.stringify(trial.stimuli)
      };

      jsPsych.finishTrial(trial_data);
    }

    var nrows = trial.stimuli.length;
    var ncols = trial.stimuli[0].length;

    display_element.innerHTML = "<svg id='jspsych-vsl-grid-scene-snap-canvas' width=" + (trial.image_size[0]*nrows) + " height=" + (trial.image_size[1]*ncols) + "></svg>";

    var paper = Snap("#jspsych-vsl-grid-scene-snap-canvas");


    // drawing grid and shapes
    // notice here that the stimuli structure used is order as [row][col] and the snap function uses [x][y], i.e. [col][row]
    for (var row = 0; row < nrows; row++) {
      for (var col = 0; col < ncols; col++) {
        if (trial.stimuli[row][col] !== 0) {
        var shape = paper.image(trial.stimuli[row][col], trial.image_size[0]*(col), trial.image_size[1]*(row), trial.image_size[0], trial.image_size[1]);
        };
      };
    };

    for (var row = 0; row < nrows; row++) {
      for (var col = 0; col < ncols; col++) {
        var cell = paper.rect(trial.image_size[0]*(col), trial.image_size[1]*(row), trial.image_size[0], trial.image_size[1]).attr({"fill-opacity": 0,  
                                                                                                                           stroke: 'black',
                                                                                                                           strokeWidth: trial.line_px});
      };
    };
    var outline = paper.rect(0, 0, trial.image_size[0]*nrows, trial.image_size[1]*ncols).attr({"fill-opacity": 0,  
                                                                                                                           stroke: 'black',
                                                                                                                           strokeWidth: trial.line_px*2});

  };

}
  VslGridSceneSnapPlugin.info = info;

  return VslGridSceneSnapPlugin;

})(jsPsychModule);

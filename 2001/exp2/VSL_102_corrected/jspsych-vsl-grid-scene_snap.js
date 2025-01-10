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

jsPsych.plugins['vsl-grid-scene-snap'] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('vsl-grid-scene-snap', 'stimuli', 'image');

  plugin.info = {
    name: 'vsl-grid-scene',
    description: '',
    parameters: {
      stimuli: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimuli',
        array: true,
        default: undefined,
        description: 'An array that defines a grid.'
      },
      image_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Image size',
        array: true,
        default: [100,100],
        description: 'Array specifying the width and height of the images to show.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: 2000,
        description: 'How long to show the stimulus for in milliseconds.'
      },
      line_px: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Line pixel',
        default: 1,
        description: 'How thick should the grid lines be in pixel.'  
      }
    }
  }

  plugin.trial = function(display_element, trial) {

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

  // plugin.generate_stimulus = function(pattern, image_size, line_px) {
  //   var nrows = pattern.length;
  //   var ncols = pattern[0].length;

  //   // create blank element to hold code that we generate
  //   var html = '<div id="jspsych-vsl-grid-scene-dummy" css="display: none;">';

  //   // create table
  //   html += '<table id="jspsych-vsl-grid-scene table" '+
  //     'style="border-collapse: collapse; margin-left: auto; margin-right: auto;">';

  //   for (var row = 0; row < nrows; row++) {
  //     html += '<tr id="jspsych-vsl-grid-scene-table-row-'+row+'" css="height: '+image_size[1]+'px;">';

  //     for (var col = 0; col < ncols; col++) {
  //       html += '<td id="jspsych-vsl-grid-scene-table-' + row + '-' + col +'" '+
  //         //'style="padding: '+ (image_size[1] / 10) + 'px ' + (image_size[0] / 10) + 'px; border: ' + line_px + 'px solid #555;">'+ // original padding
  //         'style="padding: '+ 0 + 'px ' + 0 + 'px; border: ' + line_px + 'px solid #555;">'+ // no padding
  //         '<div id="jspsych-vsl-grid-scene-table-cell-' + row + '-' + col + '" style="width: '+image_size[0]+'px; height: '+image_size[1]+'px;">';
  //       if (pattern[row][col] !== 0) {
  //         html += '<img '+
  //           'src="'+pattern[row][col]+'" style="width: '+image_size[0]+'px; height: '+image_size[1]+'"></img>';
  //       }
  //       html += '</div>';
  //       html += '</td>';
  //     }
  //     html += '</tr>';
  //   }

  //   html += '</table>';
  //   html += '</div>';

  //   return html;

  // };

  return plugin;
})();

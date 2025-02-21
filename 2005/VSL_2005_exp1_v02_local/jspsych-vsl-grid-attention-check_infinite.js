/**
 * adopted from plugin by "Josh de Leeuw"
 * change 1. new parameter allowing to change the thicknes of the grid lines.
 * change 2. removed padding as my images have that already (see line 96).
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

var jsPsychVslGridAttentionCheck = (function(jspsych) {

  'use strict';
  var plugin = {};


  const info = {
    name: 'vsl-grid-scene',
    description: '',
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
      choices: {
        type: jspsych.ParameterType.KEYS,
        
        pretty_name: 'Choices',
        default: "ALL_KEYS",
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      },
      stimulus_duration: {
        type: jspsych.ParameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.'
      },
      response_ends_trial: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when subject makes a response.'
      }
    }
  }

  class VslGridAttentionCheckPlugin {
    constructor(jsPsych) {
        this.jsPsych = jsPsych;
    }

 

    trial(display_element, trial) {

    display_element.innerHTML = this.generate_stimulus(trial.stimuli, trial.image_size, trial.line_px);

        // store response
    var response = {
      rt: null,
      key: null
    };

    jsPsych.pluginAPI.setTimeout(function() {
      end_trial();
    }, trial.trial_duration);

    const end_trial = () => {

      display_element.innerHTML = '';

      // kill any remaining setTimeout handlers
      this.jsPsych.pluginAPI.clearAllTimeouts();

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      var trial_data = {
        rt: response.rt,
        stimulus: trial.stimulus,
        response: response.key,

      };

      this.jsPsych.finishTrial(trial_data);
    }


      // function to handle responses by the subject
    var after_response = (info) => {

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      //display_element.querySelector('#jspsych-vsl-grid-attention-check-stimulus').className += ' responded';

      // only record the first response
      if (response.key == null) {
        response = info;
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

      // start the response listener
    if (trial.choices != "NO_KEYS") {
      var keyboardListener = this.jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: 'performance',
        persist: false,
        allow_held_key: false
      });
    }

        // hide stimulus if stimulus_duration is set
    if (trial.stimulus_duration !== null) {
      this.jsPsych.pluginAPI.setTimeout(() => {
        display_element.querySelector('#jspsych-vsl-grid-scene-dummy').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

  };

  generate_stimulus(pattern, image_size, line_px) {
    var nrows_grid = 20; // Full 20x20 grid size
    var ncols_grid = 20;
    var nrows = pattern.length; // Pattern size
    var ncols = pattern[0].length;
    var stimuli_start_row = 3; // Shift for positioning
    var stimuli_start_col = 7;

    var total_table_width = ncols_grid * image_size[0];
    var total_table_height = nrows_grid * image_size[1];

    var html = '<div id="jspsych-vsl-grid-scene-container" ' +
        'style="position: relative; width: ' + total_table_width + 'px; height: ' + total_table_height + 'px;">';

    // Apply the same shift as in the Snap-based implementation
    html += '<table id="jspsych-vsl-grid-scene-table" ' +
        'style="position: absolute; top: -45px; left: -45px; border-collapse: collapse; ' +
        'width: ' + total_table_width + 'px; height: ' + total_table_height + 'px; table-layout: fixed;">';

    for (var row = 0; row < nrows_grid; row++) {
        html += '<tr style="height: ' + image_size[1] + 'px;">';  // Force fixed row height

        for (var col = 0; col < ncols_grid; col++) {
            let isStimuliArea =
                row >= stimuli_start_row && row < stimuli_start_row + nrows &&
                col >= stimuli_start_col && col < stimuli_start_col + ncols;

            // Force each cell to be a perfect square
            html += '<td style="width: ' + image_size[0] + 'px; height: ' + image_size[1] + 'px; ' +
                'min-height: ' + image_size[1] + 'px; max-height: ' + image_size[1] + 'px; ' +  // Prevent stretching
                'border: ' + line_px + 'px solid black; padding: 0px; text-align: center; overflow: hidden;">';

            // Place images in the correct location
            if (isStimuliArea) {
                let p_row = row - stimuli_start_row;
                let p_col = col - stimuli_start_col;
                if (pattern[p_row][p_col] !== 0) {
                    html += '<img src="' + pattern[p_row][p_col] + '" ' +
                        'style="width: ' + image_size[0] + 'px; height: ' + image_size[1] + 'px; ' +
                        'display: block; object-fit: contain;">';
                }
            }

            html += '</td>';
        }
        html += '</tr>';
    }

    html += '</table>';
    html += '</div>'; // Close container

    return html;
};
  

  simulate(trial, simulation_mode, simulation_options, load_callback) {
    if (simulation_mode == "data-only") {
        load_callback();
        this.simulate_data_only(trial, simulation_options);
    }
    if (simulation_mode == "visual") {
        this.simulate_visual(trial, simulation_options, load_callback);
    }
}
create_simulation_data(trial, simulation_options) {
    const default_data = {
        stimulus: trial.stimulus,
        rt: this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true),
        response: this.jsPsych.pluginAPI.getValidKey(trial.choices),
    };
    const data = this.jsPsych.pluginAPI.mergeSimulationData(default_data, simulation_options);
    this.jsPsych.pluginAPI.ensureSimulationDataConsistency(trial, data);
    return data;
}
simulate_data_only(trial, simulation_options) {
    const data = this.create_simulation_data(trial, simulation_options);
    this.jsPsych.finishTrial(data);
}
simulate_visual(trial, simulation_options, load_callback) {
    const data = this.create_simulation_data(trial, simulation_options);
    const display_element = this.jsPsych.getDisplayElement();
    this.trial(display_element, trial);
    load_callback();
    if (data.rt !== null) {
        this.jsPsych.pluginAPI.pressKey(data.response, data.rt);
    }
}

}
VslGridAttentionCheckPlugin.info = info;

return VslGridAttentionCheckPlugin;

})(jsPsychModule);

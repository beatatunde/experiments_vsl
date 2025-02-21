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

var jsPsychVslGridAttentionCheckSnap = (function (jspsych) {

  'use strict';
  var plugin = {};


  const info = {
    name: 'vsl-grid-attention-check-snap',
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
        default: [100, 100],
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
      },
      grid_size: {
        type: jspsych.ParameterType.INT,
        pretty_name: 'Grid size',
        default: [20, 20],
        description: 'Size of the large grid'
      },
      stim_scene_start: {
        type: jspsych.ParameterType.INT,
        pretty_name: 'Stim scene start',
        default: [3, 7],
        description: 'Where to start the presentation grid'
      }
    }
  }

  class VslGridAttentionCheckSnapPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }



    trial(display_element, trial) {




      // 1) Calculate how large our SVG should be

      var nrows_grid = trial.grid_size[0];
      var ncols_grid = trial.grid_size[1];
      var stimuli_start_row = trial.stim_scene_start[0];
      var stimuli_start_col = trial.stim_scene_start[1];

      // If your trial.stimuli is a 2D array of squares/text, you can also do:
      var nrows = trial.stimuli.length;
      var ncols = trial.stimuli[0].length;

      // 2) Insert the SVG into the display element
      display_element.innerHTML = `
    <svg id="jspsych-vsl-grid-attention-check-snap-canvas"
         width="${trial.image_size[0] * ncols_grid}"
         height="${trial.image_size[1] * nrows_grid}">
    </svg>
  `;

      // 3) Attach Snap to the <svg> we just created
      var paper = Snap("#jspsych-vsl-grid-attention-check-snap-canvas");



      // 5) Draw your attention-check squares and/or text

      let pattern = trial.stimuli; // just an alias

      for (let r = 0; r < pattern.length; r++) {
        for (let c = 0; c < pattern[r].length; c++) {
          if (pattern[r][c] !== 0) {
            let xPos = (stimuli_start_col + c) * trial.image_size[0];
            let yPos = (stimuli_start_row + r) * trial.image_size[1];

            // e.g., squares
            if (pattern[r][c] === "img/square.png") {
              paper.image(
                "img/square.png",
                xPos, yPos,
                trial.image_size[0],
                trial.image_size[1]
              );
            }
            // e.g., "press space" text or "img/attention.png"
            if (pattern[r][c] === "img/attention.png") {
              paper.image(
                "img/attention.png",
                xPos, yPos,
                trial.image_size[0],
                trial.image_size[1]
              );
            }
          }
        }
      }

      // draw the 20×20 "infinite" grid lines for reference
      for (let row = 0; row < nrows_grid; row++) {
        for (let col = 0; col < ncols_grid; col++) {
          paper.rect(
            col * trial.image_size[0],
            row * trial.image_size[1],
            trial.image_size[0],
            trial.image_size[1]
          ).attr({
            fill: "none",
            stroke: "black",
            strokeWidth: trial.line_px
          });
        }
      }

      //  Draw the thick border on top
      var thick_border_x = trial.image_size[0] * stimuli_start_col;
      var thick_border_y = trial.image_size[1] * stimuli_start_row;
      var thick_border_w = trial.image_size[0] * 3;  // or however many columns
      var thick_border_h = trial.image_size[1] * 3;  // or however many rows

      paper.rect(thick_border_x, thick_border_y, thick_border_w, thick_border_h)
        .attr({
          fill: "none",
          stroke: "black",
          strokeWidth: trial.line_px * 4
        });


      // store response:
      var response = {
        rt: null,
        key: null
      };

      // GPT end
      jsPsych.pluginAPI.setTimeout(function () {
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

    // generate_stimulus(pattern, image_size, line_px) {
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
  VslGridAttentionCheckSnapPlugin.info = info;

  return VslGridAttentionCheckSnapPlugin;

})(jsPsychModule);

(function (exports, browser) {
    "use strict";

    var Class = browser ? exports.Class : require("./class.js").Class,
        Events = browser ? exports.Events : require("./events.js").Events,
        __typeof = browser ? exports.Typeof : require("./class.js").Typeof,
        EventMachine,
        debug = function() {}; // console.log

    EventMachine = exports.EventMachine = new Class("EventMachine", {
        $__events_state: {},
        $__combos_cfg: {}
    });

    EventMachine.Implements({
        /**
         * on("ev + ev + !ev", fn)
         *
         */
        on: function (combo_name, combo, fn) {
            combo = combo.split(",").map(function (state) {
                return state.split("+").map(function (event) { return event.trim(); });
            });

            this.$__combos_cfg[combo_name] = {
                combo: combo,
                callback: fn,
                state: 0
            };
        },
        _check_events: function () {
            var key = null,
                combo,
                ev_name,
                events,
                events_ok,
                i,
                j,
                check_against,
                current_combo;

            for (key in this.$__combos_cfg) {
                combo = this.$__combos_cfg[key].combo;

                current_combo = this.$__combos_cfg[key].state;
                debug(combo);

                events_ok = 0;
                events = combo[current_combo];
                for (j = 0; j < events.length; ++j) {
                    check_against = events[j][0] !== "!";
                    ev_name = check_against ? events[j] : events[j].substring(1);

                    this.$__events_state[ev_name] = this.$__events_state[ev_name] || false;

                    debug("eve state", ev_name, "[", check_against ,"]", this.$__events_state[ev_name]);

                    if (this.$__events_state[ev_name] === check_against) {
                        ++events_ok;
                    }
                }
                debug("events_ok", events_ok, events.length);
                if (events_ok === events.length) { // combo done!
                    if (current_combo + 1 === combo.length) {
                        this.$__combos_cfg[key].callback(key, combo, this);
                        this.$__combos_cfg[key].state = 0;
                    } else { // go next state
                        ++this.$__combos_cfg[key].state;
                    }
                } else {
                    this.$__combos_cfg[key].state = 0;
                }
            }
        },
        trigger: function (event) {
            this.$__events_state[event] = true;
            this._check_events();
            this.$__events_state[event] = false;
        },
        enable: function (event, check) {
            debug("********enable", event);
            this.$__events_state[event] = true;
            if (check || check === undefined) {
                this._check_events();
            }
        },
        disable: function (event, check) {
            debug("********disable", event);
            this.$__events_state[event] = false;
            if (check || check === undefined) {
                this._check_events();
            }
        }
    });

}(typeof module === "undefined" ? NodeClass : module.exports, typeof module === "undefined"));
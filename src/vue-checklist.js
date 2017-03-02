/*!
 * Checklist component for Vue2
 * @author Hpyer
 * @license MIT
 */

(function (global, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    const Vue = require('vue');
    module.exports = factory(Vue);
  }
  else if (typeof define !== 'undefined' && define.amd) {
    define('VueCheckList', ['vue'], factory());
  }
  else {
    global.VueCheckList = factory(global.Vue);
  }
} (window, (function (Vue) {

  if (typeof Array.indexOf === 'undefined') {
    Array.prototype.indexOf = function (item) {
      var index = -1;
      for (var i=0; i<this.length; i++) {
        if (item === this[i]) {
          index = i;
          break;
        }
      }
      return index;
    };
  }
  if (typeof Array.inArray === 'undefined') {
    Array.prototype.inArray = function (item) {
      var index = this.indexOf(item);
      return index != -1;
    };
  }
  if (typeof Array.each === 'undefined') {
    Array.prototype.each = function (cb) {
      for (var i=0; i<this.length; i++) {
        if (false === cb(this[i], i)) {
          break;
        }
      }
    };
  }

  return Vue.component('checklist', {
    template: '\
      <div>\
        <div class="checklist-item" v-for="item in list">\
          <input v-if="multi" class="checklist-item-input" type="checkbox" :value="item.value" v-model="values">\
          <input v-else class="checklist-item-input" type="radio" :value="item.value" v-model="values">\
          <div class="checklist-item-text" @click="toggleItem(item)">\
            <slot :item="item">{{item.text}}</slot>\
          </div>\
        </div>\
      </div>\
    ',
    props: {
      list: {
        type: Array,
        require: true
      },
      multi: {
        type: Boolean,
        default: true
      },
      selected: {
        default: null
      }
    },
    data () {
      return {
        values: ''
      }
    },
    created () {
      if (this.selected) {
        var selected = this.selected;
        if (this.multi) {
          if (typeof selected != 'object') selected = [selected];
        } else {
          if (typeof selected == 'object' && selected.length) selected = selected.pop();
        }
        this.values = selected;
      } else {
        if (this.multi) {
          this.values = [];
        } else {
          this.values = '';
        }
      }
    },
    watch: {
      values: function (val) {
        this.$emit('change', val);
      }
    },
    methods: {
      toggleItem: function (item) {
        if (this.multi) {
          var pos = this.values.indexOf(item.value);
          if (pos != -1) {
            this.values.splice(pos, 1);
          } else {
            this.values.push(item.value);
          }
        } else {
          this.values = item.value;
        }
      },
      getValues: function () {
        return this.values;
      },
      selectAll: function () {
        if (!this.multi) return;
        this.values = [];
        var that = this;
        this.list.each(function (one, index) {
          that.values.push(one.value);
        });
      },
      selectReverse: function () {
        if (!this.multi) return;
        var reverseValues = [];
        var that = this;
        this.list.each(function (one, index) {
          if (!that.values.inArray(one.value)) {
            reverseValues.push(one.value);
          }
        });
        this.values = reverseValues;
      },
      unselectAll: function () {
        if (!this.multi) return;
        this.values = [];
      }
    }
  })
})));

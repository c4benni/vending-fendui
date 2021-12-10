<script>
export default {
  name: 'OrderQuantity',
  model: {
    prop: 'vmodel',
    event: 'vmodel',
  },
  props: {
    useChevron: Boolean,
    step: {
      type: [String, Number],
      default: 1
    },
    vmodel: {
      type: [Number, String],
      default: 1,
    },
    disabled: Boolean,
    id: {
      type: String,
      default: undefined,
    },
    max: {
      type: [String, Number],
      default: 99,
    },
    min: {
      type: [String, Number],
      default: 1,
    },
  },
  data() {
    return {
      inputFocused: false,
      selfName: 'OrderQuantity',
    }
  },

  computed: {
    parseStep() {
      return parseFloat(this.step)
    },
    parseVmodel() {
      return this.vmodel
    }
  },


  watch: {
    max(n) {
      if (this.parseVmodel >= +n) {
        this.$emit('vmodel', n)
      }
    },
  },


  render(h) {
    const scoping = { 'data-oqy': '' }
    const div = (d, c) => h('div', d, c)
    const btn = (d, c) => h('ui-btn', d, c)
    const icon = (d, c) => h('ui-icon', d, c)
    const input = (d) => h('input', d)
    const action = ({ disabled, iconName, staticClass, click }) => {
      return btn(
        {
          props: {
            icon: true,
            flat: true,
            disabled: this.disabled || disabled,
            persistent: true,
            text: true
          },
          attrs: {
            ...scoping,
            title: iconName == 'plus' ? 'increase' : 'reduce',
          },
          staticClass,
          class: [(this.disabled || disabled ? 'bg-none' : 'before:bg-blue-700')],
          on: {
            click,
          },
        },
        [
          icon({
            attrs: { name: `${iconName}` },
          }),
        ]
      )
    }

    return div(
      {
        attrs: { ...scoping },
        staticClass: 'root fill-before-after',
        class: [{ focused: this.inputFocused, __disabled: this.disabled }],
      },
      [
        action({
          disabled: this.parseVmodel <= this.min,
          iconName: this.useChevron ? 'chevronLeft' : 'minus',
          click: () => {
            this.parseVmodel > this.min &&
              this.$nextTick(() => {
                this.$emit('vmodel', this.parseVmodel - this.parseStep)
              })
          },
          staticClass: 'rounded-l-sm'
        }),
        input({
          attrs: {
            ...scoping,
            type: this.disabled ? 'text' : 'number',
            pattern: '\\d*',
            title: 'enter quantity',
            tabindex: this.disabled ? '-1' : undefined,
            id: this.id,
            readonly: this.disabled,
            step: this.step,
            min: this.min,
            max: this.max
          },
          domProps: {
            value: this.disabled ? '--' : parseFloat(this.parseVmodel),
          },
          class: [{
            'opacity-50': this.disabled
          }],
          on: {
            focus: () => {
              this.inputFocused = true
            },
            blur: () => {
              this.inputFocused = false
            },
            input: (e) => {
              const value = parseFloat(e.currentTarget.value)

              this.$emit('vmodel', value)
            },
            change: (e) => {
              let value = parseFloat(e.currentTarget.value)
              if (!value || value == 0) {
                value = parseFloat(this.min)
              } else
                if (value > this.max) {
                  value = parseFloat(this.max)
                }

              // update value if it's not in accordance to step;
              const parseStep = this.parseStep;
              const stepModulus = value % parseStep;

              if (stepModulus) {
                if (stepModulus < 3) {
                  value -= stepModulus
                } else {
                  value += (parseStep - stepModulus)
                }
              }

              this.$emit('vmodel', value)
            },
          },
        }),
        action({
          disabled: this.parseVmodel >= this.max,
          iconName: this.useChevron ? 'chevronRight' : 'plus',

          click: () => {
            this.parseVmodel < this.max &&

              this.$nextTick(() => {
                this.$emit('vmodel', this.parseVmodel + this.parseStep)
              })
          },
          staticClass: 'rounded-r-sm'
        }),
      ]
    )
  },
}
</script>

<style>
.root[data-oqy] {
  --size: 52px;
  display: inline-grid;
  grid-template-columns: repeat(3, auto);
  height: var(--size);
  position: relative;
  border-radius: 8px;
  margin: 0.5rem 0 0;
  isolation: isolate;
  --ui-divide: 1px solid var(--divide-color);
  --divide-color: rgba(255, 255, 255, 0.192);
}

html.light .root[data-oqy] {
  --divide-color: rgba(0, 0, 0, 0.292);
}

.root[data-oqy]::before {
  border: var(--ui-divide);
  border-width: 1px;
  z-index: 1;
}

.root.__disabled[data-oqy] {
  opacity: var(--t-disabled);
}

.root[data-oqy]::after {
  width: 6.35rem;
  height: calc(100% + 9px);
  left: var(--size);
  top: -4.5px;
  border-radius: 6px;
  border: 3px solid var(--info);
  opacity: 0;
}

@media (hover: hover) and (pointer: fine) {
  .root[data-oqy]::after {
    transition: 0.2s opacity;
  }

  .root[data-oqy].hover::after {
    opacity: 0.4;
  }
}

.root[data-oqy].focused::after {
  opacity: var(--t-body);
}

input[data-oqy] {
  background-color: transparent;
  border: none;
  text-align: center;
  font-size: 1.75rem;
  color: var(--theme-surface-text);
  width: 6.35rem;
  caret-color: var(--theme-surface-text);
  opacity: var(--t-body);
  outline: none;
  border: var(--ui-divide);
  border-width: 0 1px;
  border-radius: 0;
  font-family: var(--monospace);
  transition: 0.2s opacity;
  appearance: none;
}

input[data-oqy]::-webkit-outer-spin-button,
input[data-oqy]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[data-oqy][type="number"] {
  -moz-appearance: textfield;
}

.root.__disabled[data-oqy] input {
  opacity: var(--t-disabled);
  pointer-events: none;
}

.root[data-oqy] > .ui-btn {
  width: var(--size) !important;
  max-width: var(--size) !important;
  height: var(--size) !important;
  max-height: var(--size) !important;
  border-radius: 0;
  background: var(--btn-color, var(--theme-primary));
  opacity: var(--t-title);
}

.root[data-oqy] > .ui-btn.__disabled {
  opacity: 0.5 !important;
}

.root[data-oqy] .ui-icon {
  opacity: 1 !important;
}

.root[data-oqy] > .ui-btn.__disabled .ui-icon {
  opacity: 0.5 !important;
}
</style>

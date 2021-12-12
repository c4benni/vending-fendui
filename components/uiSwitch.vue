<script>
import { vibrate } from "~/utils/main";

export default {
  name: "UiSwitch",
  inheritAttrs: false,
  model: {
    event: 'update:modelValue',
    prop: 'modelValue'
  },
  props: {
    modelValue: {
      type: Boolean, default: undefined
    },
    tag: {
      type: String,
      default: 'div'
    },
    id: {
      type: String, default: undefined
    },

    required: Boolean,
    readonly: Boolean,
    disabled: Boolean,
    validate: {
      type: Function,
      default: () => true
    },

    // used when there's no v-model
    initial: Boolean,

    height: {
      type: [String, Number],
      default: undefined
    },

    width: {
      type: [String, Number],
      default: undefined
    },
  },
  emits: ["update:modelValue"],
  data: () => ({
    inputDirtied: false,
    manualChecked: false,
  }),

  computed: {
    vmodel() {
      if (typeof this.modelValue == "boolean") {
        return this.modelValue;
      }
      return this.manualChecked;
    },

    validation() {
      if (typeof this.validate != "function") {
        return {
          valid: undefined,
          message: "",
        };
      }

      const validator = this.validate?.(this.vmodel);

      if (typeof validator == "undefined" || !this.inputDirtied) {
        return {
          valid: undefined,
          message: "",
        };
      }

      if (typeof validator == "string") {
        return {
          valid: false,
          message: validator,
        };
      }

      if (validator === true) {
        return {
          valid: true,
          message: "",
        };
      }

      return {
        valid: undefined,
        message: "",
      };
    },


    payload() {
      return {
        active: this.vmodel,
        validation: this.validation,
        toggle: this.toggle,
      }
    },

    getSize() {
      const output = {
        width: "",
        height: "",
      };

      if (typeof this.width == "string") {
        output.width = this.width;
      } else if (typeof this.width == "number") {
        output.width = `${this.width}px`;
      }

      if (typeof this.height == "string") {
        output.height = this.height;
      } else if (typeof this.height == "number") {
        output.height = `${this.height}px`;
      }

      return output;
    }

  },

  watch: {
    validation() {
      this.setValidationMessage()
    }
  },


  created() {
    this.setValidationMessage();
  },

  methods: {
    runValidate() {
      this.inputDirtied = true;
      this.validate?.(this.vmodel);
      this.setValidationMessage();
    },

    toggle(value) {
      const inactive = this.readonly || this.disabled;

      if (inactive) {
        return;
      }

      this.$emit("update:modelValue", value);

      this.manualChecked = value;
    },

    setValidationMessage() {
      this.$nextTick(() => {
        this.validate?.(this.vmodel);

        const input = this.$refs.input;
        const message = this.validation.message;

        input?.setCustomValidity?.(message);
      });
    },
  },

  render(h) {


    if (typeof this.vmodel == "undefined") {
      this.manualChecked = this.initial || false;
    }

    const scoping = { "data-ui-switch": "" };

    const div = (d, c) => h("div", d, c);

    const input = (d, c) => h("input", d, c);

    return [
      h(
        this.tag,
        {
          attrs: {
            ...scoping,
            ...this.$attrs,
            role: "switch",
            "aria-checked": `${this.vmodel}`,
            "aria-readonly": this.readonly,
          },
          class: [
            "root",
            {
              checked: this.vmodel,
            },
            this.$attrs.class,
          ],
          style: {
            "--ui-height": this.getSize.height,
            "--ui-width": this.getSize.width,
            ...(this.$attrs.style || {}),
          },
          on: {
            click: () => {
              this.$refs?.input?.click?.();

              vibrate();
            }
          }
        },
        [
          div(
            {
              attrs: {
                ...scoping,
              },
              class: [
                "track",
                {
                  checked: this.vmodel,
                },
              ],
            },
            [this.$scopedSlots.track?.(this.payload) || null]
          ),
          div(
            {
              attrs: {
                ...scoping,
              },
              class: [
                "thumb",
                {
                  checked: this.vmodel,
                },
              ],
            },
            [
              input({
                ref: "input",
                attrs: {
                  ...scoping,
                  type: "checkbox",
                  tabindex: "-1",
                  required: this.required,
                  disabled: this.disabled,
                  readonly: this.readonly,
                },
                domProps: {
                  id: this.id,
                  checked: this.vmodel ? "checked" : undefined,
                },

                class: ["input"],

                on: {
                  input: e => {
                    const value = e.currentTarget.checked;

                    this.inputDirtied = true;

                    this.toggle(value);

                    this.validate?.(this.vmodel);
                  }
                }
              }),

              this.$scopedSlots.thumb?.(this.payload) || null,
            ]
          ),

          this.$scopedSlots.default?.(this.payload) || null,
        ]
      ),
    ];
  },
};
</script>

<style>
.root[data-ui-switch] {
  --ui-height: 28px;
  --ui-width: 44px;
  --ui-track-height: 100%;
  --ui-track-width: 100%;
  --ui-track-radius: 16px;
  --ui-track-background: #999;
  --ui-track-background-checked: #007bff;
  --ui-thumb-size: 25px;
  --ui-thumb-radius: 50%;
  --ui-thumb-translatex: calc(
    var(--ui-width) - var(--ui-thumb-size) - var(--ui-thumb-offset)
  );
  --ui-thumb-offset: 1.5px;
  --ui-thumb-shadow: 0px 0.5px 1px -1px rgb(0 0 0 / 20%),
    0px 1px 2px 0px rgb(0 0 0 / 15%), 0px 1px 3px 0px rgb(0 0 0 / 10%);
  --ui-thumb-background: #fff;

  height: var(--ui-height);
  width: var(--ui-width);
  display: inline-grid;
  place-items: center;
  position: relative;

  cursor: pointer;
  appearance: none;
  padding: 0;
  border: none;
  background: none;

  isolation: isolate;
}

.root[data-ui-switch]:focus-within {
  outline: solid transparent;
}

.track[data-ui-switch] {
  height: var(--ui-track-height);
  width: var(--ui-track-width);
  border-radius: var(--ui-track-radius);
  position: absolute;
  background: var(--ui-track-background);
  isolation: isolate;
  pointer-events: none;
}

.track[data-ui-switch]::before {
  content: "";
  position: absolute;
  border-radius: inherit;
  width: 100%;
  height: 100%;
  background: var(--ui-track-background-checked);
  opacity: 0;
  transition: 0.15s ease-in-out opacity;
  z-index: -1;
  left: 0;
}

.track[data-ui-switch].checked::before {
  opacity: 1;
}

.thumb[data-ui-switch] {
  z-index: 1;
  background-color: var(--ui-thumb-background);
  box-shadow: var(--ui-thumb-shadow);
  width: var(--ui-thumb-size);
  height: var(--ui-thumb-size);
  border-radius: var(--ui-thumb-radius);
  position: absolute;
  left: 0;
  transition: transform 0.2s, opacity 0.2s;
  /* transition-timing-function: var(--circOut);
    opacity: var(--t-body); */
  transform: translate3d(var(--ui-thumb-offset), 0, 0);
}

.thumb[data-ui-switch].checked {
  transform: translate3d(var(--ui-thumb-translatex), 0, 0);
}

.input[data-ui-switch] {
  left: 50%;
  top: 50%;
  position: absolute;
  transform: translate(-75%, -75%);
  pointer-events: none;
  appearance: none;
  opacity: 0;
  pointer-events: none;
}
</style>

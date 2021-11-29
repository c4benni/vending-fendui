<script>
import {
  getCurrentInstance,
  h,
  nextTick,
  onMounted,
  reactive,
  computed,
} from "@vue/runtime-core";
import { setCSSVariable } from "../fendui/utils/core";

const div = (d, c) => h("div", d, c);
const label = (d, c) => h("label", d, c);

const scoping = { "data-ui-input": "" };

export default {
  name: "UiInput",
  props: {
    required: Boolean,
    placeholder: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "text",
    },
    pattern: {
      type: String,
      default: undefined,
    },
    background: {
      type: String,
      default: undefined,
    },
    validate: {
      type: Function,
      default: undefined,
    },
    autocomplete: {
      type: String,
      default: undefined,
    },
    modelValue: {
      type: String,
      default: undefined,
    },
    size: {
      type: String,
      default: undefined,
    },
  },
  emits: ["update:modelValue"],
  setup(p, { emit, expose }) {
    const props = computed(() => p);

    const data = reactive({
      focused: false,
      inputDirtied: false,
      vMsgKey: 1,
      manualValue: undefined,
    });

    data.manualValue = p.modelValue;

    const getValidate = props.value.validate || (() => true);

    expose({
      validate: () => {
        data.vMsgKey += 1;
        getValidate(props.value.modelValue);
      },
    });

    const i = getCurrentInstance();

    const validation = () => {
      const validationValue = () => {
        const validator = getValidate(props.value.modelValue);

        if (typeof validator == "undefined") {
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
      };

      const getValidation = validationValue();

      nextTick(() => {
        const input = i.refs.input;
        const message = getValidation.message;

        input?.setCustomValidity?.(message);
      });

      return getValidation;
    };

    const getValidation = validation();

    onMounted(() => {
      nextTick(() => {
        const input = i.refs.input;
        const message = getValidation.message;

        input._reportValidity = () => {
          data.inputDirtied = true;

          const getValidation = validation();

          data.vMsgKey += 1;

          return getValidation.valid;
        };

        input?.setCustomValidity?.(message);
      });
    });

    return function () {
      const id = `uit-${this._.uid}`;

      let getValidation = validation();

      const invalid = getValidation.valid === false && data.inputDirtied;

      const textarea = this.type == "textarea";

      const vmodel = this.modelValue || data.manualValue;

      return div(
        {
          ...scoping,
          class: [
            "root",
            {
              invalid,
              textarea,
              sm: /^sm$|^small$/i.test(this.size),
              lg: /^lg$|^large$/i.test(this.size),
            },
          ],
        },
        [
          div(
            {
              ...scoping,
              class: [
                "main fill-before-after",
                {
                  focused: data.focused,
                  "has-value": vmodel,
                  invalid,
                  textarea,
                },
              ],
              style: {
                "--ui-background": setCSSVariable(this.background),
              },
            },
            [
              label(
                {
                  ...scoping,
                  for: id,
                  class: ["label"],
                },
                this.label
              ),

              h(textarea ? "textarea" : "input", {
                ref: "input",
                ...scoping,
                id,
                type: this.type,
                class: [
                  "input",
                  {
                    textarea,
                    "has-value": vmodel,
                  },
                ],
                value: vmodel,
                pattern: this.pattern,
                autocomplete: this.autocomplete,
                required: this.required,
                placeholder: this.placeholder,
                onFocus: () => {
                  data.focused = true;
                },
                onBlur: () => {
                  data.focused = false;

                  data.inputDirtied = true;

                  validation();
                },
                onInput: (e) => {
                  const value = e.currentTarget.value;

                  if (textarea) {
                    let scrollHeight = this.$refs.input.scrollHeight;

                    scrollHeight != 96 &&
                      this.$nextTick(() => {
                        this.$refs.input.style.height = "";
                        scrollHeight = this.$refs.input.scrollHeight;
                        requestAnimationFrame(() => {
                          this.$refs.input.style.height = `${scrollHeight}px`;
                        });
                      });
                  }

                  emit("update:modelValue", value);

                  data.manualValue = value;

                  e.currentTarget.setCustomValidity(getValidation.message);
                },
              }),
            ]
          ),

          invalid
            ? div(
                {
                  key: data.vMsgKey,
                  ...scoping,
                  class: ["v-msg vibrate"],
                },
                [getValidation.message]
              )
            : undefined,
        ]
      );
    };
  },
};
</script>

<style>
.root[data-ui-input] {
  --ui-height: 56px;
  --ui-lable-font-size: 1.05rem;
  --ui-min-height: initial;
  --ui-background: initial;
  --ui-active-scale: translate3d(12px, 6px, 0) scale3d(0.75, 0.75, 1);
}

.root[data-ui-input].sm {
  --ui-height: 40px;
  --ui-lable-font-size: 0.85rem;
  --ui-active-scale: translate3d(12px, 4px, 0) scale3d(0.7, 0.7, 1);
}

.root[data-ui-input].lg {
  --ui-height: 64px;
  --ui-lable-font-size: 1.25rem;
  --ui-active-scale: translate3d(12px, 8px, 0) scale3d(0.8, 0.8, 1);
}

.main[data-ui-input] {
  /* height: var(--ui-height); */
  min-height: var(--ui-min-height);
  background-color: var(--ui-background);
  border-radius: var(--ui-rounded);
  position: relative;
}

.main[data-ui-input].textarea {
  --ui-min-height: 96px;
}

.main[data-ui-input]::before {
  transition: 0.1s opacity linear;
  border: 2px solid var(--primary-bg);
  opacity: 0;
}

.main[data-ui-input]::after {
  background-color: currentColor;
  transition: 0.2s opacity linear;
  opacity: 0;
}

.can-hover .main[data-ui-input]:hover::after {
  opacity: 0.05;
}

.main[data-ui-input]:active::after {
  opacity: 0.25;
}

.main[data-ui-input].invalid:not(:focus-within)::before {
  border: 2px solid var(--error-bg);
  opacity: 0.25;
}

.main[data-ui-input]:focus-within::before {
  opacity: 0.5;
}

.main[data-ui-input].has-value:not(:focus-within):before {
  opacity: 0.15;
}

.label[data-ui-input] {
  position: absolute;
  color: currentColor;
  font-weight: 400;
  font-size: var(--ui-lable-font-size);
  line-height: 1.4;
  letter-spacing: 0.4px;
  padding: 0px;
  display: block;
  transform-origin: left top;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - 24px);
  left: 0px;
  top: 0px;
  transform: translate3d(12px, 14px, 0) scale3d(1, 1, 1);
  transition: transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
  z-index: 1;
  pointer-events: none;
  color: var(--caption-c);
}

.main[data-ui-input]:focus-within > .label[data-ui-input],
.main[data-ui-input].has-value > .label[data-ui-input] {
  transform: var(--ui-active-scale);
  opacity: var(--t-body);
}

.input[data-ui-input] {
  appearance: none;
  border: none;
  outline: none;
  background-color: transparent;
  height: 100%;
  width: 100%;
  --height: calc(var(--ui-height) - calc(var(--ui-height) * 0.4285));
  padding: calc(0.75 * var(--height)) 12px calc(0.25 * var(--height));
  color: var(--body-c);
  letter-spacing: 0.4px;
  font-family: var(--default-font-family);
  opacity: 0;
}

.input[data-ui-input].has-value,
.input[data-ui-input]:focus {
  opacity: 1;
}

.input[data-ui-input]::placeholder {
  font-size: 0.875em;
}

.input[data-ui-input].textarea {
  resize: vertical;
  min-height: 96px;
}

.input[data-ui-input]:-webkit-autofill,
.input[data-ui-input]:-webkit-autofill:hover,
.input[data-ui-input]:-webkit-autofill:focus {
  box-shadow: 0 0 0 1000px var(--theme-banner) inset !important;
  -webkit-box-shadow: 0 0 0 1000px var(--theme-banner) inset !important;
  -webkit-text-fill-color: var(--body-c) !important;
  border-radius: var(--ui-rounded);
}

.input[data-ui-input]:autofill {
  box-shadow: 0 0 0 1000px var(--theme-banner) inset !important;
  -webkit-box-shadow: 0 0 0 1000px var(--theme-banner) inset !important;
  -webkit-text-fill-color: var(--body-c) !important;
  border-radius: var(--ui-rounded);
}

.v-msg[data-ui-input] {
  color: var(--error-bg);
  font-size: 0.9rem;
  text-align: right;
  padding: 0 var(--qtr-x-gutter);
  animation-delay: 0.15s;
  font-weight: 500;
  letter-spacing: 0.4px;
}
</style>

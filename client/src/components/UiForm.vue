<script>
import { getCurrentInstance, h, resolveComponent } from "@vue/runtime-core";
import { nextAnimFrame } from "../fendui/utils/core";

const form = (d, c) => h("form", d, c);
const Submit = (d, c) => h(resolveComponent("UiBtn"), d, c);

export default {
  name: "UiForm",
  emits: ["submit-clicked", "submit-form"],
  props: {
    showSubmit: {
      type: Boolean,
      default: true,
    },
    submitText: {
      type: String,
      default: "Submit",
    },
    submitData: {
      type: Object,
      default: () => ({}),
    },
    name: {
      type: String,
      required: true,
    },
  },
  setup(_, { emit }) {
    const i = getCurrentInstance();

    const submit = async () => {
      emit("submit-clicked");

      await nextAnimFrame();
      const isValid = i.subTree.el.reportValidity();

      if (isValid) {
        emit("submit-form");
      }
    };

    return function () {
      const submitData = { ...this.submitData };

      return form(
        {
          name: this.name,
          class: ["ui-form", `${this.$theme.is}-theme`],
          onSubmit: (e) => {
            e.preventDefault();
          },
        },
        [
          this.$slots.default?.({ submit }) || null,
          this.showSubmit
            ? Submit(
                {
                  title: this.submitText.toLowerCase(),

                  ...submitData,

                  class: ["submit-form", submitData?.class || ""],

                  onClick: async (e) => {
                    e.preventDefault();

                    submit();
                  },
                },
                {
                  default: () => [
                    this.$slots.submitText?.({ submit }) || this.submitText,
                  ],
                }
              )
            : null,
          this.$slots.append?.({ submit }) || null,
        ]
      );
    };
  },
};
</script>

<style>
.ui-form.dark-theme:not(.root[data-pfm]) {
  --info: #026fb3;
  --info-gradient: #508fb6;
}
.ui-form.light-theme:not(.root[data-pfm]) {
  --info: var(--primary);
  --info-gradient: rgb(54, 93, 114);
}
</style>

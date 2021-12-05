<script>
export default {
  name: 'UiSelect',
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    multiple: Boolean,
    modelValue: {
      type: [String, Array],
      default: () => '',
    },
    items: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      required: true,
    },
  },


  render(h) {
    if (!this.items.length) {
      return null
    }

    const scoping = { 'data-uist': '' }
    const select = (d, c) => h('select', d, c)
    const option = (d, c) => h('option', d, c)
    const optgroup = (d, c) => h('optgroup', d, c)

    return select(
      {
        attrs: {
          ...scoping,
          'aria-label': this.title,
          name: this.title,
          value: this.modelValue,
          multiple: this.multiple,
        },
        domProps: {
          value: this.modelValue,
        },
        staticClass: 'root',
        on: {
          ...this.$listeners,

          input: (e) => {
            this.$emit('input', e)
            const value = e.currentTarget.value.toLowerCase()
            const title =
              this.items.find((x) => x.value.toLowerCase() == value) || {}

            this.$emit('update:modelValue', value, title ? title.title : '')
          },
        },
      },
      [
        this.items.map((item, key) => {
          let selected
          if (
            !this.multiple &&
            item?.value?.toLowerCase?.() == this.modelValue.toLowerCase()
          ) {
            selected = 'true'
          }

          const options = ({ value, selected, disabled, title }) =>
            option(
              {
                key: key + value,
                attrs: {
                  ...scoping,
                  value: value.toLowerCase(),
                  'data-selected': selected,
                  disabled,
                  selected,
                },
                staticClass: 'item',
              },
              title
            )

          if (typeof item == 'object' && item.items && item.label) {
            return optgroup(
              {
                attrs: {
                  ...scoping,
                  label: item.label,
                },
              },
              [
                item.items.map((opt, _key) => {
                  return options({
                    value: opt.value,
                    disabled: opt.disabled,
                    title: opt.title,
                  })
                }),
              ]
            )
          }

          return options({
            ...item,
            selected,
          })
        }),
      ]
    )
  },
}
</script>

<style>
.root[data-uist] {
  cursor: pointer;
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  max-width: 256px;
  min-width: 96px;
}

.light .root[data-uist] {
  --disabled-c: rgba(44, 44, 44, 0.4);
}

.dark .root[data-uist] {
  --disabled-c: rgba(255, 255, 255, 0.4);
}

.item[data-uist] {
  color: var(--body-c);
  font-size: 0.95rem;
  font-weight: 400;
}

.item[data-uist][data-selected] {
  font-weight: 600;
  font-style: italic;
  color: var(--title-c);
}

.item[data-uist]:disabled {
  color: var(--disabled-c) !important;
  font-weight: 300;
}
</style>

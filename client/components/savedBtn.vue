<script>
import { mountSingleComponent, vibrate } from '~/components/utils/main'
export default {
  name: 'SavedBtn',

  props: {
    componentProps: {
      type: Object,
      default: () => ({}),
    },
    item: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      transitionState: '',

      componentMounted: false,

      rootKey: 0,
      selfName: 'SavedBtn',
      manualSaved: false,
    }
  },

  computed: {
    ...mountSingleComponent.computed,
    saved() {
      const recipe = this.$store.state.recipes?.[this.item] || {}

      return !!this.$store.state.savedItems.includes(this.item) || recipe.saved
    },
  },

  watch: {
    saved() {
      this.manualSaved = this.saved
    },
  },

  created() {
    this.manualSaved = this.saved
  },

  mounted() {
    mountSingleComponent.mounted.call(this)
  },

  render(h) {
    const scoping = { 'data-sbn': '' }
    const btn = (d, c) => h('ui-btn', d, c)
    const div = (d, c) => h('div', d, c)

    return btn(
      {
        key: this.rootKey,
        attrs: {
          ...scoping,
          role: 'checkbox',
          'aria-checked': `${this.manual ? 'true' : 'false'}`,
          'aria-label': `${this.saved ? 'saved' : 'save'}`,
          title: this.title || `${this.manual ? 'saved' : 'click to save'}`,
        },
        staticClass: 'root',
        class: [
          {
            __active: this.manualSaved,
          },
        ],
        props: {
          icon: true,
          flat: true,
          // readonly: /leave/i.test(this.transitionState),
          filledText: true,
          filledOpacity: '0.05',
          ...this.componentProps,
          config: {
            self: true,
          },
        },
        on: {
          click: async (e) => {
            e.stopPropagation()
            e.preventDefault()
            vibrate()

            this.manualSaved = !this.manualSaved

            this.$emit('click', e)

            const mode = this.saved ? 'remove' : 'add'

            await this.$nextTick()

            this.$emit('toggled', !this.manualSaved)

            await this.$save({
              id: this.item,
              mode,
            })
          },
          mousedown: (e) => {
            e.stopPropagation()
            e.preventDefault()
          },
          // touchstart: (e) => {
          //   e.stopPropagation();
          //   e.preventDefault();
          // },
          // touchend: (e) => {
          //   e.stopPropagation();
          //   e.preventDefault();
          //   e.currentTarget.click();
          // },
        },
      },
      [
        div(
          {
            key: `${this.manualSaved}`,
            attrs: {
              ...scoping,
              'aria-label': `heart${this.manualSaved ? '' : '-outline'} icon`,
              role: 'img',
            },
            staticClass: 'icon-wrap',
            class: [{ 'fade-scale-appear': this.manualSaved }],
            style: {
              '--appear-duration': '150ms',
              '--scale-y': '-0.1.',
            },
          },
          [
            h('ui-icon', {
              attrs: {
                name: this.manualSaved ? 'heart' : 'heart-outline',
              },
            }),
          ]
        ),
      ]
    )
  },
}
</script>

<style>
.root[data-sbn] {
  --icon__size-md: 30px !important;
  background-color: transparent !important;
  opacity: var(--t-subtitle) !important;
}

.can-hover .root[data-sbn]:hover,
.can-hover .root[data-sbn]:focus,
.root[data-sbn]:focus-within,
.root[data-sbn].__active {
  opacity: 1 !important;
}

.root[data-sbn].__active {
  color: var(--tertiary);
}

.root[data-sbn] svg {
  width: 20px !important;
  height: 20px !important;
}

/* .root[data-sbn]::before {
  opacity: 0.05;
}

.dark-theme .root[data-sbn]::before {
  opacity: 0.03;
} */

.icon-wrap[data-sbn] {
  pointer-events: none;
  overflow: hidden;
  display: grid;
  place-items: center;
}

.icon-wrap[data-sbn] > svg {
  opacity: var(--t-subtitle);
}
</style>

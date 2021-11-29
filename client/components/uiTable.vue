<script>
// div it up!
import { capitalize, computedBR, mountSingleComponent } from './utils/main'
export default {
  name: 'UiTable',
  props: {
    header: {
      type: Array,
      default: () => ['Key', 'Value'],
    },
    body: {
      type: Array,
      default: () => [],
    },
    label: {
      type: String,
      default: undefined,
    },
    describe: {
      type: String,
      default: undefined,
    },
    id: {
      type: String,
      default: undefined,
    },
    row: {
      type: String,
      default: '42px',
    },
    column: {
      type: String,
      default: '1fr 64px',
    },
  },
  data: () => ({
    selfName: 'UiTable',
  }),
  computed: {
    ...computedBR,
    ...mountSingleComponent.computed,
    getItems() {
      const value = [this.header]

      this.body.forEach((x) => {
        if (x.length == this.header.length) {
          value.push(x)
        }
      })

      return {
        header: value[0],
        body: value.filter((_, i) => i > 0),
        length: value.length,
      }
    },
  },
  mounted() {
    mountSingleComponent.mounted.call(this)
  },
  render(h) {
    const scoping = { 'data-uite': '' }

    const div = (d, c) => h('div', d, c)
    const span = (d, c) => h('span', d, c)

    const row = ({ header, key, divide, columns = [], index }) => {
      return div(
        {
          key,
          attrs: {
            ...scoping,
            role: 'rowgroup',
          },
          staticClass: `rowgroup ${header ? 'header' : 'body'}`,
          class: [{ 'fill-before section-divide-before': divide }],
        },
        [
          div(
            {
              attrs: {
                ...scoping,
                role: 'row',
                'aria-rowindex': header ? undefined : index,
              },
              staticClass: 'row',
            },
            columns.map((item, key) => {
              return span(
                {
                  key: key + 'cell',
                  attrs: {
                    ...scoping,
                    role: header ? 'columnheader' : 'cell',
                    'aria-sort': header ? 'none' : undefined,
                  },
                  class: [
                    {
                      __key: key == 0,
                      __value: key == 1,
                    },
                  ],
                },
                [capitalize(item)]
              )
            })
          ),
        ]
      )
    }

    return div(
      {
        attrs: {
          ...scoping,
          role: 'table',
          'aria-label': this.label,
          'aria-describedby': this.id,
        },
        staticClass: 'root fill-before',
        style: {
          '--length': this.getItems.length,
          '--row': this.row,
          '--column': this.column,
        },
      },
      [
        [
          this.id &&
            this.describe &&
            div(
              {
                attrs: {
                  ...scoping,
                  id: this.id,
                },
                staticClass: 'sr-only',
              },
              this.describe
            ),
        ],
        row({
          key: 'header',
          header: true,
          columns: this.getItems.header,
          divide: this.$theme.light,
        }),

        this.getItems.body.map((item, key, arr) => {
          return row({
            key: key + 'body',
            header: false,
            columns: item,
            index: key + 1,
            divide: key + 1 < arr.length,
          })
        }),
      ]
    )
  },
}
</script>

<style>
.root[data-uite] {
  background: var(--theme-inner-surface);
  position: relative;
  display: grid;
  grid-template-rows: repeat(var(--length), auto);
  max-width: 660px;
  width: calc(100% - var(--divide-offset));
  margin: 0 auto;
  border-radius: 4px;
  isolation: isolate;
  overflow: hidden;
}

.light-theme .root[data-uite] {
  background: var(--theme-primary);
}

.root[data-uite]::before {
  border: var(--ui-divide);
  z-index: 1;
}

.header[data-uite],
.body[data-uite] {
  min-height: var(--row);
}

.header[data-uite] {
  background: var(--theme-banner);
  font-weight: 600;
  position: relative;
  letter-spacing: 0.4px;
  font-size: 1.15rem;
  color: var(--title-c);
}

.header[data-uite]::before {
  --divide-offset: 0px;
}

.body[data-uite] {
  position: relative;
}

.body[data-uite]::before {
  --divide-offset: 0px;
  opacity: var(--t-caption);
}

.__key[data-uite] {
  font-size: 0.95rem;
  color: var(--body-c);
}

.__value[data-uite] {
  font-size: 0.9rem;
  color: var(--subtitle-c);
  line-height: 1.4;
  display: grid;
  height: 100%;
  justify-content: flex-start;
  align-items: center;
}

.row[data-uite] {
  min-height: var(--row);
  height: 100%;
  display: grid;
  align-items: center;
  grid-template-columns: var(--column);
  padding: 0.25rem var(--qtr-offset);
}
</style>

<script>
export default {
  name: 'AppSection',
  functional: true,
  inheritAttrs: false,
  props: {
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    bottomPadding: {
      type: Boolean,
      default: true,
    },
    divideBottom: {
      type: Boolean,
      default: true,
    },
    tag: {
      type: String,
      default: 'section',
    },
    useHeaderSlots: Boolean,
  },
  render(h, c) {
    const scoping = { 'data-asn': '' }
    const data = c.data
    const props = {
      ...c.props,
      ...data.attrs,
    }

    const attrs = {
      ...data.attrs,
    }

    delete attrs.description
    delete attrs.divideBottom
    delete attrs.bottomPadding

    const h2 = (d, c) => h('h2', d, c)
    const p = (d, c) => h('p', d, c)

    // props.useHeaderSlots && console.log(c.children)

    return h(
      props.tag,
      {
        ...data,
        attrs: {
          ...scoping,
          'aria-label': props.title,
          ...attrs,
        },
        staticClass: `root${
          c.data.staticClass ? ` ${c.data.staticClass}` : ''
        }`,
        class: [
          {
            'fill-before': props.divideBottom,
            'no-bottom-padding': !props.bottomPadding,
          },
        ],
      },
      [
        props.title.length
          ? h2(
              {
                attrs: {
                  ...scoping,
                },
                staticClass: 'title line-clamp-1',
                class: [
                  {
                    'no-desc': !props.description,
                  },
                ],
                domProps: !props.useHeaderSlots
                  ? {
                      innerHTML: props.title,
                    }
                  : undefined,
              },
              props.useHeaderSlots
                ? [
                    c?.scopedSlots.prependHeader?.(),
                    props.title,
                    c?.scopedSlots.appendHeader?.(),
                  ]
                : undefined
            )
          : null,
        props.description.length
          ? p({
              attrs: {
                ...scoping,
              },
              staticClass: 'description line-clamp-2',
              domProps: {
                innerHTML: props.description,
              },
            })
          : null,
        c.slots()?.default || '',
      ]
    )
  },
}
</script>

<style>
.root[data-asn] {
  position: relative;
  padding-bottom: var(--half-offset);
  display: grid;
  --heading-padding: 0 var(--half-offset);
}

.md-up .root[data-asn] {
  margin-top: var(--half-offset);
  padding-bottom: var(--divide-offset);
}

.root[data-asn].no-padding-bottom {
  padding-bottom: 0;
}

.root[data-asn]:not(:last-child)::before {
  border-bottom: var(--ui-divide);
  width: calc(100% - var(--divide-offset));
  left: var(--half-offset);
  border-bottom-width: 0.75px;
}

.title[data-asn] {
  margin: 0.25rem 0;
  margin-top: var(--half-offset);
  padding: var(--heading-padding);
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--primary);
  position: relative;
}

.sm-up .title[data-asn] {
  font-size: 1.35rem;
}

.title[data-asn].no-desc {
  margin-bottom: var(--qtr-offset);
}

.sm-up .title[data-asn],
.sm-up .description[data-asn] {
  text-align: center;
}

.title[data-asn] > .line-through {
  opacity: var(--t-disabled);
  font-weight: 400;
  font-size: 2rem;
  margin-left: 0.35rem;
  align-self: center;
}

.description[data-asn] {
  padding: var(--heading-padding);
  font-size: 0.9rem !important;
  font-weight: 600 !important;
  color: var(--subtitle-c);
  margin-bottom: var(--qtr-offset);
  line-height: 1.4;
  letter-spacing: 0.4px;
}

.sm-up .description[data-asn] {
  font-size: 1.1rem !important;
  font-weight: 400 !important;
}

.md-up .description[data-asn] {
  margin-bottom: var(--half-offset);
}
</style>

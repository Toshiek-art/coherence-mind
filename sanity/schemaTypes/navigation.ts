import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'navigation',
  title: 'Navigation Link',
  type: 'document',
  fields: [
    defineField({ name: 'label', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'href', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'order', type: 'number', validation: (rule) => rule.min(0) })
  ],
  preview: {
    select: { title: 'label', subtitle: 'href' }
  }
});

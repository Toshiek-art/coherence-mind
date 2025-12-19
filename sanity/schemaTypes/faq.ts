import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({ name: 'question', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'question' }, validation: (rule) => rule.required() }),
    defineField({ name: 'answer', type: 'array', of: [{ type: 'block' }] }),
    defineField({
      name: 'category',
      type: 'string',
      options: {
        list: ['Philosophy', 'AI', 'Methodology', 'Comparisons', 'Practice']
      }
    })
  ]
});

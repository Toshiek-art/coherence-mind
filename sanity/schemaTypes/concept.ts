import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'concept',
  title: 'Concept',
  type: 'document',
  fields: [
    defineField({ name: 'term', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'term' }, validation: (rule) => rule.required() }),
    defineField({ name: 'shortDefinition', type: 'text', rows: 3 }),
    defineField({ name: 'fullDefinition', type: 'array', of: [{ type: 'block' }] }),
    defineField({
      name: 'relatedConcepts',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'concept' }] }]
    })
  ]
});

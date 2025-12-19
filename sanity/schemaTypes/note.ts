import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'note',
  title: 'Lab Note',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (rule) => rule.required() }),
    defineField({ name: 'createdAt', type: 'datetime', initialValue: () => new Date().toISOString() }),
    defineField({ name: 'body', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'tags', type: 'array', of: [{ type: 'string' }] })
  ]
});

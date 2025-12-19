import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'paper',
  title: 'Paper',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (rule) => rule.required() }),
    defineField({ name: 'abstract', type: 'text' }),
    defineField({ name: 'link', type: 'url', description: 'External URL (Zenodo, arXiv, etc.)' }),
    defineField({ name: 'file', type: 'file', options: { storeOriginalFilename: true } }),
    defineField({ name: 'year', type: 'number', validation: (rule) => rule.min(1990).max(2100) }),
    defineField({
      name: 'tags',
      type: 'array',
      of: [{ type: 'string' }]
    })
  ]
});

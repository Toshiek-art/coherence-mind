import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'staticPage',
  title: 'Static Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (rule) => rule.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required()
    }),
    defineField({ name: 'heroTitle', type: 'string' }),
    defineField({ name: 'heroSubtitle', type: 'text' }),
    defineField({
      name: 'heroDisclaimer',
      type: 'text',
      title: 'Hero Disclaimer'
    }),
    defineField({
      name: 'scopeEpistemicStatus',
      title: 'Scope & Epistemic Status',
      type: 'array',
      of: [{ type: 'block' }]
    }),
    defineField({
      name: 'body',
      type: 'array',
      of: [{ type: 'block' }]
    }),
    defineField({
      name: 'sections',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'summary', type: 'text' }),
            defineField({ name: 'body', type: 'array', of: [{ type: 'block' }] })
          ]
        }
      ]
    })
  ]
});

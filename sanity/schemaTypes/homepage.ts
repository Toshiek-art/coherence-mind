import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    defineField({ name: 'heroTitle', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'heroSubtitle', type: 'text' }),
    defineField({
      name: 'heroDisclaimer',
      type: 'text',
      title: 'Hero Disclaimer'
    }),
    defineField({
      name: 'scopeEpistemicStatus',
      type: 'array',
      of: [{ type: 'block' }],
      title: 'Scope & Epistemic Status'
    })
  ]
});

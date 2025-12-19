import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'description', type: 'text' }),
    defineField({
      name: 'logo',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({ name: 'primaryColor', type: 'string', description: 'HEX color used in UI' })
  ]
});

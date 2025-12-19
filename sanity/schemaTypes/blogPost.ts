import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: (rule) => rule.required() }),
    defineField({ name: 'excerpt', type: 'text', rows: 4 }),
    defineField({ name: 'body', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'publishedAt', type: 'datetime', validation: (rule) => rule.required() }),
    defineField({ name: 'updatedAt', type: 'datetime' }),
    defineField({ name: 'tags', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'author', type: 'reference', to: [{ type: 'author' }] })
  ],
  preview: {
    select: {
      title: 'title',
      date: 'publishedAt'
    },
    prepare({ title, date }) {
      return { title, subtitle: date ? new Date(date).toLocaleDateString() : 'Draft' };
    }
  }
});

import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "photographyBlurb",
      title: "Photography blurb",
      description: "The short introduction shown above the photography archive.",
      type: "text",
      rows: 4,
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
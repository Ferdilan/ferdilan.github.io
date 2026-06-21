import { defineField, defineType } from "sanity";

export const certificateSchema = defineType({
  name: "certificate",
  title: "Certificate",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Certificate Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "issuedBy",
      title: "Issued By",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "issuedAt",
      title: "Issued Date",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "expiresAt",
      title: "Expiry Date (optional)",
      type: "date",
    }),
    defineField({
      name: "credentialId",
      title: "Credential ID",
      type: "string",
    }),
    defineField({
      name: "credentialUrl",
      title: "Credential URL",
      type: "url",
    }),
    defineField({
      name: "image",
      title: "Certificate Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Networking", value: "networking" },
          { title: "Cloud Computing", value: "cloud" },
          { title: "Programming", value: "programming" },
          { title: "Academic", value: "academic" },
          { title: "Other", value: "other" },
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "issuedBy",
      media: "image",
    },
  },
});

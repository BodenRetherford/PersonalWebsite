import { groq } from "next-sanity";

export const photosQuery = groq`
  *[_type == "photo"] | order(publishedAt desc, _createdAt desc) {
    _id,
    title,
    caption,
    tags,
    image,
    publishedAt
  }
`;

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    photographyBlurb
  }
`;
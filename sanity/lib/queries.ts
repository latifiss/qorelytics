export const blogPostsQuery = `
  *[_type == "post"] | order(date desc) {
    "id": _id,
    title,
    date,
    "imageUrl": image.asset->url,
    tags
  }
`
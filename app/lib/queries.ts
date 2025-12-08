import { gql } from "@apollo/client";

export const GET_POSTS = gql`
  query GetPosts {
    posts(first: 20) {
      nodes {
        id
        title
        slug
        date
        excerpt
        content
        featuredImage {
          node {
            sourceUrl
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
        author {
          node {
            name
          }
        }
      }
    }
  }
`;

export const GET_PAGES = gql`
  query GetPages {
    pages(first: 100) {
      nodes {
        id
        title
        slug
        content
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;

export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      slug
      date
      content
      excerpt
      featuredImage {
        node {
          sourceUrl
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
      author {
        node {
          name
        }
      }
    }
  }
`;

export const GET_PAGE_BY_SLUG = gql`
  query GetPageBySlug($slug: ID!) {
    page(id: $slug, idType: URI) {
      id
      title
      slug
      content
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
  }
`;

export const GET_SERVICES = gql`
  query GetServices {
    services(first: 50) {
      nodes {
        id
        title
        slug
        content
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;

export const GET_LOCATIONS = gql`
  query GetLocations {
    locations(first: 50) {
      nodes {
        id
        title
        slug
        content
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;

export const GET_MENU = gql`
  query GetMenu {
    menus {
      nodes {
        id
        name
        slug
        menuItems(first: 50) {
          nodes {
            id
            label
            uri
            parentId
            childItems {
              nodes {
                id
                label
                uri
              }
            }
          }
        }
      }
    }
    generalSettings {
      title
      description
    }
  }
`;

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
    pages(first: 20) {
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

// Not: WordPress'te 'Service' adında bir Custom Post Type (CPT) oluşturduğunuzu varsayıyoruz.
// Eğer yoksa, bunu standart 'post' olarak ve kategori filtrelemesiyle değiştirebiliriz.
export const GET_SERVICES = gql`
  query GetServices {
    services(first: 20) {
      nodes {
        id
        title
        slug
        content
        serviceFields { 
           iconName
           shortDesc
        }
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;

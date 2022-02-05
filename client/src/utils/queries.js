import { gql } from '@apollo/client';

//information for a logged in user
export const GET_ME = gql`
  {
    me {
        _id
        username
        email
        bookCount
        savedBooks {
            bookId
            authors
            description
            title
            image
            link
        }
    }
  }
`;
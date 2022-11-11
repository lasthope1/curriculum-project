import {gql} from '@apollo/client';

const ADMIN_FACULTY_QUERY = gql`
    query {
        fas{
            id
            name
            major {
                id
                name
            }
        }
    }
`

const ADMIN_FACULTY_CREATE_MUTATION = gql`
    mutation cfa($name String!, $)
`
import {gql} from '@apollo/client';

const STUDENT_QUESTION_QUERY = gql`
    query queryQuestion($id: ID!){
        question(id: $id) {
            question
            choice
            answer
	    }
    }
`

const STUDENT_UPDATE_QUESTION_MUTATION = gql`
    mutation updateQuestion($id: ID!, $answer: String){
        uQuestion(id: $id, answer: $answer) {
            answer
        }
    }
`

export {STUDENT_QUESTION_QUERY, STUDENT_UPDATE_QUESTION_MUTATION}
import {gql} from '@apollo/client';

const USERDATA_QUERY = gql `
    query {
        me{
            id
            fullname
            question{
                id
                question
                choice
                answer
            }
            data{
                id
                name
            }
            # fe {
            #     COURSENO
            #     name
            #     credit
            #     grade
            #     status
            # }
            # gpa
        }
    }
`

const ADVISERDATA_QUERY = gql `
    query {
        advisor {
            id
            fullname
            # email
            # cmu_name
            # role
            stu{
                id
                student_id
                major_id
                curriculum_id
                # major_name_th
                # semester_admit
                year_admit
                # study_time_id
                adviser_id
                # adviser_name
                # adviser_cmu_account
                grade_status
            }
        }
    }
`

export {USERDATA_QUERY, ADVISERDATA_QUERY}
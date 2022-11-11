import {gql} from '@apollo/client';

const STUDENT_DATA_QUERY = gql`
    query queryCurriculum($id: ID!){
        uCur(id: $id){
            cat{
                ...RefCatFields
                ...RefCatRecursive
            }
        }
    }

    fragment RefCatFields on uCat {
        id
        name
        refList {
            id 
            name 
            courses {
                id
                COURSENO
                name
                credit
                grade
                status
            }
            credit
            newCredit
            status
            type
        }
        credit
    }

    fragment RefCatRecursive on uCat {
        refCat {
            ...RefCatFields
            refCat {
                ...RefCatFields
                refCat {
                    ...RefCatFields
                    refCat {
                        ...RefCatFields
                        refCat {
                            ...RefCatFields
                            refCat {
                                ...RefCatFields
                                refCat {
                                    ...RefCatFields
                                    refCat {
                                      ...RefCatFields
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`

const STUDENT_FE_QUERY = gql`
    query {
        me {
            data{
                fe {
                    id
                    name
                    refList {
                        id
                        name
                        courses {
                            id
                            name
                            COURSENO
                            credit
                            grade
                            status
                        }
                        credit
                        newCredit
                        status
                    }
                    credit
                }
            }
        }
    }
`

const STUDENT_GRADE_QUERY = gql`
    query{
        me{
            gpa
            isGrad
            rootCredit{
                ge
                fs
                fe
            }
        }
    }
`

const STUDENT_RESET_QUERY = gql`
    query {
        me {
            setField
        }
    }
`

const ADMIN_DATA_QUERY = gql`
    query{
        aCur(id: "6320b6f8217f28de29cee2ce") {
          id
          name
          cat {
            id
            name
            ...RefCatFields
            ...RefCatRecursive
          }
        }
    }

    fragment RefCatFields on aCat {
        id
        name
        refList {
            id
            name
            courses {
                id
                COURSENO
                name
                credit
            }
        }
    }

    fragment RefCatRecursive on aCat {
        refCat {
            ...RefCatFields
            refCat {
                ...RefCatFields
                refCat {
                    ...RefCatFields
                    refCat {
                        ...RefCatFields
                        refCat {
                            ...RefCatFields
                            refCat {
                                ...RefCatFields
                                refCat {
                                    ...RefCatFields
                                    refCat {
                                        ...RefCatFields
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`


export {STUDENT_DATA_QUERY, STUDENT_FE_QUERY, STUDENT_GRADE_QUERY, STUDENT_RESET_QUERY, ADMIN_DATA_QUERY};
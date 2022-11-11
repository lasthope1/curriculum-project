import React, { useState, useEffect } from 'react';
import {useQuery} from '@apollo/client';

// Queries and Mutations
import {STUDENT_QUESTION_QUERY} from '../query/queryQuestion';


// Components 
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

// Interfaces
import { Inf_User } from '../interfaces/InfOther';


// -->  Main function component <--
function Question(props: {parentCallback: (planSelected: string) => void, handledState: string, UserInfo: Inf_User}){
    const [valueState, setValueState] = useState(props.handledState);
    const {loading, error, data} = useQuery(STUDENT_QUESTION_QUERY,{
        variables: {
            "id" : props.UserInfo.question.id
        }
    });

    if (loading) {
        return <div>loading...</div>
    }

    if (error) {
        return <div>fail to fetch</div>
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setValueState((event.target as HTMLInputElement).value);
        props.parentCallback((event.target as HTMLInputElement).value)
    };

    return (
         <FormControl>
             <FormLabel sx={{margin: '15px 10px'}}>{data.question.question}</FormLabel>
             <RadioGroup
                name='Plan'
                defaultValue="Normal Education Plan"
                value={valueState}
                onChange={handleChange} 
             >
                {
                    data.question.choice.map((choice: String, index: number) => (
                        <FormControlLabel sx={{marginLeft: '20px'}} key={index.toString()} value={choice} control={<Radio />} label={choice} />
                    ))
                }
             </RadioGroup>
         </FormControl>
    );
}

export default Question;

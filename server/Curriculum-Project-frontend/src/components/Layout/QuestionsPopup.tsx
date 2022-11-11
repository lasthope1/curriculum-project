
import {useState} from 'react';
import {useMutation, useLazyQuery} from '@apollo/client';
import '../../styles/Popup.css';

// Queries and Mutations 
import { STUDENT_UPDATE_QUESTION_MUTATION } from '../query/queryQuestion';
import {STUDENT_DATA_QUERY, STUDENT_FE_QUERY, STUDENT_GRADE_QUERY, STUDENT_RESET_QUERY} from '../query/queryData';

// Components
import Question from './question';

// Interfaces
import {Inf_User} from '../interfaces/InfOther';


// --> Main function component <-- 
function Popup( props : 
    {                
        setToggle: (activePopup: boolean) => void,                 
        parentCallback: (planSelected: string) => void,                 
        toggle: boolean,                 
        handleState: string,
        UserInfo: Inf_User      
    }){
    
    const [fetchFe] = useLazyQuery(STUDENT_FE_QUERY)
    const [fetchGrade] = useLazyQuery(STUDENT_GRADE_QUERY)
    const [fetchReset] = useLazyQuery(STUDENT_RESET_QUERY)
    const [eduPlan, setEduPlan] = useState('')
    var value : string = eduPlan;

    const [saveAns] = useMutation(STUDENT_UPDATE_QUESTION_MUTATION, {
        variables: {
            "id": props.UserInfo.question.id,
            "answer": (eduPlan === 'Normal Educational Plan') ? "normal" : "coop"
        },
        refetchQueries: () => [{
            query: STUDENT_DATA_QUERY,
            variables: {
                "id": props.UserInfo.data.id
            }},
            {
                query: STUDENT_FE_QUERY,
        }],
        awaitRefetchQueries: true,
        notifyOnNetworkStatusChange: true
    })
    
    function handleSave(event : React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        props.parentCallback(value);    
        props.setToggle(false);
        saveAns()
    }
    
    return (props.toggle) ? 
        <div className="popup-bg">
            <div className="popup-box">
                <nav className="nav-question">
                    <h3 className="question">Question</h3> 
                </nav>
                <Question parentCallback={setEduPlan} handledState={props.handleState} UserInfo={props.UserInfo}/>
                <button className="save-btn" onClick={handleSave}>save</button>
                <button className="cancel-btn" onClick={()=> props.setToggle(false)}>cancel</button>
            </div>
        </div>
    :null;
}

export default Popup;
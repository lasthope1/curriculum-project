import {useState, useEffect} from 'react';
import { useQuery } from '@apollo/client';
import '../../styles/studentNav.css';

// Components
import Popup from './QuestionsPopup';

// Queries and Mutations
import {STUDENT_QUESTION_QUERY} from '../query/queryQuestion';

// Interfaces
import {Inf_User} from '../interfaces/InfOther';

// Components
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';


// --> Main function component <-- 
function NavigationBar(props: {UserInfo: Inf_User}){

    const [showDD, setShowDD] = useState<boolean>(false)
    const [activePopup, setActivePopup] = useState(false);
    const [EduPlan, setEduPlan] = useState('');
    const {data, error} = useQuery(STUDENT_QUESTION_QUERY, {
        variables: {
            "id" : props.UserInfo.question.id
        }
    });

    // const li_main = document.querySelector('.li-main');
    // li_main?.addEventListener('click', handleClickMenu);

    // function handleClickMenu(this: HTMLElement) {
    //     console.log('Clicked')
    //     this.classList.toggle("active");
    // }

    useEffect(() => {
        if(data){
            (data.question.answer === 'normal') ? 
                setEduPlan("Normal Educational Plan") 
                : setEduPlan("Cooperative Educational Plan")
        }
        // console.log(props.UserInfo.gpa)
    }, [data])

    async function logoutUserHandler(event: React.MouseEvent<HTMLInputElement>){
        event.preventDefault();
        document.cookie = "user-token=; expires=Sun, 31 Oct 1999 00:00:00 UTC; path=/;";
        window.location.href = '/';
        // return false;
    }
    
    return (
        <>
            <nav className='navbar-wrapper'>
                <div>
                    <Button className='plan-btn' 
                        variant='contained'
                        color='info'
                        onClick={() => setActivePopup(true)}>
                        {EduPlan}
                    </Button>
                </div>
                <div style={{color: '#fff', fontSize: '22px'}}>
                    <span>{props.UserInfo.data.name}</span>
                </div>
                <div className='std-info'>
                    <ul>
                        <li className='std-gpa'>
                            <span>GPA : {(props.UserInfo.gpa === undefined || props.UserInfo.gpa === 0) ? '-' : props.UserInfo.gpa}</span>
                        </li>
                        <li className='std-heriLine'></li>
                        <li className={showDD ? 'std-name-act' : 'std-name'}>
                            <ul>
                                <li onClick={() => setShowDD(!showDD)} className='std-li'>
                                    <span>{props.UserInfo.fullname}</span>
                                    <i className={showDD ? 'triangle-dd-act' : 'triangle-dd'} /> 
                                </li>
                            </ul>
                            {   showDD &&
                                <div className='dd-menu' onClick={(e: React.MouseEvent<HTMLInputElement>) => logoutUserHandler(e)}>
                                    <div className='dd-left'>
                                        <ul>
                                            <li>
                                                <i><LogoutIcon/></i>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className='dd-right'>
                                        <ul>
                                            <li>
                                                <i>Logout</i>
                                            </li>
                                        </ul>
                                    </div>
                                </div>  
                            }
                        </li>
                    </ul>
                </div>
            </nav>
            <Popup 
                toggle={activePopup} 
                setToggle={setActivePopup} 
                parentCallback={setEduPlan}
                handleState={EduPlan}
                UserInfo={props.UserInfo}
            />
        </>
    )
}

export default NavigationBar ;
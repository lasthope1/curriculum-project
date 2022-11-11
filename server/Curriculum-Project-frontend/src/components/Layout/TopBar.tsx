import {useState} from 'react';
import styled from 'styled-components';
import '../../styles/SearchBar.css';

import {IAdviserData} from '../interfaces/InfOther';
import LogoutIcon from '@mui/icons-material/Logout';

const TopWrapper = styled.nav`
    background: #674B91;
    position: fixed;
    width: 100%;
    height: var(--nav-size);
    display: flex;
    padding: 17px 32px;
    align-items: center;
    justify-content: space-between;
    border-bottom: var(--border);
    
    top: 0px;
    left: 0px;
`;


// --> Main function component <-- 
function TopBar(props: {UserInfo: IAdviserData}) {
    const [filteredData, setFilteredData] = useState(Array<object>());
    const [showDD, setShowDD] = useState<boolean>(false)

    async function logoutUserHandler(event: React.MouseEvent<HTMLInputElement>){
        event.preventDefault();
        document.cookie = "user-token=; expires=Sun, 31 Oct 1999 00:00:00 UTC; path=/;";
        window.location.href = '/';
        // return false;
    }

    // const handleFilter = (searchWord: string) => {
    //     if(searchWord !== ""){
    //         const newFilter = param.data.filter(({name}: IStudentData) => {
    //             return name.includes(searchWord);
    //         })
    //         setFilteredData(newFilter)
    //     }else{
    //         setFilteredData([])
    //     }
    // }

  return (
    <TopWrapper>
        <div className="searchWrapper">
            <div className="searchInputs">
                <input type="text" placeholder='Enter student code'/>
                {/* <div className="searchIcon"></div> */}
            </div>
            { filteredData.length !== 0 && (
                    <div className="dataResult">
                        { filteredData.map(({name}: any) => {
                                return ( 
                                    <div className="dataItem">
                                        <p>{name}</p>
                                    </div>
                                );
                            })
                        }
                    </div>
                )
            }
        </div>
        <div className='std-info'>
                    <ul>
                        {/* <li className='std-gpa'>
                            <span>GPA : {props.UserInfo.gpa}</span>
                        </li>
                        <li className='std-heriLine'></li> */}
                        <li className={showDD ? 'std-name-act' : 'std-name'}>
                            <ul>
                                <li onClick={() => setShowDD(!showDD)} className='std-li'>
                                    <span style={{fontSize: '20px'}}>{props.UserInfo.fullname}</span>
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
    </TopWrapper>
  )
}

export default TopBar;

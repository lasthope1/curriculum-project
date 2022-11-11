import {useState, useEffect, createContext} from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import styled from 'styled-components';

// Components
import Checkbox from '../components/Layout/Checkbox';
import NavigationBar from '../components/Layout/NavigationBar';
import StudentTreeView from '../components/Layout/StudentTreeView';

// Queries and Mutations
import { USERDATA_QUERY } from '../components/query/queryUser';

// Interfaces
import {Inf_User} from '../components/interfaces/InfOther';

const ContainerFragment = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: space-between;
  align-items: flex-start;
`

export interface ModeInf {
  modeSelected: string[]
}

const defaultState: ModeInf = {
  modeSelected: []      // Start Mode selected list by empty array []
}

export const ModeContext = createContext<ModeInf>(defaultState);


// --> Main component <--
function Student(){
  const [fetchUser] = useLazyQuery(USERDATA_QUERY);
  const [Selected, setSelected] = useState<Array<string>>(['completed', 'inprocess', 'pending']);
  const [userInfo, setUserInfo] = useState<Inf_User>({
    id: '',
    fullname: '',
    question: {
      id: '',
      question: '',
      choices: [],
      answer: ''
    },
    data: {
      id: '',
      name: '',
      // setField: ''
    },
    gpa: 0.00
  });

  function checkboxCallback(modeSelected: string[]){
    setSelected([...modeSelected])
  }

  function setGrade(ave: number) {
    setUserInfo((prev: Inf_User) => ({
      ...prev, 
      gpa : ave
    }))
  }

  useEffect(() => {
    const userFetch = async() => {
      const res = await fetchUser()
      await setUserInfo(res.data.me)
    }
    
    userFetch()
  }, [])

  return (
    <>
      <Checkbox Callback={(modeFilter: string[]) => checkboxCallback(modeFilter)}/>
      <ContainerFragment>
        <ModeContext.Provider value={{modeSelected: Selected}}>
          <StudentTreeView userCurriID={userInfo.data.id} setAveGPA={setGrade}/>
        </ModeContext.Provider>
      </ContainerFragment>
      <NavigationBar UserInfo={userInfo}/>
    </>
  )
}

export default Student ; 



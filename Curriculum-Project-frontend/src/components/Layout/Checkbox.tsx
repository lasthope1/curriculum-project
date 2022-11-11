
import React, {useState}  from 'react';
import '../../styles/Checkbox.css';

interface CheckboxData {
    id: string
    name: string
    value: string
}

type FiltersOption = {
    filterLists: CheckboxData[]
    activeFilter: string[]
}

const filterCheckbox: FiltersOption = {
    filterLists: [
        {
            id: 'checkbox1',
            name: 'Completed',
            value: 'completed'
        },
        {
            id: 'checkbox2',
            name: 'In process',
            value: 'inprocess'
        },
        {
            id: 'checkbox3',
            name: 'Pending',
            value: 'pending'
        }
    ],
    activeFilter: ['completed', 'inprocess', 'pending']
}


// --> Main function component <--
function Checkbox(param: {Callback: (activeFilterList: string[]) => void}) {
    
    async function onFilterChange(event: React.ChangeEvent<HTMLInputElement>, checkedList: string[]){
        if (checkedList.includes(event.target.value)) {
            const filterIndex: number = checkedList.indexOf(event.target.value);
            await filterCheckbox.activeFilter.splice(filterIndex, 1);
        } else {
            await filterCheckbox.activeFilter.push(event.target.value);
        }

        param.Callback(filterCheckbox.activeFilter);
    }

    function checkboxDisplayer(checkbox: CheckboxData): JSX.Element {
        return (
            <label className='Checkbox-item' id={checkbox.id}>
                <input type='checkbox' value={checkbox.value} 
                    checked={filterCheckbox.activeFilter.includes(checkbox.value)} 
                    onChange={(event) => onFilterChange(event, filterCheckbox.activeFilter)}/>
                <span className={checkbox.value}>{checkbox.name}</span>
            </label>
        )
    }
    
  return (
    <>
        <div className='Checkbox'>

            {   filterCheckbox.filterLists.map((checkboxOpt: CheckboxData) => 
                    checkboxDisplayer(checkboxOpt)
                )
            }
        </div>
    </>
  );
}

export default Checkbox;

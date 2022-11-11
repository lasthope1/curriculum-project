import React, {useState, useReducer, useEffect} from 'react';
import '../../styles/CurriAddForm.css'

// Components
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader'
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import ModalTV from '../Layout/ModalTV';
import { ButtonGroup } from '@mui/material';

// Icons
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';

interface Inf_State {
    Curri_name: string
    isError: boolean
}

type Action = { type: 'setCurriName', payload: string } 
    | { type: 'formSubmit', payload: string}

const initialState: Inf_State = {
    Curri_name: '',
    isError: false
}

const reducer = (state: Inf_State, action: Action) => {
    switch(action.type){
        case 'setCurriName': 
            return {
                ...state,
                Curri_name: action.payload
            }
        case 'formSubmit':
            return {
                ...state,
                isError: false
            }
    }
}

function CurriAddForm() {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [checkedDup, setCheckedDup] = useState<boolean>(false);
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [state, dispatch] = useReducer(reducer, initialState);
    const [currDup, setCurrDup] = useState<string>('');
    const [radioValue, setRadioValue] = useState<string>('');

    const cancelButton = (
        <IconButton size='medium' color='error' onClick={handleClose}>
            <CancelIcon fontSize="inherit"/>
        </IconButton>
    )

    function handleClose() {
        setOpenForm(false);
        setCurrDup('');
        setCheckedDup(false);
        setRadioValue('');
    }

    function handleSubmit() {
        dispatch({
            type: 'formSubmit',
            payload: 'Submit Successful'
        })
        setOpenForm(false);
        setCheckedDup(false);
    }

    function handleNameChange(event : React.ChangeEvent<HTMLInputElement>) {
        dispatch({
            type: 'setCurriName',
            payload: event.target.value
        })
    }

    function handleSelectChange(event: {target: {value: string}}) {
        setCurrDup(event.target.value);
    }

    function handleSwitchChange(event: React.ChangeEvent<HTMLInputElement>) {
        setCurrDup('');
        setCheckedDup(event.target.checked);
    }

    function handleRadioChange(event: React.ChangeEvent<HTMLInputElement>) {
        setOpenModal(true)
        setRadioValue(event.target.value)
    }

    return (
        <Box>
            {   !openForm ? 
                    <Button className='text-light' size='large'
                        variant='contained' startIcon={<AddIcon/>}
                        onClick={() => setOpenForm(true)}>
                        Curriculum
                    </Button> : 
                    <Card>
                        <CardHeader action={cancelButton} title={<h5>Create new curriculum</h5>}/>
                        <CardContent>
                            <Box component='form' onSubmit={handleSubmit}>
                                <Grid item xs={6}>
                                    <TextField error={state.isError} fullWidth required
                                    id="CurriName" 
                                    label="Required"
                                    type='text' 
                                    variant="outlined"
                                    placeholder='Curriculum name'
                                    onChange={handleNameChange}
                                    defaultValue="Curriculum name"
                                    margin='dense'
                                    />
                                </Grid>
                                <Grid item xs={6} sx={{marginTop: '20px'}}>
                                    <FormLabel component="legend">Duplication</FormLabel>
                                    <FormControlLabel 
                                        control={<Switch 
                                            color="primary" 
                                            onChange={handleSwitchChange}
                                            sx={{marginLeft: '15px', display: 'inline-flex'}}/>}
                                        label="Duplicate category folder"
                                        labelPlacement="start"/>
                                    <FormControl fullWidth sx={{marginTop: 0.5}} disabled={!checkedDup}>
                                        <InputLabel id='select-curri-babel'>from</InputLabel>
                                        <Select value={currDup} onChange={handleSelectChange} >
                                            <MenuItem value='Curriculum 2558'>Curriculum 2558</MenuItem>
                                            <MenuItem value='Curriculum 2563'>Curriculum 2563</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6} sx={{position: 'relative'}}>
                                    <FormControl sx={{marginTop: '15px'}} disabled={(currDup) ? false : true}>
                                        <RadioGroup sx={{marginLeft: '15px'}} 
                                            name='radio-Dup-group'
                                            value={radioValue}
                                            onChange={handleRadioChange}>
                                            <FormControlLabel value='all' control={<Radio />} label="Duplicate all in main category folder" />
                                            <FormGroup sx={{ml: 5}}>
                                                <FormControlLabel disabled={(radioValue !== 'all')} 
                                                    control={<Checkbox />} 
                                                    label='General Education' />
                                                <FormControlLabel disabled={(radioValue !== 'all')} 
                                                    control={<Checkbox />} 
                                                    label='Field of Specialization' />
                                            </FormGroup>
                                            <FormControlLabel value='partial' control={<Radio />} label="Duplicate partial in category folder" />
                                            <Box sx={{position: 'absolute', top: '75%', right: '-10%'}}>
                                                <IconButton onClick={() => setOpenModal(true)} disabled={(radioValue !== 'partial')}>
                                                    <FolderCopyIcon />
                                                </IconButton>
                                            </Box>
                                        </RadioGroup>
                                    </FormControl> 
                                    { (openModal && (radioValue === 'partial')) && <ModalTV isOpen={openModal} setOpen={setOpenModal} /> }
                                </Grid>
                            </Box>
                        </CardContent>
                        <CardActions sx={{justifyContent: 'flex-end'}}>
                            <Button onClick={handleSubmit} type='submit'>Create</Button>
                        </CardActions>
                    </Card>
            }
        </Box>
    )
}

export default CurriAddForm;
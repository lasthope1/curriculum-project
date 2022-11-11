import {useState, Dispatch, SetStateAction} from 'react'

// Components
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';


function CreateNewCurriForm(props: {toggle: boolean, setToggle: Dispatch<SetStateAction<boolean>>}) {

    // const handleClickOpen = () => {
    //     setToggle(true);
    // };
    
    // const handleClose = () => {
    //     setToggle(false);
    // };
    
    return (
      <div>
        <Dialog open={props.toggle} onClose={(() => props.setToggle(false))}>
          <DialogTitle>Subscribe</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To subscribe to this website, please enter your email address here. We
              will send updates occasionally.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => props.setToggle(false)}>Cancel</Button>
            <Button onClick={() => props.setToggle(false)}>Subscribe</Button>
          </DialogActions>
        </Dialog>
      </div>
    )
}

export default CreateNewCurriForm;
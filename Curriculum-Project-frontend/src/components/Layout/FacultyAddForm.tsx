
import {useState, useEffect} from 'react';

// Components
import {Container, Alert, Button, Form, Col, Row} from 'react-bootstrap';
import {IconButton, Box} from '@mui/material';

// Interfaces
import {Inf_FacultyData, Inf_MajorData} from '../interfaces/InfOther';

// Icons
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';


// --> Main function component <-- 
function AddForm(prop: {callbackData: (FacData: Inf_FacultyData) => void}) {
    const [openForm, setOpenForm] = useState(false);

    const [inputFacName, setInputFacName] = useState('');
    const [inputMajName, setInputMajName] = useState('');
    const [itemFac, setItemFac] = useState<Inf_FacultyData>();
    const [listMaj, setlistMaj] = useState<Array<Inf_MajorData>>([]);

    useEffect(() => {
        console.log(itemFac)
        if(typeof itemFac !== 'undefined'){
          prop.callbackData(itemFac);
        } 
    }, [itemFac])

    function cancleHandler() {
      setOpenForm(false);
      setInputFacName('');
      setInputMajName('');
      setlistMaj([]);
    }

    function submitHandler(event: React.MouseEvent<HTMLButtonElement>) {
      event.preventDefault();
      if (inputFacName !== ''){
        var randomID: number = Math.floor(Math.random() * 100);
        setItemFac(
            {
              id: randomID.toString(), 
              name: inputFacName,
              MajorList: listMaj
            }
          );
          // window.open(`Admin/${nameFac}`, '_parent');
      }else{
        alert("Warning : Please enter the faculty name");
      }
      setInputFacName('');
      setInputMajName('');
      setlistMaj([]);
    }

    function addMajorHandler(event: React.MouseEvent<HTMLButtonElement>) {
      event.preventDefault();
      if (inputMajName !== ''){ 
        var amount: number = listMaj.filter((maj: Inf_MajorData) => maj.name === inputMajName).length;
        if (amount === 0){
          var randomID: number = Math.floor(Math.random() * 100);
          setlistMaj([...listMaj,
            {
              id: randomID.toString(),
              name: inputMajName
            }
          ])
        }else{
          alert(`Warning : You already have Major's name "${inputMajName}"`)
        }
      }else{
        alert('Warning : Please enter the major name');
      }
      setInputMajName('');
    }

    function deleteMajorHandler(event: React.MouseEvent<HTMLButtonElement>, id: string){
      event.preventDefault();
      var nonDeleted: Inf_MajorData[] = listMaj.filter((maj: Inf_MajorData) => maj.id !== id);
      setlistMaj(nonDeleted);
    }

    function inputMajorHandler(event: React.ChangeEvent<HTMLInputElement>) {
        setInputMajName(event.target.value);
    }

    function inputFacultyHandler(event: React.ChangeEvent<HTMLInputElement>) {
      setInputFacName(event.target.value);
    }

  return (
    <>
        { !openForm && 
            <Button className='text-light rounded-pill' 
              variant='primary' size='lg'
              onClick={() => setOpenForm(true)} 
              style={{fontWeight: '2rem'}}>
              Add more
            </Button>
        }
        <Alert show={openForm} className='p-20' variant='secondary'>
            <Alert.Heading className='mb-3'>Want to add a new faculty ?</Alert.Heading>
            <hr/>
            <Container>
              <Form>
                <Form.Group className='mb-3 d-flex justify-content-between' controlId='faculty.ControlInput'>
                  <div className='w-100'>
                    <Form.Label>Faculty name</Form.Label>
                    <Form.Text className='ms-3' style={{display: "inline", color: "red"}}>* required</Form.Text>
                    <Form.Control className='w-100'
                      onChange={inputFacultyHandler} 
                      value={inputFacName}
                      type='text' 
                      placeholder='Enter the faculty name ...'/>
                    <Form.Text className="text-muted" >
                      * Example "Faculty of engineering"
                    </Form.Text>
                  </div>

                  <div className='ms-3 w-100'>
                    <Form.Label>Major</Form.Label>
                    <div className='d-flex justify-content-start'>
                      <Form.Control className='w-75' 
                        value={inputMajName}
                        type='text' 
                        placeholder='Enter the major name ...'
                        onChange={inputMajorHandler} />
                      <Button className='ms-3' onClick={addMajorHandler}>
                        Add
                      </Button>
                    </div>
                    <Form.Text className='text-muted'>
                      * You should have at least one major in faculty
                    </Form.Text>
                  </div>
                </Form.Group>

                <Form.Group className='mb-3' controlId='major.ControlInput'>
                  <div className='mt-2 justify-content-start'>
                    <Row>
                      {
                        listMaj.map((maj: Inf_MajorData, index: number) => (
                          <Col md={3} key={index}>
                            <li className='m-2'>
                              {maj.name}
                              <Box sx={{display: 'inline', '& hr': {mx: 1.5, height: 'auto'}}}>
                                <IconButton size='small' color='error' sx={{mx: 1}} onClick={(e) => deleteMajorHandler(e, maj.id)}>
                                <DeleteOutlinedIcon fontSize="inherit"/>
                                </IconButton>
                              </Box>
                            </li>
                          </Col>
                        ))
                      }
                    </Row>
                  </div>
                </Form.Group>
              </Form>
              <hr/>
              <div className="d-flex justify-content-end">
                <Button onClick={submitHandler} className="me-3" variant='outline-primary' type='submit'>
                  Submit
                </Button>
                <Button onClick={cancleHandler} variant="outline-danger">
                  Cancle
                </Button>
              </div>
            </Container>
        </Alert>
    </>
  )
}

export default AddForm ; 
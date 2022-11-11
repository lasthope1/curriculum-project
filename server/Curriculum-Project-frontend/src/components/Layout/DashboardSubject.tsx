import {useState, useContext} from 'react';
import styled  from 'styled-components';
import '../../styles/catNode.css';

// Components
import Box, {BoxProps} from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const StyledDashboard = styled.div`
    display: flex;
    width: 40%;
    justify-content: center;
`

const ContSpace: object = {
    mt: 20,
    mr: 5,
    width: '100%',
}

const styledBox: object = {
    p: 5,
    m: 1,
    borderRadius: 3,
    boxShadow: 1,
    width: '100%',
    display: 'grid',
    gridTemplateRows: 'repeat(3, 1fr)' //still confuse
}

const BoxItem = (props: BoxProps) => {
    const { sx, ...other } = props;
    return (
      <Box
        sx={{
            p: 1,
            m: 1,
            border: '1px dashed',
            borderColor: 'grey.300',
            borderRadius: 2,
            fontSize: '0.85rem',
            ...sx,
        }}
        {...other}
      />
    );
  }


// Main function component 
function DashboardSub() {
    return (
        <StyledDashboard>
            {/* <CssBaseline/> */}
            <Container sx={ContSpace}>
                <Box sx={styledBox}>
                    <Typography variant='h5' gutterBottom component='span'>Subjects in process...</Typography>
                    <BoxItem>Functional programming</BoxItem>
                    <BoxItem>HCI</BoxItem>
                    <BoxItem>Project menagement</BoxItem>
                </Box>
            </Container>
        </StyledDashboard>
    )
}

export default DashboardSub ;
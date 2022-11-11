import React, { useReducer, useEffect } from 'react';
// import { createStyles, Theme } from '@mui/material';

import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';

//state type
interface Inf_State {
  username: string
  password:  string
  helperText: string
  isButtonDisabled: boolean
  isError: boolean
};

const initialState: Inf_State = {
  username: '',
  password: '',
  helperText: '',
  isButtonDisabled: true,
  isError: false
};

type Action = { type: 'setUsername', payload: string }
  | { type: 'setPassword', payload: string }
  | { type: 'setIsButtonDisabled', payload: boolean }
  | { type: 'loginSuccess', payload: string }
  | { type: 'loginFailed', payload: string }
  | { type: 'setIsError', payload: boolean };

const reducer = (state: Inf_State, action: Action): Inf_State => {
  switch (action.type) {
    case 'setUsername': 
      return {
        ...state,
        username: action.payload
      };
    case 'setPassword': 
      return {
        ...state,
        password: action.payload
      };
    case 'setIsButtonDisabled': 
      return {
        ...state,
        isButtonDisabled: action.payload
      };
    case 'loginSuccess': 
      return {
        ...state,
        helperText: action.payload,
        isError: false
      };
    case 'loginFailed': 
      return {
        ...state,
        helperText: action.payload,
        isError: true
      };
    case 'setIsError': 
      return {
        ...state,
        isError: action.payload
      };
  }
}


// --> Main function component <--
function LoginForm() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.username.trim() && state.password.trim()) {
     dispatch({
       type: 'setIsButtonDisabled',
       payload: false
     });
    } else {
      dispatch({
        type: 'setIsButtonDisabled',
        payload: true
      });
    }
  }, [state.username, state.password]);

  const handleLogin = () => {
    if (state.username === 'abc@email.com' && state.password === 'password') {
      dispatch({
        type: 'loginSuccess',
        payload: 'Login Successfully'
      });
    } else {
      dispatch({
        type: 'loginFailed',
        payload: 'Incorrect username or password'
      });
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // if (event.keyCode === 13 || event.which === 13) {
    //   state.isButtonDisabled || handleLogin();
    // }
  };

  const handleUsernameChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
      dispatch({
        type: 'setUsername',
        payload: event.target.value
      });
    };

  const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
      dispatch({
        type: 'setPassword',
        payload: event.target.value
      });
    }

  return (
    <form style={formStyle} noValidate autoComplete="off">
    <Card sx={{ marginTop: 0, borderRadius: 5}}>
        <CardHeader sx={cardHeaderStyle} title="Admin login form" />
        <CardContent>
          <div>
            <TextField error={state.isError} fullWidth
              id="username"
              type="email"
              label="Username"
              placeholder="Username"
              margin="normal"
              onChange={handleUsernameChange}
              onKeyPress={handleKeyPress}
            />
            <TextField error={state.isError} fullWidth
              id="password"
              type="password"
              label="Password"
              placeholder="Password"
              margin="normal"
              helperText={state.helperText}
              onChange={handlePasswordChange}
              onKeyPress={handleKeyPress}
            />
          </div>
        </CardContent>
        <CardActions sx={{padding: 3}}>
          <Button
            variant="contained"
            size="large"
            color="secondary"
            sx={{marginTop: 0, flexGrow: 1}}
            onClick={handleLogin}
            disabled={state.isButtonDisabled}>
            Login
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}

export default LoginForm;


// Styled
const formStyle: object = {
    display: 'inline-block', 
    flexWrap: 'wrap', 
    width: 400, 
    margin: 10, 
    top: '32%', 
    left: '25%', 
    position: 'absolute'
    
}

const cardHeaderStyle: object = {
    textAlign: 'center', 
    background: '#373737', 
    color: '#fff'
}
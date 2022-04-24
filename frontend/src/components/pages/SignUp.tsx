import Box from '@mui/material/Box';
import Card from '@mui/material/Card/Card';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Button from '@mui/material/Button';
import { Httper } from '../../utils/httper';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import GlobalContext from '../../global-context';
import { useContext } from 'react'

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ height: '380px' }}
      {...other}
    >
      {value === index && (
        <Box sx={{ height: '100%', p: 3, display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'space-evenly' }}>
          {children}
        </Box>
      )}
    </div>
  );
}
const httpService = new Httper('http://localhost:3001')

export const SignUp: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackabarMessage, setSnackbarMessage] = useState('');
  const [loginCredentials, setloginCredentials] = useState({ username: '', password: '' });
  const [registerCredentials, setRegisterCredentials] = useState({ username: '', password: '', name: '', email: '' });
  const navigate = useNavigate();
  const [loginShowPass, setLoginShowPass] = useState(false);
  const [registerShowPass, setRegisterShowPass] = useState(false);

  const globalContext = useContext(GlobalContext)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };



  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const handleClose = () => {
    setOpenSnackbar(false);
  }

  const getUserData = async () => httpService.getUserData();

  const registerUser = async () => {
    try {
      const response = await httpService.register(registerCredentials)
      if (response.status != 201) {
        console.log(response);
        setSnackbarMessage(response.message)
        setOpenSnackbar(true);
      } else {
        getUserData().then(response => {
          globalContext.setUser(response.payload)
          navigate('/home')
        }).catch(error => {
          console.log(error)
          setSnackbarMessage("Unexpected error")
          setOpenSnackbar(true);
        })
      }
    } catch (error) {
      console.log(error)
      setSnackbarMessage("Unexpected error")
      setOpenSnackbar(true);
    }
  }

  const loginUser = async () => {
    try {
      const response = await httpService.login(loginCredentials.username, loginCredentials.password)
      if (response.status != 200) {
        console.log(response);
        setSnackbarMessage(response.message)
        setOpenSnackbar(true);
      } else {
        getUserData().then(response => {
          globalContext.setUser(response.payload)
          navigate('/home')
        }).catch(error => {
          console.log(error)
          setSnackbarMessage("Unexpected error")
          setOpenSnackbar(true);
        })
      }
    } catch (error) {
      setSnackbarMessage("Unexpected error")
      setOpenSnackbar(true);
    }
  }


  return (
    <>
      <Card sx={{ width: '50vw', minWidth: '380px', height: '470px', margin: 'auto', marginTop: '10%' }} elevation={5}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabIndex} sx={{ display: 'flex' }} onChange={handleChange} aria-label="basic tabs example">
            <Tab sx={{ flex: 1 }} label="Login" {...a11yProps(0)} />
            <Tab sx={{ flex: 1 }} label="Register" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={tabIndex} index={0} key="tab1">
          <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
            <InputLabel htmlFor="login-username-input">Username</InputLabel>
            <OutlinedInput
              id="login-username-input"
              value={loginCredentials.username}
              onChange={(event) => setloginCredentials({ ...loginCredentials, username: event.target.value })}

              label="Username"
            />
          </FormControl>
          <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
            <InputLabel htmlFor="login-password-input">Password</InputLabel>
            <OutlinedInput
              id="login-password-input"
              type={loginShowPass ? 'text' : 'password'}
              value={loginCredentials.password}
              onChange={(event) => setloginCredentials({ ...loginCredentials, password: event.target.value })}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setLoginShowPass(!loginShowPass)}
                    edge="end"
                  >
                    {loginShowPass ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>

          <Button onClick={loginUser} sx={{ width: '50%', minWidth: '200px', p: 2, color: 'white', fontSize: '1.2rem' }} variant='contained'>Login</Button>
        </TabPanel>
        <TabPanel value={tabIndex} index={1} key="tab2">
          <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
            <InputLabel htmlFor="register-username-input">Username</InputLabel>
            <OutlinedInput
              id="register-username-input"
              value={registerCredentials.username}
              onChange={(event) => setRegisterCredentials({ ...registerCredentials, username: event.target.value })}

              label="Username"
            />
          </FormControl>
          <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
            <InputLabel htmlFor="register-password-input">Password</InputLabel>
            <OutlinedInput
              id="register-password-input"
              type={registerShowPass ? 'text' : 'password'}
              value={registerCredentials.password}
              onChange={(event) => setRegisterCredentials({ ...registerCredentials, password: event.target.value })}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setRegisterShowPass(!registerShowPass)}
                    edge="end"
                  >
                    {loginShowPass ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
          <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
            <InputLabel htmlFor="register-name-input">Name</InputLabel>
            <OutlinedInput
              id="register-name-input"
              value={registerCredentials.name}
              onChange={(event) => setRegisterCredentials({ ...registerCredentials, name: event.target.value })}

              label="Name"
            />
          </FormControl>
          <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
            <InputLabel htmlFor="register-email-input">Email</InputLabel>
            <OutlinedInput
              id="register-email-input"
              value={registerCredentials.email}
              onChange={(event) => setRegisterCredentials({ ...registerCredentials, email: event.target.value })}

              label="Email"
            />
          </FormControl>
          <Button onClick={registerUser} sx={{ width: '50%', minWidth: '200px', p: 2, color: 'white', fontSize: '1.2rem' }} variant='contained'>Register</Button>
        </TabPanel>
      </Card>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {snackabarMessage}
        </Alert>
      </Snackbar>
    </>


  );
}

export default SignUp;
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { green, orange, red } from '@mui/material/colors';
import { Box, Button, Card, CardContent, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Drawer, FormControl, IconButton, InputLabel, LinearProgress, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, OutlinedInput, Tooltip, Typography } from '@mui/material';
import Person from '@mui/icons-material/Person';
import { createContext, useContext, useEffect, useState } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import { MasterDataModel, SportData } from '../../../../backend/src/models/soccer-bet/master-data.model';
import { TicketItemModel, TicketModel } from '../../models/ticket.model';
import { Httper } from '../../utils/httper';
import { SportMatches } from '../SportMatches';
import { SportSidebarList } from '../SportSidebarList';
import { useNavigate } from 'react-router-dom';
import GlobalContext from '../../global-context';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

const styles = {
  drawer: {
    width: 1 / 6,

    '& .MuiPaper-root': {
      width: 1 / 6,

      '& .logo': {
        mx: 'auto',
        fontWeight: 'medium'
      }
    }

  }
}


const Home = () => {
  const navigate = useNavigate();
  const theme1 = createTheme({
    status: {
      danger: orange[500],
    },
    palette: {
      primary: green
    }
  });
  const theme2 = createTheme({
    status: {
      danger: orange[500],
    },
    palette: {
      primary: green
    }
  });
  const globalContext = useContext(GlobalContext);


  useEffect(()=>{
    setInterval(()=>{
      console.log("OVDE")
      globalContext.setRefreshGlobalContext(!globalContext.refreshGlobalContext)
    },20000) //fetch master data every 20 sec
  },[])
  

  const submitTicket = () =>{
    if(!ticketAmount || ticketAmount <= 0){
      alert("Enter valid ticket amount")
      return;
    }
    if(!globalContext.user || !ticketAmount) return;
    if(ticketAmount > globalContext.user.balance){
      alert('Insufficient money')
    }else{
      const httpService = new Httper('http://localhost:3001');
      httpService.submitTicket(globalContext.ticket, ticketAmount).then(response =>{
        console.log(response);
        if(response.status==200){
          alert('Successfully submited ticket');
          globalContext.setTicket({selectedBets:[]});
        }else{
          console.log(response);
          alert('Unexpected error')
        }
      }).catch(error=>{
        console.log(error);
        alert('Unexpected error')
      }).finally(()=>{
        setTicketDialogState(false)
      });
      
    }
  }

  const [ticketDialogState, setTicketDialogState] = useState(false);
  const [ticketAmount, setTicketAmount] = useState<number | undefined>(undefined);


  const popupTicketModal = () => {
    if (globalContext.user == undefined) {
      alert("To submit a ticket you have to sign up first")
      navigate('/signup')
    }
    setTicketDialogState(true)
  }

  const calucateTotalBet = (ticket: { selectedBets: TicketItemModel[] }) => {
    return ticket.selectedBets.reduce(function (accumulator, currentValue) {
      return accumulator * currentValue.selectedBet.Odds;
    }, 1);
  }

  return (
    <div>
      {globalContext.masterData ?
        <div style={{ display: 'flex' }}>
          <Drawer sx={{ ...styles.drawer }} variant='permanent' anchor='left'>
            <Typography variant="h2" className='logo'>LOGO</Typography>
            <Divider />
            <Typography sx={{ width: '100%' }} variant="h3" className='logo'>
              <Button onClick={() => navigate('/profile')} sx={{ width: '100%', height: '100%', fontSize: '2rem', '& .MuiButton-startIcon .MuiSvgIcon-root ': { fontSize: '2rem' }, '&.MuiSvgIcon-root': { fontSize: '2rem' } }} startIcon={<Person fontSize='large' />}>{globalContext.user?.username || 'Guest'}</Button>
            </Typography>

            <Divider />

            {globalContext.masterData && globalContext.selectedSport ?
              <SportSidebarList sports={globalContext.masterData?.CompetitionsData.Sports} selectedSport={globalContext.selectedSport!} setSelectedSport={globalContext.setSelectedSport} />
              : <div>UCITAVAM...</div>
            }
            <Divider />
            <Typography sx={{ padding: 1, display: 'flex' }} variant="h4">
              <div>Ticket</div>
              {globalContext.ticket.selectedBets.length > 0 &&
                <div style={{ flex: 1, fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '20px' }}>
                  <div>
                    {`${globalContext.ticket.selectedBets.length} tips`}
                  </div>
                  <Tooltip title="Remove all bets">
                    <IconButton sx={{ cursor: 'pointer' }} onClick={() => globalContext.setTicket({ ...globalContext.ticket, selectedBets: [] })}>
                      <CancelIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              }
            </Typography>
            <List sx={{ overflow: 'auto', maxHeight: '20vh' }}>
              {globalContext.ticket.selectedBets.map(matchData => {
                return (
                  <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ flex: 8 }}>
                      {matchData.HomeCompetitorName}
                      <br />
                      {matchData.AwayCompetitorName}
                    </Box>

                    <Box sx={{ flex: 3 }}>
                      {matchData.selectedBet.BetMetadata?.CodeForPrinting}
                    </Box>

                    <Box sx={{ flex: 3 }}>
                      {matchData.selectedBet.Odds}
                    </Box>

                    <Tooltip title="Remove">
                      <IconButton sx={{ cursor: 'pointer' }} onClick={() => globalContext.setTicket({ ...globalContext.ticket, selectedBets: globalContext.ticket.selectedBets.filter(betData => betData.Id != matchData.Id) })}>
                        <CancelIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItem>
                )
              })}

            </List>
            {globalContext.ticket.selectedBets.length > 0 &&
              <Button onClick={popupTicketModal} variant='contained' sx={{ margin: 1, marginTop: 'auto' }}>
                Submit - Total Odd: <div style={{ color: 'white' }}>&nbsp;{calucateTotalBet(globalContext.ticket).toFixed(2)}</div>
              </Button>}
          </Drawer>

          {globalContext.masterData && globalContext.selectedSport ?
            <SportMatches
              sport={globalContext.selectedSport}
              countries={globalContext.masterData.CompetitionsData.Countries}
              sportCompetitions={globalContext.masterData.CompetitionsData.Competitions.filter(competition => competition.SportId == globalContext.selectedSport?.Id)} />
            : <div>UCITAVAM...</div>
          }
        </div> : <LinearProgress />
      }

      {globalContext.user &&
        <Dialog open={ticketDialogState}>
          <DialogTitle>Submit a ticket</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Your balance is {(+globalContext.user.balance).toFixed(2)}$
            </DialogContentText>
            <Box>
              <Divider />

              <FormControl sx={{ mt: 1, mb: 1, width: '100%' }} variant="outlined">
                <InputLabel htmlFor="ticket-amount-input">Ticket amount</InputLabel>
                <OutlinedInput
                  id="ticket-amount-input"
                  value={ticketAmount}
                  type='number'
                  required
                  onChange={(event) => setTicketAmount(+event.target.value)}
                  placeholder="100$"
                  label="Card Number"
                />
              </FormControl>
              <Divider />

              <List sx={{ overflow: 'auto', maxHeight: '50vh' }}>
                {globalContext.ticket.selectedBets.map(matchData => {
                  return (
                    <Box>
                      <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ flex: 8 }}>
                          {matchData.HomeCompetitorName}
                          <br />
                          {matchData.AwayCompetitorName}
                        </Box>

                        <Box sx={{ flex: 3 }}>
                          {matchData.selectedBet.BetMetadata?.CodeForPrinting}
                        </Box>

                        <Box sx={{ flex: 3 }}>
                          {matchData.selectedBet.Odds}
                        </Box>

                        <Tooltip title="Remove">
                          <IconButton sx={{ cursor: 'pointer' }} onClick={() => globalContext.setTicket({ ...globalContext.ticket, selectedBets: globalContext.ticket.selectedBets.filter(betData => betData.Id != matchData.Id) })}>
                            <CancelIcon />
                          </IconButton>
                        </Tooltip>
                      </ListItem>
                      <Divider />
                    </Box>
                  )
                })}

              </List>
              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Typography>Total Odd:</Typography>
                <Typography sx={{ marginLeft: 'auto', fontSize: '1.2em', fontWeight: 'bold' }}>{calucateTotalBet(globalContext.ticket).toFixed(2)}</Typography>
              </Box>
              {ticketAmount && <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Typography>Maximum winning: </Typography>
                <Typography sx={{ marginLeft: 'auto', fontSize: '1.2em', fontWeight: 'bold' }}>{(calucateTotalBet(globalContext.ticket) * ticketAmount).toFixed(2)}$</Typography>
              </Box>}
              {/* <LinearProgress sx={{ display: transactionLinearProgress ? 'block' : 'none' }} color="success" /> */}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={submitTicket}>Place Bet</Button>
            <Button onClick={() => setTicketDialogState(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>
      }
    </div>
  );
}

export default Home;

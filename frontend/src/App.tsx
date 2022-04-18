import './App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { green, orange, red } from '@mui/material/colors';
import { Box, Button, Card, CardContent, Collapse, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Tooltip, Typography } from '@mui/material';
import { SportSidebarList } from './components/SportSidebarList';
import * as MuiIcons from '@mui/icons-material';
import { createContext, useEffect, useState } from 'react';
import { SportMatches } from './components/SportMatches';
import { Httper } from './utils/httper';
import { MasterDataModel, SportData } from '../../backend/src/models/soccer-bet/master-data.model'
import { TicketItemModel, TicketModel } from './models/ticket.model'
import CancelIcon from '@mui/icons-material/Cancel';

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

export const GlobalContext = createContext<{
  masterData: MasterDataModel | undefined,
  user: any,
  ticket: { selectedBets: TicketItemModel[] },
  setTicket: Function
}>
  ({ masterData: undefined, user: undefined, ticket: { selectedBets: [] }, setTicket: () => { } });

const App = () => {
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

  const httper = new Httper("http://localhost:3001")
  const [masterData, setMasterData] = useState<MasterDataModel>();
  const [selectedSport, setSelectedSport] = useState<SportData>();
  const [ticket, setTicket] = useState<TicketModel>({ selectedBets: [] });

  useEffect(() => {
    const getMasterData = async () => await httper.getMasterData();

    getMasterData()
      .then((masterData) => {
        //filter sports with Id <= 0, becouse these are invalid sports
        masterData.CompetitionsData.Sports = masterData.CompetitionsData.Sports.filter(sport => sport.Id > 0);

        setMasterData(masterData);
        setSelectedSport(masterData.CompetitionsData.Sports[0])
      })
      .catch((error) => {
        console.log(error)
        setMasterData(undefined)
        setSelectedSport(undefined)
      })
  }, [])

  const calucateTotalBet = (ticket: { selectedBets: TicketItemModel[] }) => {
    return ticket.selectedBets.reduce(function (accumulator, currentValue) {
      return accumulator * currentValue.selectedBet.Odds;
    }, 1);
  }

  return (

    <GlobalContext.Provider value={{ masterData: masterData, user: undefined, ticket: ticket, setTicket: setTicket }}>
      <ThemeProvider theme={theme1}>
        <div style={{ display: 'flex' }}>
          <Drawer sx={{ ...styles.drawer }} variant='permanent' anchor='left'>
            <Typography variant="h2" className='logo'>LOGO</Typography>
            <Divider />
            <Typography variant="h2" className='logo'>
              <Button startIcon={<MuiIcons.Person />}>GUEST</Button>
            </Typography>

            <Divider />

            {masterData && selectedSport ?
              <SportSidebarList sports={masterData?.CompetitionsData.Sports} selectedSport={selectedSport!} setSelectedSport={setSelectedSport} />
              : <div>UCITAVAM...</div>
            }
            <Divider />
            <Typography sx={{ padding: 1, display: 'flex' }} variant="h4">
              <div>Ticket</div>
              {ticket.selectedBets.length > 0 &&
                <div style={{ flex: 1, fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '20px' }}>
                  <div>
                    {`${ticket.selectedBets.length} tips`}
                  </div>
                  <Tooltip title="Remove all bets">
                    <IconButton sx={{ cursor: 'pointer' }} onClick={() => setTicket({ ...ticket, selectedBets: [] })}>
                      <CancelIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              }
            </Typography>
            <List sx={{ overflow: 'auto', maxHeight: '20vh' }}>
              {ticket.selectedBets.map(matchData => {
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
                      <IconButton sx={{ cursor: 'pointer' }} onClick={() => setTicket({ ...ticket, selectedBets: ticket.selectedBets.filter(betData => betData.Id != matchData.Id) })}>
                        <CancelIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItem>
                )
              })}

            </List>
            {ticket.selectedBets.length > 0 &&
              <Button variant='contained' sx={{ margin: 1, marginTop: 'auto' }}>
                Submit - Total Bet: <div style={{ color: 'white' }}>&nbsp;{calucateTotalBet(ticket).toFixed(2)}</div>
              </Button>}
          </Drawer>

          {masterData && selectedSport ?
            <SportMatches
              sport={selectedSport}
              countries={masterData.CompetitionsData.Countries}
              sportCompetitions={masterData.CompetitionsData.Competitions.filter(competition => competition.SportId == selectedSport.Id)}></SportMatches>
            : <div>UCITAVAM...</div>
          }
        </div>
      </ThemeProvider>
    </GlobalContext.Provider>
  );
}

export default App;

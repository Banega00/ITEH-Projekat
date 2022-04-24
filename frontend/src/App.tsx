import './App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { green, orange, red } from '@mui/material/colors';
import { Box, Button, Card, CardContent, Collapse, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Tooltip, Typography } from '@mui/material';
import { SportSidebarList } from './components/SportSidebarList';
import { createContext, useEffect, useState } from 'react';
import { SportMatches } from './components/SportMatches';
import { Httper } from './utils/httper';
import { MasterDataModel, SportData } from '../../backend/src/models/soccer-bet/master-data.model'
import { TicketItemModel, TicketModel } from './models/ticket.model'
import CancelIcon from '@mui/icons-material/Cancel';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/pages/Home';
import { SignUp } from './components/pages/SignUp';
import { Profile } from './components/pages/Profile';
import { TicketCarousel } from './components/TicketCarousel';
import GlobalContext from './global-context';

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

const App = () => {
  const theme1 = createTheme({
    status: {
      danger: orange[500],
    },
    palette: {
      primary: green
    },
    typography: {
      fontFamily: `"Tapestry","Arial", "Verdana", "Arial", "sans-serif"`
    },
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
  const [user, setUser] = useState<any>(undefined);

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


    const getUserData = async () => await httper.getUserData();

    getUserData().then((response) => {
      if (response.status == 200) {

        setUser(response.payload);
      } else {
        setUser(undefined)
      }
    })
  }, [])

  return (
    <ThemeProvider theme={theme1}>
      <GlobalContext.Provider value={{ masterData: masterData, selectedSport: selectedSport, user: user, ticket: ticket, setTicket: setTicket, setSelectedSport: setSelectedSport, setUser: setUser  }}>
        <BrowserRouter>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </BrowserRouter>
      </GlobalContext.Provider>
    </ThemeProvider>
  );
}

export default App;

import { ExpandLess, ExpandMore, SportsVolleyball } from "@mui/icons-material";
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import SportsHandballIcon from '@mui/icons-material/SportsHandball';
import { List, ListItemButton, ListItemIcon, ListItemText, Collapse } from "@mui/material";
import React from "react";
import { SportData } from "../../../backend/src/models/soccer-bet/master-data.model";
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import SportsHockeyIcon from '@mui/icons-material/SportsHockey';
import SportsMotorsportsIcon from '@mui/icons-material/SportsMotorsports';
import SportsRugbyIcon from '@mui/icons-material/SportsRugby';
export const SportSidebarList: React.FC<{ sports: SportData[], selectedSport: SportData, setSelectedSport:Function }> = ({ sports, selectedSport, setSelectedSport }) => {
    const [sportListOpen, setOpen] = React.useState(true);

    const handleClick = () => {
      setOpen(!sportListOpen);
    };

    const getSportIcon = (sport:string) =>{
      switch(sport){
        case 'Fudbal': return <SportsSoccerIcon/>
        case 'Košarka': return <SportsBasketballIcon/>
        case 'Tenis': return <SportsTennisIcon/>
        case 'Rukomet': return <SportsHandballIcon/>
        case 'Odbojka': return <SportsVolleyball/>
        case 'Bejzbol': return <SportsBaseballIcon/>
        case 'Hokej': return <SportsHockeyIcon/>
        case 'Formula': return <SportsMotorsportsIcon/>
        case 'Američki fudbal': return <SportsRugbyIcon/>
          
        default: return <SportsVolleyball />
      }
    }
    return (
      <List
        sx={{ width: '100%', maxWidth: 360, overflow: 'hidden', bgcolor: 'background.paper' }}
        component="nav"
        aria-labelledby="nested-list-subheader"
      // subheader={
      //   <ListSubheader component="div" id="nested-list-subheader">
      //     Nested List Items
      //   </ListSubheader>
      // }
      >
        <ListItemButton selected={sportListOpen} onClick={handleClick} sx={[(theme) => ({bgcolor: theme.palette.primary.light, '&:hover': {bgcolor: theme.palette.primary.main}, "&.Mui-selected":{backgroundColor: theme.palette.primary.main}, "&.Mui-selected:hover":{backgroundColor: theme.palette.primary.main}})]}>
          <ListItemIcon>
            <SportsVolleyball />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{color:'white'}} sx={{display:'flex', justifyContent:'space-between', alignItems:'center'}} primary={`Sports`} secondary={sports.length}/>
          {sportListOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={sportListOpen} timeout="auto" unmountOnExit>
          <List component="div" sx={{maxHeight: '35vh', overflow: 'auto',}} disablePadding>
            {sports.map(sport => {
              return (
                <ListItemButton key={sport.Name} onClick={()=>setSelectedSport(sport)} selected={sport.Name == selectedSport.Name} sx={[{pl: 4}, (theme) => ({ '&:hover': {bgcolor: theme.palette.primary.light}, "&.Mui-selected .MuiTypography-root":{fontWeight:'900', fontSize:"1.1rem"}, "&.Mui-selected":{backgroundColor: theme.palette.primary.light, }, "&.Mui-selected:hover":{backgroundColor: theme.palette.primary.light}})]}>
                  <ListItemIcon>
                    {getSportIcon(sport.Name)}
                  </ListItemIcon>
                  <ListItemText primary={sport.Name} />
                </ListItemButton>
              )
            })}
          </List>
        </Collapse>
      </List>
    );
  }
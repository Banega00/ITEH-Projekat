import useScript from "../scripts/useScript";
import "../styles/TicketCarousel.scss";
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import { Ticket } from "./Ticket";
import { TicketStatus } from '../models/ticket-status.enum'
import { TicketEntity } from "../../../backend/src/entities/ticket.entity";
import { Box, Typography, Divider, Tooltip } from "@mui/material";
import moment from "moment";

export const TicketCarousel: React.FC<{ tickets: TicketEntity[] }> = ({ tickets }) => {
    const script = useScript('http://localhost:3000/ticket-carousel.script.js')
    return (
        <main className="ticket-carousel" style={{ height: '95%', paddingBottom: '100px' }}>
            <div className="featured stacked-cards" style={{ height: '95%' }}>
                <ul className="slider" style={{ height: '95%' }}>
                    {tickets && tickets.length!=0 ?
                        tickets.map(ticket => <Ticket ticket={ticket} />) :
                        <li className="item" style={{ display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ p: 1, display: 'flex', alignItems: 'flex-end' }}>
                            </Box>
                                <Divider variant="middle" sx={{ borderBottomWidth: 3 }} />
                            <Box sx={{ p: 2, overflow: 'auto' }}>
                            </Box>
                                <Box sx={{margin: 'auto', textAlign: 'center'}}>
                                    You currently don't have any tickets<br/>
                                    <br />
                                    Go to Matches page, choose bets you like and Good Luck! 
                                </Box>
                            <Box sx={{ marginTop: 'auto', pb:2 }}>
                                <Divider variant="middle" sx={{ borderBottomWidth: 3 }} />
                                
                            </Box>
                        </li>}
                </ul>
            </div>
            {/* <ArrowCircleRightOutlinedIcon onClick={() => changeCard(1)} sx={{position:'absolute', top:'50%', right:0, zIndex: 20, cursor:'pointer'}} fontSize="large"/> */}
            {/* <ArrowCircleLeftOutlinedIcon onClick={() => changeCard(-1)} sx={{position:'absolute', left:0, top:'50%', zIndex:20, cursor:'pointer'}} fontSize="large"/> */}
        </main>

    )
}
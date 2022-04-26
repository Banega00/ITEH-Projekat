import { Divider, Tooltip, Typography } from "@mui/material"
import Box from "@mui/material/Box"
import moment from "moment"
import { TicketItemEntity } from "../../../backend/src/entities/ticket-item.entity"
import { TicketEntity } from "../../../backend/src/entities/ticket.entity"
import { TicketStatus } from "../models/ticket-status.enum"

export const Ticket: React.FC<{ ticket: TicketEntity }> = ({ ticket }) => {
    const getTicketColor = () => {
        if (ticket.status == TicketStatus.Missed) return 'error.light'
        if (ticket.status == TicketStatus.Active) return 'info.light'
        if (ticket.status == TicketStatus.Successful) return 'primary.light'
        return '';
    }


    const getTicketItemColor = (ticketItem: TicketItemEntity) => {
        if (ticketItem.status == TicketStatus.Missed) return 'error.light'
        if (ticketItem.status == TicketStatus.Active) return 'info.light'
        if (ticketItem.status == TicketStatus.Successful) return 'primary.light'
        return '';
    }
    return (
        <li className="item" style={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 1, display: 'flex', alignItems: 'flex-end', backgroundColor: getTicketColor() }}>
                <Typography sx={{ pl: 2, fontWeight: 'bold', fontSize: '1.2em' }}>{ticket.status}</Typography>
                <Typography sx={{ ml: 'auto' }}>{moment(ticket.date).format('DD.MM.yyyy | HH:mm')}</Typography>
            </Box>
            <Box sx={{ p: 2, overflow:'auto' }}>
                Bets
                <Divider sx={{ borderBottomWidth: 3, mb: 2 }} />
                {ticket.items.map(ticketItem => {
                    return (
                        <Box>
                            <Divider />
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{flex: 1}}>
                                    <Typography sx={{fontSize:'0.65em'}}>
                                        {moment(ticketItem.match.StartDate).format('DD.MM')}
                                    </Typography>
                                    <Typography sx={{fontSize:'0.65em'}}>
                                        {moment(ticketItem.match.StartDate).format('HH:mm')}
                                    </Typography>
                                </Box>
                                <Box sx={{ flex: 3 }}>
                                    <Typography sx={{ fontSize: '0.8em' }}>
                                        {ticketItem.match.HomeCompetitorName}
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.8em' }}>
                                        {ticketItem.match.AwayCompetitorName}
                                    </Typography>
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    {ticketItem.codeForPrinting}
                                </Box>
                                <Box sx={{ flex: 1, fontWeight: 600 }}>
                                    {ticketItem.match.matchResult && `${ticketItem.match.matchResult.d_k} - ${ticketItem.match.matchResult.g_k} `}
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Tooltip title={ticketItem.status}>
                                        <Box sx={{ display:'grid', placeItems:'center', width: '2.2em', height: '2.2em', borderRadius: '50%', backgroundColor: getTicketItemColor(ticketItem) }}>
                                            <Typography sx={{fontSize:'0.9em', fontWeight:'bold', color:'white'}}>{ticketItem._odd}</Typography>
                                        </Box>
                                    </Tooltip>
                                </Box>
                            </Box>
                            <Divider />
                        </Box>
                    )
                })}
            </Box>
            <Box sx={{ marginTop: 'auto' }}>
                <Divider variant="middle" sx={{ borderBottomWidth: 3 }} />
                <Box sx={{ p: 2, backgroundColor: getTicketColor() }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box>Total Odd:</Box>
                        <Box>{(+ticket._totalOdd).toFixed(2)}</Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box>Ticket stake</Box>
                        <Box>{(+ticket._ticketAmount).toFixed(2)}$</Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box>Maximum winning</Box>
                        <Box sx={{ fontWeight: 'bold' }}>{((+ticket._ticketAmount) * (+ticket._totalOdd)).toFixed(2)}$</Box>
                    </Box>
                    <Box></Box>
                </Box>
            </Box>
        </li>
    )
} 
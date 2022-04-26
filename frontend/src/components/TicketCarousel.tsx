import useScript from "../scripts/useScript";
import "../styles/TicketCarousel.scss";
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import { Ticket } from "./Ticket";
import { TicketStatus } from '../models/ticket-status.enum'
import { TicketEntity } from "../../../backend/src/entities/ticket.entity";

export const TicketCarousel: React.FC<{tickets:TicketEntity[]}> = ({tickets}) => {
    const script = useScript('http://localhost:3000/ticket-carousel.script.js')
    return (
        <main className="ticket-carousel" style={{height:'95%', paddingBottom:'100px'}}>
            <div className="featured stacked-cards" style={{height:'95%'}}>
                <ul className="slider" style={{height:'95%'}}>
                    {tickets.map(ticket => <Ticket ticket={ticket}/>)}
                </ul>
            </div>
            {/* <ArrowCircleRightOutlinedIcon onClick={() => changeCard(1)} sx={{position:'absolute', top:'50%', right:0, zIndex: 20, cursor:'pointer'}} fontSize="large"/> */}
            {/* <ArrowCircleLeftOutlinedIcon onClick={() => changeCard(-1)} sx={{position:'absolute', left:0, top:'50%', zIndex:20, cursor:'pointer'}} fontSize="large"/> */}
        </main>

    )
}
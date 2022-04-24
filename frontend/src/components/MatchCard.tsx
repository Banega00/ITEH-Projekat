import { useContext, useEffect, useState } from 'react';
import { MatchModel } from '../../../backend/src/models/soccer-bet/match.model'
import { BettingOddsBtn } from './BettingOddsBtn';
import moment from 'moment'
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import GlobalContext from '../global-context';

export const MatchCard: React.FC<{ match: MatchModel }> = ({ match }) => {
    const globalContext = useContext(GlobalContext);

    const [selectedBet, setSelectedBet] = useState<MatchModel['FavouriteBets'][0] | undefined>(undefined)

    const favouriteBetsCodes = {
        finalOutcome: ['1', 'X', '2'],
        goalsTotal: ['0-2', '3+']
    }

    match.FavouriteBets.forEach(betData => {
        const betMetadata = globalContext?.masterData?.BetGameOutcomesData.BetGameOutcomes.find(betMetadata => betMetadata.Id == betData.BetGameOutcomeId)
        if (!betMetadata) return;
        betData.BetMetadata = betMetadata;
    })

    useEffect(()=>{
        const betIsSelected = globalContext.ticket.selectedBets.some(ticketItem => ticketItem.Id == match.Id)
        if(!betIsSelected) setSelectedBet(undefined)
    },[globalContext.ticket.selectedBets])

    const selectBet = (bet: MatchModel['FavouriteBets'][0]) => {
        setSelectedBet(bet);

        let newSelectedBets = globalContext.ticket.selectedBets.filter(ticketBet => ticketBet.Id != match.Id )
        newSelectedBets.push({...match, selectedBet: bet});
        globalContext.setTicket({...globalContext, selectedBets: newSelectedBets})
    }
    return (
        <Grid item xs={12}>
            <Card elevation={6} sx={{ minWidth: 275, m: 3, mb: 0 }}>
                <CardContent sx={{ display: 'flex', padding: 0, '&.MuiCardContent-root': { padding: 0 } }}>
                    <Box sx={{ width: 0.3, backgroundColor: 'primary.dark', padding: 2 }}>
                        <Typography sx={{ fontSize: 14, color: 'white', textAlign: 'center' }} color="text.secondary" gutterBottom>
                            {moment(match.StartDate).format('DD.MM | HH:mm')}
                        </Typography>

                        <Typography sx={{ fontSize: 24 }} color="white" gutterBottom>
                            {match.HomeCompetitorName}
                        </Typography>

                        <Typography sx={{ fontSize: 14, pl: 2 }} color="white" gutterBottom>
                            vs
                        </Typography>

                        <Typography sx={{ fontSize: 24 }} color="white" gutterBottom>
                            {match.AwayCompetitorName}
                        </Typography>
                    </Box>

                    {/* BETTING ODS */}
                    <Box sx={{ width: '70%', display: 'flex', '& > *': { flex: '1' } }}>
                        {/* konacan ishod */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant='h6' sx={{ fontSize: 16, textAlign: 'center' }} color="primary" gutterBottom>
                                Final outcome
                            </Typography>

                            <Box sx={{display: 'flex', flexDirection:'column'}}>
                                {favouriteBetsCodes.finalOutcome.map((betCode: string) => {
                                    const betData = match.FavouriteBets.find(betData => betData.BetMetadata?.Name == betCode)
                                    if (!betData) return <></>
                                    return <BettingOddsBtn betData={betData} selected={betData.Id == selectedBet?.Id} selectBet={selectBet}/>
                                })}

                            </Box>


                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant='h6' sx={{ fontSize: 16, textAlign: 'center' }} color="primary" gutterBottom>
                                Goals total
                            </Typography>

                            <Box sx={{display: 'flex', flexDirection:'column'}}>
                                {favouriteBetsCodes.goalsTotal.map((betCode: string) => {
                                    const betData = match.FavouriteBets.find(betData => betData.BetMetadata?.Name == betCode)
                                    if (!betData) return <></>
                                    return <BettingOddsBtn betData={betData} selected={betData.Id == selectedBet?.Id} selectBet={selectBet}/>
                                })}

                            </Box>


                        </Box>


                    </Box>




                </CardContent>
            </Card>
        </Grid>
    )
}
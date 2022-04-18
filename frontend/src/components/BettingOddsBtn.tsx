import { Box } from "@mui/material"
import { useState } from "react";
import { MatchModel } from "../../../backend/src/models/soccer-bet/match.model";

export const BettingOddsBtn: React.FC<{betData: MatchModel['FavouriteBets'][0], selected: boolean, selectBet:Function}> 
= ({betData, selected, selectBet}) => {

    return (
        <Box
            sx={{
                cursor:'pointer',
                display: 'flex',
                flex:1,
                alignItems: 'center',
                border: (theme) => selected ? '5px solid black' : `2px solid ${theme.palette.divider}`,
                boxShadow: (theme) => selected ? 3 : 0,
                borderRadius: 1,
                marginBottom: 1,
                bgcolor: 'background.paper',
                color: 'text.secondary',
                '& svg': {
                    m: 1.5,
                },
                '& hr': {
                    mx: 0.5,
                },
                '&:hover': {
                    transform: 'scale(1.05)'
                }
            }}
            onClick={() => selectBet(betData)}
            
        >
            <Box  sx={{flex:1, whiteSpace: 'nowrap', textAlign:'center', bgcolor: 'black', padding: 1, color: 'white' }}>{betData.BetMetadata?.CodeForPrinting}</Box>
            <Box sx={{flex:1, whiteSpace: 'nowrap', extAlign:'center', bgcolor: 'primary.dark', padding: 1, color: 'white' }}>{betData.Odds}</Box>
        </Box>
    )
}
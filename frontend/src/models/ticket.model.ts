import { MatchModel } from '../../../backend/src/models/soccer-bet/match.model';
export interface TicketItemModel extends MatchModel{
    selectedBet: MatchModel['FavouriteBets'][0]
}

export interface TicketModel{
    selectedBets: TicketItemModel[]
}
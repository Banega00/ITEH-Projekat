import { BetGameOutcomesData } from "./master-data.model"

export interface MatchModel {
    Id: number,
    HomeCompetitorName: string,
    AwayCompetitorName: string,
    Code: number,//ovo je code za rezultate - zove se sifra
    ExternalId: number,
    StreamId: null,
    StartDate: string,
    Status: number,
    CompetitionId: number,
    SportId: number,
    FavouriteBets:
    {
        Id: number,
        Odds: number,
        IsEnabled: boolean,
        HandicapOrTotalParam: null,
        ScoreParam: null,
        PeriodParam: null,
        AdditionalParam: null,
        BetGameOutcomeId: number,
        BetMetadata?: BetGameOutcomesData['BetGameOutcomes'][0]
    }[],
    AllBets: null
}
export interface MasterDataModel {
  CompetitionsData: CompetitionsData;
  BetGameOutcomesData: BetGameOutcomesData;
  PeriodsData: PeriodsData;
}

export interface CompetitionsData {
  Sports: SportData[];
  Countries: CountryData[];
  Competitions: CompetitionData[];
}

export interface BetGameOutcomesData {
  BetGameGroups: {
    Id: number;
    Name: string;
    OrderId: number;
  };
  BetGames: {
    Id: number;
    Name: string;
    OrderId: number;
    BetParamName: string;
    BetParamShortName: string;
    HasHandicapOrTotalBetParam: boolean;
    HasScoreBetParam: false;
    HasPeriodBetParam: false;
    HasAdditionalBetParam: false;
    BetGameGroupId: number;
  };
  BetGameOutcomes: {
    Id: number;
    Name: string;
    Description: string;
    OrderId: number;
    CodeForPrinting: string;
    BetGameId: number;
  };
}

export interface PeriodsData {
  Id: number;
  Name: string;
  ShortName: string;
  OrderId: number;
}
/////////////////////////////////////////////////

export interface SportData {
  Id: number;
  Name: string;
  OrderId: number;
}

export interface CountryData {
  Id: number;
  Name: string;
  ShortName: string;
}

export interface CompetitionData {
  Id: number;
  Name: string;
  ShortName: string;
  IsFeatured: boolean;
  CountryId: number;
  SportId: number;
}

////////////////////////////////////////////////////////////////////

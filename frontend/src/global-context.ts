import { createContext } from "react";
import { MasterDataModel, SportData } from "../../backend/src/models/soccer-bet/master-data.model";
import { TicketItemModel } from "./models/ticket.model";

const GlobalContext = createContext<{
    masterData: MasterDataModel | undefined,
    selectedSport: SportData | undefined,
    user: any,
    ticket: { selectedBets: TicketItemModel[] },
    setTicket: Function
    setSelectedSport: Function
    setUser: Function
  }>
    ({ masterData: undefined, selectedSport: undefined, user: undefined, ticket: { selectedBets: [] }, setTicket: () => { }, setSelectedSport: () => { }, setUser: () => { }});

export default GlobalContext;
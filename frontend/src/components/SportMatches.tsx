import { useContext, useEffect, useState } from "react"
import { MatchModel } from "../../../backend/src/models/soccer-bet/match.model"
import { CompetitionData, CountryData, SportData } from "../../../backend/src/models/soccer-bet/master-data.model"
import { Httper } from "../utils/httper"
import { MatchCard } from "./MatchCard"
import { SelectChangeEvent } from "@mui/material/Select/SelectInput"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { getCountryFlag } from "../utils/get-country-flag"
const httper = new Httper("http://localhost:3001")

export const SportMatches: React.FC<{ sport: SportData, sportCompetitions: CompetitionData[], countries: CountryData[] }> =
    ({ sport, sportCompetitions, countries }) => {
        const [selectedCountry, setSelectedCountry] = useState<CountryData>()
        const [selectedCompetition, setSelectedCompetition] = useState<CompetitionData>()
        const [filteredCompetitions, setFilteredCompetitions] = useState<CompetitionData[]>(() => [])//only country-specific competitions
        const [matches, setMatches] = useState<MatchModel[]>();
        const changeCountry = (event: SelectChangeEvent) => {
            const selectedCountry = countries.find(country => country.Id == +event.target.value)
            if (!selectedCountry) return;


            setFilteredCompetitions(sportCompetitions.filter(competition => competition.CountryId == selectedCountry.Id && competition.Matches && competition.Matches > 0))

            setSelectedCountry(selectedCountry);
        };

        useEffect(() => {
            return () => {//referesh competitions every time sport changes and competitions that has matches
                if (!selectedCountry) return;
                setSelectedCompetition(undefined)
                setFilteredCompetitions(sportCompetitions.filter(competition => competition.CountryId == selectedCountry.Id && competition.Matches && competition.Matches > 0))
            };
        }, [sport]);


        useEffect(() => {
            if (!selectedCompetition) return;
            const getMatchesForCompetition = async (selectedCompetition: CompetitionData) => httper.getMatchesForCompetition(selectedCompetition)

            getMatchesForCompetition(selectedCompetition)
                .then(matches => setMatches(matches))
                .catch(console.log)
        }, [selectedCompetition])

        const changeCompetition = (event: SelectChangeEvent) => {
            const competition = filteredCompetitions.find(competiton => competiton.Id == +event.target.value)
            if (!competition) return;

            setSelectedCompetition(competition);
        };

        return (
            <div style={{ flex: 1 }}>
                <Card elevation={12}>
                    <CardContent sx={{ display: 'flex', alignItems: 'flex-end' }}>

                        <FormControl variant="filled" sx={{ m: 1, minWidth: 140 }}>
                            <InputLabel id="demo-simple-select-standard-label">Country</InputLabel>
                            <Select
                                // labelId="demo-simple-select-standard-label"
                                // id="demo-simple-select-standard"
                                // value={age}
                                // onChange={handleChange}
                                label="Country"
                                onChange={changeCountry}
                            >
                                {countries.map(country => {
                                    return (
                                        <MenuItem key={country.Id} value={country.Id}>{country.Name}</MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>

                        <FormControl variant="filled" sx={{ m: 1, minWidth: 190 }}>
                            <InputLabel id="demo-simple-select-standard-label">Competition</InputLabel>
                            <Select
                                // labelId="demo-simple-select-standard-label"
                                // id="demo-simple-select-standard"
                                // value={age}
                                // onChange={handleChange}
                                sx={{ '& .MuiSelect-select': { display: 'flex' } }}
                                label="Competition"
                                onChange={changeCompetition}
                            >
                                {filteredCompetitions.map(competition => {
                                    return (
                                        <MenuItem key={competition.Id} value={competition.Id}>
                                            <Typography variant="inherit">
                                                {competition.Name}
                                            </Typography>

                                            {competition.Matches &&
                                                <Typography sx={{ ml: 'auto', opacity: '0.5' }} variant="inherit">
                                                    {competition.Matches}
                                                </Typography>}
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>

                        {selectedCompetition && 
                        <Typography fontSize={24} sx={{ p: 1, ml: 3, display: 'flex', alignItems:'flex-end' }}>
                            {getCountryFlag(selectedCountry?.ShortName)}
                            <EmojiEventsIcon fontSize='large' />
                            <Typography fontSize={24} sx={{ }}>
                                {selectedCompetition.Name}
                            </Typography>
                        </Typography>}
                    </CardContent>
                </Card>

                {/* default grid width is 12 */}
                <Grid container spacing={2} sx={{ padding: '10px' }}>
                    {matches && matches.map(match => <MatchCard key={match.Id} match={match} />)}
                </Grid>

            </div>
        )
    }
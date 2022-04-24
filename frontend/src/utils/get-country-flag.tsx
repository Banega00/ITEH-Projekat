export const getCountryFlag = (country:string | undefined) =>{
    if(!country) return <></>

    const lowerShortName = country.toLowerCase();

    return <img style={{margin: 'auto 15px', height:'40px'}} src={`http://localhost:3000/flags/${lowerShortName}-flag.png`}/>
}
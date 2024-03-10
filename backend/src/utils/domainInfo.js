const whoiser = require('whoiser')

const getDomainInfo = async (url) => {
    if(!url.startsWith('http')){
        url = `https://${url}`
    }
    const domain = new URL(url).hostname;
    const domainWhois = await whoiser(domain)
    const firstInfo = Object.values(domainWhois)[0];
    const date = new Date(firstInfo["Expiry Date"]);
    console.log(date.getTime())
    return date.getTime();
}

module.exports = getDomainInfo;
const { connectToDatabase } = require('./database');
const natural = require('natural');

const tokenizer = new natural.WordTokenizer();
const nounInflector = new natural.NounInflector();
const stringDistance = natural.JaroWinklerDistance;


const customStopWords = [
    'and', 'is', 'a', 'have', 'my', 'has', 'name', 'of', 'with', 'there', 'report', 'reported', 
    'from', 'lost', 'check', 'for', 'status', 'whether', 'ltp', 'number', 'no', 'ltpno', 
    'weather', 'can', 'you', 'i', 'made'
];


function extractFullName(message) {
    const fullNamePattern = /(?:my name is|i am|this is|i'm|name|from)\s+([\w\s]+?)(?=\s*(ltp|number|with|,|is|is there a report|$))/i;
    const match = message.match(fullNamePattern);
    if (match) {
        let fullName = match[1].trim();

        fullName = fullName.replace(new RegExp(`\\b(${customStopWords.join('|')})\\b`, 'gi'), '').trim();
        return fullName;
    }
    return null;
}


function extractLtpNumber(message) {
    const ltpPattern = /\b\d{5}\b/i; 
    const match = message.match(ltpPattern);
    return match ? match[0] : null;
}


async function checkLostReport(fullName, ltpNumber) {
    const db = await connectToDatabase();
    const collection = db.collection('reportlost');

  
    fullName = fullName.trim();
    ltpNumber = ltpNumber.trim();

    console.log('Querying reportlost collection with:', { fullName, ltpNumber });

    const reportRecord = await collection.findOne({
        fullName: { $regex: `^${fullName}$`, $options: 'i' },
        ltpNumber: ltpNumber
    });

    console.log('Report record found:', reportRecord);

    if (reportRecord) {
        return `Yes, there is a report of yours in the record. You will soon be notified when it is addressed. Stay tuned!`;
    } else {
        console.log('No matching record found.');
        return "Sorry, no records of your report. Retry by entering the correct Name and LTP, if the problem persists, report again.";
    }
}


function isLostReportQueryVariations(message) {
   
    console.log('isLostReportQueryVariations input message:', message);

   
    const cleanedMessage = message.replace(/\band\b|\bis\b|\ba\b|\bhave\b|\bmy\b|\bhas\b|\bname\b|\bof\b|\bwith\b|\bthere\b|\breport\b|\breported\b|\bfrom\b|\blost\b|\bcheck\b|\bcheck\b|\bfor\b|\bstatus\b|\bwhether\b|\bltp\b|\bnumber\b|\bno\b|\bltpno\b|\bweather\b|\bcan\b|\byou\b|\bi\b|\bmade\b/gi, '');

    console.log('Cleaned message:', cleanedMessage);

    const lostReportPatterns = [
        /my name is\s+([a-z\s]+?)\s*ltp\s*(?:is\s*)?(\d{5})[\W\s]*(?:what is|tell|give) my report status/i,
        /my name is\s+([a-z\s]+?)\s*ltp\s*(?:is\s*)?(\d{5})[\W\s]*(?:what is|tell) my report status/i,
        /my name is\s+([a-z\s]+?)[\W\s]*(?:what is|tell) my report status/i,
        /has\s+([a-z\s]+?)\s*ltp\s*(?:is\s*)?(\d{5})[\W\s]*reported/i,
        /name\s+([a-z\s]+?)\s*ltp\s*(?:is\s*)?(\d{5})[\W\s]*/i,
        /i am\s+([a-z\s]+?)\s*ltp\s*(?:is\s*)?(\d{5})[\W\s]*have i reported/i,
        /([a-z\s]+?)\s*ltp\s*(?:is\s*)?(\d{5})[\W\s]*/i,
        /name\s+([a-z\s]+?)\s*ltp\s*(?:is\s*)?(\d{5})/i,
        /i am\s+([a-z\s]+?)\s*ltp\s*(?:is\s*)?(\d{5})[\W\s]*have i reported/i,
        /i am\s+([a-z\s]+?),?\s*have i reported any (?:lost\s+)?luggage\s*ltp\s*(?:is\s*)?(\d{5})/i,
        /i am\s+([a-z\s]+?),?\s*did i file a report\s*(?:under\s*)?ltp\s*(?:is\s*)?(\d{5})/i,
        /i'm\s+([a-z\s]+?),?\s*did i submit a report for (?:lost\s+)?luggage\s*(?:under\s*)?ltp\s*(?:is\s*)?(\d{5})/i,
        /has\s+([a-z\s]+?)\s*ltp\s*(?:is\s*)?(\d{5})[\W\s]*reported/i,
        /have\s+([a-z\s]+?)\s*ltp\s*(?:is\s*)?(\d{5})[\W\s]*reported/i,
        /is there (?:any\s*)?report\s*([a-z\s]+?)\s*ltp\s*(?:is\s*)?(\d{5})/i,
        /is there a record of (?:lost\s+)?luggage\s*([a-z\s]+?)\s*ltp\s*(?:is\s*)?(\d{5})/i,
        /was a report filed\s*([a-z\s]+?)\s*ltp\s*(?:is\s*)?(\d{5})/i,
        /did\s+([a-z\s]+?)\s*file a report\s*ltp\s*(?:is\s*)?(\d{5})/i,
        /can you find a report for (?:lost\s+)?luggage\s*([a-z\s]+?)\s*ltp\s*(?:is\s*)?(\d{5})/i,
        /is there a (?:lost\s+)?luggage report\s*with\s*([a-z\s]+?)\s*ltp\s*(?:is\s*)?(\d{5})/i,
        /confirm if a report was made\s*([a-z\s]+?)\s*ltp\s*(?:is\s*)?(\d{5})/i,
        /find a (?:lost\s+)?luggage report\s*([a-z\s]+?)\s*ltp\s*(?:is\s*)?(\d{5})/i,
        /does\s+([a-z\s]+?)\s*have a (?:lost\s+)?luggage report\s*ltp\s*(?:is\s*)?(\d{5})/i,
        /i am\s+([a-z\s]+?),\s*have i reported any (?:lost\s+)?luggage\s*ltp\s*(?:is\s*)?(\d{5})/i,
        /my name is\s+([a-z\s]+?),\s*did i submit a report for (?:lost\s+)?luggage\s*ltp\s*(?:is\s*)?(\d{5})/i,
        /i'm\s+([a-z\s]+?),\s*any (?:lost\s+)?luggage report\s*ltp\s*(?:is\s*)?(\d{5})/i,
        /check for report\s*([a-z\s]+?)\s*ltp\s*(?:is\s*)?(\d{5})/i,
        /lost luggage report,\s*ltp\s*(?:is\s*)?(\d{5}),\s*name\s+([a-z\s]+)/i,
        /does\s+([a-z\s]+?)\s*have a report\s*ltp\s*(?:is\s*)?(\d{5})/i,
        /([a-z\s]+?)\s*ltp\s*(?:is\s*)?(\d{5})[\W\s]*/i,
        /my name is\s+([a-z\s]+?)[\W\s]*have i reported/i,
        /i am\s+([a-z\s]+?)[\W\s]*have i reported/i,
        /is there a report\s*([a-z\s]+?)[\W\s]*/i,
        /is there a report\s*([a-z\s]+?)[\W\s]*/i,
        /i need to know if there is a report for\s*([a-z\s]+?)\s*ltp\s*(?:is\s*)?(\d{5})/i,
        /can you check for a luggage report\s*([a-z\s]+?)\s*ltp\s*(?:is\s*)?(\d{5})/i,
        /has\s*([a-z\s]+?)\s*filed a report\s*ltp\s*(?:is\s*)?(\d{5})/i,
        /did\s*([a-z\s]+?)\s*submit a report\s*ltp\s*(?:is\s*)?(\d{5})/i,
        /check if there's a luggage report\s*([a-z\s]+?)\s*ltp\s*(?:is\s*)?(\d{5})/i,
        /check report status for\s*name\s*([a-z\s]+?)\s*and\s*ltp\s*(?:is\s*)?(\d{5})/i,
        /check report status for\s*([a-z\s]+?)\s*and\s*(?:ltp\s*)?(\d{5})/i,
        /([a-z\s]+?)\s*(\d{5})/i,
        /check report status for\s*name\s*([a-z\s]+?)\s*(?:and|with)\s*ltp\s*(?:is\s*)?(\d{5})/i,
        /can you check whether\s*([a-z\s]+?)\s*with\s*ltp\s*(?:is\s*)?(\d{5})\s*reported/i,
        /can you check if\s*name\s*([a-z\s]+?)\s*with\s*ltp\s*(?:is\s*)?(\d{5})\s*reported/i,
        /can you check whether\s*([a-z\s]+?)\s*and\s*ltp\s*(?:is\s*)?(\d{5})\s*reported/i,
        /can you check whether\s*([a-z\s]+?)\s*having\s*ltp\s*(?:is\s*)?(\d{5})\s*reported/i,
        /i am\s*([a-z\s]+?)\s*and have\s*ltp\s*(?:is\s*)?(\d{5})\s*i want to check my report status/i,
        /i am\s*([a-z\s]+?)\s*with\s*ltp\s*(?:is\s*)?(\d{5})\s*i want to check my report status/i,
        /i am\s*([a-z\s]+?)\s*having\s*ltp\s*(?:is\s*)?(\d{5})\s*i want to check my report status/i,
    ];

    
    for (let pattern of lostReportPatterns) {
        const match = cleanedMessage.replace(/[^\w\s]/g, '').match(pattern);
        if (match) {
            console.log('Pattern matched:', pattern);
            console.log('Matched groups:', match);
            const [, fullName, ltpNumber] = match;
            console.log('Extracted fullName:', fullName);
            console.log('Extracted ltpNumber:', ltpNumber);
            return { fullName, ltpNumber };
        }
    }

    console.log('No lost report query patterns matched');
    return null;
}

module.exports = {
    extractFullName,
    extractLtpNumber,
    checkLostReport,
    isLostReportQueryVariations
};

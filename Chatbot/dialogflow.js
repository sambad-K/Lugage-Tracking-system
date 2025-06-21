const dialogflow = require('@google-cloud/dialogflow');
const path = require('path');


process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, 'path to api key json file');  

const projectId = 'projct id';  
const languageCode = 'en';

const sessionClient = new dialogflow.SessionsClient();

async function detectIntent(message, sessionId) {
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);  
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: message,
                languageCode: languageCode,
            },
        },
    };


    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    return result; 
}

module.exports = detectIntent;

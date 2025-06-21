const dialogflow = require('@google-cloud/dialogflow');
const path = require('path');


process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, 'sam-fdbo-c6616cf8001f.json');  

const projectId = 'sam-fdbo';  
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

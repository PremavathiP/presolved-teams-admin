const CallRecords = require('./api/CallRecords');
const gh = require("./graphHelper");
const appSettings = require("./appSettings");
const graphHelper = new gh();

const downloadPSTNLogs = async () => {
    
    let settings = await appSettings.getSettings();
    // get date for last week
    let tempDate = new Date();
    tempDate.setDate(tempDate.getDate() - 2);
    console.log('From DATE ---->', tempDate);
    let fromDate = new Date(tempDate).toISOString();
    let toDate = new Date().toISOString();
    
    const callRecordsApi = new CallRecords();

    let callRecords = await graphHelper.getPSTNCallRecords(
        settings,
        fromDate,
        toDate
    );
   // console.log(callRecords);

    // save call records to database
    //let callRecordsApi = new CallRecords();
    for (let i = 0; i < callRecords.value.length; i++) {
        let callRecord = callRecords.value[i];

        let callRecordInput = {
           
            tenantId: "P3Fusion",
            callRecordId: callRecord.id, //  id: 'dfe8b123-45b0-4239-98c6-3e8973a4511e',
            callType: callRecord.callType, //'ucap_in'   // means bot call        
            callStartTime: callRecord.startDateTime, //startDateTime: '2023-04-04T04:35:37.4464007Z',
            callEndTime: callRecord.endDateTime, //endDateTime: '2023-04-04T04:35:53.4464007Z',
            callDuration: callRecord.duration,//16
            charge: callRecord.charge,//0
            callerNumber: callRecord.callerNumber,//'+18009360632
            calleeNumber: callRecord.calleeNumber,//+16028122928'
            //createdAt: callRecordCreatedAt,
            //updatedAt: callRecordUpdatedAt
           
        };
        console.log(`Saving call record ${callRecordInput.callRecordId}`);
        let response = await callRecordsApi.writeCallRecord(callRecordInput);
        console.log(response);
    }

       // let callRecordExists = await callRecordsApi.getCallRecord(callRecordId);
       // if (callRecordExists) {
       //     console.log(`Call record ${callRecordId} already exists`);
       // } else {
        //    console.log(`Call record ${callRecordId} does not exist`);
     


    return callRecords;
    };
    
    module.exports = {downloadPSTNLogs};
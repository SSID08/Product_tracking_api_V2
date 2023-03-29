'use strict';



//const router= require('./router_2');

/*
const channelName = 'mychannel';
const chaincodeName = 'basic';
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
*/
const process = require('process');
const express= require('express');//import the required package
const fabricNetwork = require('./fabricNetwork')
const router = express.Router();
const app=express();//create an object of from the express module
const port=2000;//set the port to host the server

const orgUserId = process.argv[2];
const TransactionModel = require('./models/transaction');
require('./models/db');

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

function toDate(timestamp) {
    const milliseconds = (timestamp.seconds.low + ((timestamp.nanos / 1000000) / 1000)) * 1000;
    return new Date(milliseconds);
  }

/* function getdate(){//maybe not required

    const date = new Date();
    let day = date.getDate();
    let month= date.getMonth() + 1;
    let year = date.getFullYear();
    let currentdate=`${day}-${month}-${year}`;
    return(currentdate);
} */
const GetAssets= async function(req,res){
    console.log('Getting assets on the blockchain');
    const contract = await fabricNetwork.connectNetwork(orgUserId);
    let result = await contract.evaluateTransaction('GetAllAssets');
    result=prettyJSONString(result.toString());
    res.send(result);
}

const InitialiseLedger = async function(req,res){
    console.log('Initialising ledger');
    const contract = await fabricNetwork.connectNetwork(orgUserId);
    let result = await contract.submitTransaction('InitLedger');
    res.send(result);}

const CreateAsset = async function(req,res){
    var type=req.query.type;
    var location = req.query.location;
    var weight = req.query.weight;
    var temp =req.query.temp;
    var date =req.query.date
    //console.log('Creating a new asset');
    const contract = await fabricNetwork.connectNetwork(orgUserId);
    const date_for_id=new Date();
    let result = JSON.parse((await contract.submitTransaction('CreateAsset',`${type}`,`${location}`,`${weight}`,`${temp}`,`${date}`,date_for_id)));
    //const new_model = await TransactionModel.create({_id:result.transaction_id.toString(),transaction_details:{type: "CreateAsset"},user_id:result.user_id.toString(),org_id: result.org_id});
    console.log('*** Result: committed')
    const new_model= await TransactionModel.create(result);
    res.send(JSON.stringify(new_model));
}

const ReadAsset = async function(req,res){
    var id = req.query.id;
    const contract = await fabricNetwork.connectNetwork(orgUserId);
    let result = await contract.evaluateTransaction('ReadAsset',id);
    res.send(`*** Result: ${prettyJSONString(result.toString())}`);
    
}

const RequestTransfer= async function(req,res){
    var id =req.query.id;
    var newOwnerOrg=req.query.newOwnerOrg;
    const contract = await fabricNetwork.connectNetwork(orgUserId);
    let result = JSON.parse((await contract.submitTransaction('RequestTransfer',`${newOwnerOrg}`,`${id}`)));
    const new_model = await TransactionModel.create(result);
    console.log('*** Result: committed')
    res.send(new_model.toString());}

const ConfirmTransfer=async function(req,res){
    var id =req.query.id;
    var location=req.query.location;
    var temperature=req.query.temp; 
    var weight = req.query.weight;
    const contract = await fabricNetwork.connectNetwork(orgUserId);
    let result = JSON.parse(await contract.submitTransaction('TransferComplete',`${id}`,orgUserId,`${location}`,`${temperature}`,`${weight}`));
    const new_model = await TransactionModel.create(result);

    res.send(new_model.toString());
}

const UpdateLocation=async function(req,res){
    var id = req.query.id;
    var location = req.query.location;
    const contract = await fabricNetwork.connectNetwork(orgUserId);
    let result = JSON.parse(await contract.submitTransaction('UpdateLocation',`${id}`,`${location}`));
    const new_model = await TransactionModel.create(result);
    res.send(new_model.toString());
}

const UpdateTemperature= async function(req,res){
    var id= req.query.id;
    var temperature=req.query.temp;
    const contract = await fabricNetwork.connectNetwork(orgUserId);
    let result = JSON.parse(await contract.submitTransaction('UpdateTemperature',`${id}`,`${temperature}`));
    const new_model = await TransactionModel.create(result);
    res.send(new_model.toString());
}

const UpdateWeight = async function(req,res){
    var id= req.query.id;
    var weight= req.query.weight;
    const contract = await fabricNetwork.connectNetwork(orgUserId);
    let result = JSON.parse(await contract.submitTransaction('UpdateWeight',`${id}`,`${weight}`));
    const new_model = await TransactionModel.create(result);
    res.send(new_model.toString());

}

const UpdateUseBy=async function(req,res){
    var id= req.query.id;
    var useBy=req.query.useBy;
    const contract = await fabricNetwork.connectNetwork(orgUserId);
    let result = JSON.parse(await contract.submitTransaction('UpdateUseBy',`${id}`,`${useBy}`));
    const new_model = await TransactionModel.create(result);
    res.send(new_model.toString());
}

const GetProductHistory=async function(req,res){
    var id = req.query.id;
    const contract = await fabricNetwork.connectNetwork(orgUserId);
    let result = await contract.submitTransaction('GetProductHistory',`${id}`);
    res.send(`*** Result: ${prettyJSONString(result.toString())}`);
}

const DeleteAsset = async function(req,res){
    var id=req.query.id;
    const contract = await fabricNetwork.connectNetwork(orgUserId);
    let result = JSON.parse(await contract.submitTransaction('DeleteAsset',`${id}`));
    const new_model = await TransactionModel.create(result);
    res.send(new_model.toString());

}

const LinkExperiment = async function(req,res){
    var product_id=req.query.product_id;
    var experiment_id=req.query.exp_id;
    const contract = await fabricNetwork.connectNetwork(orgUserId);
    let result = JSON.parse(await contract.submitTransaction('LinkExperiment',`${product_id}`,`${experiment_id}`));
    const new_model = await TransactionModel.create(result);
    res.send(new_model.toString());
}

app.listen(port,function(){console.log(`Application deployed on port ${port}`);});//deploy server
app.use('/api',router);//mount router on the server 


router.get('/',function(req,res){
    res.send('Hello world');
});
router.get('/init',InitialiseLedger);
router.get('/list_assets',GetAssets);
router.get('/createproduct',CreateAsset);
router.get('/queryProduct',ReadAsset);
router.get('/transferproduct',RequestTransfer);
router.get('/confirmtransfer',ConfirmTransfer);
router.get('/updatelocation',UpdateLocation);
router.get('/updatetemperature',UpdateTemperature);
router.get('/updateUseBy',UpdateUseBy);
router.get('/updateWeight',UpdateWeight);
router.get('/getProductHistory',GetProductHistory);
router.get('/linkExperiment',LinkExperiment);
router.get('/checkownership',async function(req,res){
    var id = req.query.id;
    const contract = await fabricNetwork.connectNetwork(orgUserId);
    let result = await contract.submitTransaction('checkOwnership',`${id}`);
    res.send(result.toString());
});
router.get('/deleteasset',DeleteAsset);

//module.exports={contract,org1UserId}

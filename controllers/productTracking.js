
//const contract = require('../server_2.js').contract;
function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

function getdate(){

    const date = new Date();
    let day = date.getDate();
    let month= date.getMonth() + 1;
    let year = date.getFullYear();
    let currentdate=`${day}-${month}-${year}`;
    return(currentdate);
}
const GetAssets= async function(req,res){
    console.log('Getting assets on the blockchain');
    let result = await contract.evaluateTransaction('GetAllAssets');
    result=prettyJSONString(result.toString());
    res.json(result);
}

const CreateAsset = async function(req,res){
    var type=req.query.type;
    var location = req.query.location;
    var weight = req.query.weight;
    var date = getdate();
    console.log('Creating a new asset');
    let result = await contract.submitTransaction('CreateAsset',org1UserId,'Org1',type,location,weight,'22',date);
    res.send(`*** Result : ${prettyJSONString(result.toString())}`)
}

const ReadAsset = async function(req,res){
    var id = req.query.id;
    let result = await contract.evaluateTransaction('ReadAsset',id);
    res.send(`*** Result: ${prettyJSONString(result.toString())}`);
}

const RequestTransfer= async function(req,res){
    var id =req.query.id;
    var newOwnerOrg=req.query.newOwnerOrg;
    let result = await contract.submitTransaction('RequestTransfer',newOwnerOrg,id);
    res.send(`*** Result: ${prettyJSONString(result.toString())}`);
}

module.exports={
    GetAssets,CreateAsset,ReadAsset,RequestTransfer
}

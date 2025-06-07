const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../model/listing.js");

const mongooseUrl="mongodb://127.0.0.1:27017/wanderlust";

main().then((res)=>{
    console.log("connect");
}).catch((err)=>{
    console.log(err);
});


async function main() {
    await mongoose.connect(mongooseUrl);
}

let initdb= async ()=>{
    await Listing.deleteMany({});
    initdata.data= initdata.data.map((obj)=>({ ...obj,owner:"67dd93ac23578d7ce0623c5f"}));
    await Listing.insertMany(initdata.data);
    console.log("data was saved");
}
initdb();
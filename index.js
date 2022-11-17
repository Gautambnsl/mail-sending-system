const oo = require("./oo.json");
const op = require("./op.json");
const bc = require("./bc.json");
const axios = require("axios");
const { ethers } = require("ethers");
const {Web3Storage} = require("web3.storage");
const {sendMail} = require("./mail.js")

async function run() {
try{
	const provider = new ethers.providers.JsonRpcProvider(
		"https://polygon-mumbai.g.alchemy.com/v2/yl9TVrISmKuXSbjAf_l1tWsI6tajagX5"
	);

	const contract = new ethers.Contract(
		"0xA652eBc4472524539062150e90F54f29681b0F61",
		oo.abi,
		provider
	);

	const len = await contract.getTotalOpportunities();
	const length = len.toString();

	let data = [];
	for (let i = 0; i < length; i++) {
		try {
			const id = await contract.opportunityIds(i);
			data.push(id);
			count++;
		} catch (err) {}
	}
	for (const opportunity of data) {
		let tx = await contract.opportunityToId(opportunity);
		if (tx.opportunityStatus.toString() === "6") {
			let poolAddress = tx.opportunityPoolAddress.toString();
			console.log(poolAddress, "oportunity pool address");
			const poolContract = new ethers.Contract(poolAddress, op.abi, provider);
			if (!poolContract) {
				continue;
			}
			let repaymentDate = await poolContract.nextRepaymentTime();
			let amount = await poolContract.getRepaymentAmount();
            amount = ethers.utils.formatUnits(
                amount,
                6
            );
            console.log(amount.toString(),"<<<<<Amount")
			let today = new Date();
			let nextDueDate = new Date(repaymentDate.toString() * 1000);
			var days = Math.abs(nextDueDate - today);
            days = days / 1000 / 60 / 60 / 24
			if (today < nextDueDate)
				days = days * 1;
			else
				days = days * -1

			console.log(days, "<<< Days Remaining");
			const res = await getBorrowerJson(tx.borrower);
            try{
			console.log(res.data.email,"Email");
            await sendMail(amount,res.data.email,Math.round(days))
        }catch(err){
                console.log(err);
            }
		}
	}
	console.log("run end");
}catch(err){
    console.log(err)
}
}

const getBorrowerJson = async (address) => {
	try {
		let res = await getBorrowerDetails(address);
		if (res.success) {
			let file = await retrieveFiles(res.borrowerCid);
			if (file) {
				var url = `https://w3s.link/ipfs/${file.cid}`;
				let res = await getJSONAsync(url);
				return res;
			}
		}
	} catch (error) {
		console.log("catch of getBorrowerJson");
	}
};

async function getJSONAsync(url) {
	let json = await axios.get(url);
	return json;
}

const getBorrowerDetails = async (address) => {
	try {
		const provider = new ethers.providers.JsonRpcProvider(
			"https://polygon-mumbai.g.alchemy.com/v2/yl9TVrISmKuXSbjAf_l1tWsI6tajagX5"
		);
		const contract = new ethers.Contract(
			"0x93C13C227E3403A07892c91D1312fBe43cBF1A43",
			bc.abi,
			provider
		);
		const borrowerCid = await contract.borrowerProfile(address);
		return { borrowerCid, success: true };
	} catch (err) {
		console.log("catch of getBorrowerDetails");
	}
};

async function retrieveFiles(cid, firstFileOnly = true) {
	// console.log(cid);
	try {
		if (!cid) {
			return;
		}
		const client = makeStorageClient();
		const res = await client.get(cid);
		// console.log(`Got a response! [${res.status}] ${res.statusText}`);
		if (!res.ok) {
			// console.log(`failed to get ${cid} - [${res.status}] ${res.statusText}`);
			return;
		}

		const files = await res.files();
		// console.log(files)

		if (firstFileOnly) {
			return files[0];
		}
		return files;
	} catch (error) {
		console.log(error, "catch of retrive files");
	}
}

function makeStorageClient() {
	return new Web3Storage({
		token:
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDQ5ZDhDNDk0MGM5MWY0RUUyQTgzMTA3MzJlNTQwNzNhYTJiZkRCODEiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjE1ODk3Mjk5MTksIm5hbWUiOiJEeWduaWZ5RGFwcCJ9.52l0F_arzjGag6NT-bI-Z8XXxC-WQf-4csDpcGmFlvI",
	});
}

run();

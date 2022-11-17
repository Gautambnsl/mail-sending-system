// const {ethers} = require("ethers");


async function run(){

    const provider = new ethers.providers.JsonRpcProvider("https://orbital-cosmological-tab.ethereum-goerli.discover.quiknode.pro/b897b5faeee9dee6c09a1098d5843108417c8770/");
    provider.connection.headers = { "x-qn-api-version": 1 };
    const heads = await provider.send("qn_fetchNFTs", {
      wallet: "0x91b51c173a4bdaa1a60e234fc3f705a16d228740",
      omitFields: ["provenance", "traits"],
      page: 1,
      perPage: 10,
      contracts: [
        "0x2106c00ac7da0a3430ae667879139e832307aeaa",
        "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
      ],
    });
    console.log(heads);
}


run();

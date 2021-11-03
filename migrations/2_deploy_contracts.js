const { transferPromiseness } = require("chai-as-promised");

const Tether = artifacts.require("Tether.sol");
const RWD = artifacts.require("./RWD.sol");
const DecentralBank = artifacts.require("./DecentralBank.sol");

module.exports = async function (deployer,network,accounts) {
  await deployer.deploy(Tether)
  const tether = await Tether.deployed()

  await deployer.deploy(RWD)
  const rwd = await RWD.deployed()

  await deployer.deploy(DecentralBank,rwd.address,tether.address)
  const decentralbank= await DecentralBank.deployed()

  await rwd.transfer(decentralbank.address,'1000000000000000000000000')

  await tether.transfer(accounts[1],'100000000000000000000')

};

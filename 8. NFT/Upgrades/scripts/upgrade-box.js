const { ethers, upgrades } = require("hardhat");
const BoxAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"

async function main() {
    const BoxV2 = await ethers.getContractFactory("BoxV2");
    const box = await upgrades.upgradeProxy(BoxAddress, BoxV2);
    console.log("Box upgraded");

    let transaction = await box.store(444);
    let transaction2 = await box.increment()
    let value = await box.retrieve()
    console.log(value.toString())
    let version = await box.version()
    console.log(version.toString());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
  
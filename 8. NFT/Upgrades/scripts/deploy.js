const { ethers, upgrades } = require("hardhat");

async function main() {
  const Box = await ethers.getContractFactory("Box");
  const box = await upgrades.deployProxy(Box)
  await box.waitForDeployment()
  console.log("Box deployed to : " + await box.getAddress())

  // Tests 
  let transaction = await box.store(42);
  let value = await box.retrieve()
  console.log(value.toString())
  let version = await box.version()
  console.log(version.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

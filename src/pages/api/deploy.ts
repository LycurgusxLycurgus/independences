import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';

const INFURA_URL = process.env.INFURA_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, symbol } = req.body;
  if (!name || !symbol) {
    return res.status(400).json({ message: 'Name and symbol are required' });
  }

  try {
    const provider = new ethers.providers.JsonRpcProvider(INFURA_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY!, provider);

    const contractSource = `
      pragma solidity ^0.8.0;

      contract SimpleToken {
          string public name;
          string public symbol;
          uint8 public decimals = 18;
          uint256 public totalSupply;
          mapping(address => uint256) public balanceOf;

          constructor(string memory _name, string memory _symbol) {
              name = _name;
              symbol = _symbol;
              totalSupply = 1000000 * 10**uint256(decimals);
              balanceOf[msg.sender] = totalSupply;
          }
      }
    `;

    const contractName = "SimpleToken";
    const inputDescription = {
      language: "Solidity",
      sources: {
        [contractName]: {
          content: contractSource,
        },
      },
      settings: {
        outputSelection: {
          "*": {
            "*": ["abi", "evm.bytecode"],
          },
        },
      },
    };

    // @ts-ignore
    const solc = require('solc');
    const output = JSON.parse(solc.compile(JSON.stringify(inputDescription)));
    const abi = output.contracts[contractName].SimpleToken.abi;
    const bytecode = output.contracts[contractName].SimpleToken.evm.bytecode.object;

    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    const contract = await factory.deploy(name, symbol);
    await contract.deployed();

    res.status(200).json({ message: `Contract deployed at address: ${contract.address}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Deployment failed: ${(error as Error).message}` });
  }
}
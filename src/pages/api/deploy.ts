import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';
import solc from 'solc';

const INFURA_URL = "https://mainnet.infura.io/v3/377cad0f477547e98ebc2c94f12411b5";

function findImports(importPath: string) {
  try {
    const resolvedPath = path.resolve(process.cwd(), 'node_modules', importPath);
    return { contents: fs.readFileSync(resolvedPath, 'utf8') };
  } catch (error) {
    return { error: 'File not found: ' + importPath };
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, symbol } = req.body;
  if (!name || !symbol) {
    return res.status(400).json({ message: 'Name and symbol are required' });
  }

  try {
    const contractPath = path.resolve(process.cwd(), './contracts/Token.sol');
    const contractSource = fs.readFileSync(contractPath, 'utf8');

    const input = {
      language: 'Solidity',
      sources: { 'Token.sol': { content: contractSource } },
      settings: {
        optimizer: { enabled: true, runs: 200 },
        outputSelection: { '*': { '*': ['abi', 'evm.bytecode'] } }
      }
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));
    if (output.errors) {
      console.error(output.errors);
      return res.status(500).json({ message: 'Compilation failed', errors: output.errors });
    }

    const bytecode = output.contracts['Token.sol'].Token.evm.bytecode.object;
    const abi = output.contracts['Token.sol'].Token.abi;

    const provider = new ethers.providers.JsonRpcProvider(INFURA_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);

    const contract = await factory.deploy(name, symbol);
    await contract.deployed();
    res.json({ message: `Contract deployed at address: ${contract.address}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Deployment failed: ${(error as Error).message}` });
  }
}
export const PONSEA = {
  factory: "0xA3E832E84E42d4f02e65B0eeFc81aAaa6d4BbC6A",
  crownVault: "0x0C92E44aFB6A972B32A2a0BA94CBE72a87c41575",
  dropNft: "0x58A30FcA31ACEB54273edE8b07F4bA0CB7E1C443",
  ponsAdapter: "0x6Cef278C9C962916B52F0BBeAEA4AeEAc6a159C0",
  swapBurner: "0xD39A629f4bf87a61945D0B98946A3e6c19BdDC12",
  ponsV2Factory: "0x7eD598BcEf8bd9Edd8C97A195C6d13f40801EC7e",
} as const;

export const dropEscrowAbi = [
  {
    type: "function",
    name: "commit",
    stateMutability: "payable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "withdraw",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
  },
] as const;

export const crownVaultAbi = [
  {
    type: "function",
    name: "usurp",
    stateMutability: "payable",
    inputs: [{ name: "dropId", type: "uint256" }],
    outputs: [],
  },
] as const;

// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import SolanaprojectIDL from '../target/idl/solanaproject.json'
import type { Solanaproject } from '../target/types/solanaproject'

// Re-export the generated IDL and type
export { Solanaproject, SolanaprojectIDL }

// The programId is imported from the program IDL.
export const SOLANAPROJECT_PROGRAM_ID = new PublicKey(SolanaprojectIDL.address)

// This is a helper function to get the Solanaproject Anchor program.
export function getSolanaprojectProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...SolanaprojectIDL, address: address ? address.toBase58() : SolanaprojectIDL.address } as Solanaproject, provider)
}

// This is a helper function to get the program ID for the Solanaproject program depending on the cluster.
export function getSolanaprojectProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Solanaproject program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return SOLANAPROJECT_PROGRAM_ID
  }
}

import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import { Solanaproject } from '../target/types/solanaproject'

describe('solanaproject', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Solanaproject as Program<Solanaproject>

  const solanaprojectKeypair = Keypair.generate()

  it('Initialize Solanaproject', async () => {
    await program.methods
      .initialize()
      .accounts({
        solanaproject: solanaprojectKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([solanaprojectKeypair])
      .rpc()

    const currentCount = await program.account.solanaproject.fetch(solanaprojectKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Solanaproject', async () => {
    await program.methods.increment().accounts({ solanaproject: solanaprojectKeypair.publicKey }).rpc()

    const currentCount = await program.account.solanaproject.fetch(solanaprojectKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Solanaproject Again', async () => {
    await program.methods.increment().accounts({ solanaproject: solanaprojectKeypair.publicKey }).rpc()

    const currentCount = await program.account.solanaproject.fetch(solanaprojectKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Solanaproject', async () => {
    await program.methods.decrement().accounts({ solanaproject: solanaprojectKeypair.publicKey }).rpc()

    const currentCount = await program.account.solanaproject.fetch(solanaprojectKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set solanaproject value', async () => {
    await program.methods.set(42).accounts({ solanaproject: solanaprojectKeypair.publicKey }).rpc()

    const currentCount = await program.account.solanaproject.fetch(solanaprojectKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the solanaproject account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        solanaproject: solanaprojectKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.solanaproject.fetchNullable(solanaprojectKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})

'use client'

import { getSolanaprojectProgram, getSolanaprojectProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useSolanaprojectProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getSolanaprojectProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getSolanaprojectProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['solanaproject', 'all', { cluster }],
    queryFn: () => program.account.solanaproject.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['solanaproject', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ solanaproject: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useSolanaprojectProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useSolanaprojectProgram()

  const accountQuery = useQuery({
    queryKey: ['solanaproject', 'fetch', { cluster, account }],
    queryFn: () => program.account.solanaproject.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['solanaproject', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ solanaproject: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['solanaproject', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ solanaproject: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['solanaproject', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ solanaproject: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['solanaproject', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ solanaproject: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}

#![allow(warnings)]
#![allow(clippy::result_large_err)]
use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod solanaproject {
    use super::*;

  pub fn close(_ctx: Context<CloseSolanaproject>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.solanaproject.count -= 1;
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.solanaproject.count += 1;
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeSolanaproject>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.solanaproject.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeSolanaproject<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Solanaproject::INIT_SPACE,
  payer = payer
  )]
  pub solanaproject: Account<'info, Solanaproject>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseSolanaproject<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub solanaproject: Account<'info, Solanaproject>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub solanaproject: Account<'info, Solanaproject>,
}

#[account]
#[derive(InitSpace)]
pub struct Solanaproject {
  count: u8,
}

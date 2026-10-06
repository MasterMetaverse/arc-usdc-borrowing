/**
 * Copyright 2026 Circle Internet Group, Inc.  All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { ArrowUpRight, ShieldCheck, TrendingUp, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PinLogin } from "@/components/PinLogin";
import { AuthForm } from "@/components/auth/AuthForm";
import { StatCards } from "@/components/borrow/StatCards";
import { CollateralPanel } from "@/components/borrow/CollateralPanel";
import { LoanPanel } from "@/components/borrow/LoanPanel";
import { ActivityLog } from "@/components/borrow/ActivityLog";
import { MarketExplorer } from "@/components/borrow/MarketExplorer";
import { useUcwSession } from "@/contexts/UcwSessionContext";
import { useAuthSession } from "@/contexts/AuthContext";
import { useBorrowState } from "@/hooks/useBorrowState";
import { formatAssetAmount, formatRatio } from "@/lib/format";

export default function BorrowKitPage() {
  const { status, signOut } = useAuthSession();
  const { session, wallet, error, isBusy, refreshWallet, disconnect } = useUcwSession();
  const { market, position, activeLoanId, refetchAll } = useBorrowState();

  const marketLabel = market ? `${market.collateralAsset.symbol}/${market.loanAsset.symbol}` : "cirBTC/USDC";
  const healthFactor = position?.healthFactor ?? undefined;
  const healthBand = position?.healthFactorBand ?? "SAFE";
  const healthTone =
    healthBand === "SAFE"
      ? "text-emerald-400"
      : healthBand === "WARN"
        ? "text-amber-400"
        : healthBand === "URGENT"
          ? "text-orange-400"
          : healthBand === "IMMINENT"
            ? "text-red-400"
            : "text-red-500";

  function handleSignOut() {
    disconnect();
    void signOut();
  }

  return (
    <div className="container mx-auto max-w-6xl px-3 sm:px-4 py-5 sm:py-8 space-y-6 sm:space-y-8">
      {status === "loading" ? (
        <p className="text-center text-sm text-muted-foreground">Loading…</p>
      ) : status === "signed-out" ? (
        <AuthForm />
      ) : !session ? (
        <PinLogin />
      ) : !wallet ? (
        <Card className="max-w-md mx-auto">
          <CardContent className="py-6 space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              {isBusy ? "Setting up your wallet…" : "We couldn't find your wallet yet."}
            </p>
            {error && (
              <p className="rounded-md bg-destructive/10 px-2.5 py-1.5 text-xs text-destructive text-center">
                {error}
              </p>
            )}
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => void refreshWallet()}
                disabled={isBusy}
              >
                Try again
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut} disabled={isBusy}>
                Sign out
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <section className="rounded-2xl border border-border bg-gradient-to-br from-background via-card to-secondary/30 p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300 uppercase tracking-[0.14em]">
                  <ShieldCheck className="size-3.5" />
                  Arc Testnet
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Portfolio dashboard</p>
                  <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    Borrowing overview
                  </h1>
                </div>
                <p className="max-w-xl text-sm text-muted-foreground">
                  Monitor your cirBTC collateral, USDC borrowing power, and risk exposure across the active Arc market.
                </p>
              </div>

              <div className="grid min-w-[240px] gap-2 sm:grid-cols-2 lg:w-[300px] lg:grid-cols-1">
                <div className="rounded-xl border border-border bg-background/70 p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Wallet className="size-3.5" />
                    Active market
                  </div>
                  <p className="mt-2 font-mono text-base font-medium text-foreground">{marketLabel}</p>
                </div>
                <div className="rounded-xl border border-border bg-background/70 p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <TrendingUp className="size-3.5" />
                    Health factor
                  </div>
                  <p className={`mt-2 font-mono text-base font-medium ${healthTone}`}>
                    {healthFactor !== undefined ? healthFactor.toFixed(2) : "—"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <StatCards market={market} position={position} />

          <div className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
            <Card className="overflow-hidden">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Market snapshot</p>
                    <h2 className="mt-1 text-lg font-semibold">{marketLabel}</h2>
                  </div>
                  <div className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    Live
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">Liquidity</p>
                    <p className="mt-1 font-mono text-base font-medium text-foreground">
                      {market ? formatAssetAmount(market.liquidity, 2) : "—"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">LLTV</p>
                    <p className="mt-1 font-mono text-base font-medium text-foreground">
                      {market?.lltv !== undefined && market?.lltv !== null ? formatRatio(market.lltv, 0) : "—"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">LTV</p>
                    <p className="mt-1 font-mono text-base font-medium text-foreground">
                      {position?.ltv !== undefined && position?.ltv !== null ? formatRatio(position.ltv) : "—"}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-dashed border-border bg-secondary/20 p-3 text-sm text-muted-foreground">
                  {position ? (
                    <span>
                      Active loan balance: <span className="font-medium text-foreground">{formatAssetAmount(position.borrowed, 6)}</span> and collateral locked: <span className="font-medium text-foreground">{formatAssetAmount(position.collateral, 8)}</span>.
                    </span>
                  ) : (
                    <span>No active loan detected yet. Open a position to start borrowing USDC against cirBTC.</span>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-4 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Risk monitor</p>
                    <h2 className="mt-1 text-lg font-semibold">Position health</h2>
                  </div>
                  <ArrowUpRight className="size-4 text-muted-foreground" />
                </div>

                <div className="rounded-xl border border-border bg-muted/30 p-4">
                  <p className="text-xs text-muted-foreground">Current status</p>
                  <p className={`mt-2 text-xl font-semibold ${healthTone}`}>
                    {healthFactor !== undefined ? healthFactor.toFixed(2) : "No loan"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {position?.liquidationPrice ? `Liquidation price: ${formatAssetAmount(position.liquidationPrice, 2)}` : "No liquidation price available yet."}
                  </p>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2">
                    <span>Risk band</span>
                    <span className="font-medium text-foreground">{healthBand}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2">
                    <span>Debt ratio</span>
                    <span className="font-medium text-foreground">{position?.ltv !== undefined && position?.ltv !== null ? formatRatio(position.ltv) : "—"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-4 items-start">
            <CollateralPanel activeLoanId={activeLoanId} onSuccess={refetchAll} />
            <LoanPanel activeLoanId={activeLoanId} onSuccess={refetchAll} />
          </div>

          <MarketExplorer />
          <ActivityLog />
        </>
      )}
    </div>
  );
}

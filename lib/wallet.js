// lib/wallet.js
import { load, save, uid } from "./storage"

// Estructuras en localStorage:
// xb_wallets: { [aliasUsuario]: number }
// xb_txns:    [ { id, user, betId?, type, amount, note, at } ]
// xb_bets:    (usado para potOf en retos)

export function getBalance(user) {
  const w = load("xb_wallets", {})
  return Number(w[user] || 0)
}
export function setBalance(user, amount) {
  const w = load("xb_wallets", {})
  w[user] = Number(amount) || 0
  save("xb_wallets", w)
}
export function addBalance(user, delta) {
  setBalance(user, getBalance(user) + Number(delta || 0))
}

export function addTxn({ user, betId=null, type, amount, note }) {
  const txns = load("xb_txns", [])
  txns.unshift({
    id: uid("t"),
    user,
    betId,
    type,                         // init | deposit | withdraw | stake | payout | refund | fee
    amount: Number(amount || 0),  // + / -
    note,
    at: new Date().toISOString()
  })
  save("xb_txns", txns)
}

// Inicializa saldo demo si no existe
export function ensureDemoBalance(user, initial = 50000) {
  if (!user) return
  const w = load("xb_wallets", {})
  if (!(user in w)) {
    w[user] = Number(initial)
    save("xb_wallets", w)
    addTxn({ user, type: "init", amount: initial, note: "Saldo inicial demo" })
  }
}

// Suma de aportes de un reto (bote)
export function potOf(bet) {
  return (bet?.stakes || []).reduce((s, x) => s + Number(x.amount || 0), 0)
}

// === Extras: depósitos/retiros y reportes ===
export function getTxns() {
  return load("xb_txns", [])
}
export function getUserTxns(user) {
  const all = load("xb_txns", [])
  return all.filter(t => t.user === user)
}
export function depositDemo(user, amount, note = "Depósito manual") {
  const n = Number(amount || 0)
  if (!user || n <= 0) return false
  ensureDemoBalance(user, 0)
  addBalance(user, n)
  addTxn({ user, type: "deposit", amount: n, note })
  return true
}
export function withdrawDemo(user, amount, note = "Retiro manual") {
  const n = Number(amount || 0)
  if (!user || n <= 0) return false
  if (getBalance(user) < n) return false
  addBalance(user, -n)
  addTxn({ user, type: "withdraw", amount: -n, note })
  return true
}
export function totalFees() {
  const tx = load("xb_txns", [])
  return tx.filter(t => t.user === "APP" && t.type === "fee")
           .reduce((s, t) => s + (t.amount || 0), 0)
}
export function feeTxns(limit = 50) {
  const tx = load("xb_txns", [])
  return tx.filter(t => t.user === "APP" && t.type === "fee").slice(0, limit)
}

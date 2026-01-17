const privateData = new WeakMap();

export class BankAccount {
  constructor(owner, balance) {
    privateData.set(this, { balance });
    this.owner = owner;
  }

  deposit(amount) {
    const data = privateData.get(this);
    data.balance += amount;
    console.log(`[${this.owner}] Deposited: ${amount}. New balance: ${data.balance}`);
  }

  showBalance() {
    return privateData.get(this).balance;
  }
}

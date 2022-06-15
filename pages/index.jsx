import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

let provider;

const TransactionBox = (props) => {
  return (
    <div className="rounded white p-12">
      {props.address}
      <p>
        <strong>{props.amount}</strong>
      </p>
      <p>{props.name}</p>
      <p>{props.timeout}</p>
    </div>
  );
};

export default function Home() {
  const [account, setAccount] = useState("");
  useEffect(() => {
    async function load() {
      provider = new ethers.providers.Web3Provider(window.ethereum);

      // MetaMask requires requesting permission to connect users accounts
      let accounts = await provider.send("eth_requestAccounts", []);
      // console.log(ress);
      // const accounts = await web3.eth.requestAccounts();

      setAccount(accounts[0]);
    }

    load();
  }, []);

  let waitingCount = 0;
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [transaction, setTransaction] = useState({
    _id: "",
    address: "0x0",
    amount: "0",
    name: "Prince",
    timeout: "0",
  });

  async function waitForBalance(account, amount, cb, limit = 10, first = true) {
    waitingCount = first == true ? 0 : waitingCount + 1;

    let balance = await provider.getBalance(account);
    console.log(balance, amount, limit, waitingCount, first == true);
    if (balance >= amount) {
      cb();
    } else if (waitingCount < limit) {
      // Try again in 1 second.
      let timer = setTimeout(function () {
        waitForBalance(account, amount, cb, limit, false);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      console.log("Transaction failed");
    }
  }

  // waitForBalance("0x123abc987...", web3.toWei(1, "ether"), function () {
  //   alert("1 ether received!");
  // });

  const showTransactionBox = () => {
    // const transactionBox = document.querySelector(".transaction-box");
  };
  const [amount, setAmount] = useState("0");
  const [name, setName] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:2020/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        from: name,
        to: "prince",
      }),
    })
      .then((res) => res.json())
      .then((data) => data.data)
      .then((data) => {
        console.log(data);
        const newTransaction = {
          _id: data._id,
          address: data.ethAddress,
          amount: data.amount,
          name: data.from,
          timeout: data.timeout,
          to: data.to,
        };
        setTransaction(newTransaction);
        setIsTransactionOpen(true);
        waitForBalance(
          newTransaction.address,
          ethers.utils.parseEther(newTransaction.amount.toString()),
          function () {
            alert("1 ether received!");
          },
          10
        );
      })
      .catch((err) => {
        console.log(err);
        setTransaction({
          address: "0x0111",
          amount: "110",
          name: "Failed",
          timeout: "60",
        });
        setIsTransactionOpen(true);
      });
  };
  return (
    <div>
      <main className="h-screen flex items-center justify-center">
        <h1>Make Payment to @prince</h1>
        {account}
        <form onSubmit={handleSubmit} action="">
          <label htmlFor="amount">Amount</label>
          <input
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            name="amount"
            id="amount"
          />
          <label htmlFor="name">Name</label>
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            name="name"
            id="name"
          />
          <button>Submit</button>
        </form>

        <div className="transaction-box">
          <TransactionBox {...transaction} />
        </div>
      </main>
    </div>
  );
}

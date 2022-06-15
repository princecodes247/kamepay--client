import Head from "next/head";
import Image from "next/image";

import { useState } from "react";

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
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [transaction, setTransaction] = useState({
    address: "0x0",
    amount: "0",
    name: "Prince",
    timeout: "0",
  });

  const showTransactionBox = () => {
    // const transactionBox = document.querySelector(".transaction-box");
  };
  const [amount, setAmount] = useState("0");
  const [name, setName] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/api/transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        name,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTransaction(data);
        setIsTransactionOpen(true);
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

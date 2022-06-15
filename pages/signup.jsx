import Head from "next/head";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <main className="h-screen flex items-center justify-center">
        <h1>Make Payment to @prince</h1>

        <form action="">
          <label htmlFor="amount">Amount</label>
          <input type="number" name="amount" id="amount" />
          <label htmlFor="name">Name</label>
          <input type="text" name="name" id="name" />
          <button>Submit</button>
        </form>
      </main>
    </div>
  );
}

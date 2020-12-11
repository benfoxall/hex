import React from "react";

export const App = () => <Choose />;

const Choose = () => (
  <main>
    <p>
      View content of a <a href="#file">file</a>, <a href="#url">url</a> or{" "}
      <a href="#buffer">ArrayBuffer</a>
    </p>

    <section id="file">
      <h2>file</h2>
    </section>

    <section id="url">
      <h2>url</h2>
    </section>

    <section id="buffer">
      <h2>buffer</h2>
    </section>
  </main>
);

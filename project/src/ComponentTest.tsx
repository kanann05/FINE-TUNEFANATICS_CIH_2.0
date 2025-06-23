



import { useEffect, useState } from "react";
import Component from './Component'

export default function ComponentTest() {
  function handleAuth(data) {
    console.log(data)
  }
  return (
    <div style = {{width : 'fit-content'}}>
      <Component apiKey = {"7XXltVsZTnpf"} onAuthSuccess={handleAuth}/>
    </div>
  );
}

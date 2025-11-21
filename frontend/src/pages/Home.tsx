// import { useEffect, useState } from "react";
export default function HomePage() {
return(
  <div className="page flex flex-col"> 
      {/* add a hero section here */}
    <div className="flex flex-col items-center">
      <h1>Welcome to RiskVision</h1>

      <a 
      className="a"
      style={{textAlign: "center", alignSelf: "center"}}>
        the future of financial risk management
      </a>
    </div>
     
    <div>
      <h2>Purpose</h2>
      <p>block of text goes here</p>

    </div>

    <div>
      <h3>How To</h3>
      <p>block of text goes here</p>
    </div>


    {/* add some cool ui library componenets here */}
  </div>
);
}
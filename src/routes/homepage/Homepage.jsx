import { Link } from "react-router-dom";
import "./homepage.css";
import { TypeAnimation } from "react-type-animation";
import { useState } from "react";

const Homepage = () => {
  const [typingStatus, setTypingStatus] = useState("Human1");

  return (
    <div className="homepage">
      <img src="/orbital.png" alt="" className="orbital" />
      <div className="left">
        <h1>LAMA AI</h1>
        <h2>Supercharge your creativity and productivity</h2>
        <h3>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Placeat sint
          dolorem doloribus, architecto dolor.
        </h3>
        <Link to="/dashboard">Get Started</Link>
      </div>
      <div className="right">
        <div className="imgContainer">
          <div className="bgContainer">
            <div className="bg"></div>
          </div>
          <img src="/bot.png" alt="" className="bot" />
          <div className="chat">
            <img
              src={
                typingStatus === "Human1"
                  ? "/Human1.png"
                  : typingStatus === "Human2"
                  ? "/Human2.png"
                  : "bot.png"
              }
              alt=""
            />
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed out once, initially
                "Please tell me a joke.",
                2000,
                () => {
                  // wait 1s before displaying the next message
                  setTypingStatus("bot");
                },
                "Why don’t scientists trust atoms? Because they make up everything!",
                2000,
                () => {
                  // wait 1s before displaying the next message
                  setTypingStatus("Human2");
                },
                " What's the weather like today?",
                2000,
                () => {
                  // wait 1s before displaying the next message
                  setTypingStatus("bot");
                },
                "It's sunny and 25°C today. Don't forget your sunglasses!",
                2000,
                () => {
                  // wait 1s before displaying the next message
                  setTypingStatus("Human1");
                },
              ]}
              wrapper="span"
              repeat={Infinity}
              cursor={true}
              omitDeletionAnimation={true}
            />
          </div>
        </div>
      </div>
      <div className="terms">
        <img src="/logo.png" alt="" />
        <div className="links">
          <Link to="/">Terms of Service</Link>
          <span>|</span>
          <Link to="/">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default Homepage;

import "./chatPage.css";
import NewPropmt from "../../components/newPrompt/NewPrompt";

const ChatPage = () => {
  return (
    <div className="chatPage">
      <div className="wrapper">
        <div className="chat">
          <NewPropmt />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

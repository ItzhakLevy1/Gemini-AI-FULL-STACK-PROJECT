import { Link } from "react-router-dom";
import "./chatList.css";
import { useQuery } from "@tanstack/react-query";

const ChatList = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["userChats"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
        credentials: "include",
      }).then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      }),
  });

  return (
    <div className="chatList">
      <span className="title">DASHBOARD</span>
      <Link to="#" onClick={() => window.location.reload()}>
        Create a new Chat
      </Link>
      <Link to="/">Explore Levy's AI</Link>
      {/* <Link to="/">Contact</Link>
      <hr />
      <span className="title">RECENT CHATS</span>
      <div className="list">
        <Link>My Chat title</Link>
        <Link>My Chat title</Link>
        <Link>My Chat title</Link>
        <Link>My Chat title</Link>
        <Link>My Chat title</Link>
        <Link>My Chat title</Link>
        {isPending
          ? "Loading..."
          : error
          ? "Something went wrong!"
          : data?.map((chat) => (
              <Link to={`/dashboard/chats/${chat._id}`} key={chat._id}>
                {chat.title}
              </Link>
            ))}
        test
      </div>
      <hr /> */}
      <div className="upgrade">
        <img src="/logo.png" alt="" />
        <div className="texts">
          <span>Upgrade to Levy's AI Pro</span>
          <span>Get unlimited access to all features</span>
        </div>
      </div>
    </div>
  );
};

export default ChatList;

// This component displays a list of recent chats and navigation links
// It uses react-query to fetch the user's chats from the backend API
// It shows loading and error states accordingly
// It includes links to create a new chat, explore the main site, and contact
// It also has a section promoting an upgrade to a pro version
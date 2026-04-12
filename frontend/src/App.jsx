import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:5000"; // ✅ single place

function App() {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState(null);

  // Fetch comments
  const fetchComments = async () => {
    try {
      const res = await axios.get(`${API}/comments`);
      setComments(res.data);
    } catch (err) {
      console.log("Error fetching comments:", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // Add comment
  const addComment = async () => {
    if (!text.trim()) return;

    try {
      await axios.post(`${API}/comments`, { text });
      setText("");
      fetchComments();
    } catch (err) {
      console.log("Error adding comment:", err);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Add reply
  const addReply = async (id, replyText) => {
    if (!replyText.trim()) return;

    try {
      await axios.post(`${API}/comments/${id}/reply`, {
        text: replyText,
      });
      fetchComments();
    } catch (err) {
      console.log("Error adding reply:", err);
    }
  };

  // Delete
  const deleteComment = async (id) => {
    try {
      await axios.delete(`${API}/comments/${id}`);
      fetchComments();
    } catch (err) {
      console.log("Error deleting:", err);
    }
  };

  // Like
  const likeComment = async (id) => {
    try {
      await axios.post(`${API}/comments/${id}/like`);
      fetchComments();
    } catch (err) {
      console.log("Error liking:", err);
    }
  };

  // Dislike
  const dislikeComment = async (id) => {
    try {
      await axios.post(`${API}/comments/${id}/dislike`);
      fetchComments();
    } catch (err) {
      console.log("Error disliking:", err);
    }
  };

  return (
    <div className="app">
      <h2>💬Comment & Reply Thread System</h2>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write comment..."
      />

      <button onClick={addComment}>Post</button>

      {comments.map((c) => (
        <Comment
          key={c._id}
          c={c}
          addReply={addReply}
          deleteComment={deleteComment}
          likeComment={likeComment}
          dislikeComment={dislikeComment}
        />
      ))}
    </div>
  );
}

function Comment({
  c,
  addReply,
  deleteComment,
  likeComment,
  dislikeComment,
}) {
  const [reply, setReply] = useState("");

  return (
    <div className="comment">
      <p>{c.text}</p>

      <button onClick={() => likeComment(c._id)}>
        👍 {c.likes}
      </button>

      <button onClick={() => dislikeComment(c._id)}>
        👎 {c.dislikes || 0}
      </button>

      <button onClick={() => deleteComment(c._id)}>
        Delete
      </button>

      <input
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Reply..."
      />

      <button onClick={() => addReply(c._id, reply)}>
        Reply
      </button>

      {c.replies?.map((r, i) => (
        <p key={i}>↳ {r.text}</p>
      ))}
    </div>
  );
}

export default App;
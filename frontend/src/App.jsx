import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState(null);

  // Fetch comments
  const fetchComments = async () => {
    const res = await axios.get("http://localhost:5000/comments");
    setComments(res.data);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // Add comment
  const addComment = async () => {
    if (!text) return;
    await axios.post("http://localhost:5000/comments", { text });
    setText("");
    fetchComments();
  };

  const handleLogout = () => {
  setUser(null);
   };
  // Reply
  const addReply = async (id, replyText) => {
    await axios.post(`http://localhost:5000/comments/${id}/reply`, {
      text: replyText
    });
    fetchComments();
  };

  // Delete
  const deleteComment = async (id) => {
    await axios.delete(`http://localhost:5000/comments/${id}`)
    fetchComments();
  };

  // Like
  
  const likeComment = async (id) => {
    await axios.post(`http://localhost:5000/comments/${id}/like`)
    fetchComments();
  };

  const dislikeComment = async (id) => {
  await axios.post(`http://localhost:5000/comments/${id}/dislike`)
  fetchComments();
  };


  return (
  <div className="app">
  <h2>💬Comment & Reply Thread System</h2>
 <input value={text} onChange={(e) => setText(e.target.value)}
  placeholder="Write comment..." /> 
  <button onClick={addComment}>Post</button> 
   
      
      {comments.map((c) => (
        <Comment key={c._id} c={c} addReply={addReply} deleteComment={deleteComment} likeComment={likeComment} dislikeComment={dislikeComment} />
      ))}
    </div>
  );
}

function Comment({ c, addReply, deleteComment, likeComment ,dislikeComment}) {
  const [reply, setReply] = useState("");

  return (
    <div className="comment">
      <p>{c.text}</p>

      <button onClick={() => likeComment(c._id)}>👍 {c.likes}</button>
      <button onClick={() => dislikeComment(c._id)}>
  👎 {c.dislikes || 0}
</button>
      <button onClick={() => deleteComment(c._id)}>Delete</button>

      <input
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Reply..."
      />
      <button onClick={() => addReply(c._id, reply)}>Reply</button>

      {c.replies.map((r, i) => (
        <p key={i}>↳ {r.text}</p>
      ))}
    </div>
  );
}

export default App; 
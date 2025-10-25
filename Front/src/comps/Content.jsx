import { useParams } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import Default from "./Default";
import Markdown from "react-markdown";
import Md from "./Md";

export default function Content() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [view, setView] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [id, setId] = useState("");
  const [level, setLevel] = useState("");
  const [text, setText] = useState("");
  const [dmg, setDmg] = useState("");
  const [dmgnum, setDmgnum] = useState("");
  const [data, setData] = useState("");
  const [counter, setCounter] = useState("");
  const [image, setImage] = useState("");
  const [user, setUser] = useState("");
  useEffect(() => {
    if (!slug) return;
    const fetchData = async () => {
      try {
        axios
          .get(`http://localhost:8080/api/pages/${slug}`)
          .then((res) => setPage(res.data))
          .catch((err) => console.error(err));
        const res = await axios.get(
          `http://localhost:8080/api/pages/${slug}/data`
        );
        setTitle(res.data.title);
        setId(res.data.identifier);
        setDmgnum(res.data.damage);
        setDmg(res.data.damage_type);
        setLevel(res.data.risk_level);
        setText(res.data.description_md);
        setCounter(res.data.Qliphoth);
        setImage(res.data.Image);
        setData(res.data);

        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/pages/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
    fetchData();
  }, [slug]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:8080/api/pages/${slug}/change`,
        {
          identifier: id,
          title: title,
          description_md: text,
          damage_type: dmg,
          damage: dmgnum,
          Qliphoth: counter,
          Image: image,
          risk_level: level,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessage("Content added!");
    } catch (err) {
      setMessage("Error adding content");
      console.log(err);
    }
  };
  function click() {
    if (view) {
      setView(false);
    } else {
      setView(true);
    }
  }
  if (!slug) return <Default />;
  if (!page) return <div>Loading...</div>;

  return (
    <div class="content-main">
      {(user.role === "admin" || user.role === "editor") && (
          <button class="edit-button" onClick={() => click()}>
            {" "}
            {view ? "Edit" : "Preview"}{" "}
          </button>
        )}

      {/* Content and editor */}
      <div>
        {view && (
          <div class="content-box">
            <div class="main-content">
              <Markdown>{text}</Markdown>
            </div>
            <div class="side-content">
              <div>
                <div class="side-section">
                  <img class="content-image" src={image} alt="img"></img>
                </div>
                <div class="side-section">
                  <p class="side-info">Name:</p>
                  <p class="side-data">{title}</p>
                </div>
                <div class="side-section">
                  <p class="side-info">Identifier:</p>
                  <p class="side-data">{id}</p>
                </div>
                <div class="side-section">
                  <p class="side-info">Risk Level:</p>
                  <p class={`side-data risk-${level}`}>{level}</p>
                </div>
                <div class="side-section">
                  <p class="side-info">Damage Type:</p>
                  <p class={`side-data damage-${dmg}`}>
                    {dmg} {dmgnum}
                  </p>
                </div>
                <div class="side-section">
                  <p class="side-info">Qliphoth Counter:</p>
                  <p class="side-data">{counter}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!view && (
          <div>
            <div>
              <Md text={text} setText={setText} />
            </div>
            <form onSubmit={handleSubmit} style={{ margin: "1em 0" }}>
              <div>
                <div>
                  <input
                    class="input-content"
                    placeholder="Image Url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    placeholder="Abnormalities Identification Code"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                  />
                </div>
                <input
                  placeholder="Content Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="radio"
                  id="Choice1"
                  name="level"
                  value="ZAYIN"
                  onChange={(e) => setLevel(e.target.value)}
                />
                <label for="Choice1">ZAYIN</label>

                <input
                  type="radio"
                  id="Choice2"
                  name="level"
                  value="TETH"
                  onChange={(e) => setLevel(e.target.value)}
                />
                <label for="Choice2">TETH</label>

                <input
                  type="radio"
                  id="Choice3"
                  name="level"
                  value="HE"
                  onChange={(e) => setLevel(e.target.value)}
                />
                <label for="Choice3">HE</label>

                <input
                  type="radio"
                  id="Choice4"
                  name="level"
                  value="WAW"
                  onChange={(e) => setLevel(e.target.value)}
                />
                <label for="Choice4">WAW</label>

                <input
                  type="radio"
                  id="Choice5"
                  name="level"
                  value="ALEPH"
                  onChange={(e) => setLevel(e.target.value)}
                />
                <label for="Choice5">ALEPH</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="Choice1-1"
                  name="damage"
                  value="Red"
                  onChange={(e) => setDmg(e.target.value)}
                />
                <label for="Choice1-1">Red</label>

                <input
                  type="radio"
                  id="Choice2-1"
                  name="damage"
                  value="White"
                  onChange={(e) => setDmg(e.target.value)}
                />
                <label for="Choice2-1">White</label>

                <input
                  type="radio"
                  id="Choice3-1"
                  name="damage"
                  value="Black"
                  onChange={(e) => setDmg(e.target.value)}
                />
                <label for="Choice3-1">Black</label>

                <input
                  type="radio"
                  id="Choice4-1"
                  name="damage"
                  value="Pale"
                  onChange={(e) => setDmg(e.target.value)}
                />
                <label for="Choice4-1">Pale</label>
                <br />
                <input
                  type="text"
                  id="Choice5-1"
                  name="damage"
                  value={dmgnum}
                  onChange={(e) => setDmgnum(e.target.value)}
                />
                <label for="Choice5-1">Damage amount</label>
                <br />
                <input
                  type="text"
                  id="Choice6"
                  name="damage"
                  value={counter}
                  maxLength={1}
                  onChange={(e) => setCounter(e.target.value)}
                />
                <label for="Choice6">Qliphoth Counter</label>
              </div>

              <button type="submit">Save</button>
              {message && <div>{message}</div>}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

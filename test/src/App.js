import * as React from 'react';
 import axios from 'axios';

function App() {
  const [stories, setStories] = React.useState([]);
  const [error, setError] = React.useState(null);
  const URL = 'http://hn.algolia.com/api/v1/search';
  async function handleFetch(event) {
    let result;

    try {
      result = await axios.get(`${URL}?query=React`);
      setStories(result.data.hits);
    } catch (error) {
      setError(error);
    }
  }

  return (
    <div>
      <button type="button" onClick={handleFetch}>
        Fetch Stories
      </button>

      {error && <span>Something went wrong ...</span>}

      <ul>
        {stories.map((story) => (
          <li key={story.objectID}>
            <a href={story.url}>{story.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
import React, {useState, useEffect, useRef} from 'react';
import Ideation from './Ideation';
import { withFirebase } from '../firebase/withFirebase';
import './App.less';

const App = ({ firebase }) => {
  const { ideasCollection } = firebase;
  const ideasContainer = useRef(null);
  const [idea, setIdea] = useState('');
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    const unsubscribe = ideasCollection
      .orderBy('timestamp', 'desc')
      .onSnapshot(({docs}) => {
        const ideasFromDB = [];

        docs.forEach(doc => {
          const details = {
            id: doc.id,
            content: doc.data().idea,
            tinestamp: doc.data().tinestamp
          };

          ideasFromDB.push(details);
        });
        setIdeas(ideasFromDB);
      })
    return () => unsubscribe();
  }, []);

  const onIdeaDelete = event => {
    const { id } = event.target
    ideasCollection.doc(id).delete()
  }

  const onIdeaAdd = event => {
    event.preventDefault()
    if (!idea.trim().length) return

    setIdea('')
    ideasContainer.current.scrollTop = 0 // scroll to top of container
    ideasCollection.add({
      idea,
      timestamp: new Date()
    })
  }

  const renderIdeas = () => {
    if (!ideas.length)
      return <h2 className="app__content__no-idea">Add a new Idea...</h2>

    return ideas.map(idea => (
      <Ideation key={idea.id} idea={idea} onDelete={onIdeaDelete} />
    ))
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__header__h1">Idea Box</h1>
      </header>

      <section ref={ideasContainer} className="app__content">
        {renderIdeas()}
      </section>

      <form className="app__footer" onSubmit={onIdeaAdd}>
        <input
          type="text"
          className="app__footer__input"
          placeholder="Add a new idea"
          value={idea}
          onChange={e => setIdea(e.target.value)}
        />
        <button type="submit" className="app__btn app__footer__submit-btn">
          +
        </button>
      </form>
    </div>
  )
}

export default withFirebase(App);

import React from 'react';
import './Ideation.less';

const Ideation = ({idea, onDelete}) => (
  <div className="app__content__idea">
    <p className="app__content__idea__text">{idea.content}</p>
    <button
      type="button"
      className="app__btn app__content__idea__btn"
      id={idea.id}
      onClick={onDelete}
    >
      –
    </button>
  </div>
);

export default Ideation;

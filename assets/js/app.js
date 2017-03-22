// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import 'phoenix_html';

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

// import socket from "./socket"

Array.from(document.querySelectorAll('.genimg[data-str]')).forEach(ele => {
  const str = ele.dataset.str + 'spam';
  const canvas = document.createElement('canvas');
  canvas.dataset['jdenticonHash'] = md5(str);
  canvas.height = (canvas.width = ele.width || 50);
  ele.appendChild(canvas);
});

Array.from(document.querySelectorAll('.todo-search')).map(input => {
  input.addEventListener('input', e => {
    const query = input.value;

    Array.from(document.querySelectorAll('.todo-list-item')).map(item => {
      const text = item.dataset.body;
      const isMatch = text.toLowerCase().indexOf(query.toLowerCase()) > -1;

      console.log(query, text, isMatch);

      if (isMatch) {
        item.classList.remove('not-match');
      } else {
        item.classList.add('not-match');
      }
    });
  });
});

module.exports = (items) => {
  console.log('scripts.js: ', items);
  return `
  <script src="/lib/react.development.js"></script>
  <script src="/lib/react-dom.development.js"></script>

  ${items.map(item => {
    return `<script src="http://localhost:3000/services/${item}.js"></script>`;
  }).join('\n')}

  <script>
    ${items.map(item => {
      console.log('items map: ', item);
      return `ReactDOM.hydrate(
        React.createElement('${item}'),
        document.getElementById('${item}')
      );`;
    }).join('\n')}
  </script>
`}
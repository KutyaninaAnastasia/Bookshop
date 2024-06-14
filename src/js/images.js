function importAll(r) {
  r.keys().forEach(r);
}

importAll(require.context('../img', false, /\.(png)$/));

importAll(require.context('../img/svg', false, /\.(svg)$/));


export async function showHomePage(req, res) {
  const title = 'Home';
  res.render('home', { title });
}
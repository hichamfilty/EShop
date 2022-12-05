const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
// const authJwt = require('./helpers/jwt');
var { expressjwt: jwt } = require('express-jwt');
const errorHandler = require('./helpers/error-handler');

app.use(cors());
app.options('*', cors());

app.use(bodyParser.json());
app.use(morgan('tiny'));
// app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler);

const api = process.env.API_URL;
const secret = process.env.SECRET;

app.use(
  jwt({
    secret,
    algorithms: ['HS256'],
    isRevoked: isRevoked,
  }).unless({
    path: [
      { url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/orders(.*)/, methods: ['GET', 'OPTIONS', 'POST'] },
      `${api}/users/login`,
      `${api}/users/register`,
    ],
  })
);

async function isRevoked(req, payload) {
  if (payload.isAdmin == false) {
    return true;
  }

  return false;
}

const productsRoutes = require('./routes/products');
const categoriesRoutes = require('./routes/categories');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);



mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'reactNativeEshop',
  })
  .then(() => {
    console.log('Db-Database Connection is ready...');
  })
  .catch((err) => {
    console.log(err);
  });



app.listen(process.env.PORT || 3000, () => {
  console.log('server is running on port');
});
